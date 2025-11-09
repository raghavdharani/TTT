/**
 * Redux Store Configuration
 */

import { configureStore } from '@reduxjs/toolkit';
import searchReducer from './searchSlice';

export const store = configureStore({
  reducer: {
    search: searchReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ['search/setFilters', 'search/setSortConfig'],
        // Ignore these field paths in all actions
        ignoredActionPaths: ['payload.filters', 'payload.sortConfig'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

