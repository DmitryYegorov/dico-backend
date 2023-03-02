import { Controller, ValidationPipe } from '@nestjs/common';
import { UsersService } from './users.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { Dto } from '@dico-backend/common';

@Controller()
export class UsersController {
  constructor(private readonly service: UsersService) {}

  @MessagePattern('users.create_new_user')
  async createNewUser(
    @Payload(ValidationPipe) payload: Dto.Users.CreateNewUserDto
  ) {
    return this.service.createNewUser(payload);
  }
}
