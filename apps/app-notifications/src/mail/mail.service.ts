import { Injectable, Logger } from '@nestjs/common';
import { createTransport } from 'nodemailer';
import { ConfigService } from '@nestjs/config';
import { TemplateEngineService } from './template-engine.service';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);

  constructor(
    private readonly config: ConfigService,
    private readonly engine: TemplateEngineService
  ) {}

  async sendMail(data: {
    email: string;
    templateId: string;
    options: Record<string, any>;
    subject: string;
  }) {
    try {
      const { email, templateId, options, subject } = data;
      this.logger.log(
        `Invoked sendMail: ${JSON.stringify({ email, templateId, options })}`
      );

      const html = await this.engine.generateHtml(templateId, {
        ...options,
        subject,
      });
      const transport = await createTransport({
        host: 'smtp.yandex.ru',
        logger: true,
        debug: true,
        auth: {
          user: this.config.get('MAIL_USER_EMAIL'),
          pass: this.config.get('MAIL_USER_PASSWORD'),
        },
      });

      await transport.sendMail({
        to: email,
        from: this.config.get('MAIL_USER_EMAIL'),
        subject,
        html,
      });

      this.logger.log(`Email sent: ${email}`);
    } catch (error) {
      this.logger.error(`Failed sendMail: ${error}`);
      throw error;
    }
  }
}
