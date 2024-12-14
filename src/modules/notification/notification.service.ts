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

  async getAll(
    userId: string,
    role: string,
    startDate?: string,
    endDate?: string,
    page: number = 1,
    limit: number = 10
  ): Promise<PaginatedNotification> {
    try {
      let notificationList = [];
      const findConditions: any = {};
  
      if (startDate && endDate) {
        findConditions.time = {
          $gte: new Date(startDate),
          $lte: new Date(endDate),
        };
      }
  
      if (role === UserRole.ADMIN) {
        notificationList = await this.notificationModel
          .find(findConditions)
          // .skip((page - 1) * limit)
          // .limit(limit);
      } else if (role === UserRole.EMPLOYEE) {
        const users = await this.userModel.find({ invite_code: userId });
        if (users.length > 0) {
          for (const user of users) {
            const conditions = { ...findConditions, user_id: user.user_id };
            const notifications = await this.notificationModel.find(conditions);
            if (notifications.length > 0) {
              notificationList.push(...notifications);
            }
          }
        }
      } else {
        const conditions = { ...findConditions, user_id: userId };
        notificationList = await this.notificationModel
          .find(conditions)
          // .skip((page - 1) * limit)
          // .limit(limit);
      }
  
      const totalCount = notificationList.length;
  
      return {
        data: plainToInstance(NotificationDTO, notificationList, {
          excludeExtraneousValues: true,
          enableImplicitConversion: true,
        }),
        // page,
        // limit,
        // totalCount,
        // totalPage: Math.ceil(totalCount / limit),
      };
    } catch (err) {
      if (err instanceof HttpException) {
        throw err;
      } else {
        throw new HttpException('Lỗi Internet', HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  }
  
}
