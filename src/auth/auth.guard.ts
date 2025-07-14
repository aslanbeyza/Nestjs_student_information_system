import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { IS_PUBLIC_KEY } from './public.decorator';

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
  user?: JwtPayload; // JWT payload'ı request'e eklenir
}

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Public endpoint kontrolü
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true; // Public endpoint, token kontrolü yapma
    }

    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('Token bulunamadı');
    }

    try {
      const secret = this.configService.get<string>('jwt.secret')!;
      if (!secret) {
        throw new Error('JWT secret is not defined!');
      }
      const payload = await this.jwtService.verifyAsync<JwtPayload>(token, {
        secret: secret,
      });

      // JWT payload'ını request'e ekliyoruz
      request.user = payload;
    } catch {
      throw new UnauthorizedException('Geçersiz token');
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
