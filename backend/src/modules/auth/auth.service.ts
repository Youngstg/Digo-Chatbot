import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service.js';
import { LoginDto } from './dto/login.dto.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export interface AdminPayload {
  sub: string;
  username: string;
  email: string;
  name: string;
}

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private readonly jwtSecret: string;
  private readonly tokenExpiry: string;

  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService
  ) {
    this.jwtSecret =
      this.configService.get<string>('JWT_SECRET') ||
      'digo_super_secret_jwt_key_2026_secured';
    this.tokenExpiry = this.configService.get<string>('JWT_EXPIRES_IN') || '7d';
  }

  /**
   * Autentikasi Admin berdasarkan Username / Email dan Password
   */
  async login(dto: LoginDto) {
    const { usernameOrEmail, password } = dto;
    const cleanInput = usernameOrEmail.trim().toLowerCase();

    // 1. Cek dari Database via Prisma
    let adminRecord: any = null;
    try {
      adminRecord = await (this.prisma as any).admin.findFirst({
        where: {
          OR: [{ username: cleanInput }, { email: cleanInput }],
        },
      });
    } catch (dbError: any) {
      this.logger.warn(
        `Gagal membaca tabel admin di database (${dbError.message}). Menggunakan autentikasi environment fallback.`
      );
    }

    if (adminRecord) {
      const isMatch = await bcrypt.compare(password, adminRecord.password);
      if (!isMatch) {
        throw new UnauthorizedException('Kredensial tidak valid: Password salah');
      }

      const payload: AdminPayload = {
        sub: String(adminRecord.id),
        username: adminRecord.username,
        email: adminRecord.email,
        name: adminRecord.name,
      };

      const token = this.generateToken(payload);

      return {
        message: 'Login berhasil',
        token,
        admin: {
          id: Number(adminRecord.id),
          username: adminRecord.username,
          email: adminRecord.email,
          name: adminRecord.name,
        },
      };
    }

    // 2. Fallback: Cocokkan dengan Environment Variable Admin (Default: admin / admin123)
    const envAdminUser = (
      this.configService.get<string>('ADMIN_USERNAME') || 'admin'
    ).toLowerCase();
    const envAdminPass =
      this.configService.get<string>('ADMIN_PASSWORD') || 'admin123';
    const envAdminEmail = (
      this.configService.get<string>('ADMIN_EMAIL') || 'admin@digo.id'
    ).toLowerCase();

    const isEnvUserMatch =
      cleanInput === envAdminUser || cleanInput === envAdminEmail;
    const isEnvPassMatch = password === envAdminPass;

    if (isEnvUserMatch && isEnvPassMatch) {
      // Usahakan simpan ke DB jika DB aktif tapi tabel admin belum ada record
      try {
        const hashedPassword = await bcrypt.hash(envAdminPass, 10);
        const created = await (this.prisma as any).admin.create({
          data: {
            username: envAdminUser,
            email: envAdminEmail,
            password: hashedPassword,
            name: 'Administrator Digo',
          },
        });
        adminRecord = created;
      } catch {
        // Abaikan jika DB tidak dapat ditulis saat ini
      }

      const payload: AdminPayload = {
        sub: adminRecord ? String(adminRecord.id) : '1',
        username: envAdminUser,
        email: envAdminEmail,
        name: 'Administrator Digo',
      };

      const token = this.generateToken(payload);

      return {
        message: 'Login berhasil (Admin)',
        token,
        admin: {
          id: adminRecord ? Number(adminRecord.id) : 1,
          username: envAdminUser,
          email: envAdminEmail,
          name: 'Administrator Digo',
        },
      };
    }

    throw new UnauthorizedException('Kredensial tidak valid: Username atau password salah');
  }

  /**
   * Generate JWT Token
   */
  generateToken(payload: AdminPayload): string {
    return jwt.sign(payload, this.jwtSecret, {
      expiresIn: this.tokenExpiry,
    } as any);
  }

  /**
   * Verifikasi JWT Token
   */
  verifyToken(token: string): AdminPayload {
    try {
      const decoded = jwt.verify(token, this.jwtSecret) as AdminPayload;
      return decoded;
    } catch {
      throw new UnauthorizedException(
        'Token autentikasi tidak valid atau sudah kadaluarsa. Silakan login kembali.'
      );
    }
  }

  /**
   * Ambil data profil admin yang sedang login
   */
  async getProfile(payload: AdminPayload) {
    try {
      const admin = await (this.prisma as any).admin.findUnique({
        where: { id: BigInt(payload.sub) },
        select: {
          id: true,
          username: true,
          email: true,
          name: true,
          created_at: true,
        },
      });

      if (admin) {
        return {
          id: Number(admin.id),
          username: admin.username,
          email: admin.email,
          name: admin.name,
          created_at: admin.created_at,
        };
      }
    } catch {
      // Fallback ke decoded payload
    }

    return {
      id: Number(payload.sub) || 1,
      username: payload.username,
      email: payload.email,
      name: payload.name,
    };
  }
}

