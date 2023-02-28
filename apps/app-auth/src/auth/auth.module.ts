import {Module} from '@nestjs/common';
import {AuthController} from './auth.controller';
import {AuthRepository} from './auth.repository';
import {PrismaService} from '../prisma/prisma.service';
import {
  ClientsModule,
  Transport,
} from '@nestjs/microservices';
import {AuthService} from './auth.service';
import {JwtModule, JwtService} from "@nestjs/jwt";

@Module({
  controllers: [AuthController],
  providers: [AuthRepository, AuthService, PrismaService, JwtService],
  imports: [
    JwtModule,
    ClientsModule.register([
      {
        name: 'NOTIFICATIONS_MICROSERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'notifications',
            brokers: ['localhost:29092'],
          },
          consumer: {
            groupId: 'notifications-consumer',
          },
        },
      },
    ]),
  ],
})
export class AuthModule {
}
