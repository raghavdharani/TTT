/**
 * Sessions API Client
 * Handles API calls for saved search sessions
 */

import axios from 'axios';

export interface SearchSession {
  id: string;
  userId: string;
  name: string;
  searchQuery?: string;
  filters?: any;
  sortConfig?: any;
  columnConfig?: any;
  vendorMode?: 'primary' | 'secondary';
  createdAt: string;
  updatedAt: string;
}

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const sessionsApi = {
  /**
   * Create a new session
   */
  async create(session: Partial<SearchSession>): Promise<SearchSession> {
    const response = await axios.post<SearchSession>(`${API_BASE_URL}/api/sessions`, session);
    return response.data;
  },

  /**
   * Get all sessions for current user
   */
  async findAll(): Promise<SearchSession[]> {
    const response = await axios.get<SearchSession[]>(`${API_BASE_URL}/api/sessions`);
    return response.data;
  },

  /**
   * Get a single session
   */
  async findOne(id: string): Promise<SearchSession> {
    const response = await axios.get<SearchSession>(`${API_BASE_URL}/api/sessions/${id}`);
    return response.data;
  },

  /**
   * Get last session
   */
  async findLast(): Promise<SearchSession | null> {
    try {
      const response = await axios.get<SearchSession>(`${API_BASE_URL}/api/sessions/last`);
      return response.data;
    } catch (error: any) {
      // If 404 or network error, return null (no session found)
      if (error.response?.status === 404 || error.code === 'ERR_NETWORK') {
        return null;
      }
      throw error;
    }
  },

  /**
   * Update a session
   */
  async update(id: string, updates: Partial<SearchSession>): Promise<SearchSession> {
    const response = await axios.put<SearchSession>(`${API_BASE_URL}/api/sessions/${id}`, updates);
    return response.data;
  },

  /**
   * Delete a session
   */
  async delete(id: string): Promise<void> {
    await axios.delete(`${API_BASE_URL}/api/sessions/${id}`);
  },
};

