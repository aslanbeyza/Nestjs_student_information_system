import { IsString, IsEmail, IsEnum } from 'class-validator';
import { UserRole } from './user-role-enum';

export class CreateUsersDto {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsString()
  phone: string;

  @IsEnum(UserRole)
  role: UserRole;
}
