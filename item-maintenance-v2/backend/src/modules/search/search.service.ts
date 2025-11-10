/**
 * Search Service
 * Handles product search with multi-field support and filtering
 */

import { Injectable, Inject } from '@nestjs/common';
import { SearchRequest, SearchResponse, RecordCountResponse } from '../../../../shared/types/search';
import { QueryBuilderService } from './query-builder.service';
import { PrismaService } from '../../common/prisma/prisma.service';
import { RedisService } from '../../common/redis/redis.service';
import { MockDataService } from '../../common/mock-data/mock-data.service';

@Injectable()
export class SearchService {
  private useMockData: boolean;

  constructor(
    private readonly queryBuilder: QueryBuilderService,
    @Inject(PrismaService) private readonly prisma: PrismaService,
    @Inject(RedisService) private readonly redis: RedisService,
    @Inject(MockDataService) private readonly mockData: MockDataService,
  ) {
    // Check if we should use mock data (no DATABASE_URL or placeholder)
    this.useMockData = !process.env.DATABASE_URL || process.env.DATABASE_URL.includes('placeholder');
  }

  /**
   * Search for articles based on query and filters
   * @param request Search request with query, filters, and pagination
   * @returns Search response with results and metadata
   */
  async search(request: SearchRequest): Promise<SearchResponse> {
    const startTime = Date.now();

    // Check Redis cache first (only if not using mock data)
    if (!this.useMockData) {
      const cacheKey = this.getCacheKey(request);
      const cached = await this.redis.get(cacheKey);
      if (cached) {
        return JSON.parse(cached);
      }
    }

    let results: any[];
    let count: number;

    if (this.useMockData) {
      // Use mock data
      const allArticles = this.mockData.getAllArticles();
      let filtered = this.mockData.filterArticles(
        allArticles,
        request.quickSearch,
        request.filters,
        request.vendorMode,
      );

      // Sort
      if (request.sort) {
        filtered = this.mockData.sortArticles(filtered, request.sort);
      }

      count = filtered.length;

      // Paginate
      const page = request.pagination?.page || 1;
      const limit = request.pagination?.limit || 1000;
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      results = filtered.slice(startIndex, endIndex);
    } else {
      // Use database
      const { query, params } = this.queryBuilder.buildSearchQuery(request);
      results = await this.prisma.executeRaw(query, params);
      const countResult = await this.getRecordCount(request);
      count = countResult.count;
    }

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

    // Cache results (5 minute TTL) - only if not using mock data
    if (!this.useMockData) {
      const cacheKey = this.getCacheKey(request);
      await this.redis.setex(cacheKey, 300, JSON.stringify(response));
    }

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

    let count: number;

    if (this.useMockData) {
      // Use mock data
      const allArticles = this.mockData.getAllArticles();
      const filtered = this.mockData.filterArticles(
        allArticles,
        request.quickSearch,
        request.filters,
        request.vendorMode,
      );
      count = filtered.length;
    } else {
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
      count = result?.count || 0;

      // Cache count (5 minute TTL)
      await this.redis.setex(cacheKey, 300, JSON.stringify({ count, executionTime: Date.now() - startTime }));
    }

    const executionTime = Date.now() - startTime;

    const response: RecordCountResponse = {
      count,
      executionTime,
    };

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

