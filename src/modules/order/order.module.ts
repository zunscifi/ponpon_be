import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { BlackListModule } from '../black-list/black-list.module';
import { OrderService } from './order.service';
import { planSchema } from 'src/models/plan.schema';
import { userSchema } from 'src/models/user.schema';
import { OrderController } from './order.controller';
import { orderSchema } from 'src/models/order.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Plan', schema: planSchema },
      { name: 'User', schema: userSchema },
      { name: 'Order', schema: orderSchema },
    ]),
    ConfigModule,
    BlackListModule,
  ],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule { }
