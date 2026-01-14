'use client';
import { useCallback, useRef } from 'react';
/**
 * Creates a debounced function that schedules the provided callback to run after the given delay.
 *
 * @param callback - Function to invoke after the debounce delay
 * @param delay - Delay in milliseconds to wait before invoking `callback`
 * @returns A function which, when called, cancels any pending invocation and schedules `callback` to run after `delay`
 */
export function useDebounce( callback: () => void, delay: number ) {
    const timeoutRef = useRef<NodeJS.Timeout | null>( null );

    return useCallback( () => {
        if ( timeoutRef.current ) {
            clearTimeout( timeoutRef.current );
        }
        timeoutRef.current = setTimeout( callback, delay );
    },[callback,delay])
}