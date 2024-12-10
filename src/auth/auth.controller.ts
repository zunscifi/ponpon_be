import { Req, Body, Controller, HttpCode, Post, UseGuards } from '@nestjs/common'
import { AuthService } from './auth.service'
import { AuthGuard } from '../guards/auth.guard'
import { LoginDTO, LoginGGFBDTO} from 'src/dtos/auth.dto'
import { Roles } from 'src/decorators/roles.decorator'
import { UserRole } from 'src/enums/role.enum'

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Post('login')
  login(@Body() loginDTO: LoginDTO) {
    return this.authService.login(loginDTO)
  }

  @Post('loginGGFB')
  loginGGFB(@Body() loginGGFBDTO: LoginGGFBDTO) {
    return this.authService.loginGGFB(loginGGFBDTO)
  }


  @UseGuards(AuthGuard)
  @HttpCode(200)
  @Roles(UserRole.ADMIN, UserRole.EMPLOYEE, UserRole.USER)
  @Post('logout')
  logout(@Req() request: any) {
    return this.authService.logout(request.user_data.user_id, request.token)
  }
}
