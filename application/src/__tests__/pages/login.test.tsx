import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LoginPage from '@/app/login/page';
import { authClient } from '@/lib/auth-client';
import { useRouter, useSearchParams } from 'next/navigation';

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useRouter: vi.fn(),
  useSearchParams: vi.fn(),
}));

// Mock next/image
vi.mock('next/image', () => ({
  default: ({ src, alt, ...props }: any) => <img src={src} alt={alt} {...props} />,
}));

// Mock auth-client
vi.mock('@/lib/auth-client', () => ({
  authClient: {
    signIn: {
      email: vi.fn(),
      social: vi.fn(),
    },
    getSession: vi.fn(),
  },
}));

// Mock window.location
Object.defineProperty(window, 'location', {
  value: {
    href: '',
    origin: 'http://localhost:3000',
  },
  writable: true,
});

describe('Login Page - Sign In Workflow', () => {
  const mockPush = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    mockPush.mockClear();
    window.location.href = '';
    (useRouter as any).mockReturnValue({
      push: mockPush,
      replace: vi.fn(),
      refresh: vi.fn(),
      prefetch: vi.fn(),
      back: vi.fn(),
      forward: vi.fn(),
    });
    (useSearchParams as any).mockReturnValue({
      get: vi.fn(() => null),
    });
  });

  it('should perform a sign in workflow with valid credentials and redirect', async () => {
    const user = userEvent.setup();
    (authClient.signIn.email as any).mockResolvedValue({ data: { user: { id: '1', email: 'test@example.com' } } });
    (authClient.getSession as any).mockResolvedValue({ data: { user: { id: '1', email: 'test@example.com' } } });

    render(<LoginPage />);

    // Fill in the form
    const emailInput = screen.getByPlaceholderText('zumie@cambigo.com');
    const passwordInput = screen.getByPlaceholderText('••••••••');
    const submitButton = screen.getByText('Sign in');

    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'password123');

    // Submit the form
    await user.click(submitButton);

    // Wait for signin to be called
    await waitFor(() => {
      expect(authClient.signIn.email).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
    });

    // Wait for redirect (window.location.href is set after a delay)
    await waitFor(
      () => {
        expect(window.location.href).toBe('/flow/dashboard');
      },
      { timeout: 2000 }
    );
  });

  it('should error with random credentials without allowing access to protected routes', async () => {
    const user = userEvent.setup();
    (authClient.signIn.email as any).mockResolvedValue({
      error: { message: 'Invalid credentials' },
    });

    render(<LoginPage />);

    const emailInput = screen.getByPlaceholderText('zumie@cambigo.com');
    const passwordInput = screen.getByPlaceholderText('••••••••');
    const submitButton = screen.getByText('Sign in');

    await user.type(emailInput, 'random@example.com');
    await user.type(passwordInput, 'wrongpassword');

    await user.click(submitButton);

    // Wait for error to be displayed
    await waitFor(() => {
      expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
    });

    // Verify no redirect occurred
    expect(window.location.href).toBe('');
    expect(mockPush).not.toHaveBeenCalled();
  });

  it('should handle network errors', async () => {
    const user = userEvent.setup();
    (authClient.signIn.email as any).mockResolvedValue({
      error: { message: 'Network error occurred' },
    });

    render(<LoginPage />);

    const emailInput = screen.getByPlaceholderText('zumie@cambigo.com');
    const passwordInput = screen.getByPlaceholderText('••••••••');
    const submitButton = screen.getByText('Sign in');

    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'password123');

    await user.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText('Connection failed. Please check your internet connection and try again.')
      ).toBeInTheDocument();
    });
  });

  it('should show social login buttons', () => {
    render(<LoginPage />);

    expect(screen.getByText('Login with GitHub')).toBeInTheDocument();
    expect(screen.getByText('Login with Google')).toBeInTheDocument();
  });
});

