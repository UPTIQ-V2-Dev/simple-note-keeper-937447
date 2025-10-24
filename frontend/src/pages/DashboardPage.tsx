import { useState, useEffect } from 'react';
import { Button } from '../components/ui/button';
import { SearchBar } from '../components/notes/SearchBar';
import { NotesList } from '../components/notes/NotesList';
import { Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useNotes } from '../hooks/useNotes';
import type { Note } from '../types/notes';

export const DashboardPage = () => {
    const { notes, isLoading, deleteNote, isDeleting, searchNotes, isSearching } = useNotes();

    const [searchQuery, setSearchQuery] = useState('');
    const [filteredNotes, setFilteredNotes] = useState<Note[]>([]);

    useEffect(() => {
        setFilteredNotes(notes);
    }, [notes]);

    const handleSearch = async (query: string) => {
        setSearchQuery(query);

        if (!query.trim()) {
            setFilteredNotes(notes);
            return;
        }

        try {
            const results = await searchNotes(query);
            setFilteredNotes(results);
        } catch (error) {
            console.error('Search failed:', error);
            setFilteredNotes([]);
        }
    };

    const handleDeleteNote = async (id: string) => {
        try {
            await deleteNote(id);
            // Update filtered notes after deletion
            setFilteredNotes(prev => prev.filter(note => note.id !== id));
        } catch (error) {
            console.error('Failed to delete note:', error);
        }
    };

    return (
        <div className='container mx-auto py-6'>
            {/* Header */}
            <div className='mb-8'>
                <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6'>
                    <div>
                        <h1 className='text-3xl font-bold tracking-tight'>My Notes</h1>
                        <p className='text-muted-foreground'>
                            {notes.length === 0
                                ? 'Start writing your thoughts and ideas'
                                : `${notes.length} note${notes.length === 1 ? '' : 's'} in total`}
                        </p>
                    </div>
                    <Button
                        asChild
                        size='lg'
                    >
                        <Link to='/notes/new'>
                            <Plus className='h-4 w-4 mr-2' />
                            New Note
                        </Link>
                    </Button>
                </div>

                {/* Search */}
                {notes.length > 0 && (
                    <div className='flex justify-center sm:justify-start'>
                        <SearchBar
                            onSearch={handleSearch}
                            isSearching={isSearching}
                            placeholder='Search your notes...'
                        />
                    </div>
                )}
            </div>

            {/* Notes List */}
            <NotesList
                notes={filteredNotes}
                onDeleteNote={handleDeleteNote}
                isLoading={isLoading}
                isDeleting={isDeleting}
                searchQuery={searchQuery}
            />
        </div>
    );
};
