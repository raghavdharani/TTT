/**
 * Root Application Module
 */

import { Module } from '@nestjs/common';
import { SearchModule } from './modules/search/search.module';
import { SessionsModule } from './modules/sessions/sessions.module';
import { PrismaModule } from './common/prisma/prisma.module';
import { RedisModule } from './common/redis/redis.module';

@Module({
  imports: [
    PrismaModule,
    RedisModule,
    SearchModule,
    SessionsModule,
  ],
})
export class AppModule {}

