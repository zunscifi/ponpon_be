import {
  Controller,
  Post,
  Body,
  UseGuards,
  Query,
  Req,
  Get,
} from '@nestjs/common'
import { AuthGuard } from 'src/guards/auth.guard'
import { Roles } from 'src/decorators/roles.decorator'
import { UserRole } from 'src/enums/role.enum'
import { NotificationService } from './notification.service'
import { CreateNotificationDTO } from 'src/dtos/notification.dto'
@Controller('notifications')
export class NotificationController {
  constructor(
    private notificationService: NotificationService,
  ) {}
  @Post('create')
  @UseGuards(AuthGuard)
  @Roles(UserRole.ADMIN, UserRole.EMPLOYEE, UserRole.USER)
  create(@Body() createNotificationDTO: CreateNotificationDTO) {
    return this.notificationService.create(createNotificationDTO)
  }

  @Get('getAll')
  @UseGuards(AuthGuard)
  @Roles(UserRole.ADMIN, UserRole.EMPLOYEE, UserRole.USER)
  getAll(@Query() query: any, @Req() req: any) {
    const page = query.page ? Number(query.page) : 1
    const limit = query.limit ? Number(query.limit) : 20
    return this.notificationService.getAll(req.user_data.user_id, req.user_data.role, page, limit)
  }

}
