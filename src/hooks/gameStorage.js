// Persists the game in localStorage so an accidental reload (e.g. pull-to-refresh
// on a phone) doesn't wipe the board. Storage can be unavailable (private mode,
// blocked site data), so every access is wrapped and failures are ignored.
const KEY = "mma-bingo-game-v1";

export function loadGame(gridSize) {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const data = JSON.parse(raw);
    if (!Array.isArray(data.cells) || data.cells.length !== gridSize) return null;
    return {
      cells: data.cells,
      marked: new Set(data.marked ?? []),
      flagged: new Set(data.flagged ?? []),
      started: Boolean(data.started),
    };
  } catch {
    return null;
  }
}

export function saveGame({ cells, marked, flagged, started }) {
  try {
    localStorage.setItem(
      KEY,
      JSON.stringify({ cells, marked: [...marked], flagged: [...flagged], started }),
    );
  } catch {
    // ignore: the game still works, it just won't survive a reload
  }
}
