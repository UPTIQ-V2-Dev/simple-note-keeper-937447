import type { Note } from '../../types/notes';

export const mockNotes: Note[] = [
    {
        id: '1',
        title: 'Test Note 1',
        content: 'This is test content for note 1',
        createdAt: new Date('2024-01-01T10:00:00'),
        updatedAt: new Date('2024-01-01T10:00:00')
    },
    {
        id: '2',
        title: 'Test Note 2',
        content: 'This is test content for note 2 with more details',
        createdAt: new Date('2024-01-02T11:00:00'),
        updatedAt: new Date('2024-01-02T12:00:00')
    },
    {
        id: '3',
        title: 'Shopping List',
        content: 'Milk\nBread\nEggs',
        createdAt: new Date('2024-01-03T14:00:00'),
        updatedAt: new Date('2024-01-03T14:00:00')
    }
];

export const createMockNote = (overrides: Partial<Note> = {}): Note => ({
    id: '1',
    title: 'Test Note',
    content: 'Test content',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    ...overrides
});
