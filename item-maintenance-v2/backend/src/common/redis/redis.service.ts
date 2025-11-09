/**
 * Redis Service
 * Caching service for search results and counts
 */

import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
// import { createClient, RedisClientType } from 'redis';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(RedisService.name);
  // private client: RedisClientType;

  async onModuleInit() {
    try {
      // TODO: Uncomment when redis package is installed
      // this.client = createClient({
      //   url: process.env.REDIS_URL || 'redis://localhost:6379',
      // });
      // 
      // this.client.on('error', (err) => {
      //   this.logger.error('Redis Client Error', err);
      // });
      // 
      // await this.client.connect();
      // this.logger.log('Redis connection established');
      this.logger.warn('Redis not configured - caching disabled');
    } catch (error) {
      this.logger.error('Failed to connect to Redis', error);
      // Don't throw - allow app to run without Redis
    }
  }

  async onModuleDestroy() {
    // TODO: Uncomment when redis is set up
    // if (this.client) {
    //   await this.client.quit();
    //   this.logger.log('Redis connection closed');
    // }
  }

  /**
   * Get value from cache
   */
  async get(key: string): Promise<string | null> {
    // TODO: Uncomment when redis is set up
    // try {
    //   return await this.client.get(key);
    // } catch (error) {
    //   this.logger.error(`Redis GET error for key: ${key}`, error);
    //   return null;
    // }
    return null;
  }

  /**
   * Set value in cache with TTL
   */
  async setex(key: string, seconds: number, value: string): Promise<void> {
    // TODO: Uncomment when redis is set up
    // try {
    //   await this.client.setEx(key, seconds, value);
    // } catch (error) {
    //   this.logger.error(`Redis SETEX error for key: ${key}`, error);
    // }
  }

  /**
   * Delete key from cache
   */
  async del(key: string): Promise<void> {
    // TODO: Uncomment when redis is set up
    // try {
    //   await this.client.del(key);
    // } catch (error) {
    //   this.logger.error(`Redis DEL error for key: ${key}`, error);
    // }
  }

  /**
   * Invalidate all search-related cache keys
   */
  async invalidateSearchCache(pattern: string = 'search:*'): Promise<void> {
    // TODO: Uncomment when redis is set up
    // try {
    //   const keys = await this.client.keys(pattern);
    //   if (keys.length > 0) {
    //     await this.client.del(keys);
    //     this.logger.log(`Invalidated ${keys.length} cache keys matching ${pattern}`);
    //   }
    // } catch (error) {
    //   this.logger.error(`Redis cache invalidation error for pattern: ${pattern}`, error);
    // }
  }
}

