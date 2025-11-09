/**
 * Query Builder Service
 * Builds SQL queries for article search with multi-field support and filtering
 */

import { Injectable } from '@nestjs/common';
import { SearchRequest } from '../../../../shared/types/search';

export interface QueryResult {
  query: string;
  params: any[];
  countQuery: string;
  countParams: any[];
}

@Injectable()
export class QueryBuilderService {
  /**
   * Build search query from SearchRequest
   * Supports multi-field search, filters, vendor mode, sorting, and pagination
   */
  buildSearchQuery(request: SearchRequest): QueryResult {
    const params: any[] = [];
    let paramIndex = 1;
    const conditions: string[] = [];

    // Base query - select from articles with vendor joins
    const vendorMode = request.vendorMode || 'primary';
    const baseSelect = this.buildBaseSelect(vendorMode);
    const baseFrom = this.buildBaseFrom(vendorMode);

    // Quick search - multi-field WHERE clause
    if (request.quickSearch?.trim()) {
      const searchTerm = `%${request.quickSearch.trim()}%`;
      const quickSearchConditions = [
        'a.style LIKE $' + paramIndex,
        'a.upc LIKE $' + paramIndex,
        'a.description LIKE $' + paramIndex,
        'av.vendor_name LIKE $' + paramIndex,
      ];
      params.push(searchTerm);
      paramIndex++;
      conditions.push(`(${quickSearchConditions.join(' OR ')})`);
    }

    // Apply filters
    if (request.filters) {
      const filterConditions = this.buildFilterConditions(request.filters, params, paramIndex);
      conditions.push(...filterConditions.conditions);
      paramIndex = filterConditions.nextParamIndex;
    }

    // Build WHERE clause
    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    // Sorting
    const orderBy = this.buildOrderBy(request.sort);

    // Pagination
    const pagination = this.buildPagination(request.pagination, params, paramIndex);
    paramIndex = pagination.nextParamIndex;

    // Main query
    const query = `
      ${baseSelect}
      ${baseFrom}
      ${whereClause}
      ${orderBy}
      ${pagination.limitClause}
      ${pagination.offsetClause}
    `.trim();

    // Count query (optimized, no pagination)
    const countQuery = `
      SELECT COUNT(DISTINCT a.article_id) as count
      ${baseFrom}
      ${whereClause}
    `.trim();

    return {
      query,
      params,
      countQuery,
      countParams: [...params], // Same params for count query
    };
  }

  /**
   * Build base SELECT clause based on vendor mode
   */
  private buildBaseSelect(vendorMode: 'primary' | 'secondary'): string {
    const baseFields = [
      'a.article_id',
      'a.style',
      'a.upc',
      'a.description',
      'a.last_modified_date',
      'a.creation_date',
      'a.active_code',
      'a.season',
      'a.label_ticket',
    ];

    if (vendorMode === 'primary') {
      baseFields.push(
        'av.vendor_name as primary_vendor',
        'av.vendor_color as primary_vendor_color',
        'avc.wholesale_price',
        'avc.retail_price',
        'avc.markdown_price'
      );
    } else {
      baseFields.push(
        'av2.vendor_name as secondary_vendor',
        'av2.vendor_color as secondary_vendor_color',
        'avc2.wholesale_price',
        'avc2.retail_price',
        'avc2.markdown_price'
      );
    }

    return `SELECT ${baseFields.join(', ')}`;
  }

  /**
   * Build base FROM clause with appropriate joins based on vendor mode
   */
  private buildBaseFrom(vendorMode: 'primary' | 'secondary'): string {
    let fromClause = 'FROM articles a';

    // Join with collection (department)
    fromClause += ' LEFT JOIN coll c ON a.collection_id = c.collection_id';

    // Join with types (class)
    fromClause += ' LEFT JOIN types t ON a.type_id = t.type_id';

    if (vendorMode === 'primary') {
      // Primary vendor joins
      fromClause += ' LEFT JOIN artven av ON a.article_id = av.article_id AND av.is_primary = true';
      fromClause += ' LEFT JOIN artvc avc ON a.article_id = avc.article_id AND avc.vendor_id = av.vendor_id';
    } else {
      // Secondary vendor joins
      fromClause += ' LEFT JOIN artven av ON a.article_id = av.article_id AND av.is_primary = true';
      fromClause += ' LEFT JOIN artven av2 ON a.article_id = av2.article_id AND av2.is_primary = false';
      fromClause += ' LEFT JOIN artvc avc2 ON a.article_id = avc2.article_id AND avc2.vendor_id = av2.vendor_id';
    }

    return fromClause;
  }

  /**
   * Build filter conditions from SearchFilters
   */
  private buildFilterConditions(
    filters: any,
    params: any[],
    startParamIndex: number
  ): { conditions: string[]; nextParamIndex: number } {
    const conditions: string[] = [];
    let paramIndex = startParamIndex;

    // Hierarchy filters
    if (filters.hierarchy) {
      if (filters.hierarchy.departments?.length > 0) {
        const deptPlaceholders = filters.hierarchy.departments
          .map(() => `$${paramIndex++}`)
          .join(', ');
        params.push(...filters.hierarchy.departments);
        conditions.push(`c.collection_id IN (${deptPlaceholders})`);
      }

      if (filters.hierarchy.classes?.length > 0) {
        const classPlaceholders = filters.hierarchy.classes
          .map(() => `$${paramIndex++}`)
          .join(', ');
        params.push(...filters.hierarchy.classes);
        conditions.push(`t.type_id IN (${classPlaceholders})`);
      }

      if (filters.hierarchy.subclasses?.length > 0) {
        const subclassPlaceholders = filters.hierarchy.subclasses
          .map(() => `$${paramIndex++}`)
          .join(', ');
        params.push(...filters.hierarchy.subclasses);
        conditions.push(`a.subclass_id IN (${subclassPlaceholders})`);
      }
    }

    // Activity filters
    if (filters.activity) {
      if (filters.activity.status?.length > 0) {
        const statusPlaceholders = filters.activity.status
          .map(() => `$${paramIndex++}`)
          .join(', ');
        params.push(...filters.activity.status);
        conditions.push(`a.active_code IN (${statusPlaceholders})`);
      }

      if (filters.activity.lastModifiedDate) {
        if (filters.activity.lastModifiedDate.from) {
          params.push(filters.activity.lastModifiedDate.from);
          conditions.push(`a.last_modified_date >= $${paramIndex++}`);
        }
        if (filters.activity.lastModifiedDate.to) {
          params.push(filters.activity.lastModifiedDate.to);
          conditions.push(`a.last_modified_date <= $${paramIndex++}`);
        }
      }

      if (filters.activity.creationDate) {
        if (filters.activity.creationDate.from) {
          params.push(filters.activity.creationDate.from);
          conditions.push(`a.creation_date >= $${paramIndex++}`);
        }
        if (filters.activity.creationDate.to) {
          params.push(filters.activity.creationDate.to);
          conditions.push(`a.creation_date <= $${paramIndex++}`);
        }
      }
    }

    // Vendor filters
    if (filters.vendor) {
      if (filters.vendor.vendorName?.length > 0) {
        const vendorPlaceholders = filters.vendor.vendorName
          .map(() => `$${paramIndex++}`)
          .join(', ');
        params.push(...filters.vendor.vendorName);
        conditions.push(`av.vendor_name IN (${vendorPlaceholders})`);
      }

      if (filters.vendor.vendorColor) {
        params.push(`%${filters.vendor.vendorColor}%`);
        conditions.push(`av.vendor_color LIKE $${paramIndex++}`);
      }
    }

    // Pricing filters
    if (filters.pricing) {
      const vendorMode = filters.vendor?.mode || 'primary';
      const pricePrefix = vendorMode === 'primary' ? 'avc' : 'avc2';

      if (filters.pricing.wholesalePrice) {
        if (filters.pricing.wholesalePrice.min !== undefined) {
          params.push(filters.pricing.wholesalePrice.min);
          conditions.push(`${pricePrefix}.wholesale_price >= $${paramIndex++}`);
        }
        if (filters.pricing.wholesalePrice.max !== undefined) {
          params.push(filters.pricing.wholesalePrice.max);
          conditions.push(`${pricePrefix}.wholesale_price <= $${paramIndex++}`);
        }
      }

      if (filters.pricing.retailPrice) {
        if (filters.pricing.retailPrice.min !== undefined) {
          params.push(filters.pricing.retailPrice.min);
          conditions.push(`${pricePrefix}.retail_price >= $${paramIndex++}`);
        }
        if (filters.pricing.retailPrice.max !== undefined) {
          params.push(filters.pricing.retailPrice.max);
          conditions.push(`${pricePrefix}.retail_price <= $${paramIndex++}`);
        }
      }

      if (filters.pricing.markdownPrice) {
        if (filters.pricing.markdownPrice.min !== undefined) {
          params.push(filters.pricing.markdownPrice.min);
          conditions.push(`${pricePrefix}.markdown_price >= $${paramIndex++}`);
        }
        if (filters.pricing.markdownPrice.max !== undefined) {
          params.push(filters.pricing.markdownPrice.max);
          conditions.push(`${pricePrefix}.markdown_price <= $${paramIndex++}`);
        }
      }
    }

    // Status & Attributes filters
    if (filters.status) {
      if (filters.status.activeCode?.length > 0) {
        const activeCodePlaceholders = filters.status.activeCode
          .map(() => `$${paramIndex++}`)
          .join(', ');
        params.push(...filters.status.activeCode);
        conditions.push(`a.active_code IN (${activeCodePlaceholders})`);
      }

      if (filters.status.season?.length > 0) {
        const seasonPlaceholders = filters.status.season
          .map(() => `$${paramIndex++}`)
          .join(', ');
        params.push(...filters.status.season);
        conditions.push(`a.season IN (${seasonPlaceholders})`);
      }

      if (filters.status.labelTicket?.length > 0) {
        const labelPlaceholders = filters.status.labelTicket
          .map(() => `$${paramIndex++}`)
          .join(', ');
        params.push(...filters.status.labelTicket);
        conditions.push(`a.label_ticket IN (${labelPlaceholders})`);
      }
    }

    // Date filters (consolidated from dates object)
    if (filters.dates) {
      if (filters.dates.lastModified) {
        if (filters.dates.lastModified.from) {
          params.push(filters.dates.lastModified.from);
          conditions.push(`a.last_modified_date >= $${paramIndex++}`);
        }
        if (filters.dates.lastModified.to) {
          params.push(filters.dates.lastModified.to);
          conditions.push(`a.last_modified_date <= $${paramIndex++}`);
        }
      }

      if (filters.dates.creation) {
        if (filters.dates.creation.from) {
          params.push(filters.dates.creation.from);
          conditions.push(`a.creation_date >= $${paramIndex++}`);
        }
        if (filters.dates.creation.to) {
          params.push(filters.dates.creation.to);
          conditions.push(`a.creation_date <= $${paramIndex++}`);
        }
      }
    }

    return { conditions, nextParamIndex: paramIndex };
  }

  /**
   * Build ORDER BY clause
   */
  private buildOrderBy(sort?: { field: string; direction: string }): string {
    if (!sort) {
      return 'ORDER BY a.last_modified_date DESC'; // Default sort
    }

    let orderField = '';
    switch (sort.field) {
      case 'relevance':
        // Relevance could be based on search term match score
        // For now, default to last modified
        orderField = 'a.last_modified_date';
        break;
      case 'lastModified':
        orderField = 'a.last_modified_date';
        break;
      case 'creationDate':
        orderField = 'a.creation_date';
        break;
      case 'price':
        orderField = 'avc.retail_price'; // Default to retail price
        break;
      default:
        orderField = 'a.last_modified_date';
    }

    const direction = sort.direction?.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';
    return `ORDER BY ${orderField} ${direction}`;
  }

  /**
   * Build pagination clauses
   */
  private buildPagination(
    pagination?: { page?: number; limit?: number },
    params?: any[],
    startParamIndex?: number
  ): { limitClause: string; offsetClause: string; nextParamIndex: number } {
    const page = pagination?.page || 1;
    const limit = pagination?.limit || 1000;
    const offset = (page - 1) * limit;

    let paramIndex = startParamIndex || 1;

    if (params) {
      params.push(limit);
      params.push(offset);
    }

    return {
      limitClause: `LIMIT $${paramIndex++}`,
      offsetClause: `OFFSET $${paramIndex++}`,
      nextParamIndex: paramIndex,
    };
  }
}

