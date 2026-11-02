# Registration setup and verification

The `/register` form uses the existing AuthContextProvider and Supabase Auth.
Registration asks only for name, email, and password. Name is saved as
`user_metadata.full_name` on the Auth user. Skill level is deferred to the
profile section; signup does not assign a default skill. Passwords go only to Supabase Auth,
never to profile metadata, application storage, or application logs. Supabase's
own session persistence still stores access and refresh tokens in the browser.

## Required Supabase configuration

These are hosted project settings. Committing frontend code does **not** change
them. They have not been inspected or changed by this implementation.

1. In Authentication settings, enable email/password signup and **Confirm email**.
   The form supports confirmation being off for development, but production
   should require verification of email ownership.
2. Set the minimum password length to **8** and required characters to
   **lowercase letters, uppercase letters, and digits**. The UI accepts 8–128
   characters, preserves spaces, and requires these three character classes.
   Server enforcement is essential: callers can bypass all browser validation.
   Enable leaked-password protection if available on the project plan.
3. Set the Site URL to the deployed app's HTTPS URL. Allow these exact redirects
   (replace the production example):
   - `http://localhost:5173/auth/confirm`
   - `https://your-app.example/auth/confirm`
   The SPA callback supports Supabase's default implicit flow and verifies the
   resulting user with `getUser()`. Ensure the hosting provider rewrites SPA
   paths to `index.html`, so opening this link in a new tab works.
4. Configure production SMTP and a signup confirmation email template that links
   to Supabase's `{{ .ConfirmationURL }}`. The built-in email service has delivery
   restrictions and is unsuitable for general production registration.
5. Review Supabase Auth rate limits, including signup and confirmation emails.
   The form handles HTTP 429 without exposing internal errors. Button disabling
   and the in-flight guard only prevent accidental duplicate submissions; they
   are not security rate limits.
6. Keep only a publishable/anon key in the browser. Copy `.env.example` to
   `.env.local` and supply `VITE_SUPABASE_URL` and
   `VITE_SUPABASE_PUBLISHABLE_KEY`. The previous `VITE_SUPABASE_KEY` still works
   as a compatibility fallback. Never put a secret/service-role key in any
   `VITE_` variable.

## Account privacy and player data

An existing account receives the same app response as a signup awaiting email
confirmation. The app does not query registered emails, inspect identities to
identify duplicates, or display raw backend errors. Supabase's API behavior
also depends on its email/phone confirmation settings; UI messages alone cannot
guarantee account privacy at the API layer.

Player metadata is persistent but user-editable and must never be used for
roles, permissions, or trusted matchmaking rankings. This step does not create
the future `public.profiles` table. When that table is added, validate profile
fields in PostgreSQL, enable RLS, and keep player skill separate from session
match preference. No frontend should read or change `login_attempts`.

## CAPTCHA dependency

CAPTCHA is not implemented or enabled by this change. Supabase CAPTCHA settings
also apply to password login. The deployed `login-with-rate-limit` source is not
in this repository; enabling CAPTCHA without updating that function would break
the login flow.

To add it, integrate hCaptcha or Cloudflare Turnstile on both forms; pass the
token to `auth.signUp({ options: { captchaToken } })` and through the login Edge
Function to `auth.signInWithPassword({ options: { captchaToken } })`. Then enable
the same provider in Supabase with its server-side secret. Tokens must be
refreshed after use or expiry, and the browser must never contain the secret.
Supabase Auth must validate the token, including for direct API requests.

## Verification

Run `npm test`, `npm run lint`, and `npm run build`.
Automated tests mock Supabase and cover request data, password validation,
confirmation versus session navigation, duplicate privacy, duplicate submission
prevention, rate limits, backend/network failures, retries, and callback errors.
They do not verify the live project's configuration or email delivery.

With a test mailbox in the hosted project:

1. Submit a new email, name, and valid password. Confirm that the UI says
   to check email and does not go to the dashboard before confirmation.
2. In Authentication > Users, verify the user is unconfirmed and metadata
   contains `full_name`, with no password or signup-assigned skill level field.
3. Open the email link. Verify `/auth/confirm` opens, confirms the account, removes
   the token fragment from the URL, and goes to `/dashboard`.
4. Sign out, then log in with the new credentials. The existing login Edge
   Function must already be working; this change does not deploy or repair it.
5. Register the confirmed email again. Verify the generic check-email result.
6. Test short/weak passwords, an invalid email, temporary network loss,
   expired links, and Auth rate limits using a development project.
7. Test a direct Auth signup request with a weak password in a development
   project. Supabase must reject it even without this UI.

References: [Supabase signup](https://supabase.com/docs/reference/javascript/auth-signup),
[password security](https://supabase.com/docs/guides/auth/password-security),
[SMTP](https://supabase.com/docs/guides/auth/auth-smtp),
[rate limits](https://supabase.com/docs/guides/auth/rate-limits),
[CAPTCHA](https://supabase.com/docs/guides/auth/auth-captcha).
