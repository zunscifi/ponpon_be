import { IsNotEmpty } from 'class-validator';
import { Expose } from 'class-transformer';

export class PlanDTO {
    @Expose()
    type: string;
    @Expose()
    price: number;
    @Expose()
    content: string;
    @Expose()
    description: string
}

export class CreatePlanDTO {
    @IsNotEmpty()
    type: string;
    @IsNotEmpty()
    price: number;
    @IsNotEmpty()
    content: string;
    description: string
}
