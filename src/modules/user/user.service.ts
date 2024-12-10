import { Injectable, ConflictException, InternalServerErrorException, HttpException, HttpStatus } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { generateUpdateToken } from 'src/common/generate-update-token'
import { plainToInstance } from 'class-transformer'
import { CreateUserDTO, ExtendDateDTO, FillInviteCodeDTO, LockUserDTO, UpdateUserDTO, UserDTO } from 'src/dtos/user.dto'
import { User } from 'src/types/user'
import { hashPassword } from 'src/common/hashPassword'
import { UserRole } from 'src/enums/role.enum'

export interface PaginatedUser {
  data: UserDTO[]
  // page: number
  // limit: number
  // totalCount: number
  // totalPage: number
}
@Injectable()
export class UserService {
  constructor(@InjectModel('User') private userModel: Model<User>) { }

  async create(createUserDTO: CreateUserDTO): Promise<UserDTO> {
    try {
      const hashPass = await hashPassword(createUserDTO.password)
      const user = new this.userModel({
        ...createUserDTO,
        updated_token: generateUpdateToken(),
        created_date: Date.now(),
        password: hashPass,
      })

      await user.save()

      return plainToInstance(UserDTO, user, {
        excludeExtraneousValues: true,
      })
    } catch (err) {
      if (err.code === 11000) {
        throw new ConflictException('Email đã tồn tại !')
      } else {
        throw new InternalServerErrorException()
      }
    }
  }

  async update(updateUserDTO: UpdateUserDTO) {
    try {
      const user = await this.userModel.findOne({ user_id: updateUserDTO.user_id })

      if (!user) {
        throw new HttpException('Không tìm thấy user', HttpStatus.NOT_FOUND)
      }

      if (user.updated_token !== updateUserDTO.updated_token) {
        throw new HttpException('User đang được cập nhật bởi ai đó!', HttpStatus.CONFLICT)
      }

      const updateUserData = {
        ...updateUserDTO,
        updated_token: generateUpdateToken(),
        updated_date: Date.now(),
      }

      if (user.is_locked) {
        throw new HttpException('User đã bị chặn', HttpStatus.CONFLICT)
      } else {
        const updateResult = await user.updateOne(updateUserData)

        if (updateResult.modifiedCount > 0) {
          return { message: 'Cập nhật thành công' }
        } else {
          throw new HttpException('Cập nhật thất bại', HttpStatus.NOT_IMPLEMENTED)
        }
      }
    } catch (err) {
      if (err instanceof HttpException) {
        throw err
      } else {
        throw new HttpException('Lỗi Internet', HttpStatus.INTERNAL_SERVER_ERROR)
      }
    }
  }

  async lockUser(lockUserDTO: LockUserDTO) {
    try {
      const user = await this.userModel.findOne({ user_id: lockUserDTO.user_id })

      if (!user) {
        throw new HttpException('Không tìm thấy user', HttpStatus.NOT_FOUND)
      }

      if (user.updated_token !== lockUserDTO.updated_token) {
        throw new HttpException('User đang được cập nhật bởi ai đó!', HttpStatus.CONFLICT)
      }

      const updateUserData = {
        ...lockUserDTO,
        updated_token: generateUpdateToken(),
        updated_date: Date.now(),
      }

      const updateResult = await user.updateOne(updateUserData)

      if (updateResult.modifiedCount > 0) {
        return { message: 'Cập nhật thành công' }
      } else {
        throw new HttpException('Cập nhật thất bại', HttpStatus.NOT_IMPLEMENTED)
      }

    } catch (err) {
      if (err instanceof HttpException) {
        throw err
      } else {
        throw new HttpException('Lỗi Internet', HttpStatus.INTERNAL_SERVER_ERROR)
      }
    }
  }

  async extendDate(extendDateDTO: ExtendDateDTO) {
    try {
      const user = await this.userModel.findOne({ user_id: extendDateDTO.user_id })

      if (!user) {
        throw new HttpException('Không tìm thấy user', HttpStatus.NOT_FOUND)
      }

      if (user.updated_token !== extendDateDTO.updated_token) {
        throw new HttpException('User đang được cập nhật bởi ai đó!', HttpStatus.CONFLICT)
      }

      const newExpireDate = new Date(user.expire_date); 

      newExpireDate.setDate(newExpireDate.getDate() + extendDateDTO.expire_date);

      const updateUserData = {
        ...extendDateDTO,
        updated_token: generateUpdateToken(),
        expire_date: newExpireDate,
        updated_date: Date.now(),
      }

      const updateResult = await user.updateOne(updateUserData)

      if (updateResult.modifiedCount > 0) {
        return { message: 'Gia hạn thành công' }
      } else {
        throw new HttpException('Gia hạn thất bại', HttpStatus.NOT_IMPLEMENTED)
      }

    } catch (err) {
      if (err instanceof HttpException) {
        throw err
      } else {
        throw new HttpException('Lỗi Internet', HttpStatus.INTERNAL_SERVER_ERROR)
      }
    }
  }

  async fillInviteCode(fillInviteCodeDTO: FillInviteCodeDTO) {
    try {
      const user = await this.userModel.findOne({ user_id: fillInviteCodeDTO.user_id })

      if (!user) {
        throw new HttpException('Không tìm thấy user', HttpStatus.NOT_FOUND)
      }

      if (user.updated_token !== fillInviteCodeDTO.updated_token) {
        throw new HttpException('User đang được cập nhật bởi ai đó!', HttpStatus.CONFLICT)
      }

      if (user.user_id === fillInviteCodeDTO.invite_code) {
        throw new HttpException('Mã mời không hợp lệ!', HttpStatus.CONFLICT)
      }

      const updateUserData = {
        ...fillInviteCodeDTO,
        updated_token: generateUpdateToken(),
        updated_date: Date.now(),
      }

      if (user.is_locked) {
        throw new HttpException('User đã bị chặn', HttpStatus.CONFLICT)
      } else {
        const updateResult = await user.updateOne(updateUserData)
        if (updateResult.modifiedCount > 0) {
          return { message: 'Nhập mã mời thành công' }
        } else {
          throw new HttpException('Nhập mã mời thất bại', HttpStatus.NOT_IMPLEMENTED)
        }
      }
    } catch (err) {
      if (err instanceof HttpException) {
        throw err
      } else {
        throw new HttpException('Lỗi Internet', HttpStatus.INTERNAL_SERVER_ERROR)
      }
    }
  }

  async getUser(userid: string): Promise<UserDTO> {
    try {
      const user = await this.userModel.findOne({ user_id: userid })

      if (!user) {
        throw new HttpException('Không tìm thấy user', HttpStatus.NOT_FOUND)
      } else {
        return plainToInstance(UserDTO, user, {
          excludeExtraneousValues: true,
          enableImplicitConversion: true,
        })
      }
    } catch (err) {
      if (err instanceof HttpException) {
        throw err
      } else {
        throw new HttpException('Lỗi Internet', HttpStatus.INTERNAL_SERVER_ERROR)
      }
    }
  }

  async getAllUsers(page?: number, limit?: number): Promise<PaginatedUser> {
    try {
      const users = await this.userModel
        .find()
        // .skip((page - 1) * limit)
        // .limit(limit)

      // const totalCount = users.length

      // const totalPage = Math.ceil(totalCount / limit)

      return {
        data: plainToInstance(UserDTO, users, {
          excludeExtraneousValues: true,
          enableImplicitConversion: true,
        }),
        // page,
        // limit,
        // totalCount,
        // totalPage,
      }
    } catch (err) {
      if (err instanceof HttpException) {
        throw err
      } else {
        throw new HttpException('Lỗi Internet', HttpStatus.INTERNAL_SERVER_ERROR)
      }
    }
  }

  async getAllByUser(user_id: string, page?: number, limit?: number): Promise<PaginatedUser> {
    try {
      const users = await this.userModel
        .find({ invite_code: user_id })
        // .skip((page - 1) * limit)
        // .limit(limit)

      // const totalCount = users.length

      // const totalPage = Math.ceil(totalCount / limit)

      return {
        data: plainToInstance(UserDTO, users, {
          excludeExtraneousValues: true,
          enableImplicitConversion: true,
        }),
        // page,
        // limit,
        // totalCount,
        // totalPage,
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
