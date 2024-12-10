import { IsNotEmpty } from 'class-validator';
import { Expose, Type } from 'class-transformer';
import { UserInfoDTO } from './user.dto';

export class NotificationDTO {
    @Expose()
    @Type(() => UserInfoDTO)
    user_id: UserInfoDTO
    @Expose()
    text: string;
    @Expose()
    title: string;
    @Expose()
    time: Date
}

export class CreateNotificationDTO {
    @IsNotEmpty()
    user_id: string;
    text: string;
    title: string;
}
