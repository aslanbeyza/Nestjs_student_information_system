import { Module, forwardRef } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../user/users.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { EmailService } from './email.service';

@Module({
  imports: [
    forwardRef(() => UsersModule), // forwardRef ile circular dependency'yi çözüyoruz
    JwtModule.registerAsync({
      global: true,
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('jwt.secret'),
        signOptions: {
          expiresIn: configService.get<string>('jwt.expiresIn'),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [AuthService, EmailService],
  controllers: [AuthController],
  exports: [EmailService], // EmailService'i export ediyoruz
})
export class AuthModule {}
