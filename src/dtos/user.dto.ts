import { IsNotEmpty, Length, IsEmail, IsBoolean, Matches, IsPhoneNumber, MaxLength, IsEnum, IsOptional } from 'class-validator';
import { Transform, Expose } from 'class-transformer';
import { BooleanPipe } from 'src/pipes/boolean.pipe';
import { UserRole } from 'src/enums/role.enum';

export class UserDTO {
  @Expose()
  user_id: string;
  @Expose()
  full_name: string;
  @Expose()
  card_id: string;
  @Expose()
  email: string;
  @Expose()
  phone_number: string;
  @Expose()
  address: string;
  @Expose()
  role: string;
  @Expose()
  is_locked: boolean;
  @Expose()
  expire_date: string;
  @Expose()
  is_fill_info: boolean;
  @Expose()
  invite_code: string;
  @Expose()
  created_date: Date;
  @Expose()
  updated_date: Date;
  @Expose()
  updated_token: string;
}

export class UpdateUserDTO {
  @IsNotEmpty()
  user_id: string;

  @IsNotEmpty()
  full_name: string;

  @IsNotEmpty()
  card_id: string;

  @IsEmail()
  @IsNotEmpty()
  @Transform((email) => email.value.toLowerCase())
  email: string

  @Length(8)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/, {
    message: 'Mật khẩu phải chứa ít nhất một ký tự in hoa, một ký tự thường, một chữ số và một ký tự đặc biệt!',
  })
  password: string;

  @IsNotEmpty()
  @IsPhoneNumber('VN', { message: 'Số điện thoại không hợp lệ' })
  phone_number: string;

  @IsNotEmpty()
  @MaxLength(200)
  address: string;

  @IsNotEmpty()
  @IsEnum(UserRole)
  role: UserRole;

  @IsOptional()
  expire_date: string;

  @IsBoolean()
  @Transform((value) => new BooleanPipe().transform(value.value))
  is_fill_info: boolean;

  updated_token: string;
}


export class UserInfoDTO {
  @Expose()
  user_id: string;

  @Expose()
  full_name: string;

  @Expose()
  email: string;

  @IsNotEmpty()
  updated_token: string;
}

export class CreateUserDTO {
  @IsNotEmpty()
  user_id: string;

  @IsNotEmpty()
  full_name: string;

  @IsNotEmpty()
  card_id: string;

  @IsEmail()
  @IsNotEmpty()
  @Transform((email) => email.value.toLowerCase())
  email: string

  @IsNotEmpty()
  @Length(8)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/, {
    message: 'Mật khẩu phải chứa ít nhất một ký tự in hoa, một ký tự thường, một chữ số và một ký tự đặc biệt!',
  })
  password: string;

  @IsNotEmpty()
  @IsPhoneNumber('VN', { message: 'Số điện thoại không hợp lệ' })
  phone_number: string;

  @IsNotEmpty()
  @MaxLength(200)
  address: string;

  @IsNotEmpty()
  @IsEnum(UserRole)
  role: UserRole;

  expire_date: Date;

  @IsBoolean()
  @Transform((value) => new BooleanPipe().transform(value.value))
  is_fill_info: boolean;
}

export class LockUserDTO {
  @IsNotEmpty()
  user_id: string;

  @IsBoolean()
  @Transform((value) => new BooleanPipe().transform(value.value))
  is_locked: boolean;

  @IsNotEmpty()
  updated_token: string;
}

export class FillInviteCodeDTO {
  @IsNotEmpty()
  user_id: string;

  @IsNotEmpty()
  invite_code: string;

  @IsNotEmpty()
  updated_token: string;
}

export class ExtendDateDTO {
  @IsNotEmpty()
  user_id: string;

  @IsNotEmpty()
  expire_date: number;

  @IsNotEmpty()
  updated_token: string;
}
