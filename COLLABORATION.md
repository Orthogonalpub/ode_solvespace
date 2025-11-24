# Multi-Agent Collaboration Protocol

This document defines the strategy for **Claude Code** and **Gemini 3** to work together on the **ODE Geometry** project.

## 1. The "Shared Brain" Strategy

Since agents cannot directly talk to each other, we use the **file system as our shared memory**.

### Shared Source of Truth
Both agents must respect and update these core files:
- **`TASKS.md`**: The master task list. **Always read this first.**
- **`CHANGELOG.md`**: The history of changes. **Update this after every task.**
- **`.claude/API_EXPORTS.md`**: The status of WASM API functions.
- **`GEMINI_GUIDELINES.md`** & **`.claude/GUIDELINES.md`**: Respective agent rules (cross-reference when needed).

## 2. Handoff Protocol

When finishing a session, an agent **MUST**:
1.  **Update `TASKS.md`**: Mark completed items with `[x]` and update the "Current Status" section.
2.  **Update `CHANGELOG.md`**: Document technical details of changes.
3.  **Leave a "Handoff Note"** (Optional): If there are specific instructions for the next agent, add a `TODO(next-agent)` comment in the relevant code file or at the top of `TASKS.md`.

## 3. Directory Structure & Ownership

- **`src/` & `frontend/`**: **Shared Territory**. Both agents edit these.
- **`.claude/`**: **Claude's Home**. Gemini reads this for context but avoids modifying config files unless necessary.
- **`.gemini/`**: **Gemini's Home**. Claude reads this for context but avoids modifying config files unless necessary.
- **`build_wasm/`**: **Shared Build Artifacts**. Both agents can trigger builds here.

## 4. Conflict Resolution

- **Code Style**: Follow the existing style in the file.
- **Architecture**: `SPEC.md` (in `.claude`) is the architectural authority. If Gemini proposes a change, it must update `SPEC.md`.
- **Overwrites**: Always read the latest file content before writing. Do not blindly overwrite.

## 5. Communication Tags

Use these tags in code comments to signal intent:
- `// TODO(claude): ...` - Specific instruction for Claude.
- `// TODO(gemini): ...` - Specific instruction for Gemini.
- `// NOTE(shared): ...` - Important context for both.

---

## Example Workflow

1.  **Gemini** starts, reads `TASKS.md`, sees "Implement Extrude".
2.  **Gemini** implements `Extrude()` in C++, updates `geometry_api.cpp`.
3.  **Gemini** updates `TASKS.md` to `[x] Implement Extrude`.
4.  **Gemini** updates `CHANGELOG.md`.
5.  **User** switches to **Claude**.
6.  **Claude** reads `TASKS.md`, sees "Implement Extrude" is done.
7.  **Claude** proceeds to "Test Extrude in Frontend".
