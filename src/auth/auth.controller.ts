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
import { UserRole } from '../user/dto/user-role-enum';
import { Public } from './public.decorator';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { Throttle } from '@nestjs/throttler';
import {
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiResponse,
  ApiQuery,
  ApiBearerAuth,
  ApiProperty,
} from '@nestjs/swagger';

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

class SignInDto {
  @ApiProperty({ 
    example: 'user@example.com',
    description: 'User email address'
  })
  email: string;

  @ApiProperty({ 
    example: 'password123',
    description: 'User password'
  })
  password: string;

  @ApiProperty({ 
    enum: UserRole,
    example: UserRole.STUDENT,
    description: 'User role'
  })
  role: UserRole;
}

class ForgotPasswordDto {
  @ApiProperty({ 
    example: 'user@example.com',
    description: 'User email address'
  })
  email: string;
}

class ResetPasswordDto {
  @ApiProperty({ 
    example: 'reset-token-here',
    description: 'Password reset token'
  })
  token: string;

  @ApiProperty({ 
    example: 'newPassword123',
    description: 'New password'
  })
  newPassword: string;
}

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @HttpCode(HttpStatus.OK)
  @Post('login')
  @ApiOperation({ 
    summary: 'User login',
    description: 'Authenticate user and return JWT tokens'
  })
  @ApiBody({ type: SignInDto })
  @ApiResponse({ 
    status: 200, 
    description: 'Login successful',
    schema: {
      properties: {
        access_token: { type: 'string' },
        refresh_token: { type: 'string' }
      }
    }
  })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  signIn(
    @Body() signInDto: { email: string; password: string; role: UserRole },
  ): Promise<TokenPair> {
    const { email, password, role } = signInDto;
    return this.authService.signIn(email, password, role);
  }

  @Public()
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @HttpCode(HttpStatus.OK)
  @Post('refresh')
  @ApiOperation({ 
    summary: 'Refresh token',
    description: 'Get new access token using refresh token'
  })
  @ApiBody({ type: RefreshTokenDto })
  @ApiResponse({ 
    status: 200, 
    description: 'Token refreshed successfully',
    schema: {
      properties: {
        access_token: { type: 'string' },
        refresh_token: { type: 'string' }
      }
    }
  })
  @ApiResponse({ status: 401, description: 'Invalid refresh token' })
  refreshToken(@Body() refreshTokenDto: RefreshTokenDto): Promise<TokenPair> {
    return this.authService.refreshToken(refreshTokenDto.refresh_token);
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Get('verify-email')
  @ApiOperation({ 
    summary: 'Verify email',
    description: 'Verify user email with token'
  })
  @ApiQuery({ name: 'token', description: 'Email verification token' })
  @ApiResponse({ 
    status: 200, 
    description: 'Email verified successfully',
    schema: {
      properties: {
        message: { type: 'string' }
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Invalid or expired token' })
  verifyEmail(@Query('token') token: string): Promise<{ message: string }> {
    return this.authService.verifyEmail(token);
  }

  @Public()
  @Throttle({ default: { limit: 3, ttl: 300000 } })
  @HttpCode(HttpStatus.OK)
  @Post('resend-verification')
  @ApiOperation({ 
    summary: 'Resend verification email',
    description: 'Resend email verification link'
  })
  @ApiBody({ type: ForgotPasswordDto })
  @ApiResponse({ 
    status: 200, 
    description: 'Verification email sent',
    schema: {
      properties: {
        message: { type: 'string' }
      }
    }
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  resendVerificationEmail(
    @Body() resendDto: { email: string },
  ): Promise<{ message: string }> {
    return this.authService.resendVerificationEmail(resendDto.email);
  }

  @Public()
  @Throttle({ default: { limit: 3, ttl: 300000 } })
  @HttpCode(HttpStatus.OK)
  @Post('forgot-password')
  @ApiOperation({ 
    summary: 'Request password reset',
    description: 'Send password reset email'
  })
  @ApiBody({ type: ForgotPasswordDto })
  @ApiResponse({ 
    status: 200, 
    description: 'Password reset email sent',
    schema: {
      properties: {
        message: { type: 'string' }
      }
    }
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  requestPasswordReset(
    @Body() forgotDto: { email: string },
  ): Promise<{ message: string }> {
    return this.authService.requestPasswordReset(forgotDto.email);
  }

  @Public()
  @Throttle({ default: { limit: 5, ttl: 300000 } })
  @HttpCode(HttpStatus.OK)
  @Post('reset-password')
  @ApiOperation({ 
    summary: 'Reset password',
    description: 'Reset user password with token'
  })
  @ApiBody({ type: ResetPasswordDto })
  @ApiResponse({ 
    status: 200, 
    description: 'Password reset successful',
    schema: {
      properties: {
        message: { type: 'string' }
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Invalid or expired token' })
  resetPassword(
    @Body() resetDto: { token: string; newPassword: string },
  ): Promise<{ message: string }> {
    return this.authService.resetPassword(resetDto.token, resetDto.newPassword);
  }

  @Get('profile')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ 
    summary: 'Get user profile',
    description: 'Get current authenticated user profile'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'User profile retrieved successfully',
    schema: {
      properties: {
        sub: { type: 'string' },
        email: { type: 'string' },
        firstName: { type: 'string' },
        lastName: { type: 'string' },
        role: { type: 'string' },
        iat: { type: 'number' },
        exp: { type: 'number' }
      }
    }
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  getProfile(@Request() req: RequestWithUser): JwtPayload {
    return req.user as JwtPayload;
  }
}
