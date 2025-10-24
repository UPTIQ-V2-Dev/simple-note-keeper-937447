import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Save, ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { noteFormSchema, type NoteFormData } from '../../lib/validation';
import type { Note } from '../../types/notes';

interface NoteFormProps {
    initialData?: Note;
    onSubmit: (data: NoteFormData) => Promise<void>;
    isSubmitting?: boolean;
    mode: 'create' | 'edit';
}

export const NoteForm = ({ initialData, onSubmit, isSubmitting = false, mode }: NoteFormProps) => {
    const navigate = useNavigate();

    const form = useForm<NoteFormData>({
        resolver: zodResolver(noteFormSchema),
        defaultValues: {
            title: initialData?.title || '',
            content: initialData?.content || ''
        }
    });

    useEffect(() => {
        if (initialData) {
            form.reset({
                title: initialData.title,
                content: initialData.content
            });
        }
    }, [initialData, form]);

    const handleSubmit = async (data: NoteFormData) => {
        try {
            await onSubmit(data);
            navigate('/');
        } catch (error) {
            console.error('Failed to save note:', error);
        }
    };

    const watchedTitle = form.watch('title');
    const watchedContent = form.watch('content');

    return (
        <div className='container max-w-4xl mx-auto py-6'>
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

            <Card>
                <CardHeader>
                    <CardTitle>{mode === 'create' ? 'Create New Note' : 'Edit Note'}</CardTitle>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(handleSubmit)}
                            className='space-y-6'
                        >
                            <FormField
                                control={form.control}
                                name='title'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Title</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder='Enter note title...'
                                                {...field}
                                                disabled={isSubmitting}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name='content'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Content</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder='Write your note here...'
                                                className='min-h-[300px] resize-y'
                                                {...field}
                                                disabled={isSubmitting}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                        <div className='text-xs text-muted-foreground'>
                                            {watchedContent?.length || 0} / 10,000 characters
                                        </div>
                                    </FormItem>
                                )}
                            />

                            <div className='flex items-center justify-between pt-4'>
                                <div className='text-sm text-muted-foreground'>
                                    {watchedTitle && <span>Title: {watchedTitle.length} / 200 characters</span>}
                                </div>
                                <div className='flex items-center gap-2'>
                                    <Button
                                        type='button'
                                        variant='outline'
                                        asChild
                                        disabled={isSubmitting}
                                    >
                                        <Link to='/'>Cancel</Link>
                                    </Button>
                                    <Button
                                        type='submit'
                                        disabled={isSubmitting || !watchedTitle?.trim()}
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2' />
                                                Saving...
                                            </>
                                        ) : (
                                            <>
                                                <Save className='h-4 w-4 mr-2' />
                                                {mode === 'create' ? 'Create Note' : 'Save Changes'}
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
};
