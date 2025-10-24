import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

// React 19 compatibility fix - polyfill act function
import React from 'react';

// Set React act environment for testing library compatibility

(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;

// Polyfill React.act for React 19 if it doesn't exist
if (!React.act) {
    (React as any).act = (callback: () => void | Promise<void>) => {
        const result = callback();
        if (result && typeof result.then === 'function') {
            return result.then(() => undefined);
        }
        return Promise.resolve();
    };
}

// Mock ResizeObserver for Radix components
global.ResizeObserver = class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
};

// Mock IntersectionObserver for Radix components
global.IntersectionObserver = class IntersectionObserver {
    constructor() {}
    observe() {}
    unobserve() {}
    disconnect() {}
};

// Mock window.matchMedia for responsive components
Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: (query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: () => {},
        removeListener: () => {},
        addEventListener: () => {},
        removeEventListener: () => {},
        dispatchEvent: () => {}
    })
});

// Cleanup after each test case
afterEach(() => {
    cleanup();
});
