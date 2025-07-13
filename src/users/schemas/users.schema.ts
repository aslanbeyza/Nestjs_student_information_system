import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>; //bu kısımda user modelini oluşturuyoruz

@Schema()
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
}
export const UserSchema = SchemaFactory.createForClass(User);
