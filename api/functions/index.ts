import { Router } from 'itty-router';
import {
  getStripeInstance,
  createStripeSession,
  validateStripeSession
} from './stripe';
import {
  getPlaidInstance,
  createPlaidLinkToken,
  exchangePlaidPublicToken,
  fetchPlaidTransactions
} from './plaid';

const router = Router();

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
const PLAID_CLIENT_ID = process.env.PLAID_CLIENT_ID;
const PLAID_SECRET = process.env.PLAID_SECRET;
const PLAID_ENV = process.env.PLAID_ENV || 'sandbox';

const stripe = STRIPE_SECRET_KEY ? getStripeInstance(STRIPE_SECRET_KEY) : null;
const plaid = (PLAID_CLIENT_ID && PLAID_SECRET) ? getPlaidInstance(PLAID_CLIENT_ID, PLAID_SECRET, PLAID_ENV) : null;

router.get('/', () => new Response('Chick-fil-Gay API'));

// 1. Create Stripe Checkout session
router.post('/stripe/create-session', async (req: Request) => {
  if (!stripe) return new Response('Stripe not configured', { status: 500 });
  const url = new URL(req.url);
  const origin = url.origin;
  const session = await createStripeSession(stripe, origin);
  return Response.json({ id: session.id, url: session.url });
});

// 2. Validate Stripe payment
router.post('/stripe/validate-session', async (req: Request) => {
  if (!stripe) return new Response('Stripe not configured', { status: 500 });
  const { sessionId } = await req.json();
  const paid = await validateStripeSession(stripe, sessionId);
  return Response.json({ paid });
});

// 3. Create Plaid link token
router.post('/plaid/create-link-token', async (req: Request) => {
  if (!plaid) return new Response('Plaid not configured', { status: 500 });
  const { userId } = await req.json();
  const link_token = await createPlaidLinkToken(plaid, userId);
  return Response.json({ link_token });
});

// 4. Exchange Plaid public_token for access_token
router.post('/plaid/exchange-public-token', async (req: Request) => {
  if (!plaid) return new Response('Plaid not configured', { status: 500 });
  const { public_token } = await req.json();
  const access_token = await exchangePlaidPublicToken(plaid, public_token);
  return Response.json({ access_token });
});

// 5. Fetch transactions
router.post('/plaid/transactions', async (req: Request) => {
  if (!plaid) return new Response('Plaid not configured', { status: 500 });
  const { access_token } = await req.json();
  const transactions = await fetchPlaidTransactions(plaid, access_token);
  return Response.json({ transactions });
});

export default {
  fetch: router.handle
};
