import { Router } from 'itty-router';
import { getClients } from './clients';

const router = Router();

router.get('/', () => new Response('Chick-fil-Gay API'));

// 1. Create Stripe Checkout session
router.post('/stripe/create-session', async (req: Request, env:Env) => {
  console.log('env: ',env);
  const { stripe } = getClients(env);
  if (!stripe) return new Response('Stripe not configured', { status: 500 });
  const url = new URL(req.url);
  const origin = url.origin;
  const session = await stripe.createSession(origin);
  return Response.json({ id: session.id, url: session.url });
});

// 2. Validate Stripe payment
router.post('/stripe/validate-session', async (req: Request, env:Env) => {
  const { stripe } = getClients(env);
  if (!stripe) return new Response('Stripe not configured', { status: 500 });
  const { sessionId } = await req.json();
  const paid = await stripe.validateSession(sessionId);
  return Response.json({ paid });
});

// 3. Create Plaid link token
router.post('/plaid/create-link-token', async (req: Request, env:Env) => {
  const { plaid } = getClients(env);
  if (!plaid) return new Response('Plaid not configured', { status: 500 });
  const { userId } = await req.json();
  const link_token = await plaid.createLinkToken(userId);
  return Response.json({ link_token });
});

// 4. Exchange Plaid public_token for access_token
router.post('/plaid/exchange-public-token', async (req: Request, env:Env) => {
  const { plaid } = getClients(env);
  if (!plaid) return new Response('Plaid not configured', { status: 500 });
  const { public_token } = await req.json();
  const access_token = await plaid.exchangePublicToken(public_token);
  return Response.json({ access_token });
});

// 5. Fetch transactions
router.post('/plaid/transactions', async (req: Request, env:Env) => {
  const { plaid } = getClients(env);
  if (!plaid) return new Response('Plaid not configured', { status: 500 });
  const { access_token } = await req.json();
  return Response.json({ access_token });
});

export default {
  fetch: router.handle
};
