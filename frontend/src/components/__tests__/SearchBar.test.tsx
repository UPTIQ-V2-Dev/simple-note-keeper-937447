import { describe, it, expect, vi } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import { renderWithProviders, userEvent } from '../../test/test-utils';
import { SearchBar } from '../notes/SearchBar';

const mockOnSearch = vi.fn();

describe('SearchBar', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders with placeholder text', () => {
        renderWithProviders(
            <SearchBar
                onSearch={mockOnSearch}
                placeholder='Search notes...'
            />
        );

        expect(screen.getByPlaceholderText('Search notes...')).toBeInTheDocument();
    });

    it('calls onSearch with debounced input', async () => {
        const user = userEvent.setup();

        renderWithProviders(<SearchBar onSearch={mockOnSearch} />);

        const searchInput = screen.getByRole('textbox');
        await user.type(searchInput, 'test query');

        // Wait for debounce
        await waitFor(
            () => {
                expect(mockOnSearch).toHaveBeenCalledWith('test query');
            },
            { timeout: 500 }
        );
    });

    it('shows clear button when input has value', async () => {
        const user = userEvent.setup();

        renderWithProviders(<SearchBar onSearch={mockOnSearch} />);

        const searchInput = screen.getByRole('textbox');
        await user.type(searchInput, 'test');

        expect(screen.getByRole('button', { name: /clear search/i })).toBeInTheDocument();
    });

    it('clears search when clear button is clicked', async () => {
        const user = userEvent.setup();

        renderWithProviders(<SearchBar onSearch={mockOnSearch} />);

        const searchInput = screen.getByRole('textbox');
        await user.type(searchInput, 'test');

        const clearButton = screen.getByRole('button', { name: /clear search/i });
        await user.click(clearButton);

        expect(searchInput).toHaveValue('');
        expect(mockOnSearch).toHaveBeenCalledWith('');
    });

    it('disables input when isSearching is true', () => {
        renderWithProviders(
            <SearchBar
                onSearch={mockOnSearch}
                isSearching={true}
            />
        );

        expect(screen.getByRole('textbox')).toBeDisabled();
    });

    it('debounces input to prevent excessive API calls', async () => {
        const user = userEvent.setup();

        renderWithProviders(<SearchBar onSearch={mockOnSearch} />);

        const searchInput = screen.getByRole('textbox');

        // Type multiple characters quickly
        await user.type(searchInput, 'abc');

        // Should only call onSearch once after debounce
        await waitFor(
            () => {
                expect(mockOnSearch).toHaveBeenCalledTimes(2); // Once for empty, once for 'abc'
            },
            { timeout: 500 }
        );

        expect(mockOnSearch).toHaveBeenCalledWith('abc');
    });
});
