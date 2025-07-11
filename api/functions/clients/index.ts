import { StripeClient } from './stripe';
import { PlaidClient } from './plaid';

export function getClients(env: Env) {
    console.log('env in getClients:', env);
    const {
        STRIPE_SECRET_KEY,
        PLAID_CLIENT_ID,
        PLAID_SECRET,
        PLAID_ENV
    } = env;
    const stripe = new StripeClient(STRIPE_SECRET_KEY);
    const plaid = new PlaidClient(PLAID_CLIENT_ID, PLAID_SECRET, PLAID_ENV);
    return { stripe, plaid };
}