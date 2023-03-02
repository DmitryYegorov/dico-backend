import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Types } from '@dico-backend/common';

@Injectable()
export class UsersRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Types.Users.CreateUserRecord): Promise<void> {
    return this.prisma.user.create({ data });
  }
}
