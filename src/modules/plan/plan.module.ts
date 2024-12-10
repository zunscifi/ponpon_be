import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { BlackListModule } from '../black-list/black-list.module'
import { ConfigModule } from '@nestjs/config'
import { planSchema } from 'src/models/plan.schema'
import { PlanController } from './plan.controller'
import { PlanService } from './plan.service'

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Plan', schema: planSchema }]), ConfigModule, BlackListModule],
  controllers: [PlanController],
  providers: [PlanService],
})
export class PlanModule {}
