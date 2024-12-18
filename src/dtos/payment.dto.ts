import { IsNotEmpty, IsOptional } from 'class-validator';
import { Expose } from 'class-transformer';
import { PlanDTO } from './plan.dto';

export class PaymentDTO {
    @Expose()
    payment_id: string
    @Expose()
    plan_id: PlanDTO;
    @Expose()
    user_id: string;
    @Expose()
    created_at: Date;
}

export class CreatePaymentDTO {
    @IsNotEmpty()
    payment_id: string;
    @IsNotEmpty()
    plan_id: string;
    @IsNotEmpty()
    user_id: string;
}
