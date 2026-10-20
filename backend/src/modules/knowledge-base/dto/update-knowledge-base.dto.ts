import { IsBoolean, IsIn, IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateKnowledgeBaseDto {
  @IsOptional()
  @IsIn(['service', 'pricing', 'faq', 'portfolio', 'promotion', 'policy'])
  category?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  title?: string;

  @IsOptional()
  @IsString()
  content?: string;

  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}
