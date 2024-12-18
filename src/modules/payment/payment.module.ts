import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { BlackListModule } from '../black-list/black-list.module';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import { planSchema } from 'src/models/plan.schema';
import { userSchema } from 'src/models/user.schema';
import { paymentSchema } from 'src/models/payment.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Plan', schema: planSchema },
      { name: 'User', schema: userSchema },
      { name: 'Payment', schema: paymentSchema },
    ]),
    ConfigModule,
    BlackListModule,
  ],
  controllers: [PaymentController],
  providers: [PaymentService],
})
export class PaymentModule { }
