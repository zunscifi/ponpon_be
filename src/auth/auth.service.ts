import { Injectable, HttpException, HttpStatus, InternalServerErrorException } from '@nestjs/common'

import {
  LoginDTO,
  LoginGGFBDTO,
} from 'src/dtos/auth.dto'
import * as bcrypt from 'bcrypt'
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'
import { plainToInstance } from 'class-transformer'
import { UserDTO } from 'src/dtos/user.dto'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { User } from 'src/types/user'
import { TokenBlacklist } from 'src/types/token-blacklist'
import { UserRole } from 'src/enums/role.enum'

type PayloadType = {
  user_id: string
  role: string
}

@Injectable()
export class AuthService {
  private readonly transporter
  constructor(
    @InjectModel('User') private userModel: Model<User>,
    @InjectModel('TokenBlacklist') private tokenBlacklistModel: Model<TokenBlacklist>,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) { }

  async login(loginDTO: LoginDTO) {
    const user = await this.userModel.findOne({
      email: loginDTO.email,
    })

    console.log(user)
    if (!user) {
      throw new HttpException('Email hoặc mật khẩu không đúng !', HttpStatus.UNAUTHORIZED)
    }
    const isMatch = await bcrypt.compare(loginDTO.password, user.password)
    if (!isMatch) {
      throw new HttpException('Email hoặc mật khẩu không đúng !', HttpStatus.UNAUTHORIZED)
    }

    if (user.is_locked) {
      throw new HttpException('Tài khoản hiện tại đang bị vô hiệu hóa !', HttpStatus.FORBIDDEN)
    }

    const payload = {
      user_id: user.user_id,
      role: user.role,
    }
    const token = await this.generateToken(payload)
    return {
      user: plainToInstance(UserDTO, user, {
        excludeExtraneousValues: true,
      }),
      token: token,
    }

  }

  async loginGGFB(loginGGFBDTO: LoginGGFBDTO) {
    try {
      const user = await this.userModel.findOne({
        user_id: loginGGFBDTO.user_id,
      })

      const payload = {
        user_id: loginGGFBDTO.user_id,
        role: UserRole.USER,
      }

      if (!user) {
        try {
          const user = new this.userModel({
            user_id: loginGGFBDTO.user_id,
            full_name: loginGGFBDTO.full_name,
            card_id: null,
            email: loginGGFBDTO.email,
            password: null,
            phone_number: null,
            address: null,
            role: UserRole.USER,
            is_fill_info: false
          })

          console.log(payload)


          await user.save()
          const token = await this.generateToken(payload)


          return {
            user: plainToInstance(UserDTO, user, {
              excludeExtraneousValues: true,
            }),
            token: token,
          }
        } catch (err) {
          console.log(err)

          throw new InternalServerErrorException()
        }
      }

      if (user.is_locked) {
        throw new HttpException('Tài khoản hiện tại đang bị vô hiệu hóa !', HttpStatus.FORBIDDEN)
      }

      const token = await this.generateToken(payload)
      return {
        user: plainToInstance(UserDTO, user, {
          excludeExtraneousValues: true,
        }),
        token: token,
      }
    } catch (error) {
      throw error
    }
  }


  async logout(userId: string, token: string) {
    try {
      const result = await this.userModel.updateOne(
        {
          user_id: userId,
        },
        {
          refresh_token: null,
        },
      )
      if (result.modifiedCount === 0) {
        throw new HttpException('Không tìm thấy user !', HttpStatus.NOT_FOUND)
      }

      const tokenBlacklist = new this.tokenBlacklistModel({
        token: token,
      })
      await tokenBlacklist.save()

      return { message: 'Đăng xuất thành công !' }
    } catch (error) {
      if (error instanceof HttpException) {
        throw error
      } else {
        throw new HttpException('Lỗi Internet', HttpStatus.INTERNAL_SERVER_ERROR)
      }
    }
  }

  async refreshToken(refreshToken: string) {
    try {
      const verify = await this.jwtService.verifyAsync<PayloadType>(refreshToken, {
        secret: this.configService.get('SECRET'),
      })

      const user = await this.userModel.findOne({
        user_id: verify.user_id,
        refresh_token: refreshToken,
      })
      if (user) {
        return this.generateToken({
          user_id: user.user_id,
          role: user.role,
        })
      } else {
        throw new HttpException('Refresh token không hợp lệ !', HttpStatus.BAD_REQUEST)
      }
    } catch (err) {
      throw new HttpException('Refresh token không hợp lệ !', HttpStatus.BAD_REQUEST)
    }
  }

  private async generateToken(payload: PayloadType) {
    const accessToken = await this.jwtService.signAsync(payload)
    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.get('SECRET'),
      expiresIn: this.configService.get('EXPIRES_IN_REFRESH_TOKEN'),
    })

    await this.userModel.updateOne(
      {
        user_id: payload.user_id,
      },
      {
        refresh_token: refreshToken,
      },
    )

    return { accessToken, refreshToken }
  }
}
