import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service.js';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers['authorization'];

    if (!authHeader) {
      throw new UnauthorizedException(
        'Akses ditolak: Token autentikasi tidak ditemukan. Harap login terlebih dahulu.'
      );
    }

    const [scheme, token] = authHeader.split(' ');

    if (scheme?.toLowerCase() !== 'bearer' || !token) {
      throw new UnauthorizedException(
        'Format token tidak valid. Gunakan format "Bearer <token>".'
      );
    }

    try {
      const user = this.authService.verifyToken(token);
      request.user = user;
      return true;
    } catch (err: any) {
      throw new UnauthorizedException(
        err.message || 'Sesi login telah berakhir. Silakan login kembali.'
      );
    }
  }
}

