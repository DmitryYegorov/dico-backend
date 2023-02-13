import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

export class UserRegisterDto {
  @IsString()
  @MaxLength(255)
  readonly firstName: string;
  @IsString()
  @MaxLength(255)
  readonly lastName: string;
  @IsEmail()
  readonly email: string;
  @IsString()
  @MinLength(8)
  @MaxLength(255)
  readonly password: string;
}
