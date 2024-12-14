import { IsNotEmpty, IsOptional } from 'class-validator';
import { Expose, Type } from 'class-transformer';
import { UserInfoDTO } from './user.dto';

export class NotificationDTO {
    @Expose()
    user_id: string
    @Expose()
    app_id: string;
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
    @IsNotEmpty()
    app_id: string;
    @IsOptional()
    text: string;
    @IsOptional()
    title: string;
}
