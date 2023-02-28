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
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly repo: AuthRepository,
    @Inject('NOTIFICATIONS_MICROSERVICE')
    private readonly notificationsClient: ClientKafka,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService
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

      const activationCode = await this.jwtService.signAsync(
        { email },
        {
          expiresIn: '24h',
          secret: this.config.getOrThrow('JWT_COMMON_SECRET'),
        }
      );

      await this.repo.create({
        firstName,
        lastName,
        email,
        password: hashPass,
        activationCode,
      });

      await this.notificationsClient.emit(
        'notifications.send_email',
        JSON.stringify({
          email,
          templateId: 'user-registered-welcome',
          subject: 'Welcome to Dico',
          options: {
            fullName: `${firstName} ${lastName}`,
            activationCode,
          },
        })
      );

      this.logger.log(`Completed register`);
    } catch (error) {
      this.logger.error(`Failed register: ${error}`);
      throw error;
    }
  }

  async login(
    data: Dto.Auth.UserLoginDto
  ): Promise<Dto.Auth.UserLoginResponseDto> {
    try {
      this.logger.log(`Invoked login: ${data.email}`);

      const found = await this.repo.findByEmail(data.email);

      if (!found) {
        throw new RpcException('Invalid credentials');
      }

      const passwordMatches = await bcrypt.compare(
        data.password,
        found?.password || ''
      );

      if (!passwordMatches || !found.activationCode) {
        throw new RpcException(new BadRequestException('Invalid credentials'));
      }

      const [access, refresh] = await Promise.all([
        this.jwtService.signAsync(
          {
            email: found.email,
            id: found.id,
          },
          {
            secret: this.config.getOrThrow('JWT_ACCESS_SECRET'),
            expiresIn: '15m',
          }
        ),
        this.jwtService.signAsync(
          {
            email: found.email,
            id: found.id,
          },
          {
            secret: this.config.getOrThrow('JWT_REFRESH_SECRET'),
            expiresIn: '360d',
          }
        ),
      ]);

      this.logger.log(
        `Login by email completed: ${JSON.stringify({
          access,
          refresh,
          userId: found.id,
        })}`
      );

      return { access, refresh, userId: found.id };
    } catch (error) {
      this.logger.error(`Failed login: ${JSON.stringify(error)}`);
      throw error;
    }
  }
}
