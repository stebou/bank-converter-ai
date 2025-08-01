# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Essential Commands

**Development:**
```bash
npm run dev          # Start development server (http://localhost:3000)
npm run build        # Build production app (includes Prisma generation)
npm run start        # Start production server
npm run lint         # Run ESLint
npm run db:studio    # Open Prisma Studio for database management
```

**Database:**
```bash
npx prisma generate                    # Generate Prisma client
npx prisma migrate dev                 # Run database migrations
npx prisma studio                      # Open database viewer
dotenv -e .env.local -- npx prisma studio  # Studio with local env
```

## Architecture Overview

This is a **Next.js 15 + TypeScript** application for AI-powered bank statement analysis with the following key components:

### Core Technology Stack
- **Frontend:** Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS
- **Authentication:** Clerk (with SSO support)  
- **Database:** PostgreSQL with Prisma ORM
- **Payment:** Stripe integration with subscription management
- **AI/ML:** OpenAI GPT-4 Vision for document analysis and chat features
- **PDF Processing:** Multiple strategies (native PDF-lib, PyMuPDF, OCR)

### Database Schema (Prisma)
Key models: `User`, `Document`, `Transaction`, `Plan`, `Payment`, `Conversation`, `ChatMessage`
- Users have subscription plans with document limits
- Documents contain extracted transactions and AI analysis
- AI chat system with conversation history and document references

### Application Structure

**API Routes (`/src/app/api/`):**
- `/documents/` - Document upload, processing, and management
- `/chat/` - AI chat system with conversation management  
- `/stripe/` - Payment processing and subscription management
- `/user/` - User profile and subscription status

**Frontend Pages (`/src/app/`):**
- `/dashboard/` - Main user interface with document management
- `/ia-chat/` - AI chat interface for document analysis
- Authentication flows with Clerk integration

**Key Libraries (`/src/lib/`):**
- `prisma.ts` - Database connection with development optimizations
- `stripe.ts` - Payment processing utilities
- `pdf-processing-*.ts` - Multiple PDF processing strategies
- `plan.ts` - Subscription plan management

### Document Processing Pipeline
1. PDF upload via multipart form data
2. Text extraction using multiple fallback strategies (native → PyMuPDF → OCR)
3. AI analysis with GPT-4 Vision for transaction extraction
4. Database storage with metadata tracking
5. Excel export functionality

### Authentication & Authorization
- Clerk middleware protects all routes except public pages
- User data synced between Clerk and local database
- Subscription-based access control with document limits

### Environment Variables Required
- `DATABASE_URL` (PostgreSQL)
- `OPENAI_API_KEY` 
- `NEXT_PUBLIC_CLERK_*` (Clerk configuration)
- `STRIPE_*` (Stripe keys and webhook secrets)

## Development Notes

- Build process includes automatic Prisma client generation
- French language interface and comments throughout codebase
- Comprehensive error handling and logging in API routes
- Real-time chat streaming with OpenAI integration
- Multi-tenant architecture with user isolation