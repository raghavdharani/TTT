/**
 * Root Application Module
 */

import { Module } from '@nestjs/common';
import { SearchModule } from './modules/search/search.module';
import { SessionsModule } from './modules/sessions/sessions.module';
import { PrismaModule } from './common/prisma/prisma.module';
import { RedisModule } from './common/redis/redis.module';
import { MockDataModule } from './common/mock-data/mock-data.module';

@Module({
  imports: [
    PrismaModule,
    RedisModule,
    MockDataModule,
    SearchModule,
    SessionsModule,
  ],
})
export class AppModule {}

