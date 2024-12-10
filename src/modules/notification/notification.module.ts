import { Module } from '@nestjs/common'
import { NotificationService } from './notification.service'
import { MongooseModule } from '@nestjs/mongoose'
import { userSchema } from 'src/models/user.schema'
import { BlackListModule } from '../black-list/black-list.module'
import { ConfigModule } from '@nestjs/config'
import { CloudinaryService } from 'src/common/uploadImage'
import { notificationSchema } from 'src/models/notification.schema'
import { NotificationController } from './notification.controller'

@Module({
  imports: [MongooseModule.forFeature([{ name: 'User', schema: userSchema }, { name: 'Notification', schema: notificationSchema }]), ConfigModule, BlackListModule],
  controllers: [NotificationController],
  providers: [NotificationService, CloudinaryService],
})
export class NotificationModule {}
