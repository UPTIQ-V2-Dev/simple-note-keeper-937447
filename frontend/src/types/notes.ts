export interface Note {
    id: string;
    title: string;
    content: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface CreateNoteInput {
    title: string;
    content: string;
}

export interface UpdateNoteInput {
    title?: string;
    content?: string;
}

export interface NotesState {
    notes: Note[];
    loading: boolean;
    error: string | null;
}

export interface SearchFilters {
    query: string;
}
