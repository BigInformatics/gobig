import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import Home from '@/app/page';
import { createMockSession } from '../utils/test-helpers';
import { authClient } from '@/lib/auth-client';
import { Provider } from '@/components/ui/provider';

// Mock next/navigation
const mockPush = vi.fn();
const mockRefresh = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    replace: vi.fn(),
    refresh: mockRefresh,
  }),
}));

// Mock auth-client
vi.mock('@/lib/auth-client', () => ({
  authClient: {
    useSession: vi.fn(),
    signOut: vi.fn(),
  },
}));

describe('Home Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render the home page', () => {
    (authClient.useSession as any).mockReturnValue({
      data: null,
      isPending: false,
    });

    render(
      <Provider>
        <Home />
      </Provider>
    );

    expect(screen.getByText('Welcome to GoBig')).toBeInTheDocument();
    expect(
      screen.getByText(
        'Foundational framework for building modern web applications with Next.js, Better Auth, and Drizzle ORM.'
      )
    ).toBeInTheDocument();
  });

  it('should show sign in and sign up buttons when not logged in', async () => {
    (authClient.useSession as any).mockReturnValue({
      data: null,
      isPending: false,
    });

    render(
      <Provider>
        <Home />
      </Provider>
    );

    await waitFor(() => {
      expect(screen.getByText('Sign in')).toBeInTheDocument();
      expect(screen.getByText('Get Started')).toBeInTheDocument();
    });
  });

  it('should show dashboard and sign out buttons when logged in', () => {
    const mockSession = createMockSession();
    (authClient.useSession as any).mockReturnValue({
      data: mockSession,
      isPending: false,
    });

    render(
      <Provider>
        <Home />
      </Provider>
    );

    expect(screen.getByText('Go to Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Sign out')).toBeInTheDocument();
    expect(screen.getByText(mockSession.user.email)).toBeInTheDocument();
  });

  it('should display user email when logged in', () => {
    const mockSession = createMockSession({
      user: {
        id: 'user-1',
        name: 'John Doe',
        email: 'john@example.com',
        emailVerified: true,
      },
    });

    (authClient.useSession as any).mockReturnValue({
      data: mockSession,
      isPending: false,
    });

    render(
      <Provider>
        <Home />
      </Provider>
    );

    expect(screen.getByText('john@example.com')).toBeInTheDocument();
  });
});

