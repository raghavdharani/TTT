/**
 * FilterPanel Component Tests
 * Focused tests for filter panel functionality
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { FilterPanel } from './FilterPanel';

describe('FilterPanel', () => {
  const mockOnOpenChange = jest.fn();
  const mockOnApplyFilters = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should not render when closed', () => {
    render(
      <FilterPanel
        open={false}
        onOpenChange={mockOnOpenChange}
        activeFilters={[]}
        onApplyFilters={mockOnApplyFilters}
      />
    );

    expect(screen.queryByText('Filters')).not.toBeInTheDocument();
  });

  it('should render when open', () => {
    render(
      <FilterPanel
        open={true}
        onOpenChange={mockOnOpenChange}
        activeFilters={[]}
        onApplyFilters={mockOnApplyFilters}
      />
    );

    expect(screen.getByText('Filters')).toBeInTheDocument();
  });

  it('should close when close button is clicked', () => {
    render(
      <FilterPanel
        open={true}
        onOpenChange={mockOnOpenChange}
        activeFilters={[]}
        onApplyFilters={mockOnApplyFilters}
      />
    );

    const closeButton = screen.getByLabelText('Close filter panel');
    fireEvent.click(closeButton);

    expect(mockOnOpenChange).toHaveBeenCalledWith(false);
  });

  it('should have accordion sections for filters', () => {
    render(
      <FilterPanel
        open={true}
        onOpenChange={mockOnOpenChange}
        activeFilters={[]}
        onApplyFilters={mockOnApplyFilters}
      />
    );

    expect(screen.getByText('Item Details')).toBeInTheDocument();
    expect(screen.getByText('Hierarchy')).toBeInTheDocument();
    expect(screen.getByText('Vendor')).toBeInTheDocument();
    expect(screen.getByText('Pricing')).toBeInTheDocument();
    expect(screen.getByText('Status & Attributes')).toBeInTheDocument();
    expect(screen.getByText('Dates')).toBeInTheDocument();
  });

  it('should call onApplyFilters when Apply Filters button is clicked', () => {
    render(
      <FilterPanel
        open={true}
        onOpenChange={mockOnOpenChange}
        activeFilters={[]}
        onApplyFilters={mockOnApplyFilters}
      />
    );

    const applyButton = screen.getByText('Apply Filters');
    fireEvent.click(applyButton);

    // TODO: Verify filters are collected and passed when filter collection is implemented
    expect(mockOnApplyFilters).toHaveBeenCalled();
  });

  it('should reset filters when Reset button is clicked', () => {
    render(
      <FilterPanel
        open={true}
        onOpenChange={mockOnOpenChange}
        activeFilters={[{ key: 'test', label: 'Test Filter' }]}
        onApplyFilters={mockOnApplyFilters}
      />
    );

    const resetButton = screen.getByText('Reset');
    fireEvent.click(resetButton);

    expect(mockOnApplyFilters).toHaveBeenCalledWith([]);
  });
});

