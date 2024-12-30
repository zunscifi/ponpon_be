import { Model } from 'mongoose'
import { InjectModel } from '@nestjs/mongoose'
import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { Plan } from 'src/types/plan'
import { plainToInstance } from 'class-transformer'
import { CreateOrderDTO, OrderDTO } from 'src/dtos/order.dto'
import { Order } from 'src/types/order'

export interface PaginatedOrder {
  data: OrderDTO[]
}

@Injectable()
export class OrderService {
  constructor(
    @InjectModel('Plan') private planModel: Model<Plan>,
    @InjectModel('Order') private orderModel: Model<Order>
  ) { }

  async createOrder(createOrderDTO: CreateOrderDTO, userId: string): Promise<OrderDTO> {
    try {
      const plan = await this.planModel.findOne({ _id: createOrderDTO.plan_id })

      if (!plan) {
        throw new HttpException('Không tìm thấy gói đăng ký', HttpStatus.NOT_FOUND)
      }

      const order = new this.orderModel({
        plan_id: plan,
        user_id: userId,
        status: "0",
        created_date: Date.now(),
      })

      await order.save()
      return plainToInstance(OrderDTO, order, {
        excludeExtraneousValues: true,
      })
    } catch (err) {
      console.log(err)
      if (err instanceof HttpException) {
        throw err
      } else {
        throw new HttpException('Lỗi Server', HttpStatus.INTERNAL_SERVER_ERROR)
      }
    }
  }
  async getAllByUserId(userId: string): Promise<PaginatedOrder> {
    try {
      const orders = await this.orderModel.find({ user_id: userId }).populate("plan_id");
      return {
        data: plainToInstance(OrderDTO, orders, {
          excludeExtraneousValues: true,
          enableImplicitConversion: true,
        }),
      }
    } catch (err) {
      console.log(err)
      if (err instanceof HttpException) {
        throw err
      } else {
        throw new HttpException('Lỗi Server', HttpStatus.INTERNAL_SERVER_ERROR)
      }
    }
  }
}
