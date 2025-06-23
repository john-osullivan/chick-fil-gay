import { Router } from 'itty-router';

const router = Router();

router.get('/', () => new Response('Chick-fil-Gay API'));

// Stripe and Plaid endpoints will be added here

export default {
  fetch: router.handle
};
