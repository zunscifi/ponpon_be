import { IsNotEmpty } from 'class-validator';
import { Expose } from 'class-transformer';

export class PlanDTO {
    @Expose()
    id: string;
    @Expose()
    type: string;
    @Expose()
    date: number;
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
    date: number;
    @IsNotEmpty()
    price: number;
    @IsNotEmpty()
    content: string;
    description: string
}
