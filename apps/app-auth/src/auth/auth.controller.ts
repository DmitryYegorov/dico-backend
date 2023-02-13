import { Controller, Logger, ValidationPipe } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { Dto } from '@dico-backend/common';
import { AuthService } from './auth.service';

@Controller()
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private readonly service: AuthService) {}

  @MessagePattern('auth.register')
  async register(@Payload(ValidationPipe) data: Dto.Auth.UserRegisterDto) {
    return this.service.register(data);
  }
}
