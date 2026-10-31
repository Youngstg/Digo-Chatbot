import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @IsNotEmpty({ message: 'Username atau Email wajib diisi' })
  @IsString({ message: 'Username atau Email harus berupa teks' })
  usernameOrEmail!: string;

  @IsNotEmpty({ message: 'Password wajib diisi' })
  @IsString({ message: 'Password harus berupa teks' })
  @MinLength(4, { message: 'Password minimal 4 karakter' })
  password!: string;
}

