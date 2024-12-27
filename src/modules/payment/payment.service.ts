import * as moment from 'moment'
import * as querystring from 'qs'
import * as crypto from 'crypto'
import { htmlContentPaymentFail, htmlContentPaymentSuccess } from 'src/common/htmlContent'
import { Model } from 'mongoose'
import { InjectModel } from '@nestjs/mongoose'
import { HttpException, HttpStatus, Injectable, InternalServerErrorException } from '@nestjs/common'
import { User } from 'src/types/user'
import { Plan } from 'src/types/plan'
import { generateUpdateToken } from 'src/common/generate-update-token'
import { PaymentDTO } from 'src/dtos/payment.dto'
import { Payment } from 'src/types/payment'
import { plainToInstance } from 'class-transformer'
import axios from 'axios'

export interface PaginatedPayment {
  data: PaymentDTO[]
}

@Injectable()
export class PaymentService {
  constructor(
    @InjectModel('User') private userModel: Model<User>,
    @InjectModel('Plan') private planModel: Model<Plan>,
    @InjectModel('Payment') private paymentModel: Model<Payment>
  ) { }


  sortObject(obj: any) {
    let sorted = {}
    let str = []
    let key
    for (key in obj) {
      if (obj.hasOwnProperty(key)) {
        str.push(encodeURIComponent(key))
      }
    }
    str.sort()
    for (key = 0; key < str.length; key++) {
      sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, '+')
    }
    return sorted
  }

  async createPayment(amount: number, orderId: string, clientIp: string) {
    let vnpUrl = process.env.VNPAY_URL

    let vnp_Params = {}
    vnp_Params['vnp_Version'] = '2.1.0'
    vnp_Params['vnp_Command'] = 'pay'
    vnp_Params['vnp_TmnCode'] = process.env.VNP_TMNCODE
    vnp_Params['vnp_Locale'] = 'vn'
    vnp_Params['vnp_CurrCode'] = 'VND'
    vnp_Params['vnp_BankCode'] = 'INTCARD'
    vnp_Params['vnp_TxnRef'] = orderId
    vnp_Params['vnp_OrderInfo'] = 'Gia hạn dịch vụ'
    vnp_Params['vnp_OrderType'] = 'other'
    vnp_Params['vnp_Amount'] = amount * 100
    vnp_Params['vnp_ReturnUrl'] = `${process.env.API_URL}/payments/getPaymentResult`
    vnp_Params['vnp_IpAddr'] = clientIp
    vnp_Params['vnp_CreateDate'] = moment(new Date()).format('YYYYMMDDHHmmss')

    vnp_Params = this.sortObject(vnp_Params)
    var signData = querystring.stringify(vnp_Params, { encode: false })
    let hmac = crypto.createHmac('sha512', process.env.VNP_HASHSECRET)
    let signed = hmac.update(new Buffer(signData, 'utf-8')).digest('hex')
    vnp_Params['vnp_SecureHash'] = signed
    vnpUrl += '?' + querystring.stringify(vnp_Params, { encode: false })
    console.log(vnpUrl)
    return vnpUrl
  }

  async extendDate(userId: string, planId: string): Promise<boolean> {
    try {
      const user = await this.userModel.findOne({ user_id: userId })

      const plan = await this.planModel.findOne({ _id: planId })

      console.log(userId, planId, user, plan)

      if (!user || !plan) {
        return false
      }

      const newExpireDate = new Date(user.expire_date);

      newExpireDate.setDate(newExpireDate.getDate() + plan.date);

      const updated_token = generateUpdateToken();

      const updateUserData = {
        updated_token: updated_token,
        expire_date: newExpireDate,
        updated_date: Date.now(),
      }

      const updateResult = await user.updateOne(updateUserData)

      if (updateResult.modifiedCount > 0) {
        return true
      } else {
        return false
      }
    } catch (err) {
      console.log(err)
      return false
    }
  }

  async storePayment(userId: string, planId: string, paymentId: string) {
    try {
      const result = await this.extendDate(userId, planId)
      if (result) {
        const user = await this.userModel.findOne({ user_id: userId })

        const plan = await this.planModel.findOne({ _id: planId })

        if (!user || !plan) {
          throw new HttpException('Có lỗi xảy ra!', HttpStatus.NOT_IMPLEMENTED)
        }

        const payment = new this.paymentModel({
          payment_id: paymentId,
          user_id: userId,
          plan_id: planId,
        })

        await payment.save();
        return { message: 'Cập nhật thành công' }

      } else {
        throw new HttpException('Có lỗi xảy ra!', HttpStatus.NOT_IMPLEMENTED)
      }
    } catch (err) {
      if (err instanceof HttpException) {
        throw err
      } else {
        throw new InternalServerErrorException()
      }
    }
  }

  async getPaymentResult(query: any) {
    let vnp_Params = query
    let secureHash = vnp_Params['vnp_SecureHash']

    let rspCode = vnp_Params['vnp_ResponseCode']

    let paymentId = vnp_Params['vnp_TxnRef']

    let planId = paymentId.split('_')[0];

    let userId = paymentId.split('_')[1];

    delete vnp_Params['vnp_SecureHash']
    delete vnp_Params['vnp_SecureHashType']

    vnp_Params = this.sortObject(vnp_Params)
    let secretKey = process.env.VNP_HASHSECRET
    let signData = querystring.stringify(vnp_Params, { encode: false })
    let hmac = crypto.createHmac('sha512', secretKey)
    let signed = hmac.update(new Buffer(signData, 'utf-8')).digest('hex')

    let paymentStatus = '0' // Giả sử '0' là trạng thái khởi tạo giao dịch, chưa có IPN. Trạng thái này được lưu khi yêu cầu thanh toán chuyển hướng sang Cổng thanh toán VNPAY tại đầu khởi tạo đơn hàng.
    //let paymentStatus = '1'; // Giả sử '1' là trạng thái thành công bạn cập nhật sau IPN được gọi và trả kết quả về nó
    //let paymentStatus = '2'; // Giả sử '2' là trạng thái thất bại bạn cập nhật sau IPN được gọi và trả kết quả về nó

    let checkOrderId = true // Mã đơn hàng "giá trị của vnp_TxnRef" VNPAY phản hồi tồn tại trong CSDL của bạn
    let checkAmount = true // Kiểm tra số tiền "giá trị của vnp_Amout/100" trùng khớp với số tiền của đơn hàng trong CSDL của bạn
    if (secureHash === signed) {
      //kiểm tra checksum
      if (checkOrderId) {
        if (checkAmount) {
          if (paymentStatus == '0') {
            //kiểm tra tình trạng giao dịch trước khi cập nhật tình trạng thanh toán
            if (rspCode == '00') {
              try {
                await axios.post(`${process.env.API_URL}/payments/updateResult`,
                  { user_id: userId, plan_id: planId, payment_id: paymentId })
              } catch (error) {
                return htmlContentPaymentFail
              }
              return htmlContentPaymentSuccess
            } else {
              //that bai
              //paymentStatus = '2'
              // Ở đây cập nhật trạng thái giao dịch thanh toán thất bại vào CSDL của bạn
              return htmlContentPaymentFail
            }
          } else {
            return htmlContentPaymentFail
          }
        } else {
          return htmlContentPaymentFail
        }
      } else {
        return htmlContentPaymentFail
      }
    } else {
      return htmlContentPaymentFail
    }
  }

  async getAllPayment(user_id: string): Promise<PaginatedPayment> {
    try {
      const user = this.userModel.find({ user_id: user_id });
      if (!user) {
        throw new HttpException('Không tìm thấy user!', HttpStatus.NOT_FOUND)
      }
      const payments = await this.paymentModel
        .find({ user_id: user_id })
        .populate('plan_id');

      return {
        data: plainToInstance(PaymentDTO, payments, {
          excludeExtraneousValues: true,
          enableImplicitConversion: true,
        }),
      }
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      } else {
        throw new HttpException('Lỗi Internet', HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  }
}
