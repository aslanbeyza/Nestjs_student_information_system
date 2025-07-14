import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { UserRole } from '../dto/user-role-enum';
import { ApiProperty } from '@nestjs/swagger';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  @ApiProperty({
    example: 'John',
    description: 'User first name'
  })
  @Prop()
  firstName: string;

  @ApiProperty({
    example: 'Doe',
    description: 'User last name'
  })
  @Prop()
  lastName: string;

  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'User email address'
  })
  @Prop()
  email: string;

  @ApiProperty({
    example: 'hashed_password',
    description: 'User password (hashed)'
  })
  @Prop()
  password: string;

  @ApiProperty({
    example: '+90 555 123 45 67',
    description: 'User phone number'
  })
  @Prop()
  phone: string;

  @ApiProperty({
    enum: UserRole,
    example: UserRole.STUDENT,
    description: 'User role in the system'
  })
  @Prop({ enum: UserRole, default: UserRole.STUDENT })
  role: UserRole;

  @ApiProperty({
    example: false,
    description: 'Email verification status'
  })
  @Prop({ default: false })
  emailVerified: boolean;

  @ApiProperty({
    example: null,
    description: 'Email verification token'
  })
  @Prop({ default: null, type: String })
  emailVerificationToken: string | null;

  @ApiProperty({
    example: null,
    description: 'Email verification expiration date'
  })
  @Prop({ default: null, type: Date })
  emailVerificationExpires: Date | null;

  @ApiProperty({
    example: null,
    description: 'Password reset token'
  })
  @Prop({ default: null, type: String })
  passwordResetToken: string | null;

  @ApiProperty({
    example: null,
    description: 'Password reset expiration date'
  })
  @Prop({ default: null, type: Date })
  passwordResetExpires: Date | null;
}
export const UserSchema = SchemaFactory.createForClass(User);
