# NEXUS-AUTH | Production-Grade Auth & Data Sync

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat&logo=next.js)](https://nextjs.org/)
[![Clerk](https://img.shields.io/badge/Auth-Clerk-6C47FF?style=flat&logo=clerk)](https://clerk.com/)
[![Supabase](https://img.shields.io/badge/Database-Supabase-3ECF8E?style=flat&logo=supabase)](https://supabase.com/)

### Project Overview
A robust Full-Stack foundation featuring secure authentication, real-time database synchronization via webhooks, and protected dashboard architecture.

---

### The Problem
Many SaaS applications struggle with **Data Inconsistency**. Users sign up via third-party Auth providers (like Google or GitHub), but their profiles aren't properly synced to the internal application database. This leads to broken user experiences, manual data entry, and security vulnerabilities where the Auth state and Database state are out of alignment.

### The Solution
I engineered a **Serverless Sync Architecture**. Using **Clerk Webhooks (Svix)**, the application listens for `user.created` events. When a user authenticates, a secure POST request triggers a backend route that validates the payload signature and automatically provisions a new user record in **Supabase (PostgreSQL)**. This ensures that the application database is always a "Source of Truth" for authenticated users.

---

### Tech Stack & Architectural Choices

| Technology | Purpose | Why? |
| :--- | :--- | :--- |
| **Next.js 15 (App Router)** | Framework | Utilizing Server Components for SEO and fast initial page loads. |
| **Clerk** | Authentication | Handles session management and OAuth (Google) with zero security overhead. |
| **Supabase / PostgreSQL** | Database | Relational structure allows for complex user data scaling and RLS security. |
| **Svix / Webhooks** | Data Sync | Guaranteed delivery of Auth events from Clerk to our internal DB. |
| **Tailwind CSS** | Styling | Rapid, responsive UI development with a consistent design system. |
| **TypeScript** | Type Safety | Reducing runtime errors and ensuring data integrity across the stack. |

---

### Key Features
* **Secure Middleware:** Custom `clerkMiddleware` to protect `/dashboard` while keeping landing pages public.
* **Automated User Provisioning:** Real-time sync between Auth provider and PostgreSQL.
* **Row Level Security (RLS):** Database-level protection ensuring users can only access their own data.
* **Production-Ready Webhooks:** Implementation of Svix headers to verify incoming request authenticity.

---

### Future Roadmap (Scalability)
- [ ] **Multi-Tenant Roles:** Implementing Admin vs. User permissions.
- [ ] **Activity Logging:** Tracking user interactions within the PostgreSQL schema.
- [ ] **Email Automation:** Integrating Resend to trigger welcome sequences post-sync.

---

**Built by DevBlaze — Product Engineer**

---
