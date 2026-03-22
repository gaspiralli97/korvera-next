Workflow Orchestration
1. Plan Node Default

Enter plan mode for any non-trivial task (3+ steps or architectural decisions)

If something goes sideways, stop and re-plan immediately — don’t keep pushing

Use plan mode for verification steps, not just building

Write detailed specs upfront to reduce ambiguity

2. Subagent Strategy

Use subagents liberally to keep the main context window clean

Offload research, exploration, and parallel analysis to subagents

For complex problems, throw more compute at it via subagents

One task per subagent for focused execution

3. Self-Improvement Loop

After any correction from the user, update tasks/lessons.md with the pattern

Write rules for yourself to prevent the same mistake

Ruthlessly iterate on these lessons until mistake rate drops

Review lessons at session start for relevant project

4. Verification Before Done

Never mark a task complete without proving it works

Check diffs between main and your changes when relevant

Ask yourself: “Would a staff engineer approve this?”

Run tests, check logs, and demonstrate correctness

5. Demand Elegance (Balanced)

For non-trivial changes: pause and ask “is there a more elegant way?”

If a fix feels hacky: “Knowing everything I know now, implement the elegant solution”

Skip this for simple, obvious fixes — don’t over-engineer

Challenge your own work before presenting it

6. Autonomous Bug Fixing

When given a bug report: just fix it, don’t ask for hand-holding

Point at logs, errors, failing tests — then resolve them

No context switching required from the user

Fix failing CI tests without being told how

Task Management

Plan First: Write plan in tasks/todo.md with checkable items

Verify Plan: Check in before starting implementation

Track Progress: Mark items complete as you go

Explain Changes: High-level summary at each step

Document Results: Add review section to tasks/todo.md

Capture Lessons: Update tasks/lessons.md after corrections

Core Principles

Simplicity First: Make every change as simple as possible. Minimize impact.

No Laziness: Find root causes. No temporary fixes. Follow senior developer standards.

Minimal Impact: Only touch what’s necessary. Avoid introducing extra complexity.