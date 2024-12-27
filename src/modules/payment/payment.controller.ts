import { Controller, UseGuards, Query, Get, Body, Post, Req } from '@nestjs/common'
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
  async createPayment(@Query() query: any, @Req() req: any) {
    const clientIp = (req.headers['x-forwarded-for'] || req?.ip).toString().split(',')[0].trim();

    const amount = query.amount
    const orderId = query.orderId
    return this.paymentService.createPayment(amount, orderId, clientIp)
  }

  @Get('getPaymentResult')
  async getPaymentResult(@Query() query: any) {
    console.log(query)
    return this.paymentService.getPaymentResult(query)
  }

  @Post('getAllPayment')
  @UseGuards(AuthGuard)
  @Roles(UserRole.USER, UserRole.ADMIN, UserRole.EMPLOYEE)
  async getAllPayment(@Body() body: { user_id: string }) {
    return this.paymentService.getAllPayment(body?.user_id)
  }

  @Post('updateResult')
  async updateResult(@Body() body: { user_id: string, plan_id, payment_id }) {
    return this.paymentService.storePayment(body?.user_id, body?.plan_id, body?.payment_id)
  }
}
