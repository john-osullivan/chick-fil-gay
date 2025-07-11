// Stripe business logic
import Stripe from 'stripe';

export class StripeClient {
  private stripe: Stripe;
  constructor(secret: string) {
    this.stripe = new Stripe(secret, { apiVersion: '2022-11-15' });
  }

  async createSession(origin: string) {
    try {
      return await this.stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [{ price_data: { currency: 'usd', product_data: { name: 'Plaid Account Fee' }, unit_amount: 200 }, quantity: 1 }],
        mode: 'payment',
        success_url: `${origin}/donate?CHECKOUT_SESSION_ID={CHECKOUT_SESSION_ID}`,
        cancel_url: `${origin}/donate?cancelled=1`,
      });
    } catch (err) {
      throw new Error(`Stripe session creation failed: ${err instanceof Error ? err.message : String(err)}`);
    }
  }

  async validateSession(sessionId: string) {
    try {
      const session = await this.stripe.checkout.sessions.retrieve(sessionId);
      return session.payment_status === 'paid';
    } catch (err) {
      throw new Error(`Stripe session validation failed: ${err instanceof Error ? err.message : String(err)}`);
    }
  }

  get sdk() {
    return this.stripe;
  }
}
