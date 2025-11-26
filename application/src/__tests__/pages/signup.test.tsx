import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SignupPage from '@/app/signup/page';
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
    signUp: {
      email: vi.fn(),
    },
    signIn: {
      social: vi.fn(),
    },
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

describe('Signup Page - Sign Up Workflow', () => {
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

  it('should perform a sign up workflow with email/password and redirect', async () => {
    const user = userEvent.setup();
    (authClient.signUp.email as any).mockResolvedValue({ data: { user: { id: '1', email: 'test@example.com' } } });

    render(<SignupPage />);

    // Fill in the form
    const nameInput = screen.getByPlaceholderText('Your name');
    const emailInput = screen.getByPlaceholderText('zumie@cambigo.com');
    const passwordInput = screen.getByPlaceholderText('••••••••');
    const confirmPasswordInput = screen.getAllByPlaceholderText('••••••••')[1];
    const submitButton = screen.getByText('Create account');

    await user.type(nameInput, 'Test User');
    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'password123');
    await user.type(confirmPasswordInput, 'password123');

    // Submit the form
    await user.click(submitButton);

    // Wait for signup to be called
    await waitFor(() => {
      expect(authClient.signUp.email).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
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

  it('should show error when passwords do not match', async () => {
    const user = userEvent.setup();

    render(<SignupPage />);

    const nameInput = screen.getByPlaceholderText('Your name');
    const emailInput = screen.getByPlaceholderText('zumie@cambigo.com');
    const passwordInput = screen.getByPlaceholderText('••••••••');
    const confirmPasswordInput = screen.getAllByPlaceholderText('••••••••')[1];
    const submitButton = screen.getByText('Create account');

    await user.type(nameInput, 'Test User');
    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'password123');
    await user.type(confirmPasswordInput, 'different123');

    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Passwords do not match')).toBeInTheDocument();
    });

    expect(authClient.signUp.email).not.toHaveBeenCalled();
  });

  it('should show error when password is too short', async () => {
    const user = userEvent.setup();

    render(<SignupPage />);

    const nameInput = screen.getByPlaceholderText('Your name');
    const emailInput = screen.getByPlaceholderText('zumie@cambigo.com');
    const passwordInput = screen.getByPlaceholderText('••••••••');
    const confirmPasswordInput = screen.getAllByPlaceholderText('••••••••')[1];
    const submitButton = screen.getByText('Create account');

    await user.type(nameInput, 'Test User');
    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'short');
    await user.type(confirmPasswordInput, 'short');

    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Password must be at least 8 characters long')).toBeInTheDocument();
    });

    expect(authClient.signUp.email).not.toHaveBeenCalled();
  });

  it('should handle signup errors', async () => {
    const user = userEvent.setup();
    (authClient.signUp.email as any).mockResolvedValue({
      error: { message: 'Email already exists' },
    });

    render(<SignupPage />);

    const nameInput = screen.getByPlaceholderText('Your name');
    const emailInput = screen.getByPlaceholderText('zumie@cambigo.com');
    const passwordInput = screen.getByPlaceholderText('••••••••');
    const confirmPasswordInput = screen.getAllByPlaceholderText('••••••••')[1];
    const submitButton = screen.getByText('Create account');

    await user.type(nameInput, 'Test User');
    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'password123');
    await user.type(confirmPasswordInput, 'password123');

    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Email already exists')).toBeInTheDocument();
    });
  });
});

