import { Controller } from '@nestjs/common';
import { MailService } from './mail.service';
import {EventPattern, Payload} from '@nestjs/microservices';

@Controller()
export class MailController {
  constructor(private readonly service: MailService) {}

  @EventPattern('notifications.send_email')
  async sendEmail(@Payload() payload) {
    return this.service.sendMail(payload);
  }
}
