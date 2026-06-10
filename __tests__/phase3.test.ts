import { describe, it, expect, vi } from 'vitest';
import { signTokenData, verifyTokenData } from '@/lib/tokens';

describe('Phase 3: Triage & Tokens', () => {
  it('should sign and verify token data correctly using jose', async () => {
    const testData = { tokenId: '123', tokenNumber: 5 };
    const signed = await signTokenData(testData);
    expect(signed).toBeDefined();
    
    const verified = await verifyTokenData(signed);
    expect(verified).toMatchObject(testData);
  });

  it('should handle invalid tokens gracefully', async () => {
    const result = await verifyTokenData('invalid-token');
    expect(result).toBeNull();
  });
});
