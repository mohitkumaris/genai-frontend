# GenAI Frontend

Web-based user interface for the governed GenAI platform.

## Purpose

This is a **thin presentation layer** with no intelligence or decision authority.  
Frontend owns presentation only — not state, not memory, not policy.

## Architecture

```
src/
├── api/            # Orchestrator API client (POST /orchestrate only)
├── components/     # UI components (Header, Sidebar, MessageBubble, InputArea)
├── config/         # Environment-aware configuration
├── pages/          # Page components (ChatPage)
└── types/          # TypeScript type definitions
```

## Core Principles

| Rule | Enforcement |
|------|-------------|
| Frontend NEVER stores conversation memory | Messages are display-only |
| Frontend NEVER assembles context | Raw message sent to orchestrator |
| Frontend NEVER applies policy | No enforcement logic |
| Frontend ONLY talks to orchestrator | Single `POST /orchestrate` endpoint |
| session_id is opaque | Passed through unchanged |
| No silent retries | Explicit error display |
| No fallback logic | Errors shown as-is |

## API Contract

### Request
```json
{
  "session_id": "string",
  "message": "string"
}
```

### Response
```json
{
  "session_id": "string",
  "response": "string",
  "metadata": {
    "confidence": 0.95,
    "sla_tier": "standard",
    "latency_ms": 120
  }
}
```

## Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build
```

## Configuration

Set the orchestrator URL via environment variable:

```bash
VITE_ORCHESTRATOR_URL=http://localhost:8000
```

Defaults:
- Development: `http://localhost:8000`
- Production: `/api` (relative, expects proxy)

## Tech Stack

- React 19
- Vite
- TypeScript
- Tailwind CSS (via CDN)

## Style

Simple. Explicit. Boring. Teachable.

---

*This frontend is a window into the platform, not part of the AI system itself.*
