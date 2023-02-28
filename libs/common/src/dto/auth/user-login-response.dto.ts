import { IsString } from 'class-validator';

export class UserLoginResponseDto {
  @IsString()
  access: string;
  @IsString()
  refresh: string;
  @IsString()
  userId: string;
}
