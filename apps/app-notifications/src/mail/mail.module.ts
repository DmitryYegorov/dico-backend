import { Module } from '@nestjs/common';
import { MailController } from './mail.controller';
import { MailService } from './mail.service';
import { TemplateEngineService } from './template-engine.service';

@Module({
  controllers: [MailController],
  providers: [MailService, TemplateEngineService],
})
export class MailModule {}
