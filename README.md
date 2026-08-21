# Work in CRNWL

Independent source code for **Work in CRNWL**, a Cornwall hospitality jobs platform.

## Run locally

1. Install Node.js 20+ (Node 22 is recommended).
2. Run `npm install`.
3. Copy `.env.example` to `.env`.
4. Add your Supabase project URL and publishable key to `.env`.
5. Run `npm run dev`.

## Build

Run `npm run build`.

## Backend

The app uses Supabase for authentication and data. Email/password authentication works through Supabase. Google login also uses Supabase OAuth and requires Google to be enabled in the Supabase Authentication provider settings.

## Hosting

This project no longer requires Lovable-specific packages. It is a standard TanStack Start/Vite app and can be deployed to a compatible host. Keep secrets in your host's environment-variable settings rather than committing them to GitHub.
