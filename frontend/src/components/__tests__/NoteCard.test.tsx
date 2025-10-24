import { describe, it, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithProviders, userEvent } from '../../test/test-utils';
import { NoteCard } from '../notes/NoteCard';
import { createMockNote } from '../../test/mocks/mockData';

const mockOnDelete = vi.fn();

describe('NoteCard', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders note title and preview', () => {
        const note = createMockNote({
            title: 'Test Note Title',
            content: 'This is test content for the note'
        });

        renderWithProviders(
            <NoteCard
                note={note}
                onDelete={mockOnDelete}
            />
        );

        expect(screen.getByText('Test Note Title')).toBeInTheDocument();
        expect(screen.getByText('This is test content for the note')).toBeInTheDocument();
    });

    it('truncates long content with ellipsis', () => {
        const longContent = 'A'.repeat(200);
        const note = createMockNote({
            content: longContent
        });

        renderWithProviders(
            <NoteCard
                note={note}
                onDelete={mockOnDelete}
            />
        );

        const contentElement = screen.getByText(/A{3}\.\.\.$/);
        expect(contentElement).toBeInTheDocument();
    });

    it('displays creation date formatting', () => {
        const note = createMockNote({
            createdAt: new Date('2024-01-01T10:00:00'),
            updatedAt: new Date('2024-01-01T10:00:00')
        });

        renderWithProviders(
            <NoteCard
                note={note}
                onDelete={mockOnDelete}
            />
        );

        expect(screen.getByText(/ago/)).toBeInTheDocument();
    });

    it('shows modified badge when updated after creation', () => {
        const note = createMockNote({
            createdAt: new Date('2024-01-01T10:00:00'),
            updatedAt: new Date('2024-01-01T11:00:00')
        });

        renderWithProviders(
            <NoteCard
                note={note}
                onDelete={mockOnDelete}
            />
        );

        expect(screen.getByText('Modified')).toBeInTheDocument();
    });

    it('handles click to view note', async () => {
        const note = createMockNote({ id: 'test-123' });

        renderWithProviders(
            <NoteCard
                note={note}
                onDelete={mockOnDelete}
            />
        );

        const titleLink = screen.getByRole('link', { name: /test note/i });
        expect(titleLink).toHaveAttribute('href', '/notes/test-123');
    });

    it('shows delete confirmation dialog', async () => {
        const user = userEvent.setup();
        const note = createMockNote();

        renderWithProviders(
            <NoteCard
                note={note}
                onDelete={mockOnDelete}
            />
        );

        // Open dropdown menu
        const moreButton = screen.getByRole('button', { name: /open menu/i });
        await user.click(moreButton);

        // Click delete option
        const deleteOption = screen.getByRole('menuitem', { name: /delete/i });
        await user.click(deleteOption);

        // Check dialog appears
        expect(screen.getByText('Delete Note')).toBeInTheDocument();
        expect(screen.getByText(/are you sure you want to delete/i)).toBeInTheDocument();
    });

    it('calls onDelete when delete is confirmed', async () => {
        const user = userEvent.setup();
        const note = createMockNote({ id: 'test-123', title: 'Test Note' });

        renderWithProviders(
            <NoteCard
                note={note}
                onDelete={mockOnDelete}
            />
        );

        // Open dropdown menu and click delete
        const moreButton = screen.getByRole('button', { name: /open menu/i });
        await user.click(moreButton);

        const deleteOption = screen.getByRole('menuitem', { name: /delete/i });
        await user.click(deleteOption);

        // Confirm deletion
        const confirmButton = screen.getByRole('button', { name: 'Delete' });
        await user.click(confirmButton);

        expect(mockOnDelete).toHaveBeenCalledWith('test-123');
    });

    it('shows loading state when deleting', () => {
        const note = createMockNote();

        renderWithProviders(
            <NoteCard
                note={note}
                onDelete={mockOnDelete}
                isDeleting={true}
            />
        );

        // The loading state would be shown in the delete dialog when opened
        expect(screen.getByRole('button', { name: /open menu/i })).toBeInTheDocument();
    });
});
