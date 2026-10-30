This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Supabase database setup

For a new database, run `supabase/schema.sql`, then `supabase/phase4.sql`,
`supabase/phase5.sql`, `supabase/phase6.sql`, and `supabase/phase7.sql` in the Supabase SQL Editor. For an existing database
created from the original schema, run `supabase/phase5.sql` to add the feedback
wall's moderation columns, reactions, and report tables. Re-run `phase5.sql` on
existing databases to enforce one reaction per persona per feedback thread; if
older data has multiple reactions from the same persona, the latest is kept.
Run `supabase/phase6.sql` on existing databases to enable organizer
applications, private verification uploads, event suspension, and organizer
approval. Enable Supabase Auth email/password and configure its site URL for
email confirmation. Set `ORGANIZER_ADMIN_EMAILS` in `.env.local` and your
deployment environment to a comma-separated list of administrator email
addresses. Organizers register with Supabase Auth
email/password and must verify their email before submitting an application.
Verification proof is limited to PDF/JPG files of at most 1 MB; only allowlisted
administrators can request a short-lived proof link.
Run `supabase/phase7.sql` on existing databases to limit persona creation to
one per browser cookie. This is a best-effort browser limit, not a way to
identify a physical device: clearing cookies or changing browsers can bypass it.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
