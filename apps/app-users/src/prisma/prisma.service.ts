import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client/scripts/default-index';

@Injectable()
export class PrismaService extends PrismaClient {}
