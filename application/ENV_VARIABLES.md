# Environment Variables

Copy this file to `.env.local` and fill in your values.

## Required Variables

```bash
# Database Configuration
# PostgreSQL connection string
DATABASE_URL=postgresql://user:password@localhost:5432/gobig

# Better Auth Configuration
# Secret key for signing tokens (generate with: openssl rand -base64 32)
BETTER_AUTH_SECRET=your-secret-key-change-this-in-production

# Application URL
# Used for OAuth callbacks and CORS
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Optional OAuth Providers

```bash
# GitHub OAuth - Get credentials from https://github.com/settings/developers
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=

# Google OAuth - Get credentials from https://console.cloud.google.com/apis/credentials
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
```

## Setup Instructions

1. Copy this file to `.env.local`:
   ```bash
   cp ENV_VARIABLES.md .env.local
   ```

2. Edit `.env.local` and fill in your values

3. Generate a secure secret for `BETTER_AUTH_SECRET`:
   ```bash
   openssl rand -base64 32
   ```

4. Set up your database and update `DATABASE_URL`

5. (Optional) Configure OAuth providers by adding client IDs and secrets

## Notes

- `.env.local` is gitignored and should not be committed
- `NEXT_PUBLIC_*` variables are exposed to the browser
- OAuth providers are optional - the app works without them (email/password auth only)

