import type { Note } from '../types/notes';

export const mockNotes: Note[] = [
    {
        id: '1',
        title: 'Welcome to Notes',
        content: 'This is your first note! You can create, edit, and delete notes as needed.',
        createdAt: new Date('2024-01-15T10:00:00'),
        updatedAt: new Date('2024-01-15T10:00:00')
    },
    {
        id: '2',
        title: 'Meeting Notes',
        content:
            'Discussed project timeline and deliverables. Key points:\n- Phase 1 due next Friday\n- Review meeting scheduled for Monday\n- Need to coordinate with design team',
        createdAt: new Date('2024-01-16T14:30:00'),
        updatedAt: new Date('2024-01-16T15:45:00')
    },
    {
        id: '3',
        title: 'Shopping List',
        content: '- Milk\n- Bread\n- Eggs\n- Apples\n- Coffee',
        createdAt: new Date('2024-01-17T08:15:00'),
        updatedAt: new Date('2024-01-17T08:15:00')
    }
];
