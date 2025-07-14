import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../user/users.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UserRole } from '../user/dto/user-role-enum';
import { User } from '../user/schemas/users.schema';
import { EmailService } from './email.service';

interface TokenPair {
  access_token: string;
  refresh_token: string;
}

interface RefreshPayload {
  sub: string;
  email: string;
  type: string;
  iat?: number;
  exp?: number;
}

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private emailService: EmailService,
  ) {}

  async signIn(
    email: string,
    password: string,
    role: UserRole,
  ): Promise<TokenPair> {
    const user = await this.usersService.findByEmail(email);

    if (!user) {
      throw new UnauthorizedException('Kullanıcı bulunamadı');
    }

    // Email doğrulanmış mı kontrol et
    if (!user.emailVerified) {
      throw new UnauthorizedException(
        'Email adresinizi doğrulamanız gerekmektedir',
      );
    }

    // bcrypt ile şifre karşılaştırması
    const isPasswordValid = await this.usersService.comparePasswords(
      password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Şifre yanlış');
    }

    if (user.role !== role) {
      throw new UnauthorizedException('Rol yanlış');
    }

    return this.generateTokenPair(user);
  }

  async refreshToken(refreshToken: string): Promise<TokenPair> {
    try {
      // Refresh token'ı doğrula
      const payload = await this.jwtService.verifyAsync<RefreshPayload>(
        refreshToken,
        {
          secret: this.configService.get<string>('jwt.refreshSecret'),
        },
      );

      // Kullanıcıyı veritabanından al (güncel bilgiler için)
      const user = await this.usersService.findByEmail(payload.email);
      if (!user) {
        throw new UnauthorizedException('Kullanıcı bulunamadı');
      }

      // Yeni token çifti oluştur
      return this.generateTokenPair(user);
    } catch {
      throw new UnauthorizedException('Geçersiz refresh token');
    }
  }

  async verifyEmail(token: string): Promise<{ message: string }> {
    await this.usersService.verifyEmail(token);
    return { message: 'Email adresiniz başarıyla doğrulandı' };
  }

  async resendVerificationEmail(email: string): Promise<{ message: string }> {
    const token = await this.usersService.resendVerificationEmail(email);
    await this.emailService.sendVerificationEmail(email, token);
    return { message: 'Doğrulama emaili tekrar gönderildi' };
  }

  async requestPasswordReset(email: string): Promise<{ message: string }> {
    const token = await this.usersService.requestPasswordReset(email);
    await this.emailService.sendPasswordResetEmail(email, token);
    return { message: 'Şifre sıfırlama emaili gönderildi' };
  }

  async resetPassword(
    token: string,
    newPassword: string,
  ): Promise<{ message: string }> {
    await this.usersService.resetPassword(token, newPassword);
    return { message: 'Şifreniz başarıyla değiştirildi' };
  }

  private async generateTokenPair(user: User): Promise<TokenPair> {
    const payload = {
      sub: user.email,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
    };

    // Refresh token için sadece temel bilgiler
    const refreshPayload = {
      sub: user.email,
      email: user.email,
      type: 'refresh',
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('jwt.secret'),
        expiresIn: this.configService.get<string>('jwt.expiresIn'),
      }),
      this.jwtService.signAsync(refreshPayload, {
        secret: this.configService.get<string>('jwt.refreshSecret'),
        expiresIn: this.configService.get<string>('jwt.refreshExpiresIn'),
      }),
    ]);

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }
}
