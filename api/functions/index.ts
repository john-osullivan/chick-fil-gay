import { Router } from 'itty-router';
// @ts-ignore
import Stripe from 'stripe';
// @ts-ignore
import { Configuration, PlaidApi, PlaidEnvironments } from 'plaid';

const router = Router();

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
const PLAID_CLIENT_ID = process.env.PLAID_CLIENT_ID;
const PLAID_SECRET = process.env.PLAID_SECRET;
const PLAID_ENV = process.env.PLAID_ENV || 'sandbox';

const stripe = STRIPE_SECRET_KEY ? new Stripe(STRIPE_SECRET_KEY, { apiVersion: '2022-11-15' }) : null;
const plaidConfig = new Configuration({
  basePath: PlaidEnvironments[PLAID_ENV],
  baseOptions: {
    headers: {
      'PLAID-CLIENT-ID': PLAID_CLIENT_ID,
      'PLAID-SECRET': PLAID_SECRET,
    },
  },
});
const plaid = new PlaidApi(plaidConfig);

router.get('/', () => new Response('Chick-fil-Gay API'));

// 1. Create Stripe Checkout session
router.post('/stripe/create-session', async (req: Request) => {
  if (!stripe) return new Response('Stripe not configured', { status: 500 });
  const url = new URL(req.url);
  const origin = url.origin;
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [{ price_data: { currency: 'usd', product_data: { name: 'Plaid Account Fee' }, unit_amount: 200 }, quantity: 1 }],
    mode: 'payment',
    success_url: `${origin}/donate?CHECKOUT_SESSION_ID={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/donate?cancelled=1`,
  });
  return Response.json({ id: session.id, url: session.url });
});

// 2. Validate Stripe payment
router.post('/stripe/validate-session', async (req: Request) => {
  if (!stripe) return new Response('Stripe not configured', { status: 500 });
  const { sessionId } = await req.json();
  const session = await stripe.checkout.sessions.retrieve(sessionId);
  if (session.payment_status === 'paid') {
    return Response.json({ paid: true });
  }
  return Response.json({ paid: false });
});

// 3. Create Plaid link token
router.post('/plaid/create-link-token', async (req: Request) => {
  if (!plaid) return new Response('Plaid not configured', { status: 500 });
  const { userId } = await req.json();
  const resp = await plaid.linkTokenCreate({
    user: { client_user_id: userId },
    client_name: 'Chick-fil-Gay',
    products: ['transactions'],
    country_codes: ['US'],
    language: 'en',
  });
  return Response.json({ link_token: resp.data.link_token });
});

// 4. Exchange Plaid public_token for access_token
router.post('/plaid/exchange-public-token', async (req: Request) => {
  if (!plaid) return new Response('Plaid not configured', { status: 500 });
  const { public_token } = await req.json();
  const resp = await plaid.itemPublicTokenExchange({ public_token });
  return Response.json({ access_token: resp.data.access_token });
});

// 5. Fetch transactions
router.post('/plaid/transactions', async (req: Request) => {
  if (!plaid) return new Response('Plaid not configured', { status: 500 });
  const { access_token } = await req.json();
  const now = new Date();
  const start = new Date(now);
  start.setFullYear(now.getFullYear() - 3);
  const start_date = start.toISOString().slice(0, 10);
  const end_date = now.toISOString().slice(0, 10);
  const resp = await plaid.transactionsGet({
    access_token,
    start_date,
    end_date,
    options: { count: 500, offset: 0 },
  });
  return Response.json({ transactions: resp.data.transactions });
});

export default {
  fetch: router.handle
};
