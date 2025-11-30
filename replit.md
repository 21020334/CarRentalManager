# Car Rental Management System

## Overview

A full-stack car rental management system built with React, Express, and PostgreSQL. The application features a dual interface: a modern, customer-facing website for browsing and booking vehicles, and a comprehensive admin dashboard for managing inventory and reservations. The system is designed specifically for Vietnamese users with full Vietnamese language support and localized formatting.

**Core Purpose**: Enable customers to browse available vehicles, make rental bookings, and allow administrators to manage the car fleet and booking operations efficiently.

**Key Features**:
- Customer-facing pages for car browsing and booking
- Admin dashboard for car and booking management
- Real-time availability tracking
- Vietnamese language interface with proper diacritics support
- Responsive design for desktop and mobile devices

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework**: React 18 with TypeScript, using Wouter for client-side routing (lightweight React Router alternative)

**UI Component System**: 
- shadcn/ui components based on Radix UI primitives
- Tailwind CSS for styling with custom design tokens
- "New York" style variant from shadcn/ui
- Custom theme system supporting light/dark modes

**Design Philosophy**:
- Hybrid approach: Customer pages inspired by modern car rental platforms (Turo, Hertz), admin dashboard follows Material Design principles
- Primary font: Inter via Google Fonts with Vietnamese diacritics support
- Responsive layouts using Tailwind's breakpoint system

**State Management**:
- TanStack Query (React Query) for server state management
- React Hook Form with Zod validation for form handling
- Local component state for UI interactions

**Key UI Patterns**:
- Car listing grids with filter sidebar
- Booking forms with date pickers and price calculation
- Admin tables for data management
- Toast notifications for user feedback

### Backend Architecture

**Server Framework**: Express.js with TypeScript

**API Design**: RESTful JSON API with the following endpoints:
- `/api/cars` - CRUD operations for vehicle management
- `/api/bookings` - Booking creation and management
- `/api/cars/:id` - Individual car details

**Data Storage Strategy**:
- **Current**: In-memory storage using Map data structures (MemStorage class)
- **Production-ready**: Drizzle ORM configured for PostgreSQL via Neon Database
- Schema defined in `shared/schema.ts` for type safety across frontend/backend

**Validation**: 
- Zod schemas for runtime validation
- `drizzle-zod` for automatic schema generation from Drizzle tables
- Shared validation between client and server

**Build System**:
- Vite for frontend bundling with React Fast Refresh
- esbuild for server-side bundling
- Development mode with HMR and Replit integrations

### Data Models

**Cars Table**:
- Basic info: brand, model, year
- Classification: type (sedan/SUV/sports/etc), transmission, fuel type, seats
- Pricing: pricePerDay (integer, VND)
- Media: image URL
- Status: available/rented/maintenance
- Features: comma-separated string

**Bookings Table**:
- Car reference (carId)
- Customer info: name, phone, ID/passport number
- Rental period: startDate, endDate
- Pricing: totalPrice (calculated)
- Status: pending/confirmed/renting/returned/cancelled
- Notes field for special requests

**Type Safety**: Full TypeScript coverage with shared types between client and server via `shared/schema.ts`

### External Dependencies

**Database**: 
- Neon Database (serverless PostgreSQL)
- Connection via `@neondatabase/serverless` package
- Drizzle ORM for type-safe queries and migrations

**UI Component Libraries**:
- Radix UI primitives (@radix-ui/* packages) - 20+ component primitives
- Tailwind CSS for utility-first styling
- class-variance-authority and clsx for conditional class handling

**Form Handling**:
- react-hook-form for form state management
- @hookform/resolvers for Zod integration
- date-fns for date manipulation and formatting (Vietnamese locale support)

**Development Tools**:
- Vite with React plugin for fast development builds
- Replit-specific plugins for runtime error modal, cartographer, and dev banner
- tsx for running TypeScript in development

**Asset Management**:
- Static images served from `/attached_assets/stock_images/`
- Images referenced via Vite's asset import system

**Session Management** (configured but not actively used):
- express-session with connect-pg-simple for PostgreSQL session store
- Passport.js setup for authentication (future enhancement)

**Additional Services**:
- Google Fonts CDN for Inter font family
- No external API integrations currently implemented
- No payment gateway integration (future enhancement)