import { NoteForm } from '../components/notes/NoteForm';
import { useNotes } from '../hooks/useNotes';
import type { NoteFormData } from '../lib/validation';

export const CreateNotePage = () => {
    const { createNote, isCreating } = useNotes();

    const handleSubmit = async (data: NoteFormData) => {
        await createNote({
            title: data.title,
            content: data.content
        });
    };

    return (
        <NoteForm
            mode='create'
            onSubmit={handleSubmit}
            isSubmitting={isCreating}
        />
    );
};
