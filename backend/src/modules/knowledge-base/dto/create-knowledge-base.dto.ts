import { IsIn, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateKnowledgeBaseDto {
  @IsNotEmpty()
  @IsIn(['service', 'pricing', 'faq', 'portfolio', 'promotion', 'policy'])
  category: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  title: string;

  @IsNotEmpty()
  @IsString()
  content: string;
}
