import { useState, useEffect } from 'react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Search, X } from 'lucide-react';
import { useDebounce } from '../../hooks/useDebounce';

interface SearchBarProps {
    onSearch: (query: string) => void;
    placeholder?: string;
    isSearching?: boolean;
}

export const SearchBar = ({ onSearch, placeholder = 'Search notes...', isSearching = false }: SearchBarProps) => {
    const [query, setQuery] = useState('');
    const debouncedQuery = useDebounce(query, 300);

    // Trigger search when debounced query changes
    useEffect(() => {
        onSearch(debouncedQuery);
    }, [debouncedQuery, onSearch]);

    const handleClear = () => {
        setQuery('');
        onSearch('');
    };

    return (
        <div className='relative max-w-md'>
            <div className='relative'>
                <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4' />
                <Input
                    type='text'
                    placeholder={placeholder}
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    className='pl-10 pr-10'
                    disabled={isSearching}
                />
                {query && (
                    <Button
                        type='button'
                        variant='ghost'
                        size='sm'
                        className='absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 hover:bg-muted'
                        onClick={handleClear}
                    >
                        <X className='h-3 w-3' />
                        <span className='sr-only'>Clear search</span>
                    </Button>
                )}
            </div>
        </div>
    );
};
