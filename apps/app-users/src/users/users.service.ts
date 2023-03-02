import { Injectable, Logger } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { Dto } from '@dico-backend/common';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(private readonly repo: UsersRepository) {}

  async createNewUser(user: Dto.Users.CreateNewUserDto): Promise<void> {
    try {
      this.logger.log(`Invoked createNewUser: ${JSON.stringify(user)}`);

      const created = await this.repo.create(user);

      this.logger.log(
        `Completed createNewUser: ${JSON.stringify({ created })}`
      );
    } catch (error) {
      this.logger.error(
        `Failed createNewUser: ${JSON.stringify({ user, error })}`
      );
      throw error;
    }
  }
}
