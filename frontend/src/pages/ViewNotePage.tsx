import { useParams, Navigate } from 'react-router-dom';
import { NoteViewer } from '../components/notes/NoteViewer';
import { LoadingSpinner } from '../components/ui/loading-spinner';
import { useNote, useNotes } from '../hooks/useNotes';

export const ViewNotePage = () => {
    const { id } = useParams<{ id: string }>();
    const { deleteNote, isDeleting } = useNotes();
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

    const handleDelete = async (noteId: string) => {
        await deleteNote(noteId);
    };

    return (
        <NoteViewer
            note={note}
            onDelete={handleDelete}
            isDeleting={isDeleting}
        />
    );
};
