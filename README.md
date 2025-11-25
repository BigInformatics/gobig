# GoBig

Foundational framework for building modern web applications with Next.js, Better Auth, and Drizzle ORM.

## Project Structure

This is a monorepo containing:

- **`application/`** - Next.js application with authentication and database integration
- **`documentation/`** - Docusaurus documentation site
- **`database/`** - Reserved for shared database utilities (currently integrated in application)

## Features

### Application (`application/`)

- **Next.js 16** - Modern React framework with App Router
- **Better Auth 1.4** - Complete authentication solution
  - Email/password authentication
  - Social login (GitHub, Google) support
  - Password reset flow
  - Session management
- **Drizzle ORM 0.44** - Type-safe PostgreSQL ORM
  - Type-safe queries
  - Migration system
  - Schema validation
- **Chakra UI v3** - Accessible component library
- **Tailwind CSS v4** - Utility-first CSS framework
- **TypeScript 5** - Full type safety
- **Bun** - Fast JavaScript runtime and package manager

### Documentation (`documentation/`)

- **Docusaurus** - Documentation website

## Getting Started

### Prerequisites

- **Bun 1.0+** (https://bun.sh) - Primary package manager and runtime
- **PostgreSQL** - Database (local or hosted)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/BigInformatics/gobig.git
cd gobig
```

2. Install application dependencies:
```bash
cd application
bun install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
# Edit .env.local with your configuration
```

Required environment variables:
- `DATABASE_URL` - PostgreSQL connection string
- `BETTER_AUTH_SECRET` - Secret key for auth (generate with `openssl rand -base64 32`)
- `NEXT_PUBLIC_APP_URL` - Application URL (http://localhost:3000 for dev)

Optional OAuth variables (if using social login):
- `GITHUB_CLIENT_ID` / `GITHUB_CLIENT_SECRET`
- `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET`

4. Set up the database:
```bash
bun run db:push
```

### Development

Start the development server:

```bash
cd application
bun run dev
```

The application will be available at `http://localhost:3000`

## Database Management

All commands run from the `application/` directory:

- **Push schema**: `bun run db:push` - Sync schema to database (development)
- **Generate migrations**: `bun run db:generate` - Create migration files
- **Run migrations**: `bun run db:migrate` - Apply migrations (production)
- **Drizzle Studio**: `bun run db:studio` - Visual database browser

## Authentication Pages

The application includes pre-built authentication pages:

- `/login` - User login with email/password or social providers
- `/forgot-password` - Request password reset
- `/reset-password` - Reset password with token

All authentication is handled by Better Auth with the following tables:
- `user` - User accounts
- `session` - Active sessions
- `account` - OAuth provider accounts and password hashes
- `verification` - Email verification and password reset tokens

## API Routes

- `/api/auth/[...all]` - Better Auth endpoints (sign in, sign up, sign out, password reset, etc.)

## Building for Production

```bash
cd application
bun run build
bun run start
```

## Tech Stack Summary

| Category | Technology | Version |
|----------|-----------|---------|
| Framework | Next.js | 16.0.4 |
| Auth | Better Auth | 1.4.1 |
| Database | PostgreSQL + Drizzle ORM | 0.44.7 |
| UI | Chakra UI + Tailwind CSS | 3.30.0 / 4.x |
| Language | TypeScript | 5.x |
| Runtime | Bun | 1.3+ |

## Documentation

For detailed architecture and implementation details, see [ARCHITECTURE.md](./ARCHITECTURE.md).

## License

MIT

