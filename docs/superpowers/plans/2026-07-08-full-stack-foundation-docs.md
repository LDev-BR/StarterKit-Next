# Full Stack Foundation Docs Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Update repository documentation so future work is guided toward a modular full stack starter kit with Next.js, NestJS, TypeScript, PostgreSQL, Prisma, Docker, GitHub Actions, and Railway.

**Architecture:** The current app remains documented as a validated Next.js frontend with mocks. The target architecture is documented as a same-repository full stack system with a Next.js web app, NestJS API, Prisma/PostgreSQL persistence, Docker packaging, Railway as primary deploy target, and AWS as future alternative.

**Tech Stack:** Next.js, NestJS, TypeScript strict, PostgreSQL, Prisma, Docker, GitHub Actions, Railway, Vitest, Playwright.

## Global Constraints

- This task updates documentation only.
- Do not implement NestJS, Prisma, PostgreSQL real, CI/CD, Dockerfiles, migrations, endpoints, auth real, or deploy.
- Keep ASCII text style consistent with existing docs.
- Preserve the current frontend identity and validation history.
- Replace old prohibitive guardrails with phased full stack guardrails.
- Railway is the primary deploy target; AWS is a future alternative.
- Supabase is not a default dependency.

---

### Task 1: Add Central Full Stack Guide

**Files:**
- Create: `docs/FULL_STACK_FOUNDATION.md`

**Interfaces:**
- Consumes: `docs/superpowers/specs/2026-07-08-full-stack-foundation-design.md`
- Produces: a central guide referenced by `AGENTS.md`, `docs/README.md`, `docs/ROADMAP.md`, and `docs/PRODUCTION_CHECKLIST.md`

- [x] **Step 1: Create guide with state, target, phases, deploy, and guardrails**

Include sections for:

- Estado atual.
- Estado alvo.
- Arquitetura planejada.
- Fases de evolucao.
- Deploy Railway.
- Banco e Prisma.
- CI/CD.
- AWS futura.
- Decisoes para agentes.

- [x] **Step 2: Review guide for explicit non-implementation scope**

Expected: the guide says documentation does not implement the target stack yet.

### Task 2: Update Agent Entry Points

**Files:**
- Modify: `AGENTS.md`
- Modify: `docs/README.md`
- Modify: `README.md`

**Interfaces:**
- Consumes: `docs/FULL_STACK_FOUNDATION.md`
- Produces: clear onboarding for future agents and developers

- [x] **Step 1: Update `AGENTS.md` scope**

Replace "frontend validation" scope with "full stack foundation planning" scope.

- [x] **Step 2: Add `docs/FULL_STACK_FOUNDATION.md` to required docs**

Expected: agents know to read it before backend, database, Docker, Railway, CI/CD, or architectural tasks.

- [x] **Step 3: Update public README roadmap language**

Expected: README says current implementation is still frontend with mocks, but target stack is Next + Nest + PostgreSQL + Prisma + Docker + Railway.

### Task 3: Update Architecture And Contracts

**Files:**
- Modify: `docs/ARCHITECTURE.md`
- Modify: `docs/DATA_AND_API_CONTRACTS.md`
- Modify: `docs/AGENT_WORKFLOWS.md`

**Interfaces:**
- Consumes: current frontend architecture docs and `docs/FULL_STACK_FOUNDATION.md`
- Produces: accurate guidance for phased full stack work

- [x] **Step 1: Split current and target architecture**

Expected: current app remains described as single Next route with mocks; target app introduces Next web plus Nest API.

- [x] **Step 2: Update data/API migration path**

Expected: docs mention DTOs, Zod/shared validation where useful, Prisma schema/migrations, PostgreSQL, service boundaries, and no direct secret exposure.

- [x] **Step 3: Update agent workflow matrix**

Expected: full stack task types include Nest API, Prisma/DB, Docker/Railway, CI/CD, and docs.

### Task 4: Update Roadmap And Production Checklist

**Files:**
- Modify: `docs/ROADMAP.md`
- Modify: `docs/PRODUCTION_CHECKLIST.md`

**Interfaces:**
- Consumes: full stack target and deployment decision
- Produces: phased roadmap and production gates for future implementation

- [x] **Step 1: Rewrite roadmap phases**

Expected phases: current baseline, foundation docs, repo architecture decision, Nest API, Prisma/PostgreSQL, auth, Docker/Railway, CI/CD, production hardening.

- [x] **Step 2: Rewrite checklist status**

Expected: frontend validation stays complete; backend/database/deploy/CI are pending gates.

### Task 5: Validate Documentation Consistency

**Files:**
- Read: `AGENTS.md`
- Read: `README.md`
- Read: `docs/*.md`
- Read: `docs/superpowers/specs/2026-07-08-full-stack-foundation-design.md`

**Interfaces:**
- Consumes: all changed documentation
- Produces: final consistency check

- [x] **Step 1: Search for stale prohibitions**

Run: `rg -n "backend real.*sem pedido|PostgreSQL real.*sem pedido|monorepo sem pedido" AGENTS.md README.md docs`

Expected: any remaining lines are contextual history, not active guardrails.

- [x] **Step 2: Search for missing central guide references**

Run: `rg -n "FULL_STACK_FOUNDATION" AGENTS.md README.md docs`

Expected: referenced from major onboarding documents.

- [x] **Step 3: Check git diff**

Run: `git diff -- AGENTS.md README.md docs`

Expected: only documentation changes.
