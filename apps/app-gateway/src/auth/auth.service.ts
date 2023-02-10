import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService implements OnModuleInit {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @Inject('AUTH_MICROSERVICE') private readonly authClient: ClientKafka,
    private readonly config: ConfigService
  ) {}

  async onModuleInit() {
    this.authClient.subscribeToResponseOf('auth.register');
    await this.authClient.connect();
  }

  async register(data: any) {
    try {
      this.logger.log(`Invoked register: ${JSON.stringify(data)}`);
      this.logger.debug({ test: this.config.get('TEST') });

      return this.authClient.send('auth.register', JSON.stringify(data));
    } catch (error) {
      this.logger.error(`Failed register: ${JSON.stringify(error)}`);
      throw error;
    }
  }
}
