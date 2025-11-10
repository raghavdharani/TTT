/**
 * Mock Data Service
 * Provides sample product data for development/testing without database
 */

import { Injectable } from '@nestjs/common';

export interface MockArticle {
  id: string;
  style: string;
  sku: string;
  description: string;
  size: string;
  color: string;
  department: string;
  class: string;
  subclass: string;
  status: string;
  season: string;
  labelTicket: string;
  wholesalePrice: number;
  retailPrice: number;
  markdownPrice?: number;
  vendorName: string;
  vendorColor?: string;
  lastModifiedDate: Date;
  creationDate: Date;
  activeCode: string;
}

@Injectable()
export class MockDataService {
  private articles: MockArticle[] = [];

  constructor() {
    this.initializeMockData();
  }

  /**
   * Initialize mock product data
   */
  private initializeMockData() {
    const departments = ['Men', 'Women', 'Kids', 'Accessories'];
    const classes = ['Tops', 'Bottoms', 'Outerwear', 'Footwear'];
    const subclasses = ['T-Shirts', 'Jeans', 'Jackets', 'Sneakers'];
    const colors = ['Black', 'White', 'Blue', 'Red', 'Green', 'Gray', 'Navy'];
    const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
    const vendors = ['Nike', 'Adidas', 'Puma', 'Under Armour', 'Reebok'];
    const seasons = ['Spring', 'Summer', 'Fall', 'Winter', 'All Season'];
    const statuses = ['Active', 'Inactive', 'Discontinued', 'New'];

    // Generate 1000 mock articles
    for (let i = 1; i <= 1000; i++) {
      const department = departments[Math.floor(Math.random() * departments.length)];
      const classItem = classes[Math.floor(Math.random() * classes.length)];
      const subclass = subclasses[Math.floor(Math.random() * subclasses.length)];
      const color = colors[Math.floor(Math.random() * colors.length)];
      const size = sizes[Math.floor(Math.random() * sizes.length)];
      const vendor = vendors[Math.floor(Math.random() * vendors.length)];
      const season = seasons[Math.floor(Math.random() * seasons.length)];
      const status = statuses[Math.floor(Math.random() * statuses.length)];

      const basePrice = Math.floor(Math.random() * 200) + 20;
      const wholesalePrice = basePrice;
      const retailPrice = Math.floor(basePrice * 1.5);
      const markdownPrice = Math.random() > 0.7 ? Math.floor(retailPrice * 0.7) : undefined;

      const creationDate = new Date(2023, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1);
      const lastModifiedDate = new Date(creationDate);
      lastModifiedDate.setDate(lastModifiedDate.getDate() + Math.floor(Math.random() * 365));

      this.articles.push({
        id: `ART-${String(i).padStart(6, '0')}`,
        style: `STYLE-${String(i).padStart(4, '0')}`,
        sku: `SKU-${department.substring(0, 2)}-${classItem.substring(0, 2)}-${String(i).padStart(4, '0')}`,
        description: `${vendor} ${classItem} ${color} ${size}`,
        size,
        color,
        department,
        class: classItem,
        subclass,
        status,
        season,
        labelTicket: `TICKET-${String(i).padStart(5, '0')}`,
        wholesalePrice,
        retailPrice,
        markdownPrice,
        vendorName: vendor,
        vendorColor: Math.random() > 0.5 ? color : undefined,
        lastModifiedDate,
        creationDate,
        activeCode: status === 'Active' ? 'A' : status === 'New' ? 'N' : 'I',
      });
    }
  }

  /**
   * Get all articles (for filtering/searching)
   */
  getAllArticles(): MockArticle[] {
    return [...this.articles];
  }

  /**
   * Filter articles based on search criteria
   */
  filterArticles(
    articles: MockArticle[],
    quickSearch?: string,
    filters?: any,
    vendorMode: 'primary' | 'secondary' = 'primary',
  ): MockArticle[] {
    let filtered = [...articles];

    // Quick search across multiple fields
    if (quickSearch) {
      const searchLower = quickSearch.toLowerCase();
      filtered = filtered.filter(article => 
        article.style.toLowerCase().includes(searchLower) ||
        article.sku.toLowerCase().includes(searchLower) ||
        article.description.toLowerCase().includes(searchLower) ||
        article.color.toLowerCase().includes(searchLower) ||
        article.vendorName.toLowerCase().includes(searchLower)
      );
    }

    // Apply filters
    if (filters) {
      // Item details filters
      if (filters.itemDetails) {
        if (filters.itemDetails.style) {
          filtered = filtered.filter(a => a.style.toLowerCase().includes(filters.itemDetails.style.toLowerCase()));
        }
        if (filters.itemDetails.sku) {
          filtered = filtered.filter(a => a.sku.toLowerCase().includes(filters.itemDetails.sku.toLowerCase()));
        }
        if (filters.itemDetails.description) {
          filtered = filtered.filter(a => a.description.toLowerCase().includes(filters.itemDetails.description.toLowerCase()));
        }
        if (filters.itemDetails.size) {
          filtered = filtered.filter(a => a.size === filters.itemDetails.size);
        }
        if (filters.itemDetails.color) {
          filtered = filtered.filter(a => a.color.toLowerCase().includes(filters.itemDetails.color.toLowerCase()));
        }
      }

      // Hierarchy filters
      if (filters.hierarchy) {
        if (filters.hierarchy.departments && filters.hierarchy.departments.length > 0) {
          filtered = filtered.filter(a => filters.hierarchy.departments.includes(a.department));
        }
        if (filters.hierarchy.classes && filters.hierarchy.classes.length > 0) {
          filtered = filtered.filter(a => filters.hierarchy.classes.includes(a.class));
        }
        if (filters.hierarchy.subclasses && filters.hierarchy.subclasses.length > 0) {
          filtered = filtered.filter(a => filters.hierarchy.subclasses.includes(a.subclass));
        }
      }

      // Vendor filters
      if (filters.vendor) {
        if (filters.vendor.vendorName && filters.vendor.vendorName.length > 0) {
          filtered = filtered.filter(a => filters.vendor.vendorName.includes(a.vendorName));
        }
        if (filters.vendor.vendorColor) {
          filtered = filtered.filter(a => a.vendorColor?.toLowerCase().includes(filters.vendor.vendorColor.toLowerCase()));
        }
      }

      // Pricing filters
      if (filters.pricing) {
        if (filters.pricing.wholesalePrice) {
          if (filters.pricing.wholesalePrice.min !== undefined) {
            filtered = filtered.filter(a => a.wholesalePrice >= filters.pricing.wholesalePrice.min);
          }
          if (filters.pricing.wholesalePrice.max !== undefined) {
            filtered = filtered.filter(a => a.wholesalePrice <= filters.pricing.wholesalePrice.max);
          }
        }
        if (filters.pricing.retailPrice) {
          if (filters.pricing.retailPrice.min !== undefined) {
            filtered = filtered.filter(a => a.retailPrice >= filters.pricing.retailPrice.min);
          }
          if (filters.pricing.retailPrice.max !== undefined) {
            filtered = filtered.filter(a => a.retailPrice <= filters.pricing.retailPrice.max);
          }
        }
        if (filters.pricing.markdownPrice) {
          if (filters.pricing.markdownPrice.min !== undefined) {
            filtered = filtered.filter(a => a.markdownPrice && a.markdownPrice >= filters.pricing.markdownPrice.min);
          }
          if (filters.pricing.markdownPrice.max !== undefined) {
            filtered = filtered.filter(a => a.markdownPrice && a.markdownPrice <= filters.pricing.markdownPrice.max);
          }
        }
      }

      // Status filters
      if (filters.status) {
        if (filters.status.activeCode && filters.status.activeCode.length > 0) {
          filtered = filtered.filter(a => filters.status.activeCode.includes(a.activeCode));
        }
        if (filters.status.season && filters.status.season.length > 0) {
          filtered = filtered.filter(a => filters.status.season.includes(a.season));
        }
        if (filters.status.labelTicket && filters.status.labelTicket.length > 0) {
          filtered = filtered.filter(a => filters.status.labelTicket.includes(a.labelTicket));
        }
      }

      // Date filters
      if (filters.dates) {
        if (filters.dates.lastModified) {
          if (filters.dates.lastModified.from) {
            filtered = filtered.filter(a => a.lastModifiedDate >= new Date(filters.dates.lastModified.from));
          }
          if (filters.dates.lastModified.to) {
            filtered = filtered.filter(a => a.lastModifiedDate <= new Date(filters.dates.lastModified.to));
          }
        }
        if (filters.dates.creation) {
          if (filters.dates.creation.from) {
            filtered = filtered.filter(a => a.creationDate >= new Date(filters.dates.creation.from));
          }
          if (filters.dates.creation.to) {
            filtered = filtered.filter(a => a.creationDate <= new Date(filters.dates.creation.to));
          }
        }
      }
    }

    return filtered;
  }

  /**
   * Sort articles
   */
  sortArticles(articles: MockArticle[], sortConfig?: { field: string; direction: 'asc' | 'desc' }): MockArticle[] {
    if (!sortConfig) {
      return articles;
    }

    const sorted = [...articles];
    const { field, direction } = sortConfig;

    sorted.sort((a, b) => {
      let aVal: any;
      let bVal: any;

      switch (field) {
        case 'relevance':
          // For relevance, maintain original order (could be enhanced)
          return 0;
        case 'lastModified':
          aVal = a.lastModifiedDate;
          bVal = b.lastModifiedDate;
          break;
        case 'creationDate':
          aVal = a.creationDate;
          bVal = b.creationDate;
          break;
        case 'price':
          aVal = a.retailPrice;
          bVal = b.retailPrice;
          break;
        default:
          return 0;
      }

      if (aVal < bVal) return direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return direction === 'asc' ? 1 : -1;
      return 0;
    });

    return sorted;
  }
}


