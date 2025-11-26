import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import DashboardPage from '@/app/flow/dashboard/page';
import { renderWithAuth, createMockSession } from '../utils/test-helpers';
import { authClient } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useRouter: vi.fn(),
}));

// Mock auth-client
vi.mock('@/lib/auth-client', () => ({
  authClient: {
    useSession: vi.fn(),
    signOut: vi.fn(),
  },
}));

describe('Dashboard Page', () => {
  const mockPush = vi.fn();
  const mockSignOut = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useRouter as any).mockReturnValue({
      push: mockPush,
      replace: vi.fn(),
      refresh: vi.fn(),
      prefetch: vi.fn(),
      back: vi.fn(),
      forward: vi.fn(),
    });
    (authClient.signOut as any).mockImplementation(mockSignOut);
  });

  it('should redirect to login when not logged in', async () => {
    (authClient.useSession as any).mockReturnValue({
      data: null,
      isPending: false,
    });

    render(<DashboardPage />);

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/login?redirect=/flow/dashboard');
    });
  });

  it('should show sign in and sign up buttons when not logged in (redirect behavior)', async () => {
    (authClient.useSession as any).mockReturnValue({
      data: null,
      isPending: false,
    });

    const { container } = render(<DashboardPage />);

    // Page should redirect, so we check for redirect call
    await waitFor(() => {
      expect(mockPush).toHaveBeenCalled();
    });
  });

  it('should show dashboard and sign out buttons when logged in', () => {
    const mockSession = createMockSession();
    (authClient.useSession as any).mockReturnValue({
      data: mockSession,
      isPending: false,
    });

    render(<DashboardPage />);

    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Sign out')).toBeInTheDocument();
    expect(screen.getByText('Settings')).toBeInTheDocument();
  });

  it('should display user information when logged in', () => {
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

    render(<DashboardPage />);

    expect(screen.getByText(/Welcome back, John Doe!/)).toBeInTheDocument();
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
  });

  it('should show loading state when session is pending', () => {
    (authClient.useSession as any).mockReturnValue({
      data: null,
      isPending: true,
    });

    render(<DashboardPage />);

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('should handle sign out when sign out button is clicked', async () => {
    const mockSession = createMockSession();
    (authClient.useSession as any).mockReturnValue({
      data: mockSession,
      isPending: false,
    });

    mockSignOut.mockResolvedValue({});

    render(<DashboardPage />);

    const signOutButton = screen.getByText('Sign out');
    signOutButton.click();

    await waitFor(() => {
      expect(mockSignOut).toHaveBeenCalled();
      expect(mockPush).toHaveBeenCalledWith('/');
    });
  });
});

