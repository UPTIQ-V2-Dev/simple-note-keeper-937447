import { Button } from '../ui/button';
import { Card, CardContent, CardHeader } from '../ui/card';
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
import { ArrowLeft, Edit, Trash2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { formatDistanceToNow, format } from 'date-fns';
import type { Note } from '../../types/notes';

interface NoteViewerProps {
    note: Note;
    onDelete: (id: string) => void;
    isDeleting?: boolean;
}

export const NoteViewer = ({ note, onDelete, isDeleting = false }: NoteViewerProps) => {
    const navigate = useNavigate();

    const formatDate = (date: Date) => {
        try {
            return formatDistanceToNow(date, { addSuffix: true });
        } catch {
            return 'Unknown time';
        }
    };

    const formatFullDate = (date: Date) => {
        try {
            return format(date, 'PPpp');
        } catch {
            return 'Unknown date';
        }
    };

    const handleDelete = async () => {
        await onDelete(note.id);
        navigate('/');
    };

    return (
        <div className='container max-w-4xl mx-auto py-6'>
            {/* Header */}
            <div className='mb-6'>
                <Button
                    variant='ghost'
                    asChild
                    className='mb-4'
                >
                    <Link to='/'>
                        <ArrowLeft className='h-4 w-4 mr-2' />
                        Back to notes
                    </Link>
                </Button>
            </div>

            {/* Note Content */}
            <Card>
                <CardHeader>
                    <div className='flex items-start justify-between gap-4'>
                        <div className='flex-1'>
                            <h1 className='text-3xl font-bold leading-tight mb-4'>{note.title}</h1>
                            <div className='flex items-center gap-4 text-sm text-muted-foreground'>
                                <Badge variant='secondary'>Created {formatDate(note.createdAt)}</Badge>
                                {note.createdAt.getTime() !== note.updatedAt.getTime() && (
                                    <Badge variant='outline'>Modified {formatDate(note.updatedAt)}</Badge>
                                )}
                            </div>
                        </div>
                        <div className='flex items-center gap-2'>
                            <Button asChild>
                                <Link to={`/notes/${note.id}/edit`}>
                                    <Edit className='h-4 w-4 mr-2' />
                                    Edit
                                </Link>
                            </Button>
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button variant='destructive'>
                                        <Trash2 className='h-4 w-4 mr-2' />
                                        Delete
                                    </Button>
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
                                            onClick={handleDelete}
                                            disabled={isDeleting}
                                            className='bg-destructive hover:bg-destructive/90'
                                        >
                                            {isDeleting ? 'Deleting...' : 'Delete'}
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className='prose prose-gray max-w-none dark:prose-invert'>
                        {note.content ? (
                            <div className='whitespace-pre-wrap text-base leading-relaxed'>{note.content}</div>
                        ) : (
                            <div className='text-muted-foreground italic'>This note has no content.</div>
                        )}
                    </div>

                    {/* Metadata */}
                    <div className='mt-8 pt-6 border-t border-border'>
                        <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-muted-foreground'>
                            <div>
                                <span className='font-medium'>Created:</span> {formatFullDate(note.createdAt)}
                            </div>
                            <div>
                                <span className='font-medium'>Last modified:</span> {formatFullDate(note.updatedAt)}
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};
