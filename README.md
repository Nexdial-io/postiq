<div align="center">

<h1>
  <img src="public/favicon.ico" width="32" height="32" alt="PostIQ logo" />
  &nbsp;PostIQ
</h1>

<p><strong>AI-Powered Creator Intelligence Platform for LinkedIn</strong></p>

<p>
  <a href="https://postiq.nexdial.io"><strong>🌐 Live Demo</strong></a> &nbsp;·&nbsp;
  <a href="#-getting-started"><strong>Quick Start</strong></a> &nbsp;·&nbsp;
  <a href="#-project-structure"><strong>Architecture</strong></a> &nbsp;·&nbsp;
  <a href="#-features"><strong>Features</strong></a>
</p>

<p>
  <img src="https://img.shields.io/badge/Next.js-16.2-black?logo=next.js&logoColor=white" alt="Next.js" />
  <img src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/License-MIT-green" alt="MIT License" />
</p>

</div>

---

## 📖 Overview

**PostIQ** is an independent, full-stack creator intelligence web application designed to help professionals structure and refine their drafts using AI-driven simulated analytics. It provides estimated post scoring, simulated profile intelligence, hook generation, hashtag analysis, competitor auditing, content calendar planning, and simulated trend discovery — all wrapped in a premium UI with full dark/light mode support.

> ⚠️ **Trademark & Advisory Disclaimer:** PostIQ is an independent advisory tool and is **not affiliated with, endorsed by, or officially connected to LinkedIn Corporation or Microsoft** in any way. "LinkedIn" is a registered trademark of LinkedIn Corporation. All scores, metrics (including virality scores, recruiter appeal index, simulated SSI, and engagement estimates), and suggestions are advisory simulations and estimates. They do not guarantee actual performance, reach, or profile outcomes on LinkedIn.

---

## ✨ Features

| Module | Description |
|---|---|
| 🏠 **Dashboard** | Live feed composer with simulated AI scoring, profile preview, trending topics, and creator metrics |
| 🤖 **AI Post Analyzer** | Real-time estimated post virality score with analytical breakdown (hook, readability, emotional tone, formatting) |
| 👤 **Profile Intelligence** | Simulated ATS compatibility score, estimated SSI simulator, headline optimizer, and simulated recruiter visibility index |
| ✍️ **Hook & Rewrite Studio** | AI hook generator with style presets, readability scoring, and rewrite suggestions |
| #️⃣ **Hashtag Intelligence** | Tag frequency analysis, simulated relevance scoring, cluster grouping |
| 📅 **Content Calendar** | Visual post scheduling heatmap with estimated optimal timing suggestions |
| 👥 **Competitor Intel** | Profile comparison simulation, engagement benchmarking, and strategy analysis |
| 📈 **Trends Discovery** | Topic trend monitoring simulation with opportunity signals |
| 📊 **Analytics & Reports** | Simulated historical performance charts, growth trajectory, and engagement tracking |
| 💳 **Billing & Plans** | Subscription management UI with plan comparison and payment history |
| ⚙️ **Settings** | Profile configuration, notification preferences, API key management |

### Public Pages
`/` Home · `/features` · `/pricing` · `/about` · `/blog` · `/docs` · `/help` · `/changelog` · `/contact` · `/privacy` · `/terms` · `/login` · `/register`

---

## 🛠 Tech Stack

### Frontend
| Technology | Version | Role |
|---|---|---|
| [Next.js](https://nextjs.org) | 16.2 | App Router, SSR, file-based routing |
| [React](https://react.dev) | 19 | UI component library |
| [TypeScript](https://www.typescriptlang.org) | 5 | Type safety across the entire codebase |
| [Tailwind CSS](https://tailwindcss.com) | 4 | Utility-first styling with custom design tokens |
| [Lucide React](https://lucide.dev) | 1.21 | Icon library (500+ SVG icons) |
| [Recharts](https://recharts.org) | 3 | Composable charting for analytics views |
| [Framer Motion](https://www.framer.com/motion/) | 12 | Micro-animations and transitions |
| [canvas-confetti](https://github.com/catdad/canvas-confetti) | 1.9 | Confetti celebration on high-score posts |

### Architecture & Patterns
- **App Router** — Next.js 13+ App Router with server and client components
- **Client Layout** — Single `ClientLayout.tsx` wrapper handling auth state, theme toggling, navigation, and notifications
- **Mock Database** — `src/lib/mockDb.ts` — localStorage-backed in-memory data layer simulating a real backend
- **Scoring Engine** — `src/lib/scoringEngine.ts` — deterministic AI post scoring algorithm (hook strength, readability, emotional resonance, formatting, CTA analysis)
- **Theme System** — CSS custom properties + `.dark` class toggling, persisted to `localStorage`
- **Design Tokens** — Custom Tailwind `@theme` with LinkedIn-matched color palette

### Design System
```
Brand Colors:
  --brand-purple:   #0a66c2   (LinkedIn Blue — primary actions)
  --brand-indigo:   #004182   (Dark LinkedIn Blue — hover/accents)
  --brand-emerald:  #059669   (Success / growth indicators)
  --brand-amber:    #c37d16   (Premium / gold elements)
  
Metric Blue:        #71B7FB   (Post impressions, scores, KPI numbers)

Light Mode BG:      #f3f2ef   (LinkedIn feed gray)
Dark Mode BG:       #1b1f23   (Dark feed)
```

---

## 📁 Project Structure

```
frontend-nextjs/
├── public/                     # Static assets (favicon, images)
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── layout.tsx          # Root layout + global SEO metadata
│   │   ├── page.tsx            # Public landing page (/)
│   │   ├── globals.css         # Global styles, CSS tokens, theme variables
│   │   │
│   │   ├── dashboard/          # Main authenticated dashboard
│   │   ├── analyzer/           # AI Post Scorer
│   │   ├── profile-intelligence/  # Profile audit & ATS scoring
│   │   ├── hooks/              # Hook & Rewrite Studio
│   │   ├── hashtags/           # Hashtag Intelligence
│   │   ├── calendar/           # Content Calendar
│   │   ├── competitors/        # Competitor Intel
│   │   ├── trends/             # Trends Discovery
│   │   ├── analytics/          # Analytics & Reports
│   │   ├── billing/            # Billing & Plans
│   │   ├── settings/           # Account Settings
│   │   │
│   │   ├── login/              # Authentication pages
│   │   ├── register/
│   │   ├── forgot-password/
│   │   │
│   │   ├── about/              # Public informational pages
│   │   ├── features/
│   │   ├── pricing/
│   │   ├── blog/
│   │   ├── docs/
│   │   ├── help/
│   │   ├── contact/
│   │   ├── changelog/
│   │   ├── privacy/
│   │   └── terms/
│   │
│   ├── components/
│   │   └── ClientLayout.tsx    # Master layout: header, footer, sidebar nav, modals
│   │
│   └── lib/
│       ├── mockDb.ts           # In-memory data layer (profiles, analyses, subscriptions)
│       └── scoringEngine.ts    # AI post scoring algorithm & analytics engine
│
├── next.config.ts
├── tailwind.config.ts          # Custom design tokens + Tailwind v4 config
├── tsconfig.json
└── package.json
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** `>= 18.17.0`
- **npm** `>= 9` (or yarn / pnpm)

### 1. Clone the repository

```bash
git clone https://github.com/Nexdial-io/postiq.git
cd postiq
```

### 2. Install dependencies

```bash
npm install
```

### 3. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

> The dev server uses **Turbopack** by default for fast hot module replacement.

### 4. Build for production

```bash
npm run build
npm run start
```

---

## 🧠 How the Scoring Engine Works

`src/lib/scoringEngine.ts` implements a deterministic, heuristic-based advisory content quality algorithm to estimate draft performance:

```
Estimated Post Score = weighted average of:
  ├── Hook Strength       (25%) — First 10 words analyzed for curiosity, specificity, bold claim
  ├── Readability         (20%) — Sentence length, line breaks, avg word length
  ├── Emotional Resonance (20%) — Sentiment keywords, storytelling markers, vulnerability signals
  ├── Formatting          (15%) — Use of spacing, bullets, emojis, structure
  ├── CTA Quality         (10%) — Presence and quality of call-to-action
  ├── Hashtag Usage       (5%)  — Count (optimal: 3–5), relevance markers
  └── Trend Alignment     (5%)  — Topic freshness keywords
```

Heuristic scores range from 0–100. Drafts scoring **85+** trigger a confetti celebration animation in the UI. Note that these heuristic scores are for advisory/educational purposes only and do not connect to actual LinkedIn algorithms.

---

## 🌐 Deployment

### Deploy to Cloud Run (Google Cloud)

This project is pre-configured for containerized deployment.

```bash
# Build Docker image
docker build -t postiq .

# Deploy to Cloud Run
gcloud run deploy postiq \
  --image gcr.io/YOUR_PROJECT/postiq \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
```

### Deploy to Vercel (Recommended for Next.js)

```bash
npm i -g vercel
vercel --prod
```

Then set your custom domain to `postiq.nexdial.io` in the Vercel dashboard.

### Environment Variables

Create a `.env.local` file for local development:

```env
# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=PostIQ

# Future: API / AI integrations
# OPENAI_API_KEY=sk-...
# LINKEDIN_CLIENT_ID=...
# LINKEDIN_CLIENT_SECRET=...
# DATABASE_URL=postgresql://...
```

---

## 🗺 Roadmap

- [ ] **LinkedIn OAuth** — Real authentication via LinkedIn API
- [ ] **Live Data** — Real post impressions, profile views via LinkedIn API
- [ ] **OpenAI Integration** — GPT-4o powered hook generation & rewriting
- [ ] **PostgreSQL Backend** — Replace mock DB with real Prisma + Postgres layer
- [ ] **Email Notifications** — Weekly creator report digest
- [ ] **Mobile App** — React Native companion app
- [ ] **Browser Extension** — Score posts directly on LinkedIn.com
- [ ] **Team Workspaces** — Multi-user collaboration on content strategy

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

```bash
# 1. Fork https://github.com/Nexdial-io/postiq and clone your fork
git clone https://github.com/YOUR_USERNAME/postiq.git
git checkout -b feature/your-feature-name

# 2. Make your changes with proper commit messages
git commit -m "feat: add LinkedIn OAuth integration"

# 3. Push and open a Pull Request
git push origin feature/your-feature-name
```

### Commit Convention
This project uses [Conventional Commits](https://www.conventionalcommits.org/):
- `feat:` — new feature
- `fix:` — bug fix
- `chore:` — tooling, deps, configs
- `style:` — CSS/UI only changes
- `docs:` — documentation updates
- `refactor:` — code restructuring without behaviour change

---

## 📄 License

This project is licensed under the **MIT License** — see [LICENSE](LICENSE) for details.

---

## 👨‍💻 Built By

<div align="center">

Designed & built by **[Datta Sable](https://dattasable.com)**

[![Portfolio](https://img.shields.io/badge/Portfolio-dattasable.com-0a66c2?style=for-the-badge&logo=firefox&logoColor=white)](https://dattasable.com)

</div>

---

<div align="center">
  <sub>PostIQ is an independent tool and is not affiliated with, endorsed by, or sponsored by LinkedIn Corporation.</sub>
</div>
