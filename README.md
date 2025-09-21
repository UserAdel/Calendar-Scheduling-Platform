# 📅 SchedulePro - Calendar Scheduling Platform

A modern, full-stack calendar scheduling platform built with Next.js 15, designed to simplify meeting scheduling and calendar management. The platform provides seamless integration with popular calendar services and offers a comprehensive dashboard for managing events, availability, and bookings.

![SchedulePro Platform](./public/Hero.JPG)

## 🚀 Project Overview

SchedulePro is a complete calendar scheduling solution that eliminates the back-and-forth of meeting coordination. Built with modern web technologies, it offers a responsive interface and robust backend capabilities for both individual users and organizations.

## 🎯 Try It Out

Experience the platform in action! Book a demo meeting to see how SchedulePro works:

**[📅 Book a Follow-up Meeting](https://calendar-scheduling-platform-kappa.vercel.app/adile/follow-up)**

This live demo showcases the complete booking flow, from selecting available time slots to confirming your meeting.

## ✨ Key Features

### 🔐 Authentication & User Management

- **Secure Authentication**: NextAuth.js integration with multiple providers
- **User Profiles**: Customizable user profiles with avatar support
- **Session Management**: JWT-based secure session handling
- **Protected Routes**: Role-based access control throughout the application

### Event Type Management

Create different types of meetings with customizable:

- Duration (15 minutes to several hours)
- Description and instructions
- Video call platform preferences
- Availability windows
- Booking confirmation settings

### Smart Scheduling

- Automatic conflict detection
- Buffer time between meetings
- Timezone-aware scheduling
- Integration with existing calendar events
- Customizable booking windows

### User Dashboard

- Overview of upcoming meetings
- Quick access to event type management
- Availability calendar view
- Meeting history and analytics
- Settings and preferences

## 🔒 Security Features

- **CSRF Protection**: Built-in Next.js security
- **SQL Injection Prevention**: Prisma ORM protection
- **Authentication**: Secure OAuth implementation
- **Environment Variables**: Sensitive data protection
- **Type Safety**: TypeScript throughout the application

### 📅 Calendar Integration

- **Nylas API Integration**: Seamless connection with Google Calendar, Outlook, and other providers
- **Real-time Sync**: Automatic synchronization with external calendars
- **Free/Busy Status**: Intelligent availability checking
- **Multiple Calendar Support**: Connect and manage multiple calendar accounts

### 🎯 Event Management

- **Event Types**: Create and manage different types of meetings
- **Custom Durations**: Flexible meeting length configuration
- **Video Call Integration**: Built-in support for Google Meet and other platforms
- **Event URLs**: Shareable booking links for each event type
- **Active/Inactive Toggle**: Easy event type management

### ⏰ Availability Management

- **Weekly Schedules**: Set availability for each day of the week
- **Time Slots**: Granular control over available time periods
- **Timezone Support**: Automatic timezone detection and conversion
- **Availability Override**: Temporary schedule modifications

### 📊 Dashboard Features

- **Event Overview**: Comprehensive view of all scheduled meetings
- **Quick Actions**: Easy access to common tasks
- **Settings Management**: Centralized configuration panel
- **Meeting History**: Track past and upcoming appointments

### 📱 User Experience

- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Dark/Light Mode**: Theme switching with system preference detection
- **Modern UI**: Clean, intuitive interface built with Radix UI components
- **Real-time Updates**: Live updates for booking confirmations and changes

## 🛠️ Technology Stack

### Frontend

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript for type safety
- **Styling**: Tailwind CSS with custom components
- **UI Components**: Radix UI primitives
- **State Management**: React Server Components and Server Actions
- **Icons**: Lucide React icon library
- **Themes**: Next-themes for dark/light mode

### Backend

- **Runtime**: Node.js with Next.js API routes
- **Authentication**: NextAuth.js v5 (beta)
- **Database**: PostgreSQL with Prisma ORM
- **Calendar API**: Nylas SDK for calendar integration
- **File Upload**: UploadThing for image and file handling
- **Validation**: Zod for schema validation
- **Forms**: Conform for form handling

### Database & Deployment

- **Database**: PostgreSQL with Prisma schema
- **ORM**: Prisma Client with custom output directory
- **Deployment**: Vercel-ready configuration
- **Environment**: Environment variable management

## 📋 Prerequisites

Before running this project, make sure you have:

- **Node.js** (v18 or higher)
- **npm** or **yarn** package manager
- **PostgreSQL** database
- **Nylas API** account for calendar integration
- **NextAuth** providers configured (Google, GitHub, etc.)

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd calender-scheduling-platform
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Environment Setup

Create a `.env.local` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/schedulepro"
DIRECT_URL="postgresql://username:password@localhost:5432/schedulepro"

# NextAuth
NEXTAUTH_SECRET="your-nextauth-secret"
NEXTAUTH_URL="http://localhost:3000"

# OAuth Providers
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
GITHUB_CLIENT_ID="your-github-client-id"
GITHUB_CLIENT_SECRET="your-github-client-secret"

# Nylas Calendar Integration
NYLAS_API_KEY="your-nylas-api-key"
NYLAS_API_URI="https://api.nylas.com"

# UploadThing
UPLOADTHING_SECRET="your-uploadthing-secret"
UPLOADTHING_APP_ID="your-uploadthing-app-id"
```

### 4. Database Setup

```bash
# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma db push

# (Optional) Seed the database
npx prisma db seed
```

### 5. Run the Development Server

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 📁 Project Structure

```
├── app/                          # Next.js App Router
│   ├── (bookingPage)/           # Booking page route group
│   ├── _components/             # Shared components
│   │   ├── AuthModal.tsx        # Authentication modal
│   │   ├── Hero.tsx             # Landing page hero
│   │   ├── Navbar.tsx           # Navigation component
│   │   └── bookingForm/         # Booking form components
│   ├── api/                     # API routes
│   ├── dashboard/               # Dashboard pages
│   │   ├── availability/        # Availability management
│   │   ├── event/              # Event management
│   │   ├── meetings/           # Meeting overview
│   │   └── settings/           # User settings
│   ├── onboarding/             # User onboarding flow
│   └── success/                # Success pages
├── components/                  # Reusable UI components
│   └── ui/                     # Shadcn/ui components
├── lib/                        # Utility libraries
│   ├── auth.ts                 # NextAuth configuration
│   ├── db.ts                   # Database connection
│   └── generated/              # Generated Prisma client
├── prisma/                     # Database schema and migrations
│   └── schema.prisma           # Prisma schema definition
└── public/                     # Static assets
```

## 🔧 Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build the application for production
- `npm start` - Start the production server
- `npm run lint` - Run ESLint for code quality
- `npx prisma studio` - Open Prisma Studio for database management
- `npx prisma generate` - Generate Prisma client
- `npx prisma db push` - Push schema changes to database
