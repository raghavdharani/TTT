/**
 * Search Service
 * Handles product search with multi-field support and filtering
 */

import { Injectable, Inject } from '@nestjs/common';
import { SearchRequest, SearchResponse, RecordCountResponse } from '../../../../shared/types/search';
import { QueryBuilderService } from './query-builder.service';
import { PrismaService } from '../../common/prisma/prisma.service';
import { RedisService } from '../../common/redis/redis.service';

@Injectable()
export class SearchService {
  constructor(
    private readonly queryBuilder: QueryBuilderService,
    @Inject(PrismaService) private readonly prisma: PrismaService,
    @Inject(RedisService) private readonly redis: RedisService,
  ) {}

  /**
   * Search for articles based on query and filters
   * @param request Search request with query, filters, and pagination
   * @returns Search response with results and metadata
   */
  async search(request: SearchRequest): Promise<SearchResponse> {
    const startTime = Date.now();

    // Check Redis cache first
    const cacheKey = this.getCacheKey(request);
    const cached = await this.redis.get(cacheKey);
    if (cached) {
      return JSON.parse(cached);
    }

    // Build query using query builder
    const { query, params } = this.queryBuilder.buildSearchQuery(request);

    // Execute query
    const results = await this.prisma.executeRaw(query, params);

    // Get total count
    const countResult = await this.getRecordCount(request);
    const count = countResult.count;

    // Calculate pagination
    const page = request.pagination?.page || 1;
    const limit = request.pagination?.limit || 1000;
    const hasMore = count > page * limit;

    const executionTime = Date.now() - startTime;

    const response: SearchResponse = {
      count,
      data: results,
      executionTime,
      hasMore,
      page,
      limit,
    };

    // Cache results (5 minute TTL)
    await this.redis.setex(cacheKey, 300, JSON.stringify(response));

    return response;
  }

  /**
   * Get record count for search query without fetching data
   * Optimized for performance
   * @param request Search request with query and filters
   * @returns Record count and execution time
   */
  async getRecordCount(request: SearchRequest): Promise<RecordCountResponse> {
    const startTime = Date.now();

    // Check Redis cache for count
    const cacheKey = this.getCountCacheKey(request);
    const cached = await this.redis.get(cacheKey);
    if (cached) {
      return JSON.parse(cached);
    }

    // Build count query
    const { countQuery, countParams } = this.queryBuilder.buildSearchQuery(request);

    // Execute count query
    const result = await this.prisma.executeRawFirst<{ count: number }>(countQuery, countParams);
    const count = result?.count || 0;

    const executionTime = Date.now() - startTime;

    const response: RecordCountResponse = {
      count,
      executionTime,
    };

    // Cache count (5 minute TTL)
    await this.redis.setex(cacheKey, 300, JSON.stringify(response));

    return response;
  }

  /**
   * Generate cache key for search request
   */
  private getCacheKey(request: SearchRequest): string {
    const keyParts = [
      'search',
      request.quickSearch || '',
      JSON.stringify(request.filters || {}),
      request.vendorMode || 'primary',
      JSON.stringify(request.sort || {}),
      request.pagination?.page || 1,
      request.pagination?.limit || 1000,
    ];
    // TODO: Use crypto to create hash
    return keyParts.join(':');
  }

  /**
   * Generate cache key for count request
   */
  private getCountCacheKey(request: SearchRequest): string {
    const keyParts = [
      'search:count',
      request.quickSearch || '',
      JSON.stringify(request.filters || {}),
      request.vendorMode || 'primary',
    ];
    // TODO: Use crypto to create hash
    return keyParts.join(':');
  }
}

