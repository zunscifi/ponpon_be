import { Controller, UseGuards, Query, Get, Body, Post, Req } from '@nestjs/common'
import { UserRole } from 'src/enums/role.enum'
import { AuthGuard } from 'src/guards/auth.guard'
import { Roles } from 'src/decorators/roles.decorator'
import { OrderService } from './order.service';
import { CreateOrderDTO } from 'src/dtos/order.dto';

@Controller('orders')
export class OrderController {
  constructor(private orderService: OrderService) { }

  @Post('createOrder')
  @UseGuards(AuthGuard)
  @Roles(UserRole.USER)
  async createOrder(@Body() createOrderDTO: CreateOrderDTO, @Req() req: any) {
    const userId = req.user_data?.user_id
    return this.orderService.createOrder(createOrderDTO, userId)
  }

  @Post('getAllByUserId')
  @UseGuards(AuthGuard)
  @Roles(UserRole.USER, UserRole.ADMIN, UserRole.EMPLOYEE)
  async getAllByUserId(@Body() body: { user_id: string }) {
    return this.orderService.getAllByUserId(body?.user_id)
  }
}
