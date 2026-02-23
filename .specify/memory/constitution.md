<!--
Sync Impact Report

- Version change: 1.0.0 -> 1.1.0
- Modified principles: None renamed
- Added sections: Principle VI "Documentation Accompaniment"
- Removed sections: None
- Templates requiring updates:
  - .specify/templates/plan-template.md (✅ no changes needed — Constitution Check is a dynamic gate)
  - .specify/templates/spec-template.md (✅ no changes needed — no constitution references)
  - .specify/templates/tasks-template.md (✅ already includes documentation task in Polish phase)
- Follow-up TODOs: Populate `RATIFICATION_DATE`; ensure README.md and quickstart.md
  are kept current per Principle VI requirements.
-->

# BottleBond Web App Constitution

## Core Principles

### I. Dynamic Content First
All user-facing content MUST be provided as structured data and rendered at runtime when possible. The application
architecture MUST separate content (APIs, CMS, or headless data sources) from presentation (templates, client-side
renderers). Implement cache-control headers and graceful server-side fallbacks for dynamic segments.

### II. Security By Default
Transport layer security (HTTPS/TLS) MUST be enforced. All inputs from users or external services MUST be validated and
sanitized to prevent injection attacks. Apply least-privilege for service credentials, store secrets outside the repo
(environment variables or secret manager), and enable standard security headers (CSP, HSTS, X-Frame-Options).

### III. Testable & Continuous Delivery
Automated tests are REQUIRED: unit tests for logic, integration tests for APIs, and at least one end-to-end smoke test
that verifies critical user flows. Every change MUST pass CI checks before merge; deploys should be automated from
main branch when CI gates pass.

### IV. Observability & Error Handling
Produce structured logs and expose basic metrics (request rates, error rates, latency) for major endpoints. Errors visible
to users MUST be user-friendly and not leak internal details. Define SLI/SLO targets for uptime and response latency and
configure alerts when thresholds are exceeded.

### V. Accessibility & Performance
Deliver accessible interfaces compliant with WCAG 2.1 AA where feasible. Enforce a performance budget for first-contentful
paint and total page size; use progressive enhancement and lazy loading to meet budgets.

### VI. Documentation Accompaniment
Every change that affects user-visible behavior, content structure, or development workflow MUST include corresponding
documentation updates. The repository MUST maintain:

- A **README.md** at the project root with setup instructions, project structure overview, and common content-management
  tasks (adding articles, updating data files, modifying configuration).
- A **quickstart guide** (in `specs/` or `docs/`) that enables a new contributor to clone, run, and publish content
  within a single session.

Documentation MUST be treated as a deliverable, not an afterthought. When a feature adds or changes content workflows
(e.g., new era sections, new data file formats, new shortcodes), the README and/or quickstart MUST be updated in the
same changeset. Stale or missing documentation is treated as a defect.

## Additional Constraints
- Technology: Use progressive web app patterns when appropriate; APIs MUST return JSON for structured content. Server-side
	rendering is preferred for primary content to improve SEO and first-load performance, with client-side hydration if
	interactive features are required.
- Configuration: All runtime configuration MUST come from environment variables or a secure secret store; no secrets in
	source control.
- Data: Content sources SHOULD provide canonical IDs and timestamps to allow caching and invalidation.

## Development Workflow
- Branching: Feature branches with pull requests; work in small, reviewable commits.
- Reviews: Every PR MUST have at least one approving reviewer; security-sensitive changes require a second reviewer.
- CI Gates: Linting, unit tests, and integration tests MUST pass; deploy previews are REQUIRED for significant UI changes.
- Documentation: Every PR that modifies user-facing behavior or content workflows MUST include updated documentation
  (README, quickstart, or inline help text as appropriate). PRs missing required documentation updates SHOULD be
  flagged during review.

## Governance
This constitution defines the non-negotiable requirements for the BottleBond web application. Amendments to the
constitution MUST be proposed in a pull request that documents the rationale and migration steps. A simple majority of
project maintainers is sufficient to ratify non-breaking clarifications; major governance or principle changes (removal
or redefinition of a principle) MUST be accompanied by a migration plan and require explicit approval by core maintainers.

- Versioning policy: Governance changes follow semantic versioning. MAJOR for backward-incompatible governance changes;
	MINOR for new principles or materially expanded requirements; PATCH for wording, typos, and clarifications.

**Version**: 1.1.0 | **Ratified**: TODO(RATIFICATION_DATE) | **Last Amended**: 2026-02-15
