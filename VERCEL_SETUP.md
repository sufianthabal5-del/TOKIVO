# TOKIVA — Vercel deployment

This project is a Next.js app. Vercel hosts the website; Supabase provides accounts/database; Cloudflare R2 stores video files. Video encoding is a separate FFmpeg worker and must run on a VPS or another always-on machine (Vercel is not the worker host).

## 1. Create the Supabase project

1. Create a project at https://supabase.com/dashboard and wait until it is ready.
2. Open **SQL Editor → New query**.
3. Open `supabase/tokiva-all-migrations.sql` from this repository, copy all of it into the SQL editor, and click **Run**.
4. Open **Project Settings → API Keys**. Copy the **Project URL** and the **Publishable key**. Do not use a secret/service-role key in the website.

## 2. Create the Cloudflare R2 bucket

1. In Cloudflare, open **R2 → Create bucket**. Name it `tokiva-media` (or another name you prefer).
2. Create an R2 API token with **Object Read & Write** permission for this bucket only.
3. Save the Account ID, Access Key ID and Secret Access Key. The secret is shown only once.
4. In the bucket's **Settings → CORS Policy**, add this rule, replacing the domain if you use a different one:

```json
[
  {
    "AllowedOrigins": ["https://tokiva.fun", "https://www.tokiva.fun"],
    "AllowedMethods": ["GET", "HEAD", "PUT"],
    "AllowedHeaders": ["*"],
    "ExposeHeaders": ["ETag"],
    "MaxAgeSeconds": 3600
  }
]
```

Keep the bucket private. Leave `MEDIA_PUBLIC_URL` empty unless you intentionally want HLS files to be public to anyone with their URL.

## 3. Push the project to your GitHub

1. Create a new GitHub repository named `tokiva`.
2. Upload/push the contents of this folder to its `main` branch. Do not upload `.env.local`, `worker/.env`, or any real secrets.
3. In the repository root, `package.json` already declares Node.js 22 or newer.

## 4. Deploy on Vercel

1. Sign in at https://vercel.com and choose **Add New → Project**.
2. Import your `tokiva` GitHub repository.
3. Framework should be detected as **Next.js**. Keep the default build command (`next build`) and output settings.
4. In **Project → Settings → Environment Variables**, add these values for **Production**, **Preview**, and **Development** as appropriate:

| Variable | Value |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase Project URL |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Supabase Publishable key |
| `R2_ACCOUNT_ID` | Cloudflare account ID |
| `R2_ACCESS_KEY_ID` | R2 Access Key ID |
| `R2_SECRET_ACCESS_KEY` | R2 Secret Access Key |
| `R2_BUCKET` | Your R2 bucket name, e.g. `tokiva-media` |
| `MEDIA_PUBLIC_URL` | Leave unset/blank unless you configured a public R2 custom domain |

`NEXT_PUBLIC_` variables are intended for browser use. The four `R2_` values are server-side secrets; never rename them with a `NEXT_PUBLIC_` prefix and never commit them to GitHub.

5. Click **Deploy**. After changing environment variables, redeploy so the new deployment receives them.

## 5. Connect your domain

1. In Vercel **Project → Settings → Domains**, add `tokiva.fun` and `www.tokiva.fun`.
2. Copy the DNS records Vercel shows and add them at your domain registrar/DNS provider. Wait until Vercel marks the domain as valid.
3. In Supabase **Authentication → URL Configuration**, set **Site URL** to `https://tokiva.fun` and add these Redirect URLs:
   - `https://tokiva.fun/auth/callback`
   - `https://www.tokiva.fun/auth/callback`
4. If you use a different production domain, use that exact domain in Supabase and the R2 CORS rule too.

## 6. Make your account the first admin

1. Open the deployed site and sign up using your own email.
2. In Supabase **SQL Editor**, run this query after replacing the email:

```sql
insert into public.admins (user_id, note)
select id, 'TOKIVA owner'
from auth.users
where email = 'YOUR_EMAIL@example.com'
on conflict do nothing;
```

3. Sign in again and open `https://tokiva.fun/admin`.
4. Switch on the features you want (start with the For You feed and creator profiles). Upload/processing needs the encoder worker below.

## 7. Set up video processing (required for uploaded videos to become playable)

Vercel hosts the web app, but the project's encoder is a long-running FFmpeg worker. Run it on an Ubuntu VPS or another always-on Linux machine with `ffmpeg` and `ffprobe` installed.

1. Copy `worker/.env.example` to `worker/.env` on that worker machine.
2. Set these worker-only variables:
   - `SUPABASE_URL` = the same Supabase Project URL
   - `SUPABASE_SERVICE_ROLE_KEY` = the Supabase secret/service-role key (worker only; never add this to Vercel or browser code)
   - `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET` = the same R2 bucket credentials as above
   - `WORKER_NAME` = optional label, e.g. `tokiva-encoder-1`
3. Install Node.js 22+, FFmpeg and FFprobe on the VPS, then from the project folder run:

```bash
npm ci --prefix worker
node --env-file=worker/.env worker/index.mjs
```

Keep that process running with a process manager such as systemd or Docker. See `ops/encoder/README.md` for the production service setup. Do not expose the service-role key publicly.

## 8. Local development

Copy `.env.example` to `.env.local`, fill in the two Supabase website values and (if testing uploads) the four R2 values, then run:

```bash
npm ci
npm run dev
```

Open http://localhost:3000. For local uploads, add `http://localhost:3000` to the R2 bucket's CORS AllowedOrigins while testing.

## Important notes

- The app can load without R2, but direct video upload will not be configured.
- The app can load without the encoder, but newly uploaded clips will remain unprocessed and will not become playable.
- Do not paste secrets into chat, GitHub, screenshots, or frontend variables.
- The included migrations create the schema and security policies. Run them once on a fresh Supabase project; do not reset a database containing real user data.
