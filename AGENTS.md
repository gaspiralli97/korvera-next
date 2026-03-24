# AGENTS.md

This file provides operating guidance for coding agents working in this repository.

## Project Context

- Framework: Next.js (Pages Router) + React + TypeScript
- Package manager: npm
- Primary scripts:
  - `npm run dev` - start local dev server
  - `npm run lint` - run lint checks
  - `npm run build` - production build validation

## Working Principles

1. Keep changes minimal and scoped to the request.
2. Prefer root-cause fixes over temporary workarounds.
3. Match the existing code style and architecture.
4. Avoid introducing new dependencies unless required.
5. Do not modify unrelated files or behavior.

## Implementation Guidance

- Reuse existing patterns in `pages/` and shared modules before creating new abstractions.
- Preserve backward compatibility for existing routes and page behavior.
- Keep components readable; extract helpers only when complexity justifies it.
- Add comments only for non-obvious logic.

## Verification Expectations

- For UI or logic changes, run:
  - `npm run lint`
  - `npm run build` (when change may affect compile/runtime behavior)
- If tests are added in the future, run only the relevant subset first, then broader checks as needed.

## Git and PR Hygiene

- Make small, descriptive commits focused on a single logical change.
- Ensure working tree is clean except for intentional edits.
- Summaries should include:
  - what changed
  - why it changed
  - how it was verified

## UI Constraints

- ONLY modify UI and styling when working on frontend tasks.
- DO NOT modify hooks, API calls, state management, or business logic.
- Preserve existing props and component interfaces.
- Use SCSS modules and follow existing naming conventions.

## Safety Notes

- Treat secrets and credentials as sensitive; never hardcode them.
- Avoid destructive operations unless explicitly requested.
- If requirements are ambiguous, choose the safest minimal implementation that satisfies the request.
