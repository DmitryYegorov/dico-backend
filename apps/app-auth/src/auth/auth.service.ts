import { Inject, Injectable } from '@nestjs/common';
import { AuthRepository } from './auth.repository';
import { ClientKafka } from '@nestjs/microservices';

@Injectable()
export class AuthService {
  constructor(
    private readonly repo: AuthRepository,
    @Inject('NOTIFICATIONS_MICROSERVICE')
    private readonly notificationsClient: ClientKafka
  ) {}
}
