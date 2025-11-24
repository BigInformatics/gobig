# GoBig Architecture

## Overview

GoBig is a foundational framework template for building modern web applications. It combines the best tools in the JavaScript ecosystem to provide a robust, type-safe, and scalable starting point.

## Technology Stack

### Core Framework
- **Next.js 16**: Modern web framework

### Authentication
- **Better Auth 1.3.34**: Complete authentication solution
  - Email/password authentication
  - Session management
  - Secure password hashing
  - CSRF protection
  - Extensible for OAuth providers

### Database
- **Drizzle ORM 0.44.7**: Type-safe ORM
  - SQLite for local development
  - Type-safe queries
  - Migration system
  - Schema validation
  - Easy to switch to PostgreSQL/MySQL for production

### Payment Processing
- **Stripe 19.3.1**: Payment infrastructure
  - Ready for subscription management
  - Customer management
  - Webhook support

### UI Frameworks
- **Chakra UI 3.29.0**: Component library
  - Accessible components
  - Theme customization
  - Responsive design utilities

- **Tailwind CSS 3.x**: Utility-first CSS
  - Rapid UI development
  - Custom design system support
  - Production optimizations

### Type Safety
- **TypeScript 5.7.2**: Static typing
  - Strictest mode enabled
  - Full type coverage
  - Enhanced IDE support

## Database Schema

### Better Auth Tables (Auto-managed)

#### `user`
- id (primary key)
- name
- email (unique)
- emailVerified
- image
- createdAt
- updatedAt

#### `session`
- id (primary key)
- userId (foreign key → user.id)
- expiresAt
- token (unique)
- ipAddress
- userAgent
- createdAt
- updatedAt

#### `account`
- id (primary key)
- userId (foreign key → user.id)
- accountId
- providerId
- accessToken
- refreshToken
- password (hashed)
- createdAt
- updatedAt

#### `verification`
- id (primary key)
- identifier
- value
- expiresAt
- createdAt
- updatedAt

### Custom Application Tables

#### `settings`
- id (primary key)
- userId (foreign key → user.id, unique)
- theme
- notifications
- language
- createdAt
- updatedAt

#### `subscriptions`
- id (primary key)
- userId (foreign key → user.id)
- stripeCustomerId (unique)
- stripeSubscriptionId (unique)
- stripePriceId
- status
- currentPeriodStart
- currentPeriodEnd
- cancelAtPeriodEnd
- createdAt
- updatedAt

## Authentication Flow

### Sign Up
1. User submits form on `/signup`
2. Client calls Better Auth API: `POST /api/auth/sign-up/email`
3. Better Auth:
   - Validates input
   - Hashes password
   - Creates user record
   - Creates session
4. Returns session token
5. Client stores session
6. Redirects to `/app`

### Login
1. User submits form on `/login`
2. Client calls Better Auth API: `POST /api/auth/sign-in/email`
3. Better Auth:
   - Validates credentials
   - Verifies password hash
   - Creates session
4. Returns session token
5. Client stores session
6. Redirects to `/app`

### Session Management
- Sessions stored in database
- Token sent with each request
- Server validates on protected routes
- Automatic expiry (7 days default)
- Refresh mechanism (updates after 1 day)

### Logout
1. User clicks logout button
2. Client calls Better Auth API: `POST /api/auth/sign-out`
3. Better Auth removes session
4. Client clears local session
5. Redirects to home page


## API Routes

All Better Auth routes are handled through: `/api/auth/*`

Available endpoints:
- `POST /api/auth/sign-up/email` - Create account
- `POST /api/auth/sign-in/email` - Login
- `POST /api/auth/sign-out` - Logout
- `GET /api/auth/session` - Get current session
- And more...

## Environment Variables

Required variables (see `.env.example`):

```
DATABASE_URL=file:local.db
BETTER_AUTH_SECRET=your-secret-key
BETTER_AUTH_URL=http://localhost:4321
```

Optional for Stripe:
```
STRIPE_SECRET_KEY=
STRIPE_PUBLISHABLE_KEY=
STRIPE_WEBHOOK_SECRET=
```

## Build & Deployment

### Development
```bash
# Using Bun (recommended)
bun run dev

# Or using npm
npm run dev
```

### Production Build
```bash
# Using Bun (recommended)
bun run build

# Or using npm
npm run build
```

Output in `dist/`:
- `dist/client/` - Client-side assets
- `dist/server/` - Server-side code

### Preview Production
```bash
# Using Bun (recommended)
bun run preview

# Or using npm
npm run preview
```
