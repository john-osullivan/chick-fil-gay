// Plaid business logic
// @ts-ignore
import { Configuration, PlaidApi, PlaidEnvironments } from 'plaid';

export function getPlaidInstance(clientId: string, secret: string, env: string) {
  const config = new Configuration({
    basePath: PlaidEnvironments[env],
    baseOptions: {
      headers: {
        'PLAID-CLIENT-ID': clientId,
        'PLAID-SECRET': secret,
      },
    },
  });
  return new PlaidApi(config);
}

export async function createPlaidLinkToken(plaid: PlaidApi, userId: string) {
  const resp = await plaid.linkTokenCreate({
    user: { client_user_id: userId },
    client_name: 'Chick-fil-Gay',
    products: ['transactions'],
    country_codes: ['US'],
    language: 'en',
  });
  return resp.data.link_token;
}

export async function exchangePlaidPublicToken(plaid: PlaidApi, public_token: string) {
  const resp = await plaid.itemPublicTokenExchange({ public_token });
  return resp.data.access_token;
}

export async function fetchPlaidTransactions(plaid: PlaidApi, access_token: string) {
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
  return resp.data.transactions;
}
