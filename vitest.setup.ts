import {afterEach, expect, vi} from 'vitest';
import {cleanup} from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';

// Extend Vitest's expect with jest-dom matchers
expect.extend(matchers);

// Cleanup after each test
afterEach(() => {
    cleanup();
    vi.clearAllMocks();
});

// Mock environment variables
process.env.MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/test';
if (!process.env.NODE_ENV) {
    Object.defineProperty(process.env, 'NODE_ENV', {value: 'test', writable: true});
}

// Global test utilities
global.console = {
    ...console,
    error: vi.fn(),
    warn: vi.fn(),
};