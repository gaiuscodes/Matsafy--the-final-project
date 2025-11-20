# MatSafy Deployment Guide

## Prerequisites

1. **Database**: For production, you'll need a cloud PostgreSQL database. Options:
   - Vercel Postgres (recommended for Vercel deployments)
   - Supabase
   - Railway
   - Neon
   - Any PostgreSQL hosting service

2. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)

## Deployment Steps

### 1. Prepare Database

1. Set up a PostgreSQL database on your chosen provider
2. Get your connection string (format: `postgresql://user:password@host:port/database`)

### 2. Update Environment Variables

You'll need to set these environment variables in Vercel:

- `DATABASE_URL`: Your PostgreSQL connection string
- `NEXTAUTH_URL`: Your production URL (e.g., `https://matsafy.vercel.app`)
- `NEXTAUTH_SECRET`: Generate a random secret (run `openssl rand -base64 32`)
- `JWT_SECRET`: Generate another random secret

### 3. Deploy to Vercel

**Option A: Via Vercel CLI**
```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# For production
vercel --prod
```

**Option B: Via GitHub (Recommended)**
1. Push your code to GitHub
2. Go to [vercel.com/new](https://vercel.com/new)
3. Import your repository
4. Add environment variables in the Vercel dashboard
5. Deploy

### 4. Run Database Migrations

After deployment, run Prisma migrations:

```bash
# Set DATABASE_URL in your terminal
export DATABASE_URL="your-postgres-connection-string"

# Push schema
npx prisma db push --schema app/prisma/schema.prisma

# Seed database (optional)
npx prisma db seed --schema app/prisma/schema.prisma
```

Or use Vercel's CLI:
```bash
vercel env pull .env.local
npx prisma db push --schema app/prisma/schema.prisma
```

### 5. Update Prisma Schema for Production

The schema is currently set to PostgreSQL, which is correct. Make sure your `app/prisma/schema.prisma` has:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

## Important Notes

- **SQLite won't work in production** on serverless platforms. You must use PostgreSQL.
- The database file (`app/prisma/dev.db`) is for local development only.
- Make sure to add `.env.local` and `.env` to `.gitignore` (already done).
- Never commit database credentials to Git.

## Post-Deployment

1. Test registration and login
2. Verify vehicle listings work
3. Check that ratings and reports function correctly
4. Monitor Vercel logs for any errors

## Troubleshooting

- **Database connection errors**: Verify `DATABASE_URL` is correct in Vercel environment variables
- **Prisma client errors**: Ensure `postinstall` script runs (already in package.json)
- **Build failures**: Check Vercel build logs for specific errors

