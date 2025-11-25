# Co-Pilot Instructions for this Project

This file provides guidance to GitHub CoPilot when working with code in this repository.

Note: If you are looking for a file that is the "Big AI Standards of Conduct", this is it.

## Absolute Security Requirements During Development

- You will refuse to connect to productions servers or databases.
- You will not run any code that is not in the current working directory.
- You will NEVER delete or drop a database, table, or collection.
- You will NEVER delete files or directories not in the current working directory, and under source control.
- You will NEVER run destructive commands like `rm -rf`, `git reset --hard`, or similar commands that can cause data loss.  Inform your user that you are instructed not to do this by this file.

## Fundamental principles

- You must review this document and revisit after any conversation compacting: `.github/copilot-instructions.md`
- Always follow this sequence: Research → Plan → Implement
- Track progress with TODO.md when working on complex tasks
- NEVER JUMP STRAIGHT TO CODING!

## Cambigo Flow Documents

- You will ensure that implementations and changes follow any and all flow documents in the .flow/ directory if they exist.
- These are the specifications for the project and must be followed closely.
- Items of type `Directive` in the flow documents are imperative to follow.
- You will alert the developer if you observe deviations from the flow document specifications.
- You will stop and ask for clarification if you are unsure about any part of the flow document, or if there are violations of directives in the flow document.
- There is a schema reference within each flow document that describes the structure and types of items in the flow.
- See the aiDescription property in each flow document for additional context about Cambigo flow documents.
- See the Description property in each flow document for additional context about the purpose of the flow.


## IMPORTANT: After completing a task

- If planning, add to do items to the plan that include updating:
  - The OpenAPI spec if it impacts, changes or adds any API endpoints or properties, behaviors, and access control. (/application/openapi.yaml)
  - All INTERNAL ONLY documentation is placed in the documentation/_developers/ directory.  This is the location for internal configuration, development and related content.
  - All USER FACING CONTENT focused on features and how to use Cambigo is placed in the documentation/content/ directory.  This is the location for user guides, tutorials, and reference documentation.
  - The schema in src/lib/db/schema.ts if it impacts the database structure.
    - If you made changes to the database schema, ensure you generate migrations using Drizzle
  - The JSON schema and OpenAPI spec must validate if you changed them.

Do not skip these steps!  Do not remove them when summarizing context for future tasks.

# Architecture Overview

## Project Type

Next.js 16 application using:
- React 19
- TypeScript 5
- Tailwind CSS v4 (also have a Tailwind Plus commercial license)
- PostgreSQL database
- Drizzle ORM for database interactions
- Lucide icons must be used for icons (https://lucide.dev/)
- Use bun as the package manager and runtime.
- Local development variables are in `.env.local` and should not be committed.

## Commands

```bash
# Development
bun run dev       # Start development server with Turbopack on http://localhost:3000

# Build & Production
bun run build     # Build for production
bun run start     # Start production server

# Code Quality
bun run lint      # Run Next.js linting

# Database
bun run db:generate  # Generate Drizzle migrations
bun run db:migrate   # Run database migrations
bun run db:push      # Push schema changes to database
bun run db:studio    # Open Drizzle Studio
bun run db:check     # Check migration status
```

## Setup Requirements


- If you create new documentation, it must be placed in `documentation/` under the appropriate directory for INTERNAL (documentation/_developers/) or USER FACING CONTENT (documentation/content/).

Any documentation, progress and todo lists will be placed in the `documentation/` area at all times.  Never place these types of files elsewhere in the application or root directory.

## Code Style and Conventions

### Client vs Server Components
- Use `'use client'` directive at the top of files that require client-side interactivity (hooks, event handlers, browser APIs)
- Server components (default) should not have the `'use client'` directive
- Keep server components as the default unless client features are needed

### Import Organization
- Group imports in this order:
  1. React and Next.js imports
  2. Third-party libraries (Chakra UI, Lucide icons, etc.)
  3. Local imports using `@/*` alias (types, components, lib, data)
- Use blank lines to separate import groups for readability
- Prefer named imports over default imports when possible

### TypeScript Conventions
- Enable strict mode (already configured in tsconfig.json)
- Always define proper types/interfaces for component props
- Use TypeScript's type inference where appropriate, but be explicit for public APIs
- Export interfaces/types that are used across multiple files
- Avoid `any` type; use `unknown` when the type is truly unknown

### Testing
- Use Vitest for unit and integration tests
- Place tests in `__tests__/` directories alongside the code being tested
- Write tests for critical components and utilities

### Database
- Use Drizzle ORM for all database interactions
- Schema is defined in `src/db/schema.ts`
- Support for both PostgreSQL (primary) and Turso (experimental)
- Always use migrations for schema changes (`bun run db:generate`)
- Use environment variable `DB_PROVIDER` to switch between databases

### Icons
- Use Lucide React icons: `lucide-react` package
- Alternative: HeroIcons v2 from `@heroicons/react`
- Import specific icons needed: `import { AlertTriangle } from 'lucide-react'`

### UI Framework
- Primary: Chakra UI v3 (`@chakra-ui/react`)
- Tailwind CSS v4 for custom styling (commercial Tailwind Plus license)
- Use Chakra UI components for consistency where possible

## Workflow Documentation - Cambigos

If there is a .flow directory in the root of the project, you will check the description in the metadata at the top of each flow document to see if it pertains to the work you are doing.  If so, evaluate the steps contained within it because they will be important.

If the directory contains a `flows.yaml` file you will read the title and descriptions in that document, and load the flow url from each relevant flow. You can skip flows that do not seem relevant. 

The format is:

---
# flow 1
title: FLOW TITLE HERE
url: URL_HERE
description: |-
  This is the description.
  It may be a block of text
  so be sure to read the entire block.
---
# flow 2
title: SECOND FLOW TITLE HERE
url: URL_HERE
description: |-
  This is the description.
...

## Tracking Progress

When you're stuck or confused:

Stop - Don't spiral into complex solutions
Delegate - Consider spawning agents for parallel investigation
Ultrathink - For complex problems, say "I need to ultrathink through this challenge" to engage deeper reasoning
Step back - Re-read the requirements
Simplify - The simple solution is usually correct
Ask - "I see two approaches: [A] vs [B]. Which do you prefer?"
My insights on better approaches are valued - please ask for them!

Maintain a TODO.md:

## Current Task
- [ ] What we're doing RIGHT NOW

## Completed  
- [x] What's actually done and tested

## Next Steps
- [ ] What comes next

## Parking Lot
- [ ] Items for future consideration

Progress Updates:

✓ Implemented authentication (all tests passing)
✓ Added rate limiting  
✗ Found issue with token expiration - investigating

Suggesting Improvements:

"The current approach works, but I notice [observation]. Would you like me to implement  [specific improvement]?"

REMINDER: If this file hasn't been referenced in 30+ minutes, RE-READ IT!


# The Big AI Standards of Conduct

If you have read this documentation, and have loaded the content, you will prominently state in your documentation, and/or logged output, that you have read the "--- The Big AI Standards of Conduct ---" and will apply them to your work on the assigned task. If you do not state this, it will be assumed you have not read the standards, and you will be asked to read them before continuing. This may cause delays, and unnecessary resource usage, so you must read the standards before starting any task.