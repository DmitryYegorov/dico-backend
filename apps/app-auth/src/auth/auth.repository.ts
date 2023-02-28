import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Auth } from '@prisma/client';
import { Types } from '@dico-backend/common';

@Injectable()
export class AuthRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Types.Auth.CreateAuthRecord) {
    return this.prisma.auth.create({ data });
  }

  async findByEmail(email: string): Promise<Auth | null> {
    return this.prisma.auth.findUnique({ where: { email } });
  }
}
