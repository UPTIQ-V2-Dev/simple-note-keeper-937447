import { Button } from '../ui/button';
import { FileText, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

interface EmptyStateProps {
    title: string;
    description: string;
    showCreateButton?: boolean;
}

export const EmptyState = ({ title, description, showCreateButton = true }: EmptyStateProps) => {
    return (
        <div className='flex flex-col items-center justify-center py-16 px-4 text-center'>
            <div className='mb-4 p-3 bg-muted rounded-full'>
                <FileText className='h-8 w-8 text-muted-foreground' />
            </div>
            <h3 className='text-lg font-semibold mb-2'>{title}</h3>
            <p className='text-muted-foreground mb-6 max-w-md'>{description}</p>
            {showCreateButton && (
                <Button
                    asChild
                    size='lg'
                >
                    <Link to='/notes/new'>
                        <Plus className='h-4 w-4 mr-2' />
                        Create your first note
                    </Link>
                </Button>
            )}
        </div>
    );
};
