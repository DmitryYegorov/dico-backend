import {
  BaseExceptionFilter,
  HttpAdapterHost,
  NestFactory,
} from '@nestjs/core';

import { AppModule } from './app.module';
import { Filters } from '@dico-backend/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const adapter = app.get(HttpAdapterHost);
  app.useGlobalFilters(new Filters.AllExceptionFilter(adapter));
  app.useGlobalFilters(new Filters.HttpExceptionFilter());

  await app.listen(4444);
}

bootstrap();
