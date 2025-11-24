import '@testing-library/jest-dom';
import { expect, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';

// Setup DOM environment
if (typeof window !== 'undefined') {
  // Browser-like globals are available
}

// Cleanup after each test
afterEach(() => {
  cleanup();
});
