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
  private sessions: Map<string, SearchSession> = new Map();
  private useMockData: boolean;

  constructor(
    @Inject(PrismaService) private readonly prisma: PrismaService,
  ) {
    // Check if we should use mock data (no DATABASE_URL or placeholder)
    this.useMockData = !process.env.DATABASE_URL || process.env.DATABASE_URL.includes('placeholder');
  }

  /**
   * Create a new search session
   */
  async create(userId: string, sessionData: Partial<SearchSession>): Promise<SearchSession> {
    if (this.useMockData) {
      const session: SearchSession = {
        id: `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        userId,
        name: sessionData.name || 'Untitled Search',
        searchQuery: sessionData.searchQuery,
        filters: sessionData.filters,
        sortConfig: sessionData.sortConfig,
        columnConfig: sessionData.columnConfig,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      this.sessions.set(session.id, session);
      return session;
    }

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
    if (this.useMockData) {
      const userSessions = Array.from(this.sessions.values())
        .filter(s => s.userId === userId)
        .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
      return userSessions;
    }

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
    if (this.useMockData) {
      const session = this.sessions.get(id);
      if (!session) {
        return null;
      }
      if (session.userId !== userId) {
        throw new ForbiddenException('You do not have access to this session');
      }
      return session;
    }

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
    
    if (this.useMockData) {
      const session = this.sessions.get(id)!;
      if (updates.name !== undefined) session.name = updates.name;
      if (updates.searchQuery !== undefined) session.searchQuery = updates.searchQuery;
      if (updates.filters !== undefined) session.filters = updates.filters;
      if (updates.sortConfig !== undefined) session.sortConfig = updates.sortConfig;
      if (updates.columnConfig !== undefined) session.columnConfig = updates.columnConfig;
      session.updatedAt = new Date();
      this.sessions.set(id, session);
      return session;
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
    
    if (this.useMockData) {
      this.sessions.delete(id);
      return;
    }
    
    await this.prisma.searchSession.delete({
      where: { id },
    });
  }

  /**
   * Get the last session for a user
   */
  async findLast(userId: string): Promise<SearchSession | null> {
    if (this.useMockData) {
      const userSessions = Array.from(this.sessions.values())
        .filter(s => s.userId === userId)
        .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
      return userSessions.length > 0 ? userSessions[0] : null;
    }

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

