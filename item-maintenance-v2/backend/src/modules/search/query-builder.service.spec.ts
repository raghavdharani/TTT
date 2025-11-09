/**
 * Query Builder Service Tests
 * Unit tests for SQL query generation
 */

import { Test, TestingModule } from '@nestjs/testing';
import { QueryBuilderService } from './query-builder.service';
import { SearchRequest } from '../../../../shared/types/search';

describe('QueryBuilderService', () => {
  let service: QueryBuilderService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [QueryBuilderService],
    }).compile();

    service = module.get<QueryBuilderService>(QueryBuilderService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('buildSearchQuery', () => {
    it('should build query with quick search', () => {
      const request: SearchRequest = {
        quickSearch: 'ABC123',
        pagination: { page: 1, limit: 1000 },
      };

      const result = service.buildSearchQuery(request);

      expect(result.query).toContain('SELECT');
      expect(result.query).toContain('FROM articles');
      expect(result.query).toContain('LIKE');
      expect(result.query).toContain('ABC123');
      expect(result.params).toContain('%ABC123%');
      expect(result.query).toContain('LIMIT');
      expect(result.query).toContain('OFFSET');
    });

    it('should build query with hierarchy filters', () => {
      const request: SearchRequest = {
        filters: {
          hierarchy: {
            departments: ['01', '02'],
            classes: ['A', 'B'],
          },
        },
        pagination: { page: 1, limit: 100 },
      };

      const result = service.buildSearchQuery(request);

      expect(result.query).toContain('collection_id IN');
      expect(result.query).toContain('type_id IN');
      expect(result.params).toContain('01');
      expect(result.params).toContain('02');
      expect(result.params).toContain('A');
      expect(result.params).toContain('B');
    });

    it('should build query with pricing filters', () => {
      const request: SearchRequest = {
        filters: {
          pricing: {
            retailPrice: { min: 10, max: 50 },
            wholesalePrice: { min: 5 },
          },
        },
        vendorMode: 'primary',
        pagination: { page: 1, limit: 100 },
      };

      const result = service.buildSearchQuery(request);

      expect(result.query).toContain('retail_price');
      expect(result.query).toContain('wholesale_price');
      expect(result.params).toContain(10);
      expect(result.params).toContain(50);
      expect(result.params).toContain(5);
    });

    it('should build query with date filters', () => {
      const fromDate = new Date('2025-01-01');
      const toDate = new Date('2025-12-31');

      const request: SearchRequest = {
        filters: {
          dates: {
            lastModified: { from: fromDate, to: toDate },
          },
        },
        pagination: { page: 1, limit: 100 },
      };

      const result = service.buildSearchQuery(request);

      expect(result.query).toContain('last_modified_date');
      expect(result.query).toContain('>=');
      expect(result.query).toContain('<=');
      expect(result.params).toContain(fromDate);
      expect(result.params).toContain(toDate);
    });

    it('should build query with vendor mode primary', () => {
      const request: SearchRequest = {
        vendorMode: 'primary',
        pagination: { page: 1, limit: 100 },
      };

      const result = service.buildSearchQuery(request);

      expect(result.query).toContain('is_primary = true');
      expect(result.query).toContain('av.vendor_name');
      expect(result.query).not.toContain('av2');
    });

    it('should build query with vendor mode secondary', () => {
      const request: SearchRequest = {
        vendorMode: 'secondary',
        pagination: { page: 1, limit: 100 },
      };

      const result = service.buildSearchQuery(request);

      expect(result.query).toContain('is_primary = false');
      expect(result.query).toContain('av2');
    });

    it('should build query with sorting', () => {
      const request: SearchRequest = {
        sort: { field: 'price', direction: 'asc' },
        pagination: { page: 1, limit: 100 },
      };

      const result = service.buildSearchQuery(request);

      expect(result.query).toContain('ORDER BY');
      expect(result.query).toContain('retail_price');
      expect(result.query).toContain('ASC');
    });

    it('should build count query separately', () => {
      const request: SearchRequest = {
        quickSearch: 'test',
        pagination: { page: 1, limit: 100 },
      };

      const result = service.buildSearchQuery(request);

      expect(result.countQuery).toContain('COUNT');
      expect(result.countQuery).not.toContain('LIMIT');
      expect(result.countQuery).not.toContain('OFFSET');
      expect(result.countQuery).not.toContain('ORDER BY');
    });

    it('should handle pagination correctly', () => {
      const request: SearchRequest = {
        pagination: { page: 3, limit: 50 },
      };

      const result = service.buildSearchQuery(request);

      expect(result.query).toContain('LIMIT');
      expect(result.query).toContain('OFFSET');
      expect(result.params).toContain(50); // limit
      expect(result.params).toContain(100); // offset (page 3 - 1) * 50
    });

    it('should use parameterized queries for SQL injection protection', () => {
      const request: SearchRequest = {
        quickSearch: "'; DROP TABLE articles; --",
        pagination: { page: 1, limit: 100 },
      };

      const result = service.buildSearchQuery(request);

      // Should use parameterized query, not string concatenation
      expect(result.query).toContain('$');
      expect(result.params).toContain("%'; DROP TABLE articles; --%");
      // The dangerous SQL should be in params, not directly in query string
      expect(result.query).not.toContain('DROP TABLE');
    });
  });
});

