# Boardly — Client

Client-side application for Boardly: a real-time collaborative whiteboard and workspace.

This repository contains the React + Vite frontend used by the Boardly project. The client connects to a Boardly backend (API + Socket.IO) to sync boards, users, and drawing events in real time.

## Table of contents
- What this project does
- Why it’s useful
- Quick start
- Configuration
- Scripts
- Contributing & support

## What this project does

Boardly (client) provides a collaborative whiteboard UI with real-time syncing, user sessions, and drawing tools.

## Why it’s useful

- Real-time collaborative whiteboard powered by Socket.IO
- Fast developer experience (Vite + HMR)
- Extensible UI using Radix primitives and Tailwind CSS
- Built with standard libraries (Axios, Zustand, tldraw) for easy integration

## Quick start

Prerequisites
- Node.js 18+ and npm (or yarn/pnpm)
- A running Boardly backend (API + Socket.IO)

Install

```bash
npm install
```

Run (development)

```bash
npm run dev
```

Build

```bash
npm run build
```

Preview production build locally

```bash
npm run preview
```

## Configuration

By default the client points to a local backend at `http://localhost:5001`. The two files that control backend connections are:

- `src/lib/axios.js` — base API URL (default: `http://localhost:5001/api`)
- `src/lib/socket.js` — Socket.IO URL (default: `http://localhost:5001`)

You can override the backend URL using Vite environment variables. Example `.env` entries (see `.env.example`):

```env
VITE_BACKEND_URL=http://localhost:5001
```

If you add new env variables, restart the dev server so Vite picks them up.

## Scripts

- `npm run dev` — start Vite dev server with HMR
- `npm run build` — build production bundle
- `npm run preview` — preview production build locally
- `npm run lint` — run ESLint

These scripts are defined in `package.json`.

## Contributing & support

If you'd like to contribute, please read `CONTRIBUTING.md` and open a pull request. For backend-specific issues (auth, uploads, sockets) check the server repository and its docs.

If this repo will be published publicly, add a `LICENSE` file at the repository root and update repository settings accordingly.

<!-- End of README -->
