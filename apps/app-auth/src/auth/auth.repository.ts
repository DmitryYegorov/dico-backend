import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data) {
    console.log(data);
    return this.prisma.auth.create({ data });
  }
}
