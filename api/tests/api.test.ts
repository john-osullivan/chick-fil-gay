import { describe, it, expect, beforeAll } from 'vitest';
import router from '../functions/index';

function makeRequest(path: string, method: string = 'GET', body?: any) {
  const url = `http://localhost:8787${path}`;
  return router.fetch(new Request(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  }));
}

describe('API integration', () => {
  it('returns API root', async () => {
    try {
      const res = await makeRequest('/');
      const text = await res.text();
      expect(text).toMatch(/Chick-fil-Gay API/);
    } catch (err) {
      console.error('API root error:', err instanceof Error ? err.message : String(err));
      throw err;
    }
  });

  it.only('creates a Stripe session', async () => {
    try {
      const res = await makeRequest('/stripe/create-session', 'POST');
      const text = await res.clone().text();
      console.log('Stripe session response:', res.status, text);
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data).toHaveProperty('id');
      expect(data).toHaveProperty('url');
    } catch (err) {
      console.error('Stripe session error:', err instanceof Error ? err.message : String(err));
      throw err;
    }
  });

  it('validates a Stripe session (should fail for random id)', async () => {
    try {
      const res = await makeRequest('/stripe/validate-session', 'POST', { sessionId: 'random' });
      const text = await res.clone().text();
      console.log('Stripe validate response:', res.status, text);
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data).toHaveProperty('paid');
    } catch (err) {
      console.error('Stripe validate error:', err instanceof Error ? err.message : String(err));
      throw err;
    }
  });

  it('creates a Plaid link token', async () => {
    try {
      const res = await makeRequest('/plaid/create-link-token', 'POST', { userId: 'test-user' });
      const text = await res.clone().text();
      console.log('Plaid link token response:', res.status, text);
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data).toHaveProperty('link_token');
    } catch (err) {
      console.error('Plaid link token error:', err instanceof Error ? err.message : String(err));
      throw err;
    }
  });

  it('exchanges Plaid public token (should fail for random token)', async () => {
    try {
      const res = await makeRequest('/plaid/exchange-public-token', 'POST', { public_token: 'random' });
      const text = await res.clone().text();
      console.log('Plaid exchange token response:', res.status, text);
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data).toHaveProperty('access_token');
    } catch (err) {
      console.error('Plaid exchange token error:', err instanceof Error ? err.message : String(err));
      throw err;
    }
  });

  it('fetches Plaid transactions (should fail for random token)', async () => {
    try {
      const res = await makeRequest('/plaid/transactions', 'POST', { access_token: 'random' });
      const text = await res.clone().text();
      console.log('Plaid fetch transactions response:', res.status, text);
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data).toHaveProperty('transactions');
      expect(Array.isArray(data.transactions)).toBe(true);
    } catch (err) {
      console.error('Plaid fetch transactions error:', err instanceof Error ? err.message : String(err));
      throw err;
    }
  });
});
