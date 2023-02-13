/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { HttpAdapterHost, NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { Filters } from '@dico-backend/common';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.KAFKA,
      options: {
        client: {
          clientId: 'auth',
          brokers: ['localhost:29092'],
        },
        consumer: {
          groupId: 'auth-consumer',
        },
      },
    }
  );

  // const adapter = app.get(HttpAdapterHost);
  //
  // app.useGlobalFilters(new Filters.RpcExceptionFilter(adapter));

  await app.listen();
}

bootstrap();
