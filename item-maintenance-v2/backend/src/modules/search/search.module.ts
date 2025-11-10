/**
 * Search Module
 * Module for search functionality
 */

import { Module } from '@nestjs/common';
import { SearchController } from './search.controller';
import { SearchService } from './search.service';
import { QueryBuilderService } from './query-builder.service';
import { PrismaModule } from '../../common/prisma/prisma.module';
import { RedisModule } from '../../common/redis/redis.module';
import { MockDataModule } from '../../common/mock-data/mock-data.module';

@Module({
  imports: [PrismaModule, RedisModule, MockDataModule],
  controllers: [SearchController],
  providers: [SearchService, QueryBuilderService],
  exports: [SearchService],
})
export class SearchModule {}

