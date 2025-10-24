import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useDebounce } from '../useDebounce';

describe('useDebounce', () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('returns initial value immediately', () => {
        const { result } = renderHook(() => useDebounce('initial', 300));

        expect(result.current).toBe('initial');
    });

    it('debounces value updates', () => {
        const { result, rerender } = renderHook(({ value, delay }) => useDebounce(value, delay), {
            initialProps: { value: 'initial', delay: 300 }
        });

        expect(result.current).toBe('initial');

        // Update value
        rerender({ value: 'updated', delay: 300 });

        // Value should not update immediately
        expect(result.current).toBe('initial');

        // Fast-forward time
        vi.advanceTimersByTime(300);

        // Value should now be updated
        expect(result.current).toBe('updated');
    });

    it('cancels previous timeout when value changes rapidly', () => {
        const { result, rerender } = renderHook(({ value, delay }) => useDebounce(value, delay), {
            initialProps: { value: 'initial', delay: 300 }
        });

        // Rapid changes
        rerender({ value: 'change1', delay: 300 });
        vi.advanceTimersByTime(100);

        rerender({ value: 'change2', delay: 300 });
        vi.advanceTimersByTime(100);

        rerender({ value: 'final', delay: 300 });

        // Should still have initial value
        expect(result.current).toBe('initial');

        // Complete the debounce
        vi.advanceTimersByTime(300);

        // Should have final value
        expect(result.current).toBe('final');
    });

    it('handles different delay values', () => {
        const { result, rerender } = renderHook(({ value, delay }) => useDebounce(value, delay), {
            initialProps: { value: 'initial', delay: 500 }
        });

        rerender({ value: 'updated', delay: 500 });

        // Should not update before delay
        vi.advanceTimersByTime(400);
        expect(result.current).toBe('initial');

        // Should update after full delay
        vi.advanceTimersByTime(100);
        expect(result.current).toBe('updated');
    });

    it('works with different data types', () => {
        const { result, rerender } = renderHook(({ value, delay }) => useDebounce(value, delay), {
            initialProps: { value: { id: 1, name: 'test' }, delay: 300 }
        });

        const newValue = { id: 2, name: 'updated' };
        rerender({ value: newValue, delay: 300 });

        vi.advanceTimersByTime(300);

        expect(result.current).toEqual(newValue);
    });
});
