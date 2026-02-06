# FRONTEND INVARIANTS

## Purpose

Frontend discipline is critical in a governed GenAI platform because the boundary between presentation and intelligence defines the entire system's integrity. When frontend code begins making decisions—routing requests, interpreting responses, storing state, or referencing providers—it silently undermines every governance mechanism the platform provides. Cost controls become bypassable. Policy enforcement becomes inconsistent. Observability becomes fragmented.

Violations compound over time. What begins as "just one direct API call" or "a small local cache" evolves into a parallel decision-making layer that duplicates, contradicts, or bypasses backend governance. The result is a system where the backend believes it controls behavior, but the frontend has quietly assumed authority. This is architectural collapse—invisible until it is catastrophic.

---

## Core Principle

> **The frontend is a rendering surface, not a decision-making surface.**

This principle is absolute. The frontend receives structured responses and renders them. It captures user input and forwards it. It does not interpret, score, route, retry, or reshape.

**Example 1: Routing Violation**  
A developer adds logic to route "simple" questions to a faster model. The backend's cost tracking, SLA enforcement, and audit trail now reflect decisions the backend never made. Policy violations go undetected. Cost attribution becomes incorrect.

**Example 2: Retry Violation**  
A developer adds frontend retry logic with exponential backoff. The backend sees duplicate requests it cannot correlate. Rate limiting triggers incorrectly. Cost doubles without visibility. The user sees inconsistent behavior that backend logs cannot explain.

---

## HARD INVARIANTS

These invariants are non-negotiable. Any deviation requires architectural review and explicit exception documentation.

### 1. Stateless UI

The frontend never stores conversational state beyond ephemeral UI needs (e.g., current input text, loading spinners).

- **No session reconstruction.** If the browser refreshes, the frontend does not attempt to rebuild conversation history from local storage.
- **No memory ownership.** The frontend does not maintain a representation of "what the user has said" across requests.
- **No context accumulation.** Each request is independent; the backend alone assembles context.

### 2. Zero Intelligence

The frontend contains no decision-making logic.

- **No routing.** The frontend does not choose which agent, model, or endpoint handles a request.
- **No scoring.** The frontend does not evaluate response quality, confidence, or correctness.
- **No evaluation.** The frontend does not determine if a response is "good enough."
- **No retry logic.** The frontend does not automatically retry failed requests.
- **No fallback logic.** The frontend does not switch to alternative behavior on failure.

### 3. Provider Agnosticism

The frontend must not contain any reference to specific model providers or LLM concepts.

- **No model names.** References to "GPT-4," "Claude," "Gemini," or any model identifier are forbidden.
- **No provider names.** References to "OpenAI," "Anthropic," "Azure AI," or any provider are forbidden.
- **No SDKs.** The frontend does not import or call provider-specific libraries.
- **No LLM concepts.** Terms like "tokens," "temperature," "context window," or "embeddings" do not appear in frontend code.

### 4. No Governance Logic

Governance is a backend responsibility. The frontend does not participate.

- **No policy enforcement.** The frontend does not check if a request is allowed.
- **No cost thresholds.** The frontend does not limit behavior based on cost.
- **No SLA decisions.** The frontend does not alter behavior based on tier or quota.
- **No feature gating.** The frontend does not hide or show features based on policy evaluation.

### 5. Backend is the Source of Truth

The frontend renders responses exactly as received. It does not reinterpret.

- **No reshaping.** If the backend returns a structure, the frontend displays that structure.
- **No inference.** The frontend does not derive meaning beyond what is explicitly provided.
- **No modification.** The frontend does not alter, filter, or summarize backend responses.

---

## ALLOWED RESPONSIBILITIES

The frontend is explicitly permitted to:

| Responsibility | Description |
|----------------|-------------|
| Capture user input | Accept text, files, or structured input from the user |
| Display responses | Render the result payload returned by the backend |
| Render metadata | Display traces, evaluations, policy outcomes, latency, cost estimates |
| Visualize history | Show execution history exactly as returned by the backend |
| Support inspection | Provide developer tools for viewing raw payloads, logs, and traces |
| Manage ephemeral state | Track loading states, input focus, panel visibility |

---

## FORBIDDEN RESPONSIBILITIES

The following are explicitly forbidden. Each violation introduces silent governance bypass.

| Forbidden Action | Reason |
|------------------|--------|
| Calling LLMs directly | Bypasses orchestration, policy, cost tracking, and audit |
| Performing retrieval | Bypasses RAG governance, source attribution, and access control |
| Computing confidence | Duplicates evaluation logic; creates inconsistent quality signals |
| Inferring correctness | Usurps backend evaluation; breaks observability chain |
| Modifying outputs | Destroys auditability; backend logs no longer reflect user experience |
| Storing long-term memory | Creates ungoverned state; breaks session isolation and privacy controls |
| Selecting agents or models | Bypasses routing policy; invalidates cost attribution |
| Implementing retry/fallback | Creates invisible request duplication; breaks rate limiting and cost controls |

---

## FILE & FOLDER BOUNDARIES

The directory structure enforces separation of concerns.

| Path | Allowed Content |
|------|-----------------|
| `components/` | Pure UI components. React/view logic only. No API calls. No business logic. |
| `services/` | HTTP client functions calling backend APIs. No provider logic. No SDKs. |
| `types.ts` | TypeScript interfaces matching backend response schemas. No business types. |
| `App.tsx` | Component composition and routing. No logic beyond wiring. |

**Explicit Violation:**  
Any file named after a provider (e.g., `geminiService.ts`, `openaiClient.ts`, `azureApi.ts`) is an architectural violation and must be removed immediately.

---

## REPLACEABILITY GUARANTEE

These invariants ensure the frontend is a disposable presentation layer.

- **Frontend can be deleted and rebuilt.** Because no intelligence or state lives in the frontend, it can be rewritten in a different framework, language, or paradigm without affecting platform behavior.

- **Backend evolution does not require UI rewrites.** Because the frontend only renders what it receives, backend improvements to routing, policy, or evaluation require zero frontend changes.

- **New clients remain consistent.** A CLI, SDK, mobile app, or third-party integration will exhibit identical behavior because all decisions are made by the same backend. The frontend is not special.

---

## VIOLATION HANDLING

When a frontend invariant violation is detected:

1. **Treat it as an architectural bug.** This is not a "quick fix" or "tech debt." It is a governance breach.

2. **Require design review.** The violation must be discussed with platform architects before any code change.

3. **Do not allow temporary exceptions.** "We'll fix it later" is not acceptable. Temporary violations become permanent structures.

4. **Document if exception is granted.** In rare cases where a violation is intentionally allowed, it must be documented with explicit scope, expiration, and review schedule.

---

## FINAL WARNING

> **Breaking frontend invariants will silently destroy platform governance, even if the UI appears to work.**

The frontend will continue to render responses. Users will continue to see outputs. But cost controls will be bypassed. Policies will be unenforced. Audits will be incomplete. Observability will be fragmented.

By the time the damage is visible, it will be systemic.

These invariants exist to prevent that future.

**Enforce them without exception.**
