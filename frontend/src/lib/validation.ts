import { z } from 'zod';

export const noteFormSchema = z.object({
    title: z.string().min(1, 'Title is required').max(200, 'Title must be less than 200 characters'),
    content: z.string().max(10000, 'Content must be less than 10,000 characters')
});

export const createNoteSchema = z.object({
    title: z.string().min(1, 'Title is required').max(200, 'Title must be less than 200 characters'),
    content: z.string().max(10000, 'Content must be less than 10,000 characters')
});

export const updateNoteSchema = z.object({
    title: z.string().min(1, 'Title is required').max(200, 'Title must be less than 200 characters').optional(),
    content: z.string().max(10000, 'Content must be less than 10,000 characters').optional()
});

export type NoteFormData = z.infer<typeof noteFormSchema>;
export type CreateNoteFormData = z.infer<typeof createNoteSchema>;
export type UpdateNoteFormData = z.infer<typeof updateNoteSchema>;
