import { IsString, IsEmail, IsEnum } from 'class-validator';
import { UserRole } from './user-role-enum';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUsersDto {
  @ApiProperty({
    example: 'John',
    description: 'User first name'
  })
  @IsString()
  firstName: string;

  @ApiProperty({
    example: 'Doe',
    description: 'User last name'
  })
  @IsString()
  lastName: string;

  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'User email address'
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'password123',
    description: 'User password (minimum 6 characters)'
  })
  @IsString()
  password: string;

  @ApiProperty({
    example: '+90 555 123 45 67',
    description: 'User phone number'
  })
  @IsString()
  phone: string;

  @ApiProperty({
    enum: UserRole,
    example: UserRole.STUDENT,
    description: 'User role in the system'
  })
  @IsEnum(UserRole)
  role: UserRole;
}
