# GenAI Platform Console

A governed execution & inspection console for GenAI platform orchestration.

## Architecture

This frontend enforces a **strict presentation boundary**:

| ✅ Allowed | ❌ Disallowed |
|-----------|---------------|
| Capture execution requests | Call LLMs directly |
| Send to `/v1/orchestrate` | Reference model providers |
| Render results, logs, traces | Routing/policy/cost logic |
| UI-only state management | Memory management |

All intelligence lives in backend services (agents, policy, memory, cost, enforcement).

## Project Structure

```
components/
├── Header.tsx
├── Footer.tsx
├── RequestSection.tsx
├── ResponseSection.tsx
├── HistoryView.tsx
├── InspectionPanel.tsx
└── RawLogsView.tsx
services/
└── executionApi.ts      # Thin HTTP client ONLY
types.ts                 # UI view models
App.tsx
index.tsx
```

## Run Locally

**Prerequisites:** Node.js

```bash
# Install dependencies
npm install

# Start dev server
npm run dev
```

The app runs at `http://localhost:3000`.

## Configuration

Set the API base URL via environment variable:

```bash
VITE_API_BASE=http://localhost:8000
```

Defaults to `http://localhost:8000` if not set.

## Build

```bash
npm run build
```

Output in `dist/`.
