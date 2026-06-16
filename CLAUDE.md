# Planloos — Claude Code Project Guide

## Overview
Planloos is a React 19 + Vite 8 single-page productivity app.  
Features: tasks, habits, goals, Pomodoro timer, AI planning via Anthropic API, ICS import, PWA download, English/Afrikaans i18n, and four colour themes.

## Project Layout
```
G:\My Drive\Planloos\      ← project root (Google Drive)
  src/
    App.jsx                ← entire app (~2600 lines, single-component)
    index.css              ← global CSS variables + resets
    main.jsx               ← React 19 root mount
  index.html
  package.json
  vite.config.js
  CLAUDE.md               ← this file

C:\Users\ArmandM\.planloos-deps\   ← node_modules live HERE (not in Drive)
  node_modules/
  package.json
```

## Why node_modules Are Not in the Project Folder
Google Drive sync locks files while npm writes them, causing `TAR_ENTRY_ERROR` / `EPERM` failures.  
Symlinks into Drive are also unsupported. Solution: install deps locally and point Vite at them via `NODE_PATH` + `resolve.modules`.

## Running the Dev Server
```powershell
# From the project root (G:\My Drive\Planloos):
npm run dev
```
This runs Vite via the local binary at `C:\Users\ArmandM\.planloos-deps\node_modules\vite\bin\vite.js` with `NODE_PATH` set to the same folder.  
Open **http://localhost:5173** in your browser.

## Updating Dependencies
Run from the local deps folder, **not** the project root:
```powershell
cd C:\Users\ArmandM\.planloos-deps
npm install <package>
```

## App Architecture
- **Single component**: `export default function Planloos()` in `App.jsx`
- **Storage**: `db.get/set` — uses `window.storage` (Claude.ai) with `localStorage` fallback
- **AI**: `aiCall()` / `aiJSON()` → `https://api.anthropic.com/v1/messages` using `claude-sonnet-4-20250514`; API key stored in settings
- **Tabs**: Tasks · Done · Calendar · Habits · Goals · Plan · Stats
- **Themes**: `planloos` (dark red) · `light` · `cosmic` · `ocean`
- **i18n**: `LANG.en` / `LANG.af` + `t()` helper; language toggled in settings

## Key Constants
| Name | Purpose |
|------|---------|
| `THEMES` | Theme colour tokens |
| `PRI` | Priority labels (1–4) |
| `CATS` | Task categories |
| `HORIZONS` | Planning horizons |
| `HABIT_ICONS` | Emoji icons for habits |
| `TP` | Pomodoro time presets |

## Build
```powershell
npm run build   # outputs to dist/
npm run preview # preview the production build
```
