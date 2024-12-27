import { IsNotEmpty } from 'class-validator';
import { Expose, Type } from 'class-transformer';
import { PlanDTO } from './plan.dto';
import { UserDTO } from './user.dto';

export class OrderDTO {
    @Expose()
    id: string
    @Expose()
    @Type(() => PlanDTO)
    plan_id: PlanDTO
    @Expose()
    user_id: string;
    @Expose()
    status: string;
    @Expose()
    created_at: Date;
}

export class CreateOrderDTO {
    @IsNotEmpty()
    plan_id: string;
}
