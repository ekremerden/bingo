# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

"MMA BINGO": a single-page React 19 + Vite app. Players drag numbered MMA commentary phrases (German) from a list onto a 5×5 bingo board, start the game, then mark phrases as the commentators say them. Plain JavaScript/JSX (no TypeScript), Tailwind CSS v4 via `@tailwindcss/vite`, shadcn/ui (base-vega style, `components.json`) with lucide icons. No backend and no tests yet.

Version-controlled with git (branch `main`), hosted on GitHub and deployed to GitHub Pages.

## Commands

```
npm run dev       # Vite dev server with HMR
npm run build     # production build to dist/
npm run preview   # serve the built dist/
npm run lint      # eslint . (flat config, eslint.config.js)
```

There is no test runner configured. Don't run `npm run build` just to check a change; lint the touched files instead (e.g. `npx eslint src/App.jsx src/components src/hooks`). The one expected lint error is `react-refresh/only-export-components` in the shadcn-generated `src/components/ui/button.jsx`.

## Build and deploy

- `vite.config.js` sets `base: './'` so asset paths are relative; the site is served from `https://<user>.github.io/<repo>/`, not the domain root. Keep it that way unless the hosting changes.
- `.github/workflows/deploy.yml` builds and publishes `dist/` to GitHub Pages on every push to `main` (also runnable manually via `workflow_dispatch`).
- `vite.config.js` also proxies `/api` to `http://localhost:8000` (dev and preview only) and defines the `@` → `src/` alias (mirrored in `jsconfig.json`). A Django backend and database are planned but don't exist yet; GitHub Pages can only host the static frontend.

## Architecture

- `src/hooks/useBingoDragDrop.js` owns all game state; components are presentational and read from the `dnd` object it returns.
  - `cells`: 25 entries, each an item id or `null`. `placed` (Set) and `isFull` are derived from it.
  - Setup phase (`started === false`): native HTML5 drag-and-drop (no DnD library). Drops onto occupied cells are rejected; dragging a grid item onto another cell moves it; releasing a grid item outside the board removes it (`endDragFromCell` checks `dropEffect === "none"`). `dropOnCell` calls `endDrag` itself because the source element may unmount before `dragend` fires. `fillRandom` fills empty cells with random unplaced items, `reset` clears everything.
  - `start()` is only allowed when the board is full and locks the board (no more dragging).
  - Game phase: clicking a cell toggles a mark. Marks are stored by item id in `marked`, so they follow the item. Double-tapping a list item marks it if it's on the board, otherwise toggles a red "flag" (`flagged`).
  - Persistence: `cells`, `marked`, `flagged` and `started` are saved to `localStorage` (`src/hooks/gameStorage.js`, key `mma-bingo-game-v1`) on every change and restored on load, so an accidental reload keeps the game. `reset` also ends a started game; `SetupBar` shows a "New game" button (with confirm) once started. `index.css` sets `overscroll-behavior-y: none` on `html` to suppress pull-to-refresh.
  - `score` and `isBingoCell` are derived from `BINGO_LINES` (5 rows, 5 columns, 2 diagonals): a line is a bingo when all 5 cells are marked.
- `App.jsx` creates the hook once and lays out `Header`, the sticky `BingoGrid`, `SetupBar` (Reset, dice, Start, date), `ResultBar` (only-placed filter toggle and scores) and `ItemList`. The `onlyPlaced` filter state lives in `App`.
- `ItemList` detects double taps itself from two clicks (`DOUBLE_TAP_MS`) because `onDoubleClick` is unreliable on mobile.
- `src/components/markedClasses.js` holds the Tailwind classes that draw the X on marked cells and items (used by `BingoGrid` and `ItemList`).
- `src/items.js` is the phrase catalogue (`{ id, text }`, optional `bold`); the ids are what's shown on the board.
- `src/components/ui/` and `src/lib/utils.js` are shadcn-generated.

### Fonts

The app body uses Open Sans (`@fontsource/open-sans`, set via a class in `App.jsx`). `src/index.css` also imports Inter as shadcn's default `--font-sans`, so both are bundled.

### Not done yet

- Player handling: `ResultBar` shows two hard-coded players ("Ekrem", "Lena") with the same shared `score`; there is no player toggle or per-player state.
- The `LineHeight` button in `ResultBar` is a hidden placeholder.
- `index.html` links `/favicon.svg`, which doesn't exist (`public/` is empty).
- `README.md` is still the Vite template README.
