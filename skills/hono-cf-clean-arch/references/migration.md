# Migrating an existing Hono + Workers project to the canonical layout

Strangler-style: every step is behavior-preserving, lands as its own commit, and ends
with `pnpm typecheck && pnpm test` green. Stop and reassess if a step forces a
behavior change — that's a bug fix, do it in a separate commit first.

Typical starting point: one giant `app.ts` with all routes and zod schemas, plus a
`services/` directory where each file mixes drizzle queries, business orchestration,
and raw `fetch` calls to external systems.

## Step 1 — Split the HTTP layer

Move routes + their zod schemas out of the god file into `http/<resource>.ts`
(e.g. `http/library.ts`, `http/downloads.ts`, `http/admin.ts`). Keep shared
middleware (auth, error mapping) in `http/middleware.ts`. Pure mechanical move; the
mounted route tree and any exported app type must not change.

Hono's registration order is load-bearing in two ways, so split with register
functions, not sub-apps:

- middleware (`routes.use`) only guards routes registered after it — public routes
  (health, setup) stay public precisely because they register first;
- static paths must register before parameter paths (`/indexers/search` before
  `/indexers/:id`).

Each module exports `registerXxxRoutes(routes: Hono<AppEnv>)`; the assembler calls
them in the original order and carries a comment saying the order is load-bearing.

## Step 2 — Port the multi-implementation concepts first

These have the highest payoff: anything dispatched by a `kind` field
(downloaders, indexers, metadata providers).

1. Define the port interface in `usecases/ports.ts` with only the methods the
   existing code actually calls (`submit`, `checkHealth`, ...).
2. Move each kind's branch into `adapters/<concept>/<kind>.ts` implementing the port.
3. Replace the `if/else` chain with a lookup table (`Record<Kind, Adapter>`).
4. Existing tests that mocked `fetch` move to the adapter files; usecase tests get
   fake ports instead.

## Step 3 — Extract repositories

Move drizzle queries from each service into `adapters/repos/<entity>.ts` implementing
a repo port. What remains of the service file is the usecase — move it to
`usecases/`. Rows stop leaking: repos return domain/DTO shapes.

## Step 4 — Extract domain rules

Hunt for business rules interleaved with I/O (state-transition logic, key
parsing/validation, eligibility rules). Pull them into `domain/` as pure functions
and give them direct unit tests. This step usually reveals the bugs.

## Step 5 — Composition root (the big one)

Create `composition.ts` with `createDeps(env)` and `usecases/deps.ts` with the
`Deps` interface. Convert the remaining service files into `usecases/` functions
taking `deps` first. Inject via Hono middleware (`c.set('deps', createDeps(c.env))`)
registered before everything (it guards nothing, so it goes first). Delete the
parameter threading and the old services directory.

Things this step surfaces (all have a standard answer — see SKILL.md):

- adapter error classes caught by http → move to `usecases/ports.ts`;
- SSE/stream endpoints returning `Response` from a service → usecase becomes
  `(deps, ..., signal, emit)`, http builds the `ReadableStream`/`Response`;
- request-bound capabilities (auth user creation) → function parameter from the
  route, not a `Deps` entry, so `createDeps(env)` stays usable from `scheduled`;
- routes that are pure pass-throughs to one port → call the port via `deps`
  directly, don't manufacture empty usecases;
- existing orchestration tests → fake repos + real gateways + the same fetch stubs.

## Step 6 — Enforce

Copy `templates/dependency-cruiser.cjs` to the repo root as
`.dependency-cruiser.cjs`, add the devDependency and `lint:arch` script, wire into
CI. Fix any violations it finds (there will be a few stragglers), then the layout is
locked.

Known straggler: a better-auth style module that both owns tables and serves
requests. Keep it at `server/auth.ts` and add the named exception to the drizzle
rule (the template shows how) — moving it into `adapters/` only converts the
violation into `http-not-into-adapters`.

## Ordering between projects

Within one project the steps are ordered by risk (1 is lowest). Across projects,
migrate the project you're actively changing first; don't batch-migrate dormant
repos — the structure pays for itself only where code is moving.
