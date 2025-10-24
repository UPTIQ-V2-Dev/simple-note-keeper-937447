# Frontend Implementation Plan: Minimal Note Taking App

## Tech Stack

- **Framework**: React 19 with Vite
- **UI Library**: shadcn/ui components
- **Styling**: Tailwind CSS v4
- **State Management**: React hooks (useState, useReducer)
- **Data Persistence**: LocalStorage
- **Testing**: Vitest + React Testing Library + MSW
- **Form Validation**: Zod + react-hook-form

## Project Structure

```
src/
├── components/
│   ├── ui/           # shadcn components (existing)
│   └── notes/        # Note-specific components
├── hooks/            # Custom hooks
├── lib/              # Utilities and constants
├── services/         # Data services
├── types/            # TypeScript definitions
└── test/             # Test utilities and setup
```

## Page-by-Page Implementation

### 1. Main Notes Dashboard (`/`)

**Components:**

- `NotesLayout` - Main layout with header and content area
- `NotesList` - Grid/list view of all notes
- `NoteCard` - Individual note preview card
- `AddNoteButton` - Floating action button to create new note
- `SearchBar` - Filter notes by title/content
- `EmptyState` - Show when no notes exist

**Features:**

- Display all notes in a responsive grid
- Search/filter functionality
- Quick note preview
- Delete confirmation dialog
- Loading states

**API/Services:**

- `notesService.getAllNotes()`
- `notesService.deleteNote(id)`
- `notesService.searchNotes(query)`

### 2. Create Note Page (`/notes/new`)

**Components:**

- `NoteForm` - Form for creating notes
- `NoteEditor` - Rich text area for note content
- `SaveControls` - Save/Cancel action buttons

**Features:**

- Create new note with title and content
- Form validation
- Auto-save functionality (optional)
- Character count display

**API/Services:**

- `notesService.createNote(noteData)`

### 3. Edit Note Page (`/notes/:id/edit`)

**Components:**

- `NoteForm` - Reused from create (with pre-filled data)
- `NoteEditor` - Pre-populated with existing content
- `SaveControls` - Save/Cancel/Delete actions

**Features:**

- Edit existing note
- Pre-populate form with current data
- Save changes
- Delete note option

**API/Services:**

- `notesService.getNoteById(id)`
- `notesService.updateNote(id, noteData)`
- `notesService.deleteNote(id)`

### 4. View Note Page (`/notes/:id`)

**Components:**

- `NoteViewer` - Display note in read-only mode
- `NoteActions` - Edit/Delete action buttons
- `BackButton` - Navigate back to dashboard

**Features:**

- Display note title and content
- Action buttons for edit/delete
- Responsive design for mobile

**API/Services:**

- `notesService.getNoteById(id)`

## Common Components & Utilities

### Layout Components

- `AppLayout` - Main app wrapper with navigation
- `PageHeader` - Reusable page header component
- `LoadingSpinner` - Loading indicator

### Utility Components

- `ConfirmDialog` - Confirmation modal for destructive actions
- `ErrorBoundary` - Error handling wrapper
- `Toast` - Success/error notifications (using sonner)

### Custom Hooks

- `useNotes()` - Manage notes state and operations
- `useLocalStorage()` - LocalStorage persistence
- `useDebounce()` - Debounce search input

### Services

- `notesService.ts` - CRUD operations for notes
- `storageService.ts` - LocalStorage abstraction
- `validationSchemas.ts` - Zod schemas for form validation

### Types

```typescript
interface Note {
    id: string;
    title: string;
    content: string;
    createdAt: Date;
    updatedAt: Date;
}

interface NotesState {
    notes: Note[];
    loading: boolean;
    error: string | null;
}
```

## Routing Structure

```
/ - Notes Dashboard
/notes/new - Create New Note
/notes/:id - View Note
/notes/:id/edit - Edit Note
```

## Testing Strategy

### Test Organization

```
src/
├── components/
│   └── __tests__/     # Component tests
├── hooks/
│   └── __tests__/     # Hook tests
├── services/
│   └── __tests__/     # Service tests
└── test/
    ├── setup.ts       # Test setup (existing)
    ├── test-utils.tsx # Custom render utilities
    └── mocks/         # MSW handlers and mock data
```

### Testing Framework Setup

- **Unit/Component Tests**: Vitest + React Testing Library
- **API Mocking**: MSW (Mock Service Worker)
- **Test Utilities**: Custom render function with providers
- **Coverage**: Minimum 80% coverage target

### Test File Naming Convention

- Component tests: `ComponentName.test.tsx`
- Hook tests: `useHookName.test.ts`
- Service tests: `serviceName.test.ts`
- Integration tests: `feature.integration.test.tsx`

### Key Test Categories

#### 1. Component Tests

- **NoteCard.test.tsx**
    - Renders note title and preview
    - Handles click to view/edit
    - Shows delete confirmation dialog
    - Displays creation date formatting

- **NoteForm.test.tsx**
    - Form validation (title required, content optional)
    - Submit handler calls with correct data
    - Cancel button navigation
    - Auto-save functionality

- **NotesList.test.tsx**
    - Renders list of notes
    - Empty state when no notes
    - Search filtering functionality
    - Loading state display

- **SearchBar.test.tsx**
    - Input debouncing
    - Search query submission
    - Clear search functionality

#### 2. Hook Tests

- **useNotes.test.ts**
    - CRUD operations (create, read, update, delete)
    - State updates after operations
    - Error handling for failed operations
    - Loading states during async operations

- **useLocalStorage.test.ts**
    - Data persistence and retrieval
    - JSON serialization/deserialization
    - Fallback for localStorage unavailable

#### 3. Service Tests

- **notesService.test.ts**
    - getAllNotes returns all stored notes
    - createNote generates ID and timestamps
    - updateNote preserves ID and createdAt
    - deleteNote removes from storage
    - searchNotes filters by title/content

#### 4. Integration Tests

- **notes-flow.integration.test.tsx**
    - Complete CRUD workflow
    - Navigation between pages
    - Form submission and data persistence
    - Search and filter functionality

### Test Utilities

#### Custom Render (`src/test/test-utils.tsx`)

```typescript
export function renderWithProviders(ui: ReactElement) {
  return render(ui, {
    wrapper: ({ children }) => (
      <BrowserRouter>
        <QueryClient>{children}</QueryClient>
      </BrowserRouter>
    )
  });
}
```

#### Mock Data (`src/test/mocks/mockData.ts`)

```typescript
export const mockNotes: Note[] = [
    {
        id: '1',
        title: 'Test Note',
        content: 'Test content',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01')
    }
];
```

#### MSW Handlers (`src/test/mocks/handlers.ts`)

```typescript
export const handlers = [
    http.get('/api/notes', () => {
        return HttpResponse.json(mockNotes);
    })
    // Additional API mocks
];
```

### Critical Test Cases

#### Form Validation

- Required field validation (title)
- Maximum length validation
- XSS prevention in content
- Successful form submission

#### State Transitions

- Loading → Success states
- Loading → Error states
- Optimistic updates
- Data refetching after mutations

#### Error Handling

- Network failure scenarios
- LocalStorage quota exceeded
- Invalid data handling
- User-friendly error messages

#### Edge Cases

- Empty note list
- Very long note titles/content
- Special characters in content
- Browser back/forward navigation

### Test Scripts

- `npm run test` - Run all tests in watch mode
- `npm run test:ci` - Run tests once for CI
- `npm run test:coverage` - Generate coverage report
- `npm run test:ui` - Open Vitest UI for debugging

### Performance Testing

- Component rendering performance
- Large dataset handling (1000+ notes)
- Search/filter performance
- LocalStorage read/write performance

## Development Phases

### Phase 1: Core Setup

1. Set up routing with React Router
2. Create basic layout components
3. Set up LocalStorage service
4. Create Note type definitions

### Phase 2: CRUD Operations

1. Implement notes service with LocalStorage
2. Create NoteForm component
3. Build notes list and card components
4. Add create/edit/delete functionality

### Phase 3: Enhanced Features

1. Add search functionality
2. Implement responsive design
3. Add loading states and error handling
4. Include confirmation dialogs

### Phase 4: Testing & Polish

1. Write comprehensive tests
2. Add accessibility features
3. Performance optimizations
4. Error boundary implementation

## Success Criteria

- All CRUD operations working with LocalStorage
- Responsive design on mobile/desktop
- Form validation and error handling
- Search functionality
- 80%+ test coverage
- No console errors or warnings
- Accessible UI components
