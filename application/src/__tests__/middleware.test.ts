import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest, NextResponse } from 'next/server';
import { middleware } from '@/middleware';
import { createMockRequest } from './utils/test-helpers';
import { auth } from '@/lib/auth';

// Mock Better Auth
vi.mock('@/lib/auth', () => ({
  auth: {
    api: {
      getSession: vi.fn(),
    },
  },
}));

describe('Middleware - Route Protection', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should allow access to public routes without login', async () => {
    const request = createMockRequest('/');
    const response = await middleware(request);

    expect(response).toBeInstanceOf(NextResponse);
    expect(response.status).toBe(200);
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('should allow access to login page without authentication', async () => {
    const request = createMockRequest('/login');
    const response = await middleware(request);

    expect(response).toBeInstanceOf(NextResponse);
    expect(response.status).toBe(200);
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('should allow access to signup page without authentication', async () => {
    const request = createMockRequest('/signup');
    const response = await middleware(request);

    expect(response).toBeInstanceOf(NextResponse);
    expect(response.status).toBe(200);
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('should deny access to protected route when not logged in and redirect to login', async () => {
    (auth.api.getSession as any).mockResolvedValue({ user: null });

    const request = createMockRequest('/settings');
    const response = await middleware(request);

    expect(response).toBeInstanceOf(NextResponse);
    expect(response.status).toBe(307); // Redirect status
    expect(response.headers.get('location')).toContain('/login');
    expect(response.headers.get('location')).toContain('redirect=/settings');
    expect(auth.api.getSession).toHaveBeenCalled();
  });

  it('should deny access to protected route (/flow/dashboard) when not logged in', async () => {
    (auth.api.getSession as any).mockResolvedValue({ user: null });

    const request = createMockRequest('/flow/dashboard');
    const response = await middleware(request);

    expect(response).toBeInstanceOf(NextResponse);
    expect(response.status).toBe(307); // Redirect status
    expect(response.headers.get('location')).toContain('/login');
    expect(response.headers.get('location')).toContain('redirect=/flow/dashboard');
  });

  it('should allow access to protected route when logged in', async () => {
    (auth.api.getSession as any).mockResolvedValue({
      user: {
        id: '1',
        email: 'test@example.com',
        name: 'Test User',
      },
    });

    const request = createMockRequest('/settings', {
      cookies: 'better-auth.session_token=test-token',
    });
    const response = await middleware(request);

    expect(response).toBeInstanceOf(NextResponse);
    expect(response.status).toBe(200);
    expect(auth.api.getSession).toHaveBeenCalled();
  });

  it('should allow access to protected route (/flow/dashboard) when logged in', async () => {
    (auth.api.getSession as any).mockResolvedValue({
      user: {
        id: '1',
        email: 'test@example.com',
        name: 'Test User',
      },
    });

    const request = createMockRequest('/flow/dashboard', {
      cookies: 'better-auth.session_token=test-token',
    });
    const response = await middleware(request);

    expect(response).toBeInstanceOf(NextResponse);
    expect(response.status).toBe(200);
    expect(auth.api.getSession).toHaveBeenCalled();
  });

  it('should allow access to unprotected routes without login', async () => {
    const request = createMockRequest('/forgot-password');
    const response = await middleware(request);

    expect(response).toBeInstanceOf(NextResponse);
    expect(response.status).toBe(200);
    expect(auth.api.getSession).not.toHaveBeenCalled();
  });

  it('should allow access to unprotected routes while logged in', async () => {
    const request = createMockRequest('/');
    const response = await middleware(request);

    expect(response).toBeInstanceOf(NextResponse);
    expect(response.status).toBe(200);
    expect(auth.api.getSession).not.toHaveBeenCalled();
  });

  it('should handle session check errors and redirect to login', async () => {
    (auth.api.getSession as any).mockRejectedValue(new Error('Session check failed'));

    const request = createMockRequest('/settings');
    const response = await middleware(request);

    expect(response).toBeInstanceOf(NextResponse);
    expect(response.status).toBe(307);
    expect(response.headers.get('location')).toContain('/login');
  });

  it('should allow API auth routes without authentication', async () => {
    const request = createMockRequest('/api/auth/session');
    const response = await middleware(request);

    expect(response).toBeInstanceOf(NextResponse);
    expect(response.status).toBe(200);
    expect(auth.api.getSession).not.toHaveBeenCalled();
  });
});

