# Design Document: Hyper-Personalized Stadium Portal

## Overview
A hyper-performant, mobile-first web portal for in-venue attendees. The architecture balances visually intensive front-end experiences (3D, GSAP, SVGs) with a lean, serverless data layer designed to sustain localized traffic spikes (e.g. 100,000 requests during a 15-minute halftime).

## Architecture

### System Components
```
[ Mobile Frontend (Next.js 15) ]
       │            │
       ▼            ▼
[  Gemini AI ]  [ Google Maps ]
    (Agent)     (Indoor Routing)
       │            │
       ▼            ▼
[ Firebase Realtime  & Firestore ]
(Live Queue Data)  (Order & User State)
```

### Technology Stack
- **Frontend**: Next.js 15 (App Router for optimized SSR/SSG), Tailwind CSS (Theming & layouts), GSAP (Scroll triggers, robust transitions), Three.js (For AR & immersive layers). Focus on Bento Grid configurations and Dark Mode Glassmorphism.
- **Backend/Database**: Firebase Suite. We use Firestore for static structures (Menus, Venue structure) and Realtime DB for high-frequency updates (Queue lengths, Location).
- **AI**: Gemini 1.5 Flash via Vertex AI / Google AI Studio for function calling and logic parsing.

## Components and Interfaces

### 1. Spatial Navigation Module
**Responsibilities:**
- Renders Google Indoor Maps.
- Overlays personalized routes routing around crowd hotspots.

**Interface:**
```typescript
interface VenueService {
  getIndoorMap(venueId: string): Promise<MapConfig>;
  calculateHeatmapRoute(origin: Coordinates, destination: Coordinates): Promise<Path>;
}
```

### 2. Live Queue & Telemetry Service
**Responsibilities:**
- Synchronize sub-second queue status from concessions.
- Push predictive notifications down to React components.

**Interface:**
```typescript
interface QueueTelemetry {
  standId: string;
  waitDurationSec: number;
  velocity: number; // people per minute
}
```

### 3. Agentic Assistant (Gemini)
**Responsibilities:**
- Parse natural language requests ("Where's the closest beer?", "Order a hotdog").
- Call relevant React-level functions via Gemini Function Calling.

**Interface:**
```typescript
interface CognitiveService {
  processPrompt(prompt: string, context: UserContext): Promise<AgentResponse>;
  executeFunction(functionName: string, args: Record<string, any>): void;
}
```

## UI/UX Design System (2026 Standards)
Following `Next Level Website Designer`:
- **Typography:** Inter for body, Space Grotesk for Headings (using Modular Perfect Fifth scale).
- **Colors:** Deep Slate/Charcoal Backgrounds (#1f2121) with vibrant accents (Teal #32b8c6) and Glassmorphism surfaces.
- **Layouts:** Heavy utilization of 6-column Bento Grid for the primary dashboard.

## Database Schema (Firebase)

**Firestore Collections:**
- `venues/` -> Structure: { name, indoorMapId, stands[] }
- `users/` -> Structure: { uid, activeCrewId, preferences }
- `orders/` -> Structure: { orderId, uid, standId, items, status, timestamp }

**Realtime DB Nodes:**
- `/telemetry/stands/{standId}` -> { queueLength, estimatedWait }
- `/presence/crews/{crewId}/{uid}` -> { lat, lng, timestamp }
