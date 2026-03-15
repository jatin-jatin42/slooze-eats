import 'dotenv/config';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor() {
    const connectionString = process.env.POSTGRES_PRISMA_URL || process.env.POSTGRES_URL || process.env.DATABASE_URL;
    const pool = new Pool({ connectionString });
    //@ts-ignore
    const adapter = new PrismaPg(pool);
    super({ adapter } as any);
  }

  async onModuleInit() {


    await this.$connect();
  }
}
