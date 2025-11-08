# Contributing to Boardly (client)

Thanks for your interest in contributing! This file includes a short, practical checklist to help you get started.

1. Fork the repository and create a feature branch from `main` (or the project's default branch):

```bash
git checkout -b feat/your-feature
```

2. Make small, focused changes. Add tests when applicable and keep formatting/linting consistent.

3. Run the app and linting locally:

```bash
npm install
npm run dev
npm run lint
```

4. Commit with clear messages and open a PR against the upstream `main` branch. In your PR description, include:
- What the change does
- Why it's needed
- Any migration or configuration notes

5. A maintainer will review the PR. Address review comments and squash or rebase commits if requested.

Notes
- Keep changes small and focused for faster review.
- If your change affects the backend contract (API shape, auth, uploads), update the server docs or coordinate with the backend maintainers.

See also: add a `LICENSE` at the repo root if you intend to publish this project publicly.
