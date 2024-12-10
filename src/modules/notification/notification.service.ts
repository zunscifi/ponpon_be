import { Injectable, ConflictException, InternalServerErrorException, HttpException, HttpStatus } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { plainToInstance } from 'class-transformer'
import { UserRole } from 'src/enums/role.enum'
import { CreateNotificationDTO, NotificationDTO } from 'src/dtos/notification.dto'
import { Notification } from 'src/types/notification'
import { User } from 'src/types/user'

export interface PaginatedNotification {
  data: NotificationDTO[]
  // page: number
  // limit: number
  // totalCount: number
  // totalPage: number
}
@Injectable()
export class NotificationService {
  constructor(
    @InjectModel('Notification') private notificationModel: Model<Notification>,
    @InjectModel('User') private userModel: Model<User>
  ) { }

  async create(createNotificationDTO: CreateNotificationDTO): Promise<NotificationDTO> {
    try {

      const user = await this.userModel.findOne({ user_id: createNotificationDTO.user_id })

      if (!user) {
        throw new HttpException('Không tìm thấy user!', HttpStatus.NOT_FOUND)
      }

      const notification = new this.notificationModel({
        ...createNotificationDTO,
        time: Date.now(),
      })

      await notification.save()

      return plainToInstance(NotificationDTO, notification, {
        excludeExtraneousValues: true,
      })
    } catch (err) {
      if (err instanceof HttpException) {
        throw err
      } else {
        throw new InternalServerErrorException()
      }
    }
  }

  async getAll(userId: string, role: string, page?: number, limit?: number): Promise<PaginatedNotification> {
    try {
      let notificationList = [];

      if (role === UserRole.ADMIN) {
        notificationList = await this.notificationModel.find();
      } else if (role === UserRole.EMPLOYEE) {
        const users = await this.userModel.find({invite_code: userId})
        if (users.length > 0) {
          users.forEach(async (item) => {
            const notifications = await this.notificationModel.find({user_id: item.user_id});
            if (notifications.length > 0) {
              notificationList.push(notifications)
            }
          });
        }
      } else {
        notificationList = await this.notificationModel.find({user_id: userId});
      }
      
      // const totalCount = users.length

      // const totalPage = Math.ceil(totalCount / limit)

      return {
        data: plainToInstance(NotificationDTO, notificationList, {
          excludeExtraneousValues: true,
          enableImplicitConversion: true,
        }),
        // page,
        // limit,
        // totalCount,
        // totalPage,
      }
    } catch (err) {
      if (err instanceof HttpException) {
        throw err
      } else {
        throw new HttpException('Lỗi Internet', HttpStatus.INTERNAL_SERVER_ERROR)
      }
    }
  }
}
