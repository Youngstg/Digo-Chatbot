import { IsIn, IsNotEmpty } from 'class-validator';

export class UpdateLeadStatusDto {
  @IsNotEmpty()
  @IsIn(['new', 'contacted', 'qualified', 'closed'])
  status: string;
}
