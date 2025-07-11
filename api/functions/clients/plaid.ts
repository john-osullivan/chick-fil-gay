// Plaid business logic
import { Configuration, PlaidApi, PlaidEnvironments, Products, CountryCode } from 'plaid';

export class PlaidClient {
  private plaid: PlaidApi;
  constructor(clientId: string, secret: string, env: string) {
    const config = new Configuration({
      basePath: PlaidEnvironments[env],
      baseOptions: {
        headers: {
          'PLAID-CLIENT-ID': clientId,
          'PLAID-SECRET': secret,
        },
      },
    });
    this.plaid = new PlaidApi(config);
  }

  async createLinkToken(userId: string) {
    try {
      const resp = await this.plaid.linkTokenCreate({
        user: { client_user_id: userId },
        client_name: 'Chick-fil-Gay',
        products: [Products.Transactions],
        country_codes: [CountryCode.Us],
        language: 'en',
      });
      return resp.data.link_token;
    } catch (err) {
      throw new Error(`Plaid link token creation failed: ${err instanceof Error ? err.message : String(err)}`);
    }
  }

  async exchangePublicToken(public_token: string) {
    try {
      const resp = await this.plaid.itemPublicTokenExchange({ public_token });
      return resp.data.access_token;
    } catch (err) {
      throw new Error(`Plaid public token exchange failed: ${err instanceof Error ? err.message : String(err)}`);
    }
  }

  get sdk() {
    return this.plaid;
  }
}
