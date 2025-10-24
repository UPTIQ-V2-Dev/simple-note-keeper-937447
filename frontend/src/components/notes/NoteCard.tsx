import { Card, CardContent, CardHeader } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger
} from '../ui/alert-dialog';
import { MoreHorizontal, Edit, Trash2, Eye } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { formatDistanceToNow } from 'date-fns';
import type { Note } from '../../types/notes';
import { Link } from 'react-router-dom';

interface NoteCardProps {
    note: Note;
    onDelete: (id: string) => void;
    isDeleting?: boolean;
}

export const NoteCard = ({ note, onDelete, isDeleting = false }: NoteCardProps) => {
    const truncateContent = (content: string, maxLength: number = 150) => {
        if (content.length <= maxLength) return content;
        return content.substring(0, maxLength) + '...';
    };

    const formatDate = (date: Date) => {
        try {
            return formatDistanceToNow(date, { addSuffix: true });
        } catch {
            return 'Unknown time';
        }
    };

    return (
        <Card className='group hover:shadow-md transition-shadow duration-200'>
            <CardHeader className='pb-2'>
                <div className='flex items-start justify-between gap-2'>
                    <Link
                        to={`/notes/${note.id}`}
                        className='flex-1 hover:text-primary transition-colors'
                    >
                        <h3 className='font-semibold text-lg leading-tight line-clamp-2 group-hover:text-primary transition-colors'>
                            {note.title}
                        </h3>
                    </Link>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant='ghost'
                                size='sm'
                                className='opacity-0 group-hover:opacity-100 transition-opacity'
                            >
                                <MoreHorizontal className='h-4 w-4' />
                                <span className='sr-only'>Open menu</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align='end'>
                            <DropdownMenuItem asChild>
                                <Link
                                    to={`/notes/${note.id}`}
                                    className='flex items-center gap-2'
                                >
                                    <Eye className='h-4 w-4' />
                                    View
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                                <Link
                                    to={`/notes/${note.id}/edit`}
                                    className='flex items-center gap-2'
                                >
                                    <Edit className='h-4 w-4' />
                                    Edit
                                </Link>
                            </DropdownMenuItem>
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <DropdownMenuItem
                                        onSelect={e => e.preventDefault()}
                                        className='text-destructive focus:text-destructive'
                                    >
                                        <Trash2 className='h-4 w-4' />
                                        Delete
                                    </DropdownMenuItem>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Delete Note</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            Are you sure you want to delete "{note.title}"? This action cannot be
                                            undone.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction
                                            onClick={() => onDelete(note.id)}
                                            disabled={isDeleting}
                                            className='bg-destructive hover:bg-destructive/90'
                                        >
                                            {isDeleting ? 'Deleting...' : 'Delete'}
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </CardHeader>
            <CardContent>
                <Link to={`/notes/${note.id}`}>
                    <p className='text-muted-foreground text-sm mb-3 whitespace-pre-wrap line-clamp-3'>
                        {truncateContent(note.content)}
                    </p>
                    <div className='flex items-center justify-between'>
                        <Badge
                            variant='secondary'
                            className='text-xs'
                        >
                            {formatDate(note.updatedAt)}
                        </Badge>
                        {note.createdAt.getTime() !== note.updatedAt.getTime() && (
                            <Badge
                                variant='outline'
                                className='text-xs'
                            >
                                Modified
                            </Badge>
                        )}
                    </div>
                </Link>
            </CardContent>
        </Card>
    );
};
