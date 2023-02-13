import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Dto } from '@dico-backend/common';

@Controller('auth')
export class AuthController {
  constructor(private readonly service: AuthService) {}

  @Post('sign-up')
  async register(@Body() body: Dto.Auth.UserRegisterDto) {
    return this.service.register(body);
  }
}
