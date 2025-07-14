import {
  Body,
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  Get,
  Request,
  Query,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserRole } from '../users/dto/user-role-enum';
import { Public } from './public.decorator';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { Throttle } from '@nestjs/throttler';

interface JwtPayload {
  sub: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  iat?: number;
  exp?: number;
}

interface RequestWithUser extends Request {
  user?: JwtPayload;
}

interface TokenPair {
  access_token: string;
  refresh_token: string;
}

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public() // Login endpoint public olmalı
  @Throttle({ default: { limit: 5, ttl: 60000 } }) // Login için sıkı limit: 1 dakikada 5 deneme
  @HttpCode(HttpStatus.OK)
  @Post('login')
  signIn(
    @Body() signInDto: { email: string; password: string; role: UserRole },
  ): Promise<TokenPair> {
    const { email, password, role } = signInDto;
    return this.authService.signIn(email, password, role);
  }

  @Public() // Refresh token endpoint public olmalı
  @Throttle({ default: { limit: 10, ttl: 60000 } }) // Refresh için orta limit: 1 dakikada 10 deneme
  @HttpCode(HttpStatus.OK)
  @Post('refresh')
  refreshToken(@Body() refreshTokenDto: RefreshTokenDto): Promise<TokenPair> {
    return this.authService.refreshToken(refreshTokenDto.refresh_token);
  }

  @Public() // Email verification public olmalı
  @HttpCode(HttpStatus.OK)
  @Get('verify-email')
  verifyEmail(@Query('token') token: string): Promise<{ message: string }> {
    return this.authService.verifyEmail(token);
  }

  @Public() // Email resend public olmalı
  @Throttle({ default: { limit: 3, ttl: 300000 } }) // 5 dakikada 3 deneme
  @HttpCode(HttpStatus.OK)
  @Post('resend-verification')
  resendVerificationEmail(
    @Body() resendDto: { email: string },
  ): Promise<{ message: string }> {
    return this.authService.resendVerificationEmail(resendDto.email);
  }

  @Public() // Password reset request public olmalı
  @Throttle({ default: { limit: 3, ttl: 300000 } }) // 5 dakikada 3 deneme
  @HttpCode(HttpStatus.OK)
  @Post('forgot-password')
  requestPasswordReset(
    @Body() forgotDto: { email: string },
  ): Promise<{ message: string }> {
    return this.authService.requestPasswordReset(forgotDto.email);
  }

  @Public() // Password reset public olmalı
  @Throttle({ default: { limit: 5, ttl: 300000 } }) // 5 dakikada 5 deneme
  @HttpCode(HttpStatus.OK)
  @Post('reset-password')
  resetPassword(
    @Body() resetDto: { token: string; newPassword: string },
  ): Promise<{ message: string }> {
    return this.authService.resetPassword(resetDto.token, resetDto.newPassword);
  }

  // Global AuthGuard sayesinde otomatik protected
  // Rate limiting: Default global limit (1 dakikada 10 istek)
  @Get('profile')
  getProfile(@Request() req: RequestWithUser): JwtPayload {
    return req.user as JwtPayload;
  }
}
