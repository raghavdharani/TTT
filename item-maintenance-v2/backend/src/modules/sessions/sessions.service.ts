/**
 * Sessions Service
 * Handles CRUD operations for saved search sessions
 */

import { Injectable, NotFoundException, ForbiddenException, Inject } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';

export interface SearchSession {
  id: string;
  userId: string;
  name: string;
  searchQuery?: string;
  filters?: any; // JSON
  sortConfig?: any; // JSON
  columnConfig?: any; // JSON
  createdAt: Date;
  updatedAt: Date;
}

@Injectable()
export class SessionsService {
  constructor(
    @Inject(PrismaService) private readonly prisma: PrismaService,
  ) {}

  /**
   * Create a new search session
   */
  async create(userId: string, sessionData: Partial<SearchSession>): Promise<SearchSession> {
    const session = await this.prisma.searchSession.create({
      data: {
        userId,
        name: sessionData.name || 'Untitled Search',
        searchQuery: sessionData.searchQuery || null,
        filters: sessionData.filters ? JSON.stringify(sessionData.filters) : null,
        sortConfig: sessionData.sortConfig ? JSON.stringify(sessionData.sortConfig) : null,
        columnConfig: sessionData.columnConfig ? JSON.stringify(sessionData.columnConfig) : null,
      },
    });
    return this.mapPrismaToSession(session);
  }

  /**
   * Get all sessions for a user
   */
  async findAll(userId: string): Promise<SearchSession[]> {
    const sessions = await this.prisma.searchSession.findMany({
      where: { userId },
      orderBy: { updatedAt: 'desc' },
    });
    return sessions.map(s => this.mapPrismaToSession(s));
  }

  /**
   * Get a single session by ID
   */
  async findOne(id: string, userId: string): Promise<SearchSession | null> {
    const session = await this.prisma.searchSession.findUnique({
      where: { id },
    });
    
    if (!session) {
      return null;
    }
    
    if (session.userId !== userId) {
      throw new ForbiddenException('You do not have access to this session');
    }
    
    return this.mapPrismaToSession(session);
  }

  /**
   * Update an existing session
   */
  async update(id: string, userId: string, updates: Partial<SearchSession>): Promise<SearchSession> {
    // First verify ownership
    const existing = await this.findOne(id, userId);
    if (!existing) {
      throw new NotFoundException(`Session with ID ${id} not found`);
    }
    
    const session = await this.prisma.searchSession.update({
      where: { id },
      data: {
        name: updates.name,
        searchQuery: updates.searchQuery,
        filters: updates.filters ? JSON.stringify(updates.filters) : undefined,
        sortConfig: updates.sortConfig ? JSON.stringify(updates.sortConfig) : undefined,
        columnConfig: updates.columnConfig ? JSON.stringify(updates.columnConfig) : undefined,
        updatedAt: new Date(),
      },
    });
    
    return this.mapPrismaToSession(session);
  }

  /**
   * Delete a session
   */
  async remove(id: string, userId: string): Promise<void> {
    // First verify ownership
    const existing = await this.findOne(id, userId);
    if (!existing) {
      throw new NotFoundException(`Session with ID ${id} not found`);
    }
    
    await this.prisma.searchSession.delete({
      where: { id },
    });
  }

  /**
   * Get the last session for a user
   */
  async findLast(userId: string): Promise<SearchSession | null> {
    const session = await this.prisma.searchSession.findFirst({
      where: { userId },
      orderBy: { updatedAt: 'desc' },
    });
    
    return session ? this.mapPrismaToSession(session) : null;
  }

  /**
   * Map Prisma model to SearchSession interface
   */
  private mapPrismaToSession(prismaSession: any): SearchSession {
    return {
      id: prismaSession.id,
      userId: prismaSession.userId,
      name: prismaSession.name,
      searchQuery: prismaSession.searchQuery,
      filters: prismaSession.filters ? JSON.parse(prismaSession.filters) : undefined,
      sortConfig: prismaSession.sortConfig ? JSON.parse(prismaSession.sortConfig) : undefined,
      columnConfig: prismaSession.columnConfig ? JSON.parse(prismaSession.columnConfig) : undefined,
      createdAt: prismaSession.createdAt,
      updatedAt: prismaSession.updatedAt,
    };
  }
}

