# news-admin Deployment Guide
## Deploy to Vercel + Secure Registration

---

## PART 1 — Secure the Code (do this first)

### Step 1 — Copy the 2 security files

Copy these files from the `admin-security.zip` into your `news-admin/` folder:

| File | Destination |
|------|-------------|
| `register/route.ts` | `news-admin/src/app/api/auth/register/route.ts` |
| `middleware.ts` | `news-admin/middleware.ts` (replace existing) |

### Step 2 — Commit and push to GitHub

```bash
cd news-admin
git add .
git commit -m "feat: secure registration with email whitelist"
git push origin main
```

---

## PART 2 — Deploy to Vercel

### Step 3 — Create a new Vercel project

1. Go to **vercel.com** → Log in → **Add New Project**
2. Click **Import Git Repository**
3. Select your **news-admin** repo (or the parent repo + set Root Directory to `news-admin`)
4. Set **Framework Preset** → `Next.js`
5. Set **Root Directory** → `news-admin` (if it's inside a monorepo)
6. Click **Deploy** — it will fail (no env vars yet) — that's OK

### Step 4 — Add Environment Variables

In Vercel → your project → **Settings → Environment Variables**, add ALL of these:

| Variable | Value |
|----------|-------|
| `MONGODB_URI` | `mongodb+srv://somdevsheel:S09%40somdev@cluster0.b9cklx1.mongodb.net/pdftool-news?...` |
| `JWT_SECRET` | `k9x2mP8vQnR5tL3wY7uJ1eA4sD6fH0bN` |
| `ADMIN_ALLOWED_EMAILS` | `youremail@gmail.com` ← your real email |
| `AWS_REGION` | `us-east-1` |
| `AWS_ACCESS_KEY_ID` | your key |
| `AWS_SECRET_ACCESS_KEY` | your secret |
| `S3_BUCKET_NAME` | `vidstreammm` |
| `CLOUDFRONT_DOMAIN` | `https://d1afw9oa08qpwz.cloudfront.net` |
| `GMAIL_USER` | your Gmail |
| `GMAIL_APP_PASSWORD` | your app password |
| `GMAIL_FROM_NAME` | `PDF.tools` |
| `DIGEST_SECRET` | choose any strong secret |
| `NEXT_PUBLIC_APP_URL` | `https://pdftooladmin.arutechconsultancy.com` |
| `NEXT_PUBLIC_FRONTEND_URL` | `https://pdftool.arutechconsultancy.com` |

### Step 5 — Redeploy

Vercel → your project → **Deployments → 3 dots → Redeploy**

Wait ~2 minutes for the build to finish.

---

## PART 3 — Custom Domain

### Step 6 — Add domain in Vercel

1. Vercel → project → **Settings → Domains**
2. Type: `pdftooladmin.arutechconsultancy.com` → **Add**
3. Vercel shows you a CNAME record to add

### Step 7 — Add DNS record

Go to wherever your domain DNS is managed (GoDaddy / Cloudflare / Namecheap etc.):

| Type | Name | Value |
|------|------|-------|
| CNAME | `pdftooladmin` | `cname.vercel-dns.com` |

DNS propagates in 2–10 minutes. Then `https://pdftooladmin.arutechconsultancy.com` is live.

---

## PART 4 — Create Your Admin Account

### Step 8 — Register (first time only)

1. Go to `https://pdftooladmin.arutechconsultancy.com/admin/login`
2. Click **Register** (or go to `/admin/register`)
3. Use the **exact email** you put in `ADMIN_ALLOWED_EMAILS`
4. First account is automatically assigned `admin` role

### Step 9 — Done!

After your account is created:
- The register endpoint is now **locked** — only existing admins can add more users
- Anyone not in `ADMIN_ALLOWED_EMAILS` gets `403 Forbidden`
- Anyone trying to access `/admin/*` without login gets redirected to `/admin/login`

---

## PART 5 — Adding More Admin Users Later

If you want to add another editor/admin later:

**Option A — Add their email to Vercel env var:**
1. Vercel → Settings → Environment Variables → edit `ADMIN_ALLOWED_EMAILS`
2. Add: `youremail@gmail.com,newperson@gmail.com`
3. Redeploy
4. They go to `/admin/register` and create their account
5. Remove their email from the list again if you want (already registered users are not affected)

**Option B — You add them while logged in:**
- Log in as admin → Settings (if you build a user management page)

---

## Security Summary

| Attack | Protection |
|--------|-----------|
| Unknown person registers | Blocked — email not in `ADMIN_ALLOWED_EMAILS` → 403 |
| Brute force `/api/auth/register` | Email whitelist check happens before any DB query |
| Cross-origin register POST | Middleware blocks requests from different origins |
| Accessing `/admin/*` without login | Middleware redirects to `/admin/login` |
| Expired/invalid JWT token | Middleware clears cookie + redirects to login |
| Direct browser GET to register API | Middleware returns 404 |
