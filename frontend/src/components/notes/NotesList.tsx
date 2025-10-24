import { NoteCard } from './NoteCard';
import { EmptyState } from './EmptyState';
import { LoadingSpinner } from '../ui/loading-spinner';
import type { Note } from '../../types/notes';

interface NotesListProps {
    notes: Note[];
    onDeleteNote: (id: string) => void;
    isLoading?: boolean;
    isDeleting?: boolean;
    searchQuery?: string;
}

export const NotesList = ({
    notes,
    onDeleteNote,
    isLoading = false,
    isDeleting = false,
    searchQuery = ''
}: NotesListProps) => {
    if (isLoading) {
        return (
            <div className='flex justify-center items-center py-12'>
                <LoadingSpinner />
            </div>
        );
    }

    if (notes.length === 0) {
        return (
            <EmptyState
                title={searchQuery ? 'No notes found' : 'No notes yet'}
                description={
                    searchQuery
                        ? `No notes match "${searchQuery}". Try different keywords.`
                        : 'Create your first note to get started!'
                }
                showCreateButton={!searchQuery}
            />
        );
    }

    return (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
            {notes.map(note => (
                <NoteCard
                    key={note.id}
                    note={note}
                    onDelete={onDeleteNote}
                    isDeleting={isDeleting}
                />
            ))}
        </div>
    );
};
