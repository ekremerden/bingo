# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

"MMA BINGO": a single-page React 19 + Vite app. Players drag numbered MMA commentary phrases (German) from a list onto a 5×5 bingo board. Plain JavaScript/JSX (no TypeScript), Tailwind CSS v4 via `@tailwindcss/vite` (imported in `src/index.css`), Open Sans via `@fontsource`. No backend, no tests, no git repo yet.

## Commands

```
npm run dev       # Vite dev server with HMR
npm run build     # production build to dist/
npm run preview   # serve the built dist/
npm run lint      # eslint . (flat config, eslint.config.js)
```

There is no test runner configured.

`vite.config.js` proxies `/api` to `http://localhost:8000` (a Django backend is anticipated but does not exist yet) and defines the `@` → `src/` alias (mirrored in `jsconfig.json`).

## Architecture

The app is a port of a legacy jQuery implementation to React:

- `src/hooks/useBingoDragDrop.js` owns all board state. `cells` is an array of 25 entries holding an item id or `null`; `placed` (a Set derived from `cells`) replaces the old `.dropped`/`.undropped` CSS classes; `dragging = { itemId, from }` where `from` is a grid index or `null` when dragged from the list. Uses native HTML5 drag-and-drop (no DnD library). Drops onto occupied cells are rejected; dropping a grid item onto another cell moves it. `dropOnCell` calls `endDrag` itself because the source element may unmount before `dragend` fires.
- `App.jsx` creates the hook once and passes the whole `dnd` object to `BingoGrid` (the board) and `ItemList` (the phrase list). Components are presentational and read everything from `dnd`.
- `src/items.js` is the phrase catalogue (`{ id, text }`); ids are what's shown on the board. `ItemList` also honors an optional `bold` flag on an item.

### Legacy code (not imported by the React app)

- `src/bingo.js` / `src/bingo.css` are the original jQuery version. They still document features not yet ported to React: right-click to remove an item from a cell, click to mark a cell (`is-marked`), bingo/score detection over 12 lines (5 rows, 5 columns, 2 diagonals) with highlighting, a dice button that randomly fills empty cells, a date field, and a player toggle. Use them as the spec when porting these features.
- `src - Kopie/` is a stale backup copy of `src/`. Don't edit it. Note that `npm run lint` lints it and `src/bingo.js` too (jQuery globals are undefined there), so expect lint errors from those files; lint specific paths (e.g. `npx eslint src/App.jsx src/components src/hooks`) to check only the React code.

### git installed and repository created.