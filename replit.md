# SecurePass - Password Generator & Strength Checker

## Overview

SecurePass is a client-side password generator and strength checker web application built with React, TypeScript, and Express.js. The application provides two main features: generating secure passwords with customizable options and checking the strength of existing passwords with detailed feedback. All password processing happens client-side for maximum security.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **Routing**: Wouter for lightweight client-side routing
- **UI Framework**: Shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with CSS variables for theming
- **State Management**: TanStack Query for server state, React hooks for local state
- **Theme System**: Custom theme provider supporting light/dark modes

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ES modules
- **Database ORM**: Drizzle ORM configured for PostgreSQL
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **Session Storage**: PostgreSQL-based sessions using connect-pg-simple
- **Development**: Hot reload with Vite integration in development mode

### Security Features
- **Client-Side Processing**: All password generation and strength checking happens in the browser
- **Cryptographically Secure**: Uses Web Crypto API for random number generation
- **No Server Storage**: Passwords never leave the user's device
- **Content Security**: Proper error handling and input validation

## Key Components

### Password Generator (`client/src/components/password-generator.tsx`)
- Customizable password length (8-128 characters)
- Character set selection (uppercase, lowercase, numbers, symbols)
- Options to exclude ambiguous or duplicate characters
- Real-time password generation with cryptographic randomness
- Copy-to-clipboard functionality with user feedback

### Password Strength Checker (`client/src/components/password-strength-checker.tsx`)
- Real-time strength analysis as user types
- Visual strength indicators with color-coded progress bars
- Detailed factor analysis (length, character diversity, common patterns)
- Estimated crack time calculations
- Actionable suggestions for improvement
- Toggle visibility for password input

### UI Components (`client/src/components/ui/`)
- Complete Shadcn/ui component library
- Radix UI primitives for accessibility
- Consistent design system with Tailwind CSS
- Custom theme provider for light/dark mode switching

## Data Flow

### Password Generation Flow
1. User configures options (length, character types, exclusions)
2. Client-side `generatePassword` function creates secure random password
3. Password displayed in read-only field with copy functionality
4. No server communication required

### Password Strength Checking Flow
1. User inputs password in real-time
2. Client-side `checkPasswordStrength` function analyzes password
3. Strength score, factors, and suggestions calculated locally
4. UI updates immediately with visual feedback
5. No password data transmitted to server

### Theme Management
1. Theme preference stored in localStorage
2. System theme detection for automatic mode
3. CSS variables updated dynamically for theme switching

## External Dependencies

### Frontend Dependencies
- **React Ecosystem**: React, React DOM, React Router (Wouter)
- **UI Libraries**: Radix UI components, Lucide React icons
- **Styling**: Tailwind CSS, class-variance-authority, clsx
- **State Management**: TanStack React Query
- **Form Handling**: React Hook Form with Zod validation
- **Utilities**: date-fns, nanoid

### Backend Dependencies
- **Server**: Express.js with TypeScript
- **Database**: Drizzle ORM, Neon Database serverless driver
- **Session Management**: express-session with connect-pg-simple
- **Development**: tsx for TypeScript execution, esbuild for production builds

### Development Tools
- **Build System**: Vite with React plugin
- **Database Migrations**: Drizzle Kit
- **Type Checking**: TypeScript with strict configuration
- **CSS Processing**: PostCSS with Autoprefixer

## Deployment Strategy

### Build Process
1. **Frontend Build**: Vite builds React app with TypeScript compilation and asset optimization
2. **Backend Build**: esbuild bundles Express server with external package handling
3. **Static Assets**: Frontend builds to `dist/public` for Express static serving

### Production Setup
- **Server Entry**: `dist/index.js` runs the Express server
- **Static Serving**: Express serves built React app from `dist/public`
- **Environment Variables**: `DATABASE_URL` required for PostgreSQL connection
- **Session Security**: Secure session configuration for production

### Development Mode
- **Hot Reload**: Vite dev server integrated with Express
- **TypeScript**: Real-time compilation and type checking
- **Database**: Drizzle migrations with `npm run db:push`
- **Error Handling**: Runtime error overlay for better debugging

### Database Configuration
- **Schema**: Located in `shared/schema.ts` for type sharing
- **Migrations**: Generated in `./migrations` directory
- **Connection**: Neon serverless PostgreSQL with connection pooling
- **Type Safety**: Full end-to-end TypeScript types from database to frontend

The application emphasizes security, performance, and user experience while maintaining a clean separation between client-side password operations and server-side infrastructure.