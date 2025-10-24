import { screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { renderWithProviders } from './test-utils';
import { App } from '../App';

describe('App', () => {
    it('should render without crashing', () => {
        renderWithProviders(<App />);
        // Check for the actual page header
        expect(screen.getByText('My Notes')).toBeInTheDocument();
    });
});
