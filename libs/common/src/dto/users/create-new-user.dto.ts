import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateNewUserDto {
  @IsString()
  @IsNotEmpty()
  readonly id: string;
  @IsString()
  @IsNotEmpty()
  readonly firstName: string;
  @IsString()
  @IsNotEmpty()
  readonly lastName: string;
  @IsString()
  @IsOptional()
  readonly middleName?: string;
  @IsEmail()
  readonly email: string;
}
