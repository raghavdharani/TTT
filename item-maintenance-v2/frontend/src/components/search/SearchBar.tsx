/**
 * SearchBar Component
 * Global search input with debouncing, history, and autocomplete
 */

import React, { useState, useEffect, useRef } from 'react';
import { Search } from 'lucide-react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSearch: (query: string) => void;
  placeholder?: string;
  debounceMs?: number;
}

export function SearchBar({
  value,
  onChange,
  onSearch,
  placeholder = 'Search by SKU, UPC, or description...',
  debounceMs = 500,
}: SearchBarProps) {
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [autocompleteSuggestions, setAutocompleteSuggestions] = useState<string[]>([]);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load search history from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('search-history');
    if (stored) {
      try {
        setSearchHistory(JSON.parse(stored).slice(0, 20));
      } catch (e) {
        // Ignore parse errors
      }
    }
  }, []);

  // Debounced search
  useEffect(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    if (value.trim()) {
      debounceTimerRef.current = setTimeout(() => {
        onSearch(value);
      }, debounceMs);
    }

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [value, debounceMs, onSearch]);

  // TODO: Implement autocomplete suggestions API call
  useEffect(() => {
    if (value.trim().length > 2) {
      // TODO: Call autocomplete API
      setAutocompleteSuggestions([]);
    } else {
      setAutocompleteSuggestions([]);
    }
  }, [value]);

  const handleSearch = () => {
    if (value.trim()) {
      // Add to history
      const newHistory = [value, ...searchHistory.filter(h => h !== value)].slice(0, 20);
      setSearchHistory(newHistory);
      localStorage.setItem('search-history', JSON.stringify(newHistory));
      
      onSearch(value);
      setShowHistory(false);
    }
  };

  const handleHistoryClick = (query: string) => {
    onChange(query);
    onSearch(query);
    setShowHistory(false);
  };

  const clearHistory = () => {
    setSearchHistory([]);
    localStorage.removeItem('search-history');
  };

  return (
    <div className="relative flex-1 max-w-2xl">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
      <Input
        ref={inputRef}
        type="text"
        placeholder={placeholder}
        className="pl-10 pr-20 rounded-lg border-gray-300 focus:border-[#1976D2] focus:ring-[#1976D2]"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setShowHistory(true)}
        onBlur={() => {
          // Delay to allow click on history items
          setTimeout(() => setShowHistory(false), 200);
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            handleSearch();
          }
        }}
      />
      <Button
        onClick={handleSearch}
        className="absolute right-2 top-1/2 -translate-y-1/2 h-8 px-3 text-sm"
        size="sm"
      >
        Search
      </Button>

      {/* Search History Dropdown */}
      {showHistory && (searchHistory.length > 0 || autocompleteSuggestions.length > 0) && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
          {searchHistory.length > 0 && (
            <div className="p-2">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-gray-500 font-medium">Recent Searches</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearHistory}
                  className="h-6 px-2 text-xs"
                >
                  Clear
                </Button>
              </div>
              {searchHistory.map((query, index) => (
                <button
                  key={index}
                  onClick={() => handleHistoryClick(query)}
                  className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded text-sm"
                >
                  {query}
                </button>
              ))}
            </div>
          )}
          {autocompleteSuggestions.length > 0 && (
            <div className="p-2 border-t border-gray-200">
              <span className="text-xs text-gray-500 font-medium mb-2 block">Suggestions</span>
              {autocompleteSuggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleHistoryClick(suggestion)}
                  className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded text-sm"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

