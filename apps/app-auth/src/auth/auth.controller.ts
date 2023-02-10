import { Controller, Logger, ValidationPipe } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AuthRepository } from './auth.repository';
import { ConfigService } from '@nestjs/config';

@Controller()
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(
    private readonly repo: AuthRepository,
    private readonly config: ConfigService
  ) {}

  @MessagePattern('auth.register')
  async register(@Payload(ValidationPipe) data) {
    try {
      this.logger.log('Invoked register');
      this.logger.debug({ test: this.config.get('TEST') });
      return this.repo.create(data);
    } catch (e) {
      this.logger.error('Failed register', e);
      throw e;
    }
  }
}
