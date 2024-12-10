import {
  Controller,
  Post,
  Body,
  Put,
  UseGuards,
  UseInterceptors,
  Query,
  UploadedFile,
  Req,
  BadRequestException,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
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
  @Roles(UserRole.ADMIN, UserRole.EMPLOYEE, UserRole.USER)
  create(@Body() createNotificationDTO: CreateNotificationDTO) {
    return this.notificationService.create(createNotificationDTO)
  }

  @Post('getAll')
  @UseGuards(AuthGuard)
  @Roles(UserRole.ADMIN, UserRole.EMPLOYEE, UserRole.USER)
  getUser(@Query() query: any, @Body() body: { user_id: string }, @Req() req: any) {
    const page = query.page ? Number(query.page) : 1
    const limit = query.limit ? Number(query.limit) : 20
    return this.notificationService.getAll(body.user_id, req.user_data.role, page, limit)
  }

}
