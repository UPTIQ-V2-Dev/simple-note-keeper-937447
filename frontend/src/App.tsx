import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { DashboardPage } from './pages/DashboardPage';
import { CreateNotePage } from './pages/CreateNotePage';
import { EditNotePage } from './pages/EditNotePage';
import { ViewNotePage } from './pages/ViewNotePage';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 1000 * 60 * 5, // 5 minutes
            gcTime: 1000 * 60 * 10 // 10 minutes
        }
    }
});

export const App = () => {
    return (
        <QueryClientProvider client={queryClient}>
            <BrowserRouter>
                <div className='min-h-screen bg-background'>
                    <Routes>
                        <Route
                            path='/'
                            element={<DashboardPage />}
                        />
                        <Route
                            path='/notes/new'
                            element={<CreateNotePage />}
                        />
                        <Route
                            path='/notes/:id'
                            element={<ViewNotePage />}
                        />
                        <Route
                            path='/notes/:id/edit'
                            element={<EditNotePage />}
                        />
                    </Routes>
                    <Toaster position='top-right' />
                </div>
            </BrowserRouter>
        </QueryClientProvider>
    );
};
