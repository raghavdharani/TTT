/**
 * Prisma Service
 * Database connection and query service
 */

import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);

  async onModuleInit() {
    // Skip database connection if DATABASE_URL is not set (using mock data)
    if (!process.env.DATABASE_URL || process.env.DATABASE_URL.includes('placeholder')) {
      this.logger.warn('DATABASE_URL not configured - running in mock data mode');
      return;
    }
    
    try {
      await this.$connect();
      this.logger.log('Database connection established');
    } catch (error) {
      this.logger.error('Failed to connect to database', error);
      this.logger.warn('Continuing in mock data mode');
      // Don't throw - allow app to run with mock data
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
    this.logger.log('Database connection closed');
  }

  /**
   * Execute raw SQL query with parameters
   * @param query SQL query string with $1, $2, etc. placeholders
   * @param params Array of parameter values
   * @returns Query results
   */
  async executeRaw<T = any>(query: string, params: any[] = []): Promise<T[]> {
    try {
      // Convert parameterized query format if needed
      // Prisma uses $1, $2 format for PostgreSQL
      // For SQL Server, might need different format
      const result = await this.$queryRawUnsafe<T>(query, ...params);
      return result as T[];
    } catch (error) {
      this.logger.error('Database query error', error);
      throw error;
    }
  }

  /**
   * Execute raw SQL query and return first result
   */
  async executeRawFirst<T = any>(query: string, params: any[] = []): Promise<T | null> {
    const results = await this.executeRaw<T>(query, params);
    return results.length > 0 ? results[0] : null;
  }
}

