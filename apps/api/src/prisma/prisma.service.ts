import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaLibSql } from '@prisma/adapter-libsql';
import * as path from 'path';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor() {
    const dbPath = path.join(process.cwd(), 'dev.db');
    const adapter = new PrismaLibSql({ url: `file:${dbPath}` });
    super({ adapter } as any);
  }

  async onModuleInit() {
    await this.$connect();
  }
}
