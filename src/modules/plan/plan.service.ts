import { Injectable, InternalServerErrorException, HttpException, HttpStatus } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { plainToInstance } from 'class-transformer'
import { CreatePlanDTO, PlanDTO } from 'src/dtos/plan.dto'
import { Plan } from 'src/types/plan'

export interface PaginatedPlan {
    data: PlanDTO[]
}
@Injectable()
export class PlanService {
    constructor(
        @InjectModel('Plan') private planModel: Model<Plan>) { }

    async create(createPlanDTO: CreatePlanDTO): Promise<PlanDTO> {
        try {
            const plan = new this.planModel({
                ...createPlanDTO,
            })

            await plan.save()

            return plainToInstance(PlanDTO, plan, {
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

    async getAll(): Promise<PaginatedPlan> {
        try {
            const plans = await this.planModel.find();
            return {
                data: plainToInstance(PlanDTO, plans, {
                    excludeExtraneousValues: true,
                    enableImplicitConversion: true,
                }),
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
