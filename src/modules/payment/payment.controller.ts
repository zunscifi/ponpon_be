import { Controller, UseGuards, Query, Get, Body, Post, Req, HttpCode } from '@nestjs/common'
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
    return this.paymentService.getPaymentResult(query)
  }

  @Get('updateResult')
  @HttpCode(200)
  async updateResult(@Query() query: any) {
    return this.paymentService.updateResult(query)
  }
}
