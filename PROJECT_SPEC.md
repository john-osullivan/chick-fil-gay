# Chick-fil-Gay PRD

I'm planning to build a small, focused web application in honor of Pride Month. The app is named “Chick-fil-Gay”, its core function is to check how much money you've spent at Chick-fil-A and make it dead simple to donate a matching amount to an LGBTQ charity of your choice.

## “Golden path” user story

The core user flow is:

1. User reads a landing page explaining the premise, click on a CTA to check their transactions
2. User enters the interactive donation flow. First screen explains to the user that we're using Plaid to pull transactions from your bank, at a cost of $2/account. Asks user to pay this fee in order to keep the site cost-neutral, button says, “By clicking, you accept our terms and conditions”.
3. User pays the $2 through an embedded Stripe Checkout form. Upon completion, a redirect sends them back to this flow, now including a CHECKOUT_SESSION_ID in the URL. Client sends this ID to our server, validates that the user completed the payment.
4. If so, then the user is presented with a screen prepping them for Plaid's “sync your account” flow. It explains that you should pick the account where you think most of your ChickFilA spend would've happened, and that our app won't preserve any of the transaction records — they will be processed on your device. User clicks confirm and is…
5. Taken to a screen which shows them the Plaid UX for connecting a credit card or bank account. Our integration will request a transaction history, Plaid will ask them to approve of this.
6. When the user completes the flow, some sort of redirect or webhook will tell us that we're now allowed to pull the user's transaction history for the last 36 months. Our client asks our server to pull it, the transactions get passed directly to the client for processing — we don’t modify the response in any way.
7. The client searches the list of transactions for any ones which mention “ChickFilA” or some variation on that name. It stores that data in React state to be rendered on the final CTA page.
8. The final CTA page is headed with a standout, “You’ve spent $X at Chick-fil-A over the last 3 years.” Beneath it, we have linked thumbnails for 3 LGBTQ charities — let’s go with GLAAD, HRC, and The Trevor Project. Each link is prefilled with the amount above. Beneath these links, render a table of every matching transaction, showing the date, statement descriptor, and amount. This will let people validate their spend and feel confident in the total.

- Here's an example of a prefilled link: https://give.hrc.org/page/162604/donate/1?ea.tracking.id=or_gnr_hrc_website2024&transaction.donationAmt=42.42

## Technical implementation

- I would like to implement this as a React app styled with Tailwind. Use react-router for basic routing, don’t bring in a complex framework like Next.js
- The backend logic should be implemented through “serverless” functions, akin to Lambda, on Cloudflare. Use Express for an HTTP server implementation unless there’s an alternative to Express which is better-suited for “serverless” functions.
- The client can be hosted as a static bundle, deployed through a GitHub Acton.
- Leverage GitHub Secrets along with .env files to let me provide necessary API credentials for both Plaid & Stripe.
- I’ll provide React/Tailwind implementations of the following components once the project has been set up and scaffolded. Lay out files for them which accept easy-to-use interfaces from the perspective of the rest of my app:
  - Tables
  - Cards
  - Stats
  - Description Lists
  - Hero Section
  - FAQs
  - Buttons
  - Dropdowns
  - Checkboxes
  - Progress Bars
- Use trusted libraries in the serverless ecosystem to start a test suite for validating my backend logic.
- Organize frontend into `pages`, `components`, `services`, and `utils`.
