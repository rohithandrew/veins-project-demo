# Vijaya Electronics — AI Inventory Management System

A prototype dashboard for manufacturing supply-chain operations at Vijaya Electronics — purchase orders, production, inventory, and suppliers — built as a single-page Next.js app with an in-browser "AI assistant" that progressively builds out the UI as you chat with it.

## Concept

The app starts nearly empty, with only the **Assistant** page unlocked. Chatting with the assistant (e.g. *"Build me a dashboard"*, *"Add an inventory management page"*, *"Add a supplier insights widget"*) simulates it generating that page or dashboard widget and unlocking it in the sidebar. The assistant's responses are rule-based pattern matching over the chat text (see [lib/assistant.ts](lib/assistant.ts)) rather than a call to an LLM — there is no backend or API key required.

## Features

- **Dashboard** — KPIs and configurable widgets (supplier insights, delivery timeline, pending requests, PO status breakdown, critical materials)
- **PO Upload & Processing** — parse purchase orders into kits and bills of materials
- **Production** — track kits through production, raise stock requests for materials
- **Inventory Management** — stock levels, inward/outward records, low-stock alerts
- **Supplier Dashboard** — supplier contact details, ratings, and open supply requests
- **Low Stock** — a custom page (unlockable via the assistant) listing materials at or below their reorder point
- **Assistant** — chat interface that unlocks pages/widgets and answers questions about stock, POs, and suppliers

All state is seeded from [lib/seed-data.ts](lib/seed-data.ts) and held in-memory via a React context/reducer store ([lib/store.tsx](lib/store.tsx)) — there is no database or persistence layer.

## Tech stack

- [Next.js](https://nextjs.org) 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS 4

## Getting Started

Install dependencies and run the development server:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the result. The app is a single route (`app/page.tsx`); navigation between pages is handled client-side, not via Next.js routing.

## Scripts

- `npm run dev` — start the dev server
- `npm run build` — production build
- `npm run start` — run the production build
- `npm run lint` — run ESLint

## Project structure

```
app/            # Next.js App Router entry (layout, single page, global styles)
components/     # UI components: pages (Dashboard, Inventory, Production, ...), widgets, shell (Sidebar/Topbar), assistant chat
lib/            # Domain types, seed data, the store (state/reducer), and the assistant's reply logic
```
