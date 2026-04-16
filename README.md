# Getting Started with Send Signal

A production-ready, full-stack WhatsApp outreach automation SaaS.

## Prerequisites

- Node.js 18+
- PostgreSQL database
- WhatsApp Business API credentials (optional for development)

## Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your database URL and credentials
```

3. Set up the database:
```bash
npm run db:generate
npm run db:push
```

4. Start the development server:
```bash
npm run dev
```

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── (marketing)/        # Public marketing pages
│   ├── (auth)/            # Authentication pages
│   ├── (dashboard)/       # Protected dashboard
│   ├── (onboarding)/      # Onboarding wizard
│   └── api/               # API routes
├── components/            # Reusable components
│   ├── ui/               # UI primitives
│   ├── layout/           # Layout components
│   ├── shared/           # Shared components
│   └── onboarding/       # Onboarding step components
├── lib/                   # Utilities and services
└── types/                 # TypeScript types
```

## Key Features

- **Marketing Landing Page**: Professional dark-themed landing page
- **Authentication**: Secure signup/login with JWT sessions
- **Onboarding Wizard**: 6-step setup flow
- **Lead Management**: CSV import, search, filtering
- **Template Builder**: Create reusable message templates with placeholders
- **Campaign Management**: Create, schedule, and monitor campaigns
- **Real-time Analytics**: Track message delivery, reads, and replies
- **WhatsApp Integration**: Official WhatsApp Business API
- **Compliance**: Automatic unsubscribe handling, duplicate prevention

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run db:generate` - Generate Prisma client
- `npm run db:push` - Push schema to database
- `npm run db:migrate` - Run database migrations
- `npm run db:studio` - Open Prisma Studio
