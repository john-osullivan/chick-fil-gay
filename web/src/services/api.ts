// All API calls for Plaid and Stripe

export async function createStripeSession() {
  const res = await fetch('/api/stripe/create-session', { method: 'POST' });
  if (!res.ok) throw new Error('Failed to create Stripe session');
  return res.json();
}

export async function validateStripeSession(sessionId: string) {
  const res = await fetch('/api/stripe/validate-session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sessionId })
  });
  if (!res.ok) throw new Error('Failed to validate Stripe session');
  return res.json();
}

export async function createPlaidLinkToken(userId: string) {
  const res = await fetch('/api/plaid/create-link-token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId })
  });
  if (!res.ok) throw new Error('Failed to create Plaid link token');
  return res.json();
}

export async function exchangePlaidPublicToken(public_token: string) {
  const res = await fetch('/api/plaid/exchange-public-token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ public_token })
  });
  if (!res.ok) throw new Error('Failed to exchange Plaid public token');
  return res.json();
}

export async function fetchPlaidTransactions(access_token: string) {
  const res = await fetch('/api/plaid/transactions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ access_token })
  });
  if (!res.ok) throw new Error('Failed to fetch Plaid transactions');
  return res.json();
}
