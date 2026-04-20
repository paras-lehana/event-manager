# StadiumFlow (Event Manager) v1.0 🏟️

**A hyper-personalized, real-time stadium experience portal. Publicly hosted at [eventops.lehana.in](https://eventops.lehana.in).**

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
## 📁 File Index

### 📄 Documentation Files
| File | Purpose | When to Read |
|------|---------|--------------|
| `README.md` | **START HERE** - Project overview | First stop for understanding |
| `CHANGELOG.md` | Version history | Check for updates/fixes |
| `HACKATHON.md` | Hackathon-specific context | Original project goals |
| `MANUAL_TODO.md` | API key setup instructions | When configuring production keys |

### 💻 Application Code (src/)
| File/Dir | Purpose | Key Components |
|----------|---------|----------------|
| `src/app/` | App Router pages | `page.tsx` (Dashboard), `map/`, `order/` |
| `src/components/` | Reusable UI components | `GlassCard.tsx`, `VenueMap.tsx` |
| `src/lib/` | Core logic and utilities | `firebase.ts`, `gemini.ts`, `mock-data.ts` |
| `src/lib/providers.tsx` | State management | Queue, Cart, Orders contexts |

### ⚙️ Configuration & DevOps
| File | Purpose | What It Configures |
|------|---------|-------------------|
| `docker-compose.yml` | Container orchestration | Deployment labels, networks |
| `Dockerfile` | Build instructions | Multi-stage production build |
| `version.js` | Version constant | Single source of truth for version |
| `package.json` | Dependencies | npm packages & scripts |

### 📂 Directories
| Directory | Purpose | Contents |
|-----------|---------|----------|
| `public/` | Static assets | Icons, images |
| `docs/` | Planning & testing docs | System design, test strategy |

## Deployment & Hosting

This application is hosted on the **Lehana.in Hybrid Cloud**:
- **Host Node**: `lehana-rig` (home lab)
- **Public Entry**: VPS (`eventops.lehana.in`) via Traefik forwarding
- **Docker Home**: `/root/docker/event-manager/`
- **Code Home**: `/root/code/frontend/event-manager/`

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
