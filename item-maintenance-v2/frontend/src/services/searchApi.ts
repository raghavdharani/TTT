/**
 * Search API Client
 * Handles API calls for search functionality
 */

import axios from 'axios';
import { SearchRequest, SearchResponse, RecordCountResponse } from '../../../shared/types/search';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const searchApi = {
  /**
   * Search for articles
   */
  async search(request: SearchRequest): Promise<SearchResponse> {
    const response = await axios.post<SearchResponse>(`${API_BASE_URL}/api/search`, request);
    return response.data;
  },

  /**
   * Get record count
   */
  async getCount(request: Partial<SearchRequest>): Promise<RecordCountResponse> {
    const response = await axios.get<RecordCountResponse>(`${API_BASE_URL}/api/search/count`, {
      params: request,
    });
    return response.data;
  },
};

