/**
 * SearchBar Component Tests
 * Focused tests for search bar functionality
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { SearchBar } from './SearchBar';

describe('SearchBar', () => {
  const mockOnSearch = jest.fn();
  const mockOnChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  it('should render search input with placeholder', () => {
    render(
      <SearchBar
        value=""
        onChange={mockOnChange}
        onSearch={mockOnSearch}
      />
    );

    expect(screen.getByPlaceholderText(/Search by SKU, UPC, or description/i)).toBeInTheDocument();
  });

  it('should update search input value', () => {
    render(
      <SearchBar
        value=""
        onChange={mockOnChange}
        onSearch={mockOnSearch}
      />
    );

    const input = screen.getByPlaceholderText(/Search by SKU, UPC, or description/i);
    fireEvent.change(input, { target: { value: 'ABC123' } });

    expect(mockOnChange).toHaveBeenCalledWith('ABC123');
  });

  it('should trigger search on Enter key', () => {
    render(
      <SearchBar
        value="ABC123"
        onChange={mockOnChange}
        onSearch={mockOnSearch}
      />
    );

    const input = screen.getByPlaceholderText(/Search by SKU, UPC, or description/i);
    fireEvent.keyDown(input, { key: 'Enter' });

    expect(mockOnSearch).toHaveBeenCalledWith('ABC123');
  });

  it('should trigger search on Search button click', () => {
    render(
      <SearchBar
        value="ABC123"
        onChange={mockOnChange}
        onSearch={mockOnSearch}
      />
    );

    const searchButton = screen.getByText('Search');
    fireEvent.click(searchButton);

    expect(mockOnSearch).toHaveBeenCalledWith('ABC123');
  });

  it('should show search history when input is focused', async () => {
    localStorage.setItem('search-history', JSON.stringify(['Previous Search 1', 'Previous Search 2']));

    render(
      <SearchBar
        value=""
        onChange={mockOnChange}
        onSearch={mockOnSearch}
      />
    );

    const input = screen.getByPlaceholderText(/Search by SKU, UPC, or description/i);
    fireEvent.focus(input);

    await waitFor(() => {
      expect(screen.getByText('Previous Search 1')).toBeInTheDocument();
    });
  });

  it('should add search to history when search is performed', () => {
    render(
      <SearchBar
        value="New Search"
        onChange={mockOnChange}
        onSearch={mockOnSearch}
      />
    );

    const searchButton = screen.getByText('Search');
    fireEvent.click(searchButton);

    const history = JSON.parse(localStorage.getItem('search-history') || '[]');
    expect(history).toContain('New Search');
  });
});

