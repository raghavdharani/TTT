/**
 * Search Controller
 * RESTful API endpoints for search functionality
 */

import { Controller, Post, Get, Body, Query, HttpCode, HttpStatus } from '@nestjs/common';
import { SearchService } from './search.service';
import { SearchRequest, SearchResponse, RecordCountResponse } from '../../../../shared/types/search';

@Controller('api/search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  /**
   * POST /api/search
   * Search for articles with filters and pagination
   */
  @Post()
  @HttpCode(HttpStatus.OK)
  async search(@Body() request: SearchRequest): Promise<SearchResponse> {
    return this.searchService.search(request);
  }

  /**
   * GET /api/search/count
   * Get record count for search query (optimized, cached)
   */
  @Get('count')
  async getCount(@Query() request: Partial<SearchRequest>): Promise<RecordCountResponse> {
    // Convert query params to SearchRequest
    const searchRequest: SearchRequest = {
      quickSearch: request.quickSearch,
      filters: request.filters,
      vendorMode: request.vendorMode,
      pagination: request.pagination,
    };
    
    return this.searchService.getRecordCount(searchRequest);
  }
}

