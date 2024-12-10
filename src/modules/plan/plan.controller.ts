import {
    Controller,
    Post,
    Body,
    Get,
} from '@nestjs/common'
import { Roles } from 'src/decorators/roles.decorator'
import { UserRole } from 'src/enums/role.enum'
import { PlanService } from './plan.service'
import { CreatePlanDTO } from 'src/dtos/plan.dto'
@Controller('plans')
export class PlanController {
    constructor(
        private planService: PlanService,
    ) { }
    @Post('create')
    @Roles(UserRole.ADMIN)
    create(@Body() createPlanDTO: CreatePlanDTO) {
        return this.planService.create(createPlanDTO)
    }

    @Get('getAll')
    getUser() {
        return this.planService.getAll()
    }

}
