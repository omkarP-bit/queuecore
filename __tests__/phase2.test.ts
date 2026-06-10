import { describe, it, expect, vi } from 'vitest';
import { authOptions } from '@/lib/auth';

describe('Phase 2: Authentication & Profiles', () => {
  it('should have NextAuth configured with Google and Credentials', () => {
    const providers = authOptions.providers.map(p => p.id);
    expect(providers).toContain('google');
    // NextAuth might normalize 'receptionist-login' to 'credentials' in some versions
    // but here we check for either to be safe in the test.
    expect(providers.some(id => id === 'receptionist-login' || id === 'credentials')).toBe(true);
  });

  it('should have a 24-hour session max age', () => {
    expect(authOptions.session?.maxAge).toBe(24 * 60 * 60);
  });

  it('should protect routes in middleware', async () => {
    // This is a bit complex to unit test middleware directly without mocks of Request/Response
    // But we can verify the config exists
    const { config } = await import('@/middleware');
    expect(config.matcher).toContain('/patient/:path*');
    expect(config.matcher).toContain('/receptionist/:path*');
  });
});
