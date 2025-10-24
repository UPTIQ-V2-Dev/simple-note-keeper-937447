import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { NotesService } from '../services/notes';
import type { Note, UpdateNoteInput } from '../types/notes';
import { toast } from 'sonner';

const NOTES_QUERY_KEY = ['notes'];

export const useNotes = () => {
    const queryClient = useQueryClient();

    const {
        data: notes = [],
        isLoading,
        error,
        refetch
    } = useQuery({
        queryKey: NOTES_QUERY_KEY,
        queryFn: NotesService.getAllNotes
    });

    const createNoteMutation = useMutation({
        mutationFn: NotesService.createNote,
        onSuccess: newNote => {
            queryClient.setQueryData<Note[]>(NOTES_QUERY_KEY, (old = []) => [newNote, ...old]);
            toast.success('Note created successfully');
        },
        onError: () => {
            toast.error('Failed to create note');
        }
    });

    const updateNoteMutation = useMutation({
        mutationFn: ({ id, input }: { id: string; input: UpdateNoteInput }) => NotesService.updateNote(id, input),
        onSuccess: updatedNote => {
            if (updatedNote) {
                queryClient.setQueryData<Note[]>(NOTES_QUERY_KEY, (old = []) =>
                    old.map(note => (note.id === updatedNote.id ? updatedNote : note))
                );
                toast.success('Note updated successfully');
            }
        },
        onError: () => {
            toast.error('Failed to update note');
        }
    });

    const deleteNoteMutation = useMutation({
        mutationFn: NotesService.deleteNote,
        onSuccess: (success, noteId) => {
            if (success) {
                queryClient.setQueryData<Note[]>(NOTES_QUERY_KEY, (old = []) => old.filter(note => note.id !== noteId));
                toast.success('Note deleted successfully');
            }
        },
        onError: () => {
            toast.error('Failed to delete note');
        }
    });

    const searchMutation = useMutation({
        mutationFn: NotesService.searchNotes
    });

    return {
        notes,
        isLoading,
        error,
        refetch,
        createNote: createNoteMutation.mutateAsync,
        updateNote: updateNoteMutation.mutateAsync,
        deleteNote: deleteNoteMutation.mutateAsync,
        searchNotes: searchMutation.mutateAsync,
        isCreating: createNoteMutation.isPending,
        isUpdating: updateNoteMutation.isPending,
        isDeleting: deleteNoteMutation.isPending,
        isSearching: searchMutation.isPending
    };
};

export const useNote = (id: string) => {
    return useQuery({
        queryKey: ['note', id],
        queryFn: () => NotesService.getNoteById(id),
        enabled: !!id
    });
};
