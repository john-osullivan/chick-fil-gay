// Stripe business logic
// @ts-ignore
import Stripe from 'stripe';

export function getStripeInstance(secret: string) {
  return new Stripe(secret, { apiVersion: '2022-11-15' });
}

export async function createStripeSession(stripe: Stripe, origin: string) {
  return stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [{ price_data: { currency: 'usd', product_data: { name: 'Plaid Account Fee' }, unit_amount: 200 }, quantity: 1 }],
    mode: 'payment',
    success_url: `${origin}/donate?CHECKOUT_SESSION_ID={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/donate?cancelled=1`,
  });
}

export async function validateStripeSession(stripe: Stripe, sessionId: string) {
  const session = await stripe.checkout.sessions.retrieve(sessionId);
  return session.payment_status === 'paid';
}
