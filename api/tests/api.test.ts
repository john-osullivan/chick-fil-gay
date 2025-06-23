import { describe, it, expect, vi } from 'vitest';
import * as stripeLogic from '../functions/stripe';
import * as plaidLogic from '../functions/plaid';

// Mock Stripe and Plaid classes
const mockStripe = {
  checkout: {
    sessions: {
      create: vi.fn(async () => ({ id: 'sess_123', url: 'https://stripe.com/checkout' })),
      retrieve: vi.fn(async (id) => ({ payment_status: id === 'paid' ? 'paid' : 'unpaid' }))
    }
  }
};

const mockPlaid = {
  linkTokenCreate: vi.fn(async () => ({ data: { link_token: 'link-token-123' } })),
  itemPublicTokenExchange: vi.fn(async () => ({ data: { access_token: 'access-token-123' } })),
  transactionsGet: vi.fn(async () => ({ data: { transactions: [{ date: '2024-01-01', name: 'Chick-fil-A', amount: 42.42 }] } }))
};

describe('API smoke test', () => {
  it('should be true', () => {
    expect(true).toBe(true);
  });
});

describe('stripe logic', () => {
  it('creates a Stripe session', async () => {
    const session = await stripeLogic.createStripeSession(mockStripe as any, 'https://test');
    expect(session.id).toBe('sess_123');
    expect(session.url).toContain('stripe.com');
  });

  it('validates a paid Stripe session', async () => {
    const paid = await stripeLogic.validateStripeSession(mockStripe as any, 'paid');
    expect(paid).toBe(true);
  });

  it('validates an unpaid Stripe session', async () => {
    const paid = await stripeLogic.validateStripeSession(mockStripe as any, 'unpaid');
    expect(paid).toBe(false);
  });
});

describe('plaid logic', () => {
  it('creates a Plaid link token', async () => {
    const token = await plaidLogic.createPlaidLinkToken(mockPlaid as any, 'user-1');
    expect(token).toBe('link-token-123');
  });

  it('exchanges Plaid public token', async () => {
    const access = await plaidLogic.exchangePlaidPublicToken(mockPlaid as any, 'public-token');
    expect(access).toBe('access-token-123');
  });

  it('fetches Plaid transactions', async () => {
    const txs = await plaidLogic.fetchPlaidTransactions(mockPlaid as any, 'access-token-123');
    expect(Array.isArray(txs)).toBe(true);
    expect(txs[0].name).toMatch(/chick-fil-a/i);
  });
});
