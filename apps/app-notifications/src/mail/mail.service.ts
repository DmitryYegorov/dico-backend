import { Injectable, Logger } from '@nestjs/common';
import { createTransport } from 'nodemailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);

  constructor(private readonly config: ConfigService) {}

  async sendMail(options: any) {
    try {
      this.logger.log(`Invoked sendMail: ${JSON.stringify(options)}`);
      const transport = await createTransport({
        service: 'Yandex',
        auth: {
          user: this.config.get('MAIL_USER_EMAIL'),
          pass: this.config.get('MAIL_USER_PASSWORD'),
        },
      });
    } catch (error) {}
  }
}
