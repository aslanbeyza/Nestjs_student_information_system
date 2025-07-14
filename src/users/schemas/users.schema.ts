import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { UserRole } from '../dto/user-role-enum';

export type UserDocument = HydratedDocument<User>; //bu kısımda user modelini oluşturuyoruz

@Schema({ timestamps: true }) // createdAt ve updatedAt otomatik eklenir
export class User {
  //bu classı  16. satırda  kullandık export ettik
  @Prop()
  firstName: string;
  @Prop() //bu kısımda prop decoratorı kullanarak fieldımızı oluşturuyoruz property yani özellik den geliyo zaten
  lastName: string;
  @Prop()
  email: string;
  @Prop()
  password: string;
  @Prop()
  phone: string;
  @Prop({ enum: UserRole, default: UserRole.STUDENT })
  role: UserRole;
  @Prop({ default: false })
  emailVerified: boolean;
  @Prop({ default: null, type: String })
  emailVerificationToken: string | null;
  @Prop({ default: null, type: Date })
  emailVerificationExpires: Date | null;
  @Prop({ default: null, type: String })
  passwordResetToken: string | null;
  @Prop({ default: null, type: Date })
  passwordResetExpires: Date | null;
}
export const UserSchema = SchemaFactory.createForClass(User);
