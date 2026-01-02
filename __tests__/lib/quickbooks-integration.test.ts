import { describe, it, expect } from 'vitest';
import { getQuickBooksAuthUrl } from '@/lib/integrations/quickbooks';

describe('QuickBooks Integration', () => {
  describe('getQuickBooksAuthUrl', () => {
    it('should generate valid OAuth base URL for sandbox', async () => {
      const baseUrl = await getQuickBooksAuthUrl('sandbox');

      expect(baseUrl).toBeDefined();
      expect(typeof baseUrl).toBe('string');
      expect(baseUrl).toContain('https://appcenter.intuit.com/connect/oauth2');
    });

    it('should generate valid OAuth base URL for production', async () => {
      const baseUrl = await getQuickBooksAuthUrl('production');

      expect(baseUrl).toBeDefined();
      expect(typeof baseUrl).toBe('string');
      expect(baseUrl).toContain('https://appcenter.intuit.com/connect/oauth2');
    });
  });
});
