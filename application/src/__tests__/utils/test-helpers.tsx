import { render, RenderOptions } from '@testing-library/react';
import { ReactElement } from 'react';
import { Provider } from '@/components/ui/provider';
import { vi } from 'vitest';

// Mock user session type
export interface MockUser {
  id: string;
  name: string;
  email: string;
  image?: string | null;
  emailVerified: boolean;
}

export interface MockSession {
  user: MockUser;
  expiresAt: Date;
}

// Create a mock session
export function createMockSession(overrides?: Partial<MockSession>): MockSession {
  const defaultUser: MockUser = {
    id: 'test-user-id',
    name: 'Test User',
    email: 'test@example.com',
    image: null,
    emailVerified: true,
  };

  return {
    user: { ...defaultUser, ...overrides?.user },
    expiresAt: overrides?.expiresAt || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
  };
}

// Create a mock Next.js request
export function createMockRequest(
  pathname: string,
  options?: {
    method?: string;
    headers?: Record<string, string>;
    cookies?: string;
  }
) {
  // Dynamically import NextRequest to avoid issues in test environment
  const { NextRequest } = require('next/server');
  const url = `http://localhost:3000${pathname}`;
  const headers = new Headers(options?.headers || {});
  
  if (options?.cookies) {
    headers.set('cookie', options.cookies);
  }

  return new NextRequest(url, {
    method: options?.method || 'GET',
    headers,
  });
}

// Custom render function with auth context
interface RenderWithAuthOptions extends Omit<RenderOptions, 'wrapper'> {
  session?: MockSession | null;
  isPending?: boolean;
}

export function renderWithAuth(
  ui: ReactElement,
  options: RenderWithAuthOptions = {}
) {
  const { session = null, isPending = false, ...renderOptions } = options;

  const Wrapper = ({ children }: { children: React.ReactNode }) => {
    return <Provider>{children}</Provider>;
  };

  return {
    ...render(ui, { wrapper: Wrapper, ...renderOptions }),
    session,
    isPending,
  };
}

// Helper to wait for async operations
export function waitForAsync() {
  return new Promise((resolve) => setTimeout(resolve, 0));
}

// Helper to create mock router
export function createMockRouter() {
  return {
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
  };
}

// Helper to create mock search params
export function createMockSearchParams(params: Record<string, string> = {}) {
  return new URLSearchParams(params);
}

