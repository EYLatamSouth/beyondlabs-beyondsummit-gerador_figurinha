# Copilot Instructions — Beyond Summit Figurinha Generator

Web app for generating personalized digital stickers for the EY Latin America Beyond Summit event. Users upload a photo, background is removed client-side via WASM, they fill in their data, and download a 900×1200px PNG sticker.

## Commands

```bash
npm run dev       # Vite dev server (frontend only, no Functions)
npm run build     # tsc -b && vite build
npm run lint      # ESLint
```

For local development with Azure Functions, use `swa-cli` to emulate Azure Static Web Apps:

```bash
# Copy .env.example → .env and set VITE_API_BASE_URL=http://localhost:7071
swa start
```

There are no tests.

## Architecture

The app has **no server-side image processing** — all background removal runs locally in the browser via `@imgly/background-removal` (WASM). The backend is minimal: two Azure Functions on Azure Static Web Apps.

### Three-screen flow (managed in `App.tsx`)

```
Upload (idle) → Processing → Editor
```

State lives entirely in `App.tsx` via `useState`. No state manager (Zustand, Context) — the scope doesn't warrant it.

### Canvas composition pipeline

```
useBackgroundRemoval (hook)
  └─ @imgly WASM → blob URL

useStampCanvas (hook)
  └─ calls composeLayers() from src/lib/canvas.ts on every StampData change

composeLayers() layer order (900×1200px):
  1. /template/figurinha-bg.png      ← green background with BS silhouette
  2. User photo (blob URL)           ← clipped to rect, cover-scaled
  3. /template/figurinha-overlay.png ← logo + "BEYOND SUMMIT" branding
  4. /flags/[countryCode].svg        ← ISO alpha-2 filename (e.g. br.svg)
  5. country.codeDisplay text        ← e.g. "BRA", "ARG"
  6. NAME text (Barlow Condensed 800, shrinks to fit)
  7. ROLE | AREA tag (green rounded rect + Barlow Condensed 700)
```

**Critical**: `canvas.ts` contains only pure functions. `StampCanvas.tsx` and `useStampCanvas.ts` call into it — no canvas logic elsewhere.

### Download is never blocked by the API

```typescript
// In handleDownload():
downloadPNG()                    // synchronous — happens immediately
registerParticipant(data)        // fire and forget — no await, no .catch shown to user
```

### API endpoints

| Endpoint | Method | Auth |
|---|---|---|
| `/api/register` | POST | None |
| `/api/metrics` | GET | Header `x-admin-key` |

The admin key is never stored in localStorage — only in React state (memory) for the duration of the session.

## Key Conventions

### Language split
- **Code** (variables, functions, comments): English
- **UI** (labels, toasts, error messages, button text): Brazilian Portuguese

### TypeScript
- No `any`, no `@ts-ignore`
- Props typed with `interface`, not `type`
- All hooks in `src/hooks/` prefixed with `use`

### Styling
- Tailwind CSS only — no CSS modules, no styled-components, no custom classes when Tailwind resolves it
- shadcn/ui for base components: `Button`, `Input`, `Select`, `Dialog`, `Sonner`
- CSS variables from `index.css` for brand colors (`--color-green-dark`, `--color-green-mid`, `--color-gold`)
- Use `style={{}}` inline only for dynamically calculated values that Tailwind can't express (e.g. canvas pixel positions)
- Tailwind class order: layout → spacing → sizing → colors → typography → effects

### React
- Function components + hooks only
- One component per file, PascalCase filenames
- No `document.getElementById` or direct DOM manipulation outside canvas

### Error handling
- Upload/processing errors: `toast.error(...)` with Portuguese message
- `registerParticipant()` errors: `console.error` in dev, silent in production — never shown to user
- Always `try/catch` in async operations

### Never do
- `localStorage` or `sessionStorage`
- Send the user's photo or blob URL to any external server
- Commit `.env`, secrets, or connection strings
- Block the PNG download waiting for `POST /api/register`
- Use `alert()` or `confirm()` — use Sonner toasts

## Path Aliases

`@/` maps to `src/` (configured in `vite.config.ts`).

## Types Reference (`src/types/stamp.ts`)

```typescript
interface StampData {
  name: string; role: string; area: string; email: string; countryCode: string;
}
interface ParticipantRecord {
  nome: string; email: string; pais: string; paisCode: string; timestamp: string; // ISO 8601
}
interface Country {
  code: string;        // ISO alpha-2, e.g. 'br'
  codeDisplay: string; // e.g. 'BRA'
  name: string;        // e.g. 'Brasil'
  featured: boolean;   // true = visible chip in CountrySelect level 1
}
```

## Fonts

- Display/titles/canvas text: `'Barlow Condensed'` (700, 800)
- Body/inputs/labels: `'DM Sans'` (400, 500, 600)

Both loaded via Google Fonts in `index.html`. Always `await document.fonts.load(...)` before drawing text on canvas (already handled in `composeLayers`).
