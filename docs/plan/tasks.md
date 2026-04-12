# Implementation Plan Tasks

## Overview
This document represents an exhaustive phase-by-phase breakdown for building the portal. 

## Breakdown (100+ Tasks)

### Phase 1: Environment & Tooling Scaffold (Tasks 1-15)
- [ ] 01. Initialize Next.js 15 App Router.
- [ ] 02. Configure TypeScript strict mode.
- [ ] 03. Configure ES Lint and Prettier standard rules.
- [ ] 04. Setup `tailwind.config.ts` with 2026 color scheme.
- [ ] 05. Install GSAP & plugins (`@gsap/react`, ScrollTrigger).
- [ ] 06. Install Three.js and `@react-three/fiber` for 3D elements.
- [ ] 07. Install Firebase SDK JS.
- [ ] 08. Setup environment variables (`.env.example` -> `NEXT_PUBLIC_FIREBASE_API_KEY`, `GOOGLE_MAPS_KEY`, etc.)
- [ ] 09. Create `src/components`, `src/app`, `src/lib`, `src/hooks`, `src/styles`.
- [ ] 10. Implement foundational layout `layout.tsx` with Dark mode `#1f2121`.
- [ ] 11. Configure SVGR for SVG manipulation inside React components.
- [ ] 12. Create Next.js manifest structure for PWA configuration.
- [ ] 13. Initialize Jest/Vitest testing configuration.
- [ ] 14. Initialize Playwright environment for E2E tests.
- [ ] 15. Create Dockerfile (multi-stage build) and `docker-compose.yml`.

### Phase 2: Design System & Shared Components (Tasks 16-35)
- [ ] 16. Define global typography tokens (Inter/Space Grotesk) in `globals.css`.
- [ ] 17. Implement standard `GlassCard` layout component wrapper.
- [ ] 18. Build Bento Grid wrapper container component (`<BentoGrid>`).
- [ ] 19. Build Bento Layout sizing components (`<BentoItem wide>`, etc.).
- [ ] 20. Implement standard primary action button with GSAP hover hooks.
- [ ] 21. Implement secondary ghost button.
- [ ] 22. Implement magnetic button logic (`mousemove` tracking cursor).
- [ ] 23. Implement bottom navigation bar (sticky, hidden on scroll-down).
- [ ] 24. Create kinetic typography animated text component.
- [ ] 25. Build Notification Toast system (for queue alerts).
- [ ] 26. Create global Loading Spinner / SVG animation block.
- [ ] 27. Build Input field and Form wrap logic with validations.
- [ ] 28. Refine scrollbars (hidden or minimalist themed).
- [ ] 29. Implement 3D Tilt Card effect utility hook.
- [ ] 30. Create Gradient shifting background wrapper.
- [ ] 31. Build empty state components.
- [ ] 32. Build standard modal/dialog wrapper.
- [ ] 33. Create interactive user avatar component.
- [ ] 34. Develop utility context for theme switching (if applicable).
- [ ] 35. Audit baseline accessible contrast for all design tokens.

### Phase 3: Firebase Data Layer & Auth (Tasks 36-50)
- [ ] 36. Initialize Firebase App in `lib/firebase.ts`.
- [ ] 37. Setup Firebase Anonymous Auth provider.
- [ ] 38. Initialize Firestore module wrappers.
- [ ] 39. Initialize Realtime DB module wrappers.
- [ ] 40. Write interface `User` model.
- [ ] 41. Write interface `Venue` and `Stand` models.
- [ ] 42. Write interface `Order` model.
- [ ] 43. Create custom hook `useAuth()` to establish anonymous sessions.
- [ ] 44. Implement `useQueues()` hook to stream Realtime DB lengths.
- [ ] 45. Implement `usePresence()` generic hook for tracking user location.
- [ ] 46. Build Firestore query caching utility.
- [ ] 47. Create mock data seeder script for local testing.
- [ ] 48. Seed mock venue map and 10 concession stands.
- [ ] 49. Define Firebase Security rules logic plan.
- [ ] 50. Write unit tests for data transformers.

### Phase 4: Google Maps Indoor Navigation (Tasks 51-65)
- [ ] 51. Integrate `@googlemaps/react-wrapper`.
- [ ] 52. Create `VenueMap` component canvas.
- [ ] 53. Setup Indoor Maps property initialization.
- [ ] 54. Implement user Geolocation browser API extraction.
- [ ] 55. Draw user location marker ("Blue Dot") on map.
- [ ] 56. Poll geolocation data and throttle updates.
- [ ] 57. Render concession markers dynamically onto the maps layer.
- [ ] 58. Create custom SVG infowindows for Google Maps markers.
- [ ] 59. Implement basic A* or Directions API call for drawing paths.
- [ ] 60. Write hook `useRoutePolylines(origin, dest)`.
- [ ] 61. Filter and toggle points of interest by category (Food, Merch).
- [ ] 62. Style Google map (Dark mode JSON configuration ingestion).
- [ ] 63. Connect "Find My Crew" presence logic to render remote avatars.
- [ ] 64. Build map zoom and recenter controls.
- [ ] 65. Address memory leak potential in map unmounting.

### Phase 5: Concessions & Queue Management Core (Tasks 66-80)
- [ ] 66. Create Main Dashboard page mapping to Bento blocks.
- [ ] 67. Embed Queue Time predictive widgets.
- [ ] 68. Create single Concession Menu View.
- [ ] 69. Implement Shopping Cart context provider.
- [ ] 70. Build list component for menu items.
- [ ] 71. Build Add/Remove to Cart floating controls.
- [ ] 72. Create checkout confirmation dialogue.
- [ ] 73. Connect checkout to Firestore `orders` table.
- [ ] 74. Hook incoming Realtime DB queue lengths to GSAP meter bars.
- [ ] 75. Create algorithm: predict wait time = items_in_queue * 45 seconds.
- [ ] 76. Setup "Predictive Slash Alert" toast notification trigger system.
- [ ] 77. Listen to global state and trigger toast on <2 min drop.
- [ ] 78. Design order history and QR code retrieval component.
- [ ] 79. Implement optimistic UI updates when clicking "Order".
- [ ] 80. Add micro-interaction to checkout success state (confetti/particles).

### Phase 6: Gemini Agent Assistant Integration (Tasks 81-95)
- [ ] 81. Initialize Vertex / Gemini official Node wrapper `lib/gemini.ts`.
- [ ] 82. Create floating AI action button on UI.
- [ ] 83. Develop AI Chat dialog slide-over panel.
- [ ] 84. Configure system prompt for domain (Venue expert).
- [ ] 85. Define JSON Schema for Gemini Function calling capabilities.
- [ ] 86. Create function execution map (`orderFood`, `navigate`).
- [ ] 87. Implement streaming response hook from API.
- [ ] 88. Build dynamic SVG thinking/generating state animation (Gemini 3.1 Pro style).
- [ ] 89. Parse Markdown/results from AI properly on UI.
- [ ] 90. Hook `navigate` function call to update the Map store state.
- [ ] 91. Hook `orderFood` function call to populate checkout cart.
- [ ] 92. Add contextual memory logic (feeding user's last 5 events into prompt).
- [ ] 93. Error handling: provide graceful fallback if AI times out.
- [ ] 94. Validate latency on AI generation.
- [ ] 95. Write unit test for the function extraction parser.

### Phase 7: Optimization & Final Polish (Tasks 96-105)
- [ ] 96. Implement Three.js background "Particle System" on auth/landing view.
- [ ] 97. Analyze Web Vitals (Lighthouse check).
- [ ] 98. Implement code splitting for Three.js and Google Maps heavy chunks.
- [ ] 99. Finalize and review Dockerfile build process.
- [ ] 100. Write full `MANUAL_TODO.md` file for project handover.
- [ ] 101. Write `README.md` and `HACKATHON.md`.
- [ ] 102. Validate WCAG color contrasts across entire portal.
- [ ] 103. Test cross-browser compatibility (Chrome, Safari iOS).
- [ ] 104. Set up Nginx bypass / Traefik labels in `docker-compose.yml` if needed.
- [ ] 105. Perform local synthetic load test using `k6` script.
