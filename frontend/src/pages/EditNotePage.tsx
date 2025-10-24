import { useParams, Navigate } from 'react-router-dom';
import { NoteForm } from '../components/notes/NoteForm';
import { LoadingSpinner } from '../components/ui/loading-spinner';
import { useNote, useNotes } from '../hooks/useNotes';
import type { NoteFormData } from '../lib/validation';

export const EditNotePage = () => {
    const { id } = useParams<{ id: string }>();
    const { updateNote, isUpdating } = useNotes();
    const { data: note, isLoading, error } = useNote(id!);

    if (isLoading) {
        return (
            <div className='container mx-auto py-12 flex justify-center'>
                <LoadingSpinner size='lg' />
            </div>
        );
    }

    if (error || !note) {
        return (
            <Navigate
                to='/'
                replace
            />
        );
    }

    const handleSubmit = async (data: NoteFormData) => {
        await updateNote({
            id: note.id,
            input: {
                title: data.title,
                content: data.content
            }
        });
    };

    return (
        <NoteForm
            mode='edit'
            initialData={note}
            onSubmit={handleSubmit}
            isSubmitting={isUpdating}
        />
    );
};
