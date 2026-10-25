# SimpleVerifier for Zapier

Source of the [SimpleVerifier](https://simpleverifier.com) Zapier integration, built with the Zapier Platform CLI.

**Actions**

- **Verify Email**: syntax, domain, disposable and live mailbox (SMTP) checks. Returns `valid`, `risky` or `invalid`, a reason and `send_advice`.
- **Validate Phone**: E.164 form, country and numbering-plan line type. A format check only; it never says a number is in service.

Authentication is an API key from https://simpleverifier.com/api-keys (Pro, Business or Agency plan). Each run is one API call.

## Develop

```bash
npm ci
npm test            # runs against a local mock API, no real key needed
npx zapier-platform validate
```

To try it in your own Zapier account: `npx zapier-platform login`, then `npx zapier-platform register` and `npx zapier-platform push`.

## License

MIT
