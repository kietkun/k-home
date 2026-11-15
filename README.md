# K-home

A responsive homestay landing page and booking-flow prototype built with Vite, React, and TypeScript.

## Run locally

```sh
npm install
npm run dev
```

Create a production build with `npm run build`.

## What’s included

- Landing page with room cards, guest/date selectors, story, amenities, location, Google review link, and social/contact links.
- Room detail and booking-request page opened from available rooms. Booked rooms cannot be selected.
- Cancellation-alert form and booking form are previews only. They do not send, store, or reserve anything.
- Sample room inventory and location are in `src/App.tsx`. Replace the room data, address, Google Business Profile URL, contact details, and social profile URLs with verified homestay information before publishing.

## Booking and payment safety

This front end deliberately does not collect card details or claim to confirm a reservation. The displayed availability, prices, alert form, and booking request are demo data and have no server behind them.

For real bookings, connect the form to a trusted booking provider or a server you control. The server—not the browser—must validate dates, re-check room availability, and create the reservation atomically so two guests cannot book the same room. Send confirmations only after the reservation is persisted.

If you add online payment, use a hosted checkout from a payment provider such as Stripe Checkout or another reputable, locally supported provider:

1. Your server creates a checkout session after validating the reservation and price.
2. The browser redirects to the provider’s hosted payment page; never ask for or store raw card numbers or security codes in this app.
3. Keep secret API keys on the server in environment variables, never in `VITE_*` variables or client-side code.
4. Confirm payment from the provider’s signed webhook on the server. Do not treat a browser redirect or success message as proof of payment.
5. Use HTTPS, validate webhook signatures, make booking/payment operations idempotent, and define cancellation/refund handling.

Hosted checkout reduces exposure to card data but does not remove all security, privacy, tax, consumer-law, or payment-provider obligations. Review the provider’s current integration and compliance guidance before launch.
