import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class StoreChatDto {
  @IsNotEmpty()
  @IsString()
  message: string;

  @IsOptional()
  @IsString()
  session_id?: string;

  @IsOptional()
  @IsString()
  user_name?: string;
}
