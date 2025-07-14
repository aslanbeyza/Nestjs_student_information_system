import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/users.schema';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { RolesGuard } from './guards/roles.guard';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    forwardRef(() => AuthModule), // forwardRef ile circular dependency'yi çözüyoruz
  ],
  controllers: [UsersController],
  providers: [UsersService, RolesGuard],
  exports: [UsersService], // Diğer modüller için export
})
export class UsersModule {}
