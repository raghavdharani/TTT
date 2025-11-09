/**
 * Sessions Controller
 * RESTful API endpoints for search sessions
 */

import { Controller, Post, Get, Put, Delete, Body, Param, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { SessionsService, SearchSession } from './sessions.service';
// import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
// import { GetUser } from '../auth/decorators/get-user.decorator';

@Controller('api/sessions')
// @UseGuards(JwtAuthGuard)
export class SessionsController {
  constructor(private readonly sessionsService: SessionsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createSessionDto: Partial<SearchSession>,
    // @GetUser() user: any
  ): Promise<SearchSession> {
    const userId = 'user-id'; // TODO: Get from auth
    return this.sessionsService.create(userId, createSessionDto);
  }

  @Get()
  async findAll(
    // @GetUser() user: any
  ): Promise<SearchSession[]> {
    const userId = 'user-id'; // TODO: Get from auth
    return this.sessionsService.findAll(userId);
  }

  @Get('last')
  async findLast(
    // @GetUser() user: any
  ): Promise<SearchSession | null> {
    const userId = 'user-id'; // TODO: Get from auth
    return this.sessionsService.findLast(userId);
  }

  @Get(':id')
  async findOne(
    @Param('id') id: string,
    // @GetUser() user: any
  ): Promise<SearchSession> {
    const userId = 'user-id'; // TODO: Get from auth
    const session = await this.sessionsService.findOne(id, userId);
    if (!session) {
      throw new Error('Session not found'); // TODO: Use proper exception
    }
    return session;
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateSessionDto: Partial<SearchSession>,
    // @GetUser() user: any
  ): Promise<SearchSession> {
    const userId = 'user-id'; // TODO: Get from auth
    return this.sessionsService.update(id, userId, updateSessionDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(
    @Param('id') id: string,
    // @GetUser() user: any
  ): Promise<void> {
    const userId = 'user-id'; // TODO: Get from auth
    return this.sessionsService.remove(id, userId);
  }
}

