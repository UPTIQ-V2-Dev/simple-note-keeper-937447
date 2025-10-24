import type { Note, CreateNoteInput, UpdateNoteInput } from '../types/notes';
import { StorageService } from './storage';
import { mockNotes } from '../data/mockNotes';

const NOTES_STORAGE_KEY = 'notes-app-notes';

export class NotesService {
    private static generateId(): string {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    static getAllNotes(): Promise<Note[]> {
        // Return mock data if environment variable is set
        if (import.meta.env.VITE_USE_MOCK_DATA === 'true') {
            return Promise.resolve(mockNotes);
        }

        return new Promise(resolve => {
            const notes = StorageService.getItem<Note[]>(NOTES_STORAGE_KEY, []);
            // Convert string dates back to Date objects
            const parsedNotes = notes.map(note => ({
                ...note,
                createdAt: new Date(note.createdAt),
                updatedAt: new Date(note.updatedAt)
            }));
            resolve(parsedNotes);
        });
    }

    static createNote(input: CreateNoteInput): Promise<Note> {
        // Return mock data if environment variable is set
        if (import.meta.env.VITE_USE_MOCK_DATA === 'true') {
            const newNote: Note = {
                id: this.generateId(),
                title: input.title,
                content: input.content || '',
                createdAt: new Date(),
                updatedAt: new Date()
            };
            return Promise.resolve(newNote);
        }

        return new Promise(resolve => {
            const notes = StorageService.getItem<Note[]>(NOTES_STORAGE_KEY, []);
            const newNote: Note = {
                id: this.generateId(),
                title: input.title,
                content: input.content || '',
                createdAt: new Date(),
                updatedAt: new Date()
            };

            const updatedNotes = [newNote, ...notes];
            StorageService.setItem(NOTES_STORAGE_KEY, updatedNotes);
            resolve(newNote);
        });
    }

    static getNoteById(id: string): Promise<Note | null> {
        // Return mock data if environment variable is set
        if (import.meta.env.VITE_USE_MOCK_DATA === 'true') {
            const note = mockNotes.find(n => n.id === id) || null;
            return Promise.resolve(note);
        }

        return new Promise(resolve => {
            const notes = StorageService.getItem<Note[]>(NOTES_STORAGE_KEY, []);
            const parsedNotes = notes.map(note => ({
                ...note,
                createdAt: new Date(note.createdAt),
                updatedAt: new Date(note.updatedAt)
            }));
            const note = parsedNotes.find(n => n.id === id) || null;
            resolve(note);
        });
    }

    static updateNote(id: string, input: UpdateNoteInput): Promise<Note | null> {
        // Return mock data if environment variable is set
        if (import.meta.env.VITE_USE_MOCK_DATA === 'true') {
            const existingNote = mockNotes.find(n => n.id === id);
            if (!existingNote) return Promise.resolve(null);

            const updatedNote: Note = {
                ...existingNote,
                title: input.title !== undefined ? input.title : existingNote.title,
                content: input.content !== undefined ? input.content : existingNote.content,
                updatedAt: new Date()
            };
            return Promise.resolve(updatedNote);
        }

        return new Promise(resolve => {
            const notes = StorageService.getItem<Note[]>(NOTES_STORAGE_KEY, []);
            const noteIndex = notes.findIndex(n => n.id === id);

            if (noteIndex === -1) {
                resolve(null);
                return;
            }

            const existingNote = notes[noteIndex];
            const updatedNote: Note = {
                ...existingNote,
                title: input.title !== undefined ? input.title : existingNote.title,
                content: input.content !== undefined ? input.content : existingNote.content,
                updatedAt: new Date(),
                createdAt: new Date(existingNote.createdAt)
            };

            notes[noteIndex] = updatedNote;
            StorageService.setItem(NOTES_STORAGE_KEY, notes);
            resolve(updatedNote);
        });
    }

    static deleteNote(id: string): Promise<boolean> {
        // Return mock success if environment variable is set
        if (import.meta.env.VITE_USE_MOCK_DATA === 'true') {
            return Promise.resolve(true);
        }

        return new Promise(resolve => {
            const notes = StorageService.getItem<Note[]>(NOTES_STORAGE_KEY, []);
            const filteredNotes = notes.filter(n => n.id !== id);

            if (filteredNotes.length === notes.length) {
                resolve(false); // Note not found
                return;
            }

            StorageService.setItem(NOTES_STORAGE_KEY, filteredNotes);
            resolve(true);
        });
    }

    static searchNotes(query: string): Promise<Note[]> {
        // Return mock filtered data if environment variable is set
        if (import.meta.env.VITE_USE_MOCK_DATA === 'true') {
            const filteredNotes = mockNotes.filter(
                note =>
                    note.title.toLowerCase().includes(query.toLowerCase()) ||
                    note.content.toLowerCase().includes(query.toLowerCase())
            );
            return Promise.resolve(filteredNotes);
        }

        return new Promise(resolve => {
            const notes = StorageService.getItem<Note[]>(NOTES_STORAGE_KEY, []);
            const parsedNotes = notes.map(note => ({
                ...note,
                createdAt: new Date(note.createdAt),
                updatedAt: new Date(note.updatedAt)
            }));

            if (!query.trim()) {
                resolve(parsedNotes);
                return;
            }

            const filteredNotes = parsedNotes.filter(
                note =>
                    note.title.toLowerCase().includes(query.toLowerCase()) ||
                    note.content.toLowerCase().includes(query.toLowerCase())
            );
            resolve(filteredNotes);
        });
    }
}
