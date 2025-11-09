/**
 * Search State Management Slice
 * Using Redux Toolkit pattern (can be adapted to Zustand)
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SearchRequest, SearchResponse } from '../../../shared/types/search';

interface SearchState {
  searchQuery: string;
  filters: SearchRequest['filters'];
  sortConfig: SearchRequest['sort'];
  vendorMode: 'primary' | 'secondary';
  activeFilters: { key: string; label: string }[];
  recordCount: number | null;
  results: any[];
  loading: boolean;
  error: string | null;
}

const initialState: SearchState = {
  searchQuery: '',
  filters: undefined,
  sortConfig: undefined,
  vendorMode: 'primary',
  activeFilters: [],
  recordCount: null,
  results: [],
  loading: false,
  error: null,
};

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setFilters: (state, action: PayloadAction<SearchRequest['filters']>) => {
      state.filters = action.payload;
    },
    setSortConfig: (state, action: PayloadAction<SearchRequest['sort']>) => {
      state.sortConfig = action.payload;
    },
    setVendorMode: (state, action: PayloadAction<'primary' | 'secondary'>) => {
      state.vendorMode = action.payload;
    },
    setActiveFilters: (state, action: PayloadAction<{ key: string; label: string }[]>) => {
      state.activeFilters = action.payload;
    },
    setRecordCount: (state, action: PayloadAction<number | null>) => {
      state.recordCount = action.payload;
    },
    setResults: (state, action: PayloadAction<any[]>) => {
      state.results = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const {
  setSearchQuery,
  setFilters,
  setSortConfig,
  setVendorMode,
  setActiveFilters,
  setRecordCount,
  setResults,
  setLoading,
  setError,
} = searchSlice.actions;

export default searchSlice.reducer;

