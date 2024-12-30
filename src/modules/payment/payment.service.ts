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
import { Order } from 'src/types/order'

@Injectable()
export class PaymentService {
  constructor(
    @InjectModel('User') private userModel: Model<User>,
    @InjectModel('Plan') private planModel: Model<Plan>,
    @InjectModel('Order') private orderModel: Model<Order>
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
    process.env.TZ = 'Asia/Ho_Chi_Minh';

    console.log(`${process.env.API_URL}/payments/getPaymentResult`)

    let vnpUrl = process.env.VNPAY_URL

    let vnp_Params = {}
    vnp_Params['vnp_Version'] = '2.1.0'
    vnp_Params['vnp_Command'] = 'pay'
    vnp_Params['vnp_TmnCode'] = process.env.VNP_TMNCODE
    vnp_Params['vnp_Locale'] = 'vn'
    vnp_Params['vnp_CurrCode'] = 'VND'
    // vnp_Params['vnp_BankCode'] = 'VNPAYQR'`
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

  async getPaymentResult(query: any) {
    let vnp_Params = query
    let secureHash = vnp_Params['vnp_SecureHash']

    delete vnp_Params['vnp_SecureHash']
    delete vnp_Params['vnp_SecureHashType']

    let orderId = vnp_Params['vnp_TxnRef']

    vnp_Params = this.sortObject(vnp_Params)
    let secretKey = process.env.VNP_HASHSECRET
    let signData = querystring.stringify(vnp_Params, { encode: false })
    let hmac = crypto.createHmac('sha512', secretKey)
    let signed = hmac.update(new Buffer(signData, 'utf-8')).digest('hex')

    const order = await this.orderModel?.findOne({ _id: orderId })

    if (secureHash === signed) {
      if (order && order?.status === "2") {
        return htmlContentPaymentSuccess
      } else {
        return htmlContentPaymentFail
      }
    } else {
      return htmlContentPaymentFail
    }
  }

  async updateResult(query: any) {
    let vnp_Params = query
    let secureHash = vnp_Params['vnp_SecureHash']

    let rspCode = vnp_Params['vnp_ResponseCode']

    let orderId = vnp_Params['vnp_TxnRef']

    let amount = vnp_Params['vnp_Amount']

    delete vnp_Params['vnp_SecureHash']
    delete vnp_Params['vnp_SecureHashType']

    vnp_Params = this.sortObject(vnp_Params)
    let secretKey = process.env.VNP_HASHSECRET
    let signData = querystring.stringify(vnp_Params, { encode: false })
    let hmac = crypto.createHmac('sha512', secretKey)
    let signed = hmac.update(new Buffer(signData, 'utf-8')).digest('hex')

    const order = await this.orderModel?.findOne({ _id: orderId })

    let paymentStatus = order?.status ?? ""

    let checkOrderId = !order ? false : true
    let checkAmount = checkOrderId ? order?.plan_id?.price * 100 === amount : false
    if (secureHash === signed) {
      //kiểm tra checksum
      if (checkOrderId) {
        if (checkAmount) {
          if (paymentStatus == '0') {
            if (rspCode == '00') {
              try {
                const updateResult = await order.updateOne({ status: "1" })
                if (updateResult.modifiedCount > 0) {
                  const result = await this.extendDate(order?.user_id, order?.plan_id?.id)
                  if (result) {
                    return { RspCode: '00', Message: 'Success' }
                  } else {
                    throw new HttpException({ RspCode: '99', Message: 'Update database faild!' }, HttpStatus.NOT_IMPLEMENTED)
                  }
                } else {
                  throw new HttpException({ RspCode: '99', Message: 'Update database faild!' }, HttpStatus.NOT_IMPLEMENTED)
                }
              } catch (error) {
                throw new HttpException({ RspCode: '99', Message: 'Update database faild!' }, HttpStatus.NOT_IMPLEMENTED)
              }
            } else {
              try {
                const updateResult = await order.updateOne({ status: "2" })
                if (updateResult.modifiedCount > 0) {
                  return { RspCode: '00', Message: 'Success' }
                } else {
                  throw new HttpException({ RspCode: '99', Message: 'Update database faild!' }, HttpStatus.NOT_IMPLEMENTED)
                }
              } catch (error) {
                throw new HttpException({ RspCode: '99', Message: 'Update database faild!' }, HttpStatus.NOT_IMPLEMENTED)
              }
            }
          } else {
            return { RspCode: '02', Message: 'This order has been updated to the payment status' }
          }
        } else {
          return { RspCode: '04', Message: 'Amount invalid' }
        }
      } else {
        return { RspCode: '01', Message: 'Order not found' }
      }
    } else {
      return { RspCode: '97', Message: 'Checksum failed' }
    }
  }
}
