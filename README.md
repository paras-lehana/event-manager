# StadiumFlow 🏟️

**A hyper-personalized, real-time stadium experience portal that eliminates wait times, coordinates crews, and brings AI-powered concierge assistance to 100,000-seat venues.**

## Problem

Attending major sporting events today means:
- 🕐 Spending 15-25 minutes per trip to concessions during halftime
- 🗺️ Getting lost in multi-level concourses
- ❌ No real-time visibility into queue lengths
- 📱 No coordination tools for groups attending together
- 🤷 No intelligent assistance for first-time visitors

**StadiumFlow solves all of this.**

## Solution

A mobile-first web portal that transforms the physical venue experience through:

### Core Features
| Feature | Description | Google Service |
|---------|-------------|----------------|
| 🗺️ **Stadium Map** | Interactive canvas map with concession, restroom, and merch markers with live queue overlays | Google Maps JS API |
| ⚡ **Predictive Slash Alerts** | Auto-notifications when wait times drop below thresholds | Firebase Realtime DB |
| 🍔 **Frictionless Ordering** | Skip-the-line mobile ordering with optimistic UI and QR-code pickup | Firebase Firestore |
| 👥 **Find My Crew** | Real-time location sharing with friends on the venue map | Firebase Presence |
| ✨ **Gemini Concierge** | AI assistant that navigates, orders food, and answers questions via function calling | Gemini 1.5 Flash |
| 📊 **Live Queue Dashboard** | Color-coded, animated wait times for every concession and restroom | Firebase Realtime DB |

## Tech Stack

- **Frontend**: Next.js 15 (App Router), TypeScript, Tailwind CSS
- **Animations**: GSAP, Framer Motion, Three.js
- **Backend**: Firebase (Firestore + Realtime Database + Auth)
- **AI**: Gemini 1.5 Flash with Function Calling
- **Maps**: Google Maps JavaScript API
- **Deployment**: Docker (multi-stage build, standalone output)

## Quick Start

### Development
```bash
npm install
npm run dev
# Open http://localhost:3000
```

### Docker
```bash
docker-compose up --build -d
# Open http://localhost:3000
```

### Environment Variables
Copy `.env.example` to `.env` and fill in your keys. The app runs in full demo mode without any keys.

## Architecture

```
┌─────────────────────────────────────────┐
│          Next.js 15 Frontend            │
│  (Bento Grid · Glassmorphism · GSAP)    │
├──────────┬──────────┬───────────────────┤
│ Firebase │ Google   │ Gemini AI         │
│ RTDB     │ Maps JS  │ Function Calling  │
│ Firestore│ Indoor   │                   │
│ Auth     │ Routing  │                   │
└──────────┴──────────┴───────────────────┘
```

## Project Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout with SEO metadata
│   ├── providers.tsx       # All context providers composed
│   ├── page.tsx            # Dashboard (Bento Grid homepage)
│   ├── map/page.tsx        # Interactive venue map
│   ├── order/page.tsx      # Concession stand browser & ordering
│   ├── crew/page.tsx       # Find My Crew location sharing
│   └── orders/page.tsx     # Order tracking & QR pickup
├── components/
│   ├── layout/
│   │   └── BottomNav.tsx   # Mobile navigation bar
│   └── ui/
│       ├── GlassCard.tsx       # Glassmorphism card component
│       ├── VenueMap.tsx        # Canvas-based stadium map
│       ├── QueueDashboard.tsx  # Live queue trackers
│       ├── StandMenu.tsx       # Concession menu + cart
│       ├── AIChatPanel.tsx     # Gemini AI slide-over chat
│       └── ToastContainer.tsx  # Notification toasts
├── lib/
│   ├── firebase.ts         # Firebase initialization (lazy singleton)
│   ├── gemini.ts           # Gemini AI + Function Calling + local fallback
│   ├── mock-data.ts        # Full mock: venue, stands, menus, queues
│   ├── providers.tsx       # React contexts (Queue, Cart, Orders, Crew, Toast, Venue)
│   └── types.ts            # All TypeScript interfaces
├── Dockerfile              # Multi-stage production build
├── docker-compose.yml      # Container orchestration
└── MANUAL_TODO.md          # API key setup instructions
```

## Accessibility

- WCAG 2.2 Level AA compliance targets
- 44px minimum touch targets for mobile use
- High contrast color scheme (4.5:1+ ratios)
- Keyboard-navigable interface
- Semantic HTML5 structure

## Code Quality

- TypeScript strict mode
- ESLint with Next.js recommended config
- Clean separation of concerns (providers, components, lib)
- No hardcoded secrets (all via environment variables)
- `.env.example` with placeholder values

## Testing Strategy

See [`docs/plan/tests.md`](docs/plan/tests.md) for full testing strategy including:
- K6 load testing for 20,000 concurrent users
- Vitest unit tests for queue estimation and AI parsing
- Playwright E2E tests for ordering flow
- axe-core accessibility auditing

## License

MIT
