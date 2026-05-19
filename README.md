<div align="center">

<img src="https://img.shields.io/badge/USICT-PULSE-3a60ff?style=for-the-badge&labelColor=141852" alt="USICT PULSE" />

# USICT PULSE

### The pulse of USICT — discover, connect, grow.

A premium, AI-powered college intelligence platform built exclusively for students of **USICT, GGSIPU, New Delhi**. Find opportunities, connect with seniors and alumni, review teachers, share resources, and ask anything — all in one place.

[![Next.js](https://img.shields.io/badge/Next.js-15.5-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61dafb?style=flat-square&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178c6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind](https://img.shields.io/badge/Tailwind-3.4-06b6d4?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)
[![Prisma](https://img.shields.io/badge/Prisma-5.22-2d3748?style=flat-square&logo=prisma)](https://www.prisma.io/)
[![Supabase](https://img.shields.io/badge/Supabase-Postgres-3ecf8e?style=flat-square&logo=supabase)](https://supabase.com/)
[![Gemini](https://img.shields.io/badge/Gemini-2.5_Flash-4285f4?style=flat-square&logo=google)](https://ai.google.dev/)

[Live Demo](https://usict-pulse.vercel.app) · [Report Bug](https://github.com/vishesh1111/USICT_Pulse/issues) · [Request Feature](https://github.com/vishesh1111/USICT_Pulse/issues)

</div>

---

## Overview

USICT PULSE is the all-in-one student intelligence platform tailored for USICT, GGSIPU. Whether you're a junior looking for your first internship, a senior scaling your mentor profile, or just someone who wants honest reviews of professors before semester registration — PULSE has it covered. Built with a cinematic glassmorphism UI in both dark and light modes, an AI assistant powered by Google Gemini, and a real database backing every interaction.

## Highlights

- **AI Assistant powered by Gemini 2.5 Flash** — answers from a live RAG context combining your DB, opportunities, and resources.
- **Stunning UI** — frosted-glass navbar, animated active pill, scroll-reveal motion, particle ambience, light + dark mode parity.
- **Two onboarding flows** — separate experiences for juniors (1st/2nd year) and seniors (3rd/4th year), each tailored to their goals.
- **Real-time leaderboard** — seniors ranked by helpfulness, with top-3 podium glow effects.
- **Mobile-first** — slide-in drawer, bottom-sheet inputs, responsive grid down to 360px.
- **Production-ready** — deployed on Vercel with Supabase Postgres + Prisma, type-safe end to end.

## Features

### Core Modules

| Module | What it does |
|--------|--------------|
| **Dashboard** | Personalized home with welcome card, stats, featured opportunities, closing deadlines, application tracker, and recommended mentors. |
| **Opportunities** | Browse curated internships, scholarships, club inductions, and local events. Filter by branch, type, and status. |
| **Ask** | Anonymous Q&A platform. Post questions, vote helpful answers, get responses from seniors and alumni. |
| **Connect** | Find mentors from your branch and year. Direct connect with one click. |
| **Alumni** | Discover where USICT graduates work, their journey, and reach out via LinkedIn. |
| **Teachers** | Honest faculty reviews — difficulty, marking trends, subjects taught, student ratings. |
| **Resources** | Subject-wise notes, videos, GitHub repos, cheatsheets — recommended by toppers. Upload your own files too. |
| **Leaderboard** | Top seniors ranked by mentor score (helpful answers + activity). Podium for top 3. |
| **Notifications** | Personalized alerts for deadlines, mentor replies, and new opportunities. |
| **Profile** | Editable bio, social links (GitHub, LinkedIn), achievements, and credibility score. |

### AI Chatbot (PULSE Assistant)

A floating chat widget available on every page. The assistant is RAG-powered — it pulls live context from:
- Recent Q&A from the database
- All current opportunities (with eligibility, deadlines, apply links)
- Curated learning resources

It also knows your profile (branch, year, interests) and personalizes responses accordingly. Streams responses in markdown for clean formatting.

### UI / UX Polish

- **Glassmorphism design** — frosted blur, soft indigo-tinted shadows, cool-white light mode and deep navy dark mode.
- **Animated navbar** — floating pill bar with shadow-on-scroll, sliding active indicator (Framer Motion `layoutId`), grouped "More" dropdown with icons.
- **Scroll-reveal animations** — `FadeIn`, `StaggerContainer`, `AnimatedCounter`, `FloatingParticles`, `GlowPulse` primitives.
- **Hover states everywhere** — colored glows per accent (purple for Q&A, orange for alumni, amber for deadlines), scale + lift on cards.
- **Mobile drawer** — spring-physics slide-in with staggered link entrance.
- **Splash screen** — animated logo with pulse rings + floating particles on first visit.

## Tech Stack

### Frontend

- **[Next.js 15.5](https://nextjs.org/)** — App Router, Server Components, streaming
- **[React 19](https://react.dev/)** — latest concurrent features
- **[TypeScript](https://www.typescriptlang.org/)** — fully typed end to end
- **[Tailwind CSS 3.4](https://tailwindcss.com/)** with custom design tokens (pulse blue palette, glassmorphism utilities)
- **[shadcn/ui](https://ui.shadcn.com/)** — Radix primitives styled with Tailwind
- **[Framer Motion 11](https://www.framer.com/motion/)** — page transitions, hover physics, scroll reveals
- **[Lucide Icons](https://lucide.dev/)** — consistent icon set
- **[next-themes](https://github.com/pacocoursey/next-themes)** — dark/light mode with system preference

### Backend / Data

- **[Prisma 5.22](https://www.prisma.io/)** — type-safe ORM
- **[Supabase Postgres](https://supabase.com/)** — managed Postgres with connection pooling
- **Next.js Route Handlers** — `/api/chat`, `/api/questions`, `/api/users`

### AI

- **[Google Gemini 2.5 Flash](https://ai.google.dev/)** via `@ai-sdk/google`
- **[Vercel AI SDK](https://sdk.vercel.ai/)** — streaming responses with `streamText`

### Forms & State

- **[React Hook Form](https://react-hook-form.com/)** + **[Zod](https://zod.dev/)** — typed validation
- **[Zustand](https://zustand-demo.pmnd.rs/)** — lightweight global state (user profile)
- **[Sonner](https://sonner.emilkowal.ski/)** — toast notifications

### Other

- **[EmailJS](https://www.emailjs.com/)** — welcome emails on signup
- **[Recharts](https://recharts.org/)** — leaderboard score visualizations
- **[react-markdown](https://github.com/remarkjs/react-markdown)** — chatbot response rendering

## Getting Started

### Prerequisites

- Node.js **18.17+**
- npm / pnpm / yarn
- A Supabase project (free tier works)
- A Google AI Studio API key ([get one here](https://aistudio.google.com/apikey))
- (Optional) An EmailJS account for welcome emails

### 1. Clone the repo

```bash
git clone https://github.com/vishesh1111/USICT_Pulse.git
cd USICT_Pulse
```

### 2. Install dependencies

```bash
npm install --legacy-peer-deps
```

> The `--legacy-peer-deps` flag is needed because of React 19 RC peer dependency mismatches with some libs. The project's `.npmrc` handles this automatically.

### 3. Configure environment variables

Copy the example file:

```bash
cp .env.example .env.local
```

Fill in `.env.local`:

```dotenv
# Supabase Postgres (connection pooling — for runtime)
DATABASE_URL="postgresql://postgres:[PASSWORD]@[HOST]:6543/postgres?pgbouncer=true"

# Direct connection (for migrations)
DIRECT_URL="postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres"

# Gemini API (server-side, NOT NEXT_PUBLIC)
GOOGLE_GENERATIVE_AI_API_KEY="your-gemini-api-key"

# EmailJS (optional — for welcome emails)
NEXT_PUBLIC_EMAILJS_SERVICE_ID=""
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=""
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=""
```

### 4. Set up the database

Push the Prisma schema to your Supabase database:

```bash
npm run db:push
```

(Optional) Seed sample data:

```bash
npm run db:seed
```

### 5. Run the dev server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) — the app will auto-redirect to `/onboarding` on first visit.

## Project Scripts

| Command | What it does |
|---------|--------------|
| `npm run dev` | Start the Next.js dev server with hot reload |
| `npm run build` | Generate Prisma client + production build |
| `npm run start` | Run the production build locally |
| `npm run lint` | Run ESLint with Next.js rules |
| `npm run db:push` | Sync Prisma schema to your Supabase DB |
| `npm run db:seed` | Insert sample data (questions, users, etc.) |
| `npm run db:studio` | Open Prisma Studio (visual DB editor) |

## Project Structure

```
USICT_Pulse/
├── prisma/
│   └── schema.prisma           # DB schema (User, Question, Answer, Resource, Branch enum)
├── public/                     # Static assets
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/
│   │   │   ├── chat/           # Gemini-powered RAG chatbot
│   │   │   ├── questions/      # CRUD for Q&A
│   │   │   └── users/          # User + leaderboard endpoints
│   │   ├── about/
│   │   ├── alumni/
│   │   ├── ask/
│   │   ├── connect/
│   │   ├── dashboard/
│   │   ├── leaderboard/
│   │   ├── notifications/
│   │   ├── onboarding/         # Junior + Senior flows
│   │   ├── opportunities/
│   │   ├── profile/
│   │   ├── resources/
│   │   ├── teachers/
│   │   ├── globals.css         # Theme tokens + custom utilities
│   │   ├── layout.tsx
│   │   └── page.tsx            # Landing
│   ├── components/
│   │   ├── ui/                 # shadcn primitives (Button, Card, Badge, etc.)
│   │   ├── ask/                # Question/answer modals
│   │   ├── notifications/
│   │   ├── resources/
│   │   ├── teachers/
│   │   ├── chat-widget.tsx     # Floating AI assistant
│   │   ├── motion-primitives.tsx  # FadeIn, Stagger, Counter, Particles
│   │   ├── site-header.tsx     # Glass navbar + mobile drawer
│   │   ├── site-footer.tsx
│   │   ├── splash.tsx
│   │   └── ...
│   └── lib/
│       ├── constants.ts        # Branches, nav links, app metadata
│       ├── mock/               # Static seed data (opportunities, alumni, teachers, resources)
│       ├── prisma.ts           # Prisma client singleton
│       ├── user-store.ts       # Zustand profile store
│       └── utils.ts            # cn(), getInitials(), timeAgo(), etc.
├── tailwind.config.ts          # Pulse palette + custom keyframes
├── next.config.mjs
└── package.json
```

## Deployment

This project is optimized for **Vercel**. To deploy:

1. Push to GitHub
2. Import the repo at [vercel.com/new](https://vercel.com/new)
3. Add the environment variables (same as `.env.local`)
4. Deploy

The build command (`prisma generate && next build`) is already set in `package.json`. The `.npmrc` handles peer-dep conflicts. No extra config needed.

> **Note:** The chat API route uses `maxDuration = 60`, which requires Vercel **Pro** plan. On Hobby plan, change it to `10` in `src/app/api/chat/route.ts`.

## Roadmap

- [ ] Real-time chat between mentor and mentee (Supabase Realtime)
- [ ] OAuth login (Google + GitHub)
- [ ] Push notifications for deadlines (Web Push API)
- [ ] Calendar export for opportunities (.ics)
- [ ] Resource voting + comments
- [ ] Anonymous teacher reviews moderation queue
- [ ] Branch-specific channels in Connect
- [ ] AI resume reviewer (upload PDF, get feedback)

## Contributing

Contributions are welcome — this is a community-driven project for USICT students.

1. Fork the repo
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

Please follow the existing code style (run `npm run lint` before pushing).

## License

Built by students, for students. Free to use and adapt for your own college community.

## Acknowledgments

- The faculty and students of **USICT, GGSIPU** for the inspiration
- [shadcn/ui](https://ui.shadcn.com/) for the component foundation
- [Vercel](https://vercel.com/) for hosting and the AI SDK
- [Google AI Studio](https://aistudio.google.com/) for Gemini access
- [Supabase](https://supabase.com/) for the free Postgres tier

---

<div align="center">

**Made with ❤️ at USICT**

[⬆ Back to top](#usict-pulse)

</div>
