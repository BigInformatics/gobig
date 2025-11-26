import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Home from '@/app/page';
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

describe('Sign Out Workflow', () => {
  const mockPush = vi.fn();
  const mockRefresh = vi.fn();
  const mockSignOut = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    mockPush.mockClear();
    mockRefresh.mockClear();
    mockSignOut.mockClear();
    (useRouter as any).mockReturnValue({
      push: mockPush,
      replace: vi.fn(),
      refresh: mockRefresh,
      prefetch: vi.fn(),
      back: vi.fn(),
      forward: vi.fn(),
    });
    (authClient.signOut as any).mockImplementation(mockSignOut);
  });

  it('should perform a sign out workflow - verify logout clears session and redirects', async () => {
    const user = userEvent.setup();
    const mockSession = {
      user: {
        id: '1',
        name: 'Test User',
        email: 'test@example.com',
        emailVerified: true,
      },
    };

    (authClient.useSession as any).mockReturnValue({
      data: mockSession,
      isPending: false,
    });

    mockSignOut.mockResolvedValue({});

    render(<Home />);

    // Find and click sign out button
    const signOutButton = screen.getByText('Sign out');
    await user.click(signOutButton);

    // Wait for signOut to be called
    await waitFor(() => {
      expect(mockSignOut).toHaveBeenCalled();
    });

    // Verify refresh was called (which updates the session state)
    await waitFor(() => {
      expect(mockRefresh).toHaveBeenCalled();
    });
  });

  it('should handle sign out errors gracefully', async () => {
    const user = userEvent.setup();
    const mockSession = {
      user: {
        id: '1',
        name: 'Test User',
        email: 'test@example.com',
        emailVerified: true,
      },
    };

    (authClient.useSession as any).mockReturnValue({
      data: mockSession,
      isPending: false,
    });

    mockSignOut.mockRejectedValue(new Error('Sign out failed'));

    // Mock console.error to avoid noise in test output
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(<Home />);

    const signOutButton = screen.getByText('Sign out');
    await user.click(signOutButton);

    await waitFor(() => {
      expect(mockSignOut).toHaveBeenCalled();
    });

    expect(consoleSpy).toHaveBeenCalledWith('Failed to sign out:', expect.any(Error));

    consoleSpy.mockRestore();
  });
});

