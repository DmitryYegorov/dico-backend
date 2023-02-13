import {
  BadRequestException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { AuthRepository } from './auth.repository';
import { ClientKafka, RpcException } from '@nestjs/microservices';
import { Dto, Filters } from '@dico-backend/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly repo: AuthRepository,
    @Inject('NOTIFICATIONS_MICROSERVICE')
    private readonly notificationsClient: ClientKafka
  ) {}

  async register(data: Dto.Auth.UserRegisterDto): Promise<void> {
    try {
      const { firstName, lastName, password, email } = data;
      this.logger.log(
        `Invoked register: ${JSON.stringify({ firstName, lastName, email })}`
      );

      const existed = await this.repo.findByEmail(email);

      if (existed) {
        throw new RpcException(
          new BadRequestException('User already registered')
        );
      }

      const salt = bcrypt.genSaltSync();
      const hashPass = await bcrypt.hash(password, salt);

      await this.repo.create({
        firstName,
        lastName,
        email,
        password: hashPass,
      });

      await this.notificationsClient.emit(
        'notifications.send_email',
        JSON.stringify({
          email,
          templateId: 'user-registered-welcome',
          subject: 'Welcome to Dico',
          options: {
            fullName: `${firstName} ${lastName}`,
            activationCode: 123456789,
          },
        })
      );

      this.logger.log(`Completed register`);
    } catch (error) {
      this.logger.error(`Failed register: ${error}`);
      throw error;
    }
  }
}
