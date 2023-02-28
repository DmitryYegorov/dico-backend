import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { Dto } from '@dico-backend/common';
import { catchError, map, Observable, throwError } from 'rxjs';

@Injectable()
export class AuthService implements OnModuleInit {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @Inject('AUTH_MICROSERVICE') private readonly authClient: ClientKafka,
    private readonly config: ConfigService
  ) {}

  async onModuleInit() {
    this.authClient.subscribeToResponseOf('auth.register');
    this.authClient.subscribeToResponseOf('auth.login.email');
    await this.authClient.connect();
  }

  async register(data: Dto.Auth.UserRegisterDto) {
    try {
      this.logger.log(`Invoked register endpoint`);

      return this.authClient
        .send('auth.register', JSON.stringify(data))
        .pipe(catchError((err) => throwError(err)));
    } catch (error) {
      this.logger.error(`Failed register: ${JSON.stringify(error)}`);
      throw error;
    }
  }

  loginEmail(
    data: Dto.Auth.UserLoginDto
  ): Observable<Dto.Auth.UserLoginResponseDto> {
    try {
      this.logger.log(`Invoked login by email endpoint`);

      return this.authClient
        .send('auth.login.email', JSON.stringify(data))
        .pipe(catchError((err) => throwError(err)));
    } catch (error) {
      this.logger.error(`Failed loginEmail: ${JSON.stringify(error)}`);
      throw error;
    }
  }
}
