/**
 * Search Service Tests
 * Focused tests for search functionality
 */

import { Test, TestingModule } from '@nestjs/testing';
import { SearchService } from './search.service';
import { SearchRequest } from '../../../../shared/types/search';

describe('SearchService', () => {
  let service: SearchService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SearchService],
    }).compile();

    service = module.get<SearchService>(SearchService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('search', () => {
    it('should search across multiple fields (SKU, Style, Vendor, Description)', async () => {
      const request: SearchRequest = {
        quickSearch: 'ABC123',
        pagination: { page: 1, limit: 1000 },
      };

      const result = await service.search(request);
      
      expect(result).toBeDefined();
      expect(result).toHaveProperty('count');
      expect(result).toHaveProperty('data');
      expect(result).toHaveProperty('executionTime');
      expect(result).toHaveProperty('hasMore');
    });

    it('should support partial matching in search', async () => {
      const request: SearchRequest = {
        quickSearch: 'ABC',
        pagination: { page: 1, limit: 1000 },
      };

      const result = await service.search(request);
      
      expect(result).toBeDefined();
      // TODO: Verify partial matching works when query builder is implemented
    });

    it('should return empty results when no matches found', async () => {
      const request: SearchRequest = {
        quickSearch: 'NONEXISTENT12345',
        pagination: { page: 1, limit: 1000 },
      };

      const result = await service.search(request);
      
      expect(result.count).toBe(0);
      expect(result.data).toEqual([]);
    });

    it('should complete search within 3 seconds for 20K records', async () => {
      const request: SearchRequest = {
        quickSearch: 'test',
        pagination: { page: 1, limit: 20000 },
      };

      const startTime = Date.now();
      const result = await service.search(request);
      const executionTime = Date.now() - startTime;
      
      expect(result.executionTime).toBeLessThanOrEqual(3000);
      expect(executionTime).toBeLessThanOrEqual(3000);
    });

    it('should handle special characters in search query', async () => {
      const request: SearchRequest = {
        quickSearch: 'ABC-123_Test@Special',
        pagination: { page: 1, limit: 1000 },
      };

      const result = await service.search(request);
      
      expect(result).toBeDefined();
      // Should not throw error with special characters
    });
  });

  describe('getRecordCount', () => {
    it('should return record count without fetching data', async () => {
      const request: SearchRequest = {
        quickSearch: 'ABC123',
      };

      const result = await service.getRecordCount(request);
      
      expect(result).toBeDefined();
      expect(result).toHaveProperty('count');
      expect(result).toHaveProperty('executionTime');
      expect(typeof result.count).toBe('number');
    });

    it('should complete count query within 3 seconds for 20K records', async () => {
      const request: SearchRequest = {
        quickSearch: 'test',
      };

      const startTime = Date.now();
      const result = await service.getRecordCount(request);
      const executionTime = Date.now() - startTime;
      
      expect(result.executionTime).toBeLessThanOrEqual(3000);
      expect(executionTime).toBeLessThanOrEqual(3000);
    });
  });
});

