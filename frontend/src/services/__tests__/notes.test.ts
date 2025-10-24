import { describe, it, expect, beforeEach, vi } from 'vitest';
import { NotesService } from '../notes';
import { StorageService } from '../storage';

// Mock StorageService
vi.mock('../storage', () => ({
    StorageService: {
        getItem: vi.fn(),
        setItem: vi.fn(),
        removeItem: vi.fn()
    }
}));

const mockStorageService = StorageService as any;

describe('NotesService', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        // Reset environment variable mock
        vi.stubEnv('VITE_USE_MOCK_DATA', 'false');
    });

    describe('getAllNotes', () => {
        it('returns empty array when no notes exist', async () => {
            mockStorageService.getItem.mockReturnValue([]);

            const notes = await NotesService.getAllNotes();

            expect(notes).toEqual([]);
            expect(mockStorageService.getItem).toHaveBeenCalledWith('notes-app-notes', []);
        });

        it('returns notes with parsed dates', async () => {
            const storedNotes = [
                {
                    id: '1',
                    title: 'Test Note',
                    content: 'Test content',
                    createdAt: '2024-01-01T10:00:00.000Z',
                    updatedAt: '2024-01-01T10:00:00.000Z'
                }
            ];

            mockStorageService.getItem.mockReturnValue(storedNotes);

            const notes = await NotesService.getAllNotes();

            expect(notes).toHaveLength(1);
            expect(notes[0].createdAt).toBeInstanceOf(Date);
            expect(notes[0].updatedAt).toBeInstanceOf(Date);
        });

        it('returns mock data when VITE_USE_MOCK_DATA is true', async () => {
            vi.stubEnv('VITE_USE_MOCK_DATA', 'true');

            const notes = await NotesService.getAllNotes();

            expect(notes).toHaveLength(3);
            expect(mockStorageService.getItem).not.toHaveBeenCalled();
        });
    });

    describe('createNote', () => {
        it('creates note with generated ID and timestamps', async () => {
            mockStorageService.getItem.mockReturnValue([]);

            const input = { title: 'New Note', content: 'New content' };
            const note = await NotesService.createNote(input);

            expect(note.id).toBeTruthy();
            expect(note.title).toBe('New Note');
            expect(note.content).toBe('New content');
            expect(note.createdAt).toBeInstanceOf(Date);
            expect(note.updatedAt).toBeInstanceOf(Date);

            expect(mockStorageService.setItem).toHaveBeenCalledWith(
                'notes-app-notes',
                expect.arrayContaining([expect.objectContaining(input)])
            );
        });

        it('adds new note to beginning of existing notes', async () => {
            const existingNotes = [
                { id: '1', title: 'Old Note', content: '', createdAt: new Date(), updatedAt: new Date() }
            ];
            mockStorageService.getItem.mockReturnValue(existingNotes);

            const input = { title: 'New Note', content: 'New content' };
            await NotesService.createNote(input);

            const savedNotes = mockStorageService.setItem.mock.calls[0][1];
            expect(savedNotes[0].title).toBe('New Note');
            expect(savedNotes).toHaveLength(2);
        });
    });

    describe('getNoteById', () => {
        it('returns note when found', async () => {
            const storedNotes = [
                {
                    id: 'test-id',
                    title: 'Test Note',
                    content: 'Test content',
                    createdAt: '2024-01-01T10:00:00.000Z',
                    updatedAt: '2024-01-01T10:00:00.000Z'
                }
            ];

            mockStorageService.getItem.mockReturnValue(storedNotes);

            const note = await NotesService.getNoteById('test-id');

            expect(note).toBeTruthy();
            expect(note?.id).toBe('test-id');
            expect(note?.title).toBe('Test Note');
        });

        it('returns null when note not found', async () => {
            mockStorageService.getItem.mockReturnValue([]);

            const note = await NotesService.getNoteById('nonexistent');

            expect(note).toBeNull();
        });
    });

    describe('updateNote', () => {
        it('updates existing note', async () => {
            const existingNote = {
                id: 'test-id',
                title: 'Old Title',
                content: 'Old content',
                createdAt: '2024-01-01T10:00:00.000Z',
                updatedAt: '2024-01-01T10:00:00.000Z'
            };

            mockStorageService.getItem.mockReturnValue([existingNote]);

            const input = { title: 'Updated Title', content: 'Updated content' };
            const updatedNote = await NotesService.updateNote('test-id', input);

            expect(updatedNote?.title).toBe('Updated Title');
            expect(updatedNote?.content).toBe('Updated content');
            expect(updatedNote?.id).toBe('test-id');
            expect(updatedNote?.updatedAt).toBeInstanceOf(Date);
        });

        it('returns null when note not found', async () => {
            mockStorageService.getItem.mockReturnValue([]);

            const result = await NotesService.updateNote('nonexistent', { title: 'New Title' });

            expect(result).toBeNull();
        });
    });

    describe('deleteNote', () => {
        it('deletes existing note', async () => {
            const notes = [
                { id: '1', title: 'Note 1', content: '', createdAt: new Date(), updatedAt: new Date() },
                { id: '2', title: 'Note 2', content: '', createdAt: new Date(), updatedAt: new Date() }
            ];

            mockStorageService.getItem.mockReturnValue(notes);

            const result = await NotesService.deleteNote('1');

            expect(result).toBe(true);

            const savedNotes = mockStorageService.setItem.mock.calls[0][1];
            expect(savedNotes).toHaveLength(1);
            expect(savedNotes[0].id).toBe('2');
        });

        it('returns false when note not found', async () => {
            mockStorageService.getItem.mockReturnValue([]);

            const result = await NotesService.deleteNote('nonexistent');

            expect(result).toBe(false);
        });
    });

    describe('searchNotes', () => {
        const mockNotes = [
            {
                id: '1',
                title: 'JavaScript Tutorial',
                content: 'Learn React hooks',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                id: '2',
                title: 'Shopping List',
                content: 'Buy milk and bread',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                id: '3',
                title: 'Meeting Notes',
                content: 'Discuss JavaScript project',
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ];

        it('filters notes by title', async () => {
            mockStorageService.getItem.mockReturnValue(mockNotes);

            const results = await NotesService.searchNotes('JavaScript');

            expect(results).toHaveLength(2);
            expect(results.map(n => n.id)).toEqual(['1', '3']);
        });

        it('filters notes by content', async () => {
            mockStorageService.getItem.mockReturnValue(mockNotes);

            const results = await NotesService.searchNotes('milk');

            expect(results).toHaveLength(1);
            expect(results[0].id).toBe('2');
        });

        it('returns all notes when query is empty', async () => {
            mockStorageService.getItem.mockReturnValue(mockNotes);

            const results = await NotesService.searchNotes('');

            expect(results).toHaveLength(3);
        });

        it('performs case-insensitive search', async () => {
            mockStorageService.getItem.mockReturnValue(mockNotes);

            const results = await NotesService.searchNotes('javascript');

            expect(results).toHaveLength(2);
        });
    });
});
