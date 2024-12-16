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
import { UserService } from './user.service'
import { CreateUserDTO, ExtendDateDTO, FillInviteCodeDTO, LockUserDTO, UpdateUserDTO } from 'src/dtos/user.dto'
import { AuthGuard } from 'src/guards/auth.guard'
import { Roles } from 'src/decorators/roles.decorator'
import { UserRole } from 'src/enums/role.enum'
@Controller('users')
export class UserController {
  constructor(
    private userService: UserService,
  ) {}
  @Post('create')
  @UseGuards(AuthGuard)
  @Roles(UserRole.ADMIN, UserRole.EMPLOYEE, UserRole.USER)
  create(@Body() createUserDTO: CreateUserDTO) {
    console.log("fdfsdfsdfsdfsdfsdfsdfsdfsdfsdfsbbbbb")
    return this.userService.create(createUserDTO)
  }

  @Post('getUser')
  getUser(@Body() body: { user_id: string }, @Req() req: any) {
    return this.userService.getUser(body.user_id ? body.user_id : req.user_data.user_id)
  }

  @Put('update')
  @UseGuards(AuthGuard)
  @Roles(UserRole.USER, UserRole.ADMIN)
  async update(@Body() updateUserDTO: UpdateUserDTO, @Req() req: any) {
    try {
      return this.userService.update(updateUserDTO)
    } catch (error) {
      console.log(error)
      throw error
    }
  }

  @Put('extendDate')
  @UseGuards(AuthGuard)
  @Roles(UserRole.USER, UserRole.ADMIN, UserRole.EMPLOYEE)
  async extendDate(@Body() extendDateDTO: ExtendDateDTO, @Req() req: any) {
    try {
      return this.userService.extendDate(extendDateDTO)
    } catch (error) {
      console.log(error)
      throw new HttpException('Gia hạn ngày thất bại !', HttpStatus.BAD_REQUEST)
    }
  }

  @Put('fillInviteCode')
  @UseGuards(AuthGuard)
  @Roles(UserRole.USER, UserRole.ADMIN, UserRole.EMPLOYEE)
  async fillInviteCode(@Body() fillInviteCodeDTO: FillInviteCodeDTO, @Req() req: any) {
    try {
      return this.userService.fillInviteCode(fillInviteCodeDTO)
    } catch (error) {
      console.log(error)
      throw new HttpException('Nhập mã mời thất bại !', HttpStatus.BAD_REQUEST)
    }
  }

  @Put('lockUser')
  @UseGuards(AuthGuard)
  @Roles(UserRole.USER, UserRole.ADMIN, UserRole.EMPLOYEE)
  async lockUser(@Body() lockUserDTO: LockUserDTO, @Req() req: any) {
    try {
      return this.userService.lockUser(lockUserDTO)
    } catch (error) {
      console.log(error)
      throw new HttpException('Khoá tài khoản thất bại !', HttpStatus.BAD_REQUEST)
    }
  }

  @Get("getAll")
  @UseGuards(AuthGuard)
  @Roles(UserRole.ADMIN)
  @HttpCode(200)
  async getAllUsers(@Query() query: any) {
    const page = query.page ? Number(query.page) : 1
    const limit = query.limit ? Number(query.limit) : 20
    return this.userService.getAllUsers(page, limit)
  }

  @Post("getAllByUser")
  @UseGuards(AuthGuard)
  @Roles(UserRole.EMPLOYEE, UserRole.ADMIN)
  @HttpCode(200)
  async getAllByUser(@Query() query: any, @Req() req: any, @Body() body: { user_id: string }) {
    const page = query.page ? Number(query.page) : 1
    const limit = query.limit ? Number(query.limit) : 20
    const user_id = body?.user_id ?? req.user_data?.user_id
    console.log(user_id)
    return this.userService.getAllByUser(user_id, page, limit,)
  }
}
