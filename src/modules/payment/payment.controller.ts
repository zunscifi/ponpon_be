import { Controller, UseGuards, Query, Get, Body, Post } from '@nestjs/common'
import { UserRole } from 'src/enums/role.enum'
import { AuthGuard } from 'src/guards/auth.guard'
import { Roles } from 'src/decorators/roles.decorator'
import { PaymentService } from './payment.service'

@Controller('payments')
export class PaymentController {
  constructor(private paymentService: PaymentService) { }

  @Get('createPayment')
  @UseGuards(AuthGuard)
  @Roles(UserRole.USER)
  async createPayment(@Query() query: any) {
    const amount = query.amount
    const orderId = query.orderId
    return this.paymentService.createPayment(amount, orderId)
  }

  @Get('getPaymentResult')
  async getPaymentResult(@Query() query: any) {
    return this.paymentService.getPaymentResult(query)
  }

  @Post('getAllPayment')
  @UseGuards(AuthGuard)
  @Roles(UserRole.USER, UserRole.ADMIN, UserRole.EMPLOYEE)
  async getAllPayment(@Body() body: { user_id: string }) {
    return this.paymentService.getAllPayment(body?.user_id)
  }
}
