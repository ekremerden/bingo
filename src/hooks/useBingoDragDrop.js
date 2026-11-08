import { useEffect, useState } from "react";
import { loadGame, saveGame } from "./gameStorage";

// The 12 possible bingo lines on a 5×5 board as 0-based grid indices:
// 5 rows, 5 columns and the 2 diagonals (legacy arrBingos, which was 1-based).
const SIZE = 5;
const range = [...Array(SIZE).keys()];
export const BINGO_LINES = [
  ...range.map((r) => range.map((c) => r * SIZE + c)), // rows
  ...range.map((c) => range.map((r) => r * SIZE + c)), // columns
  range.map((i) => i * SIZE + i), // diagonal top-left → bottom-right
  range.map((i) => i * SIZE + (SIZE - 1 - i)), // diagonal top-right → bottom-left
];

/**
 * Drag & drop state for the bingo board.
 * cells[i] = item id placed in grid box i, or null if empty.
 */
export function useBingoDragDrop(gridSize = 25) {
  // saved game from a previous page load (read once on mount), or null
  const [saved] = useState(() => loadGame(gridSize));
  const [cells, setCells] = useState(() => saved?.cells ?? Array(gridSize).fill(null));
  // { itemId: number, from: number | null }  (from = grid index, null = from list)
  const [dragging, setDragging] = useState(null);
  const [overIndex, setOverIndex] = useState(null);
  // item ids marked with an X (stored by item, so the mark moves with it)
  const [marked, setMarked] = useState(() => saved?.marked ?? new Set());
  // false = setup phase (fill the board), true = game running (marking only)
  const [started, setStarted] = useState(() => saved?.started ?? false);

  // derived: replaces the .dropped / .undropped classes
  const placed = new Set(cells.filter((c) => c !== null));
  const isFull = cells.every((c) => c !== null);

  // start is only allowed once every grid box holds an item
  const start = () => {
    if (isFull) setStarted(true);
  };

  const startDrag = (itemId, from) => (e) => {
    // board is locked once the game started. draggable={false} alone is not
    // enough: dragging selected text still fires a dragstart that bubbles here.
    if (started) {
      e.preventDefault();
      return;
    }
    e.dataTransfer.setData("text/plain", String(itemId)); // Firefox needs this
    e.dataTransfer.effectAllowed = "move";
    setDragging({ itemId, from });
  };

  const endDrag = () => {
    setDragging(null);
    setOverIndex(null);
  };

  // dragend for items that sit on the board. dropEffect is "none" when the
  // item was released somewhere that is not a drop target (outside the grid),
  // so we take it off the board. A successful or rejected drop on a cell calls
  // preventDefault in dragover, which leaves dropEffect as "move".
  const endDragFromCell = (index) => (e) => {
    if (!started && e.dataTransfer.dropEffect === "none") {
      unmark(cells[index]);
      setCells((prev) => {
        const next = [...prev];
        next[index] = null;
        return next;
      });
    }
    endDrag();
  };

  const unmark = (itemId) => {
    setMarked((prev) => {
      if (!prev.has(itemId)) return prev;
      const next = new Set(prev);
      next.delete(itemId);
      return next;
    });
  };

  // click on a grid box toggles the X; only after start, never on empty boxes
  const toggleMark = (index) => {
    const itemId = cells[index];
    if (!started || itemId === null) return;
    setMarked((prev) => {
      const next = new Set(prev);
      if (next.has(itemId)) next.delete(itemId);
      else next.add(itemId);
      return next;
    });
  };

  const isMarked = (index) => cells[index] !== null && marked.has(cells[index]);
  const isItemMarked = (itemId) => marked.has(itemId);

  // item ids of list entries that are not on the board but were flagged red
  const [flagged, setFlagged] = useState(() => saved?.flagged ?? new Set());

  // write the game to localStorage on every change so a reload restores it
  useEffect(() => {
    saveGame({ cells, marked, flagged, started });
  }, [cells, marked, flagged, started]);
  const isItemFlagged = (itemId) => !placed.has(itemId) && flagged.has(itemId);

  // double click on a list item: placed → same as clicking its grid box,
  // not placed → toggle the red flag. Only after start.
  const activateItem = (itemId) => {
    if (!started) return;
    const index = cells.indexOf(itemId);
    if (index !== -1) {
      toggleMark(index);
      return;
    }
    setFlagged((prev) => {
      const next = new Set(prev);
      if (next.has(itemId)) next.delete(itemId);
      else next.add(itemId);
      return next;
    });
  };

  // derived: port of the legacy checkBingo(). Every line whose 5 boxes are all
  // marked is a bingo; score = number of bingo lines, bingoCells = boxes to highlight.
  const bingoLines = BINGO_LINES.filter((line) => line.every(isMarked));
  const score = bingoLines.length;
  const bingoCells = new Set(bingoLines.flat());
  const isBingoCell = (index) => bingoCells.has(index);

  const dragOverCell = (index) => (e) => {
    if (started) return; // board is locked: no preventDefault, so no drop
    e.preventDefault(); // required, otherwise drop never fires
    e.dataTransfer.dropEffect = "move";
    if (overIndex !== index) setOverIndex(index);
  };

  const leaveCell = (e) => {
    // ignore leave events caused by entering a child element
    if (e.currentTarget.contains(e.relatedTarget)) return;
    setOverIndex(null);
  };

  const dropOnCell = (index) => (e) => {
    e.preventDefault();
    // game started, nothing dragged, or box occupied: don't change the board
    if (started || !dragging || cells[index] !== null) {
      endDrag();
      return;
    }
    setCells((prev) => {
      const next = [...prev];
      if (dragging.from !== null) next[dragging.from] = null; // move inside grid
      next[index] = dragging.itemId;
      return next;
    });
    endDrag(); // source element may unmount, so dragend would never fire
  };

  // Fill every empty cell with a random, not-yet-placed item id
  // (port of the legacy dice button). Occupied cells are kept.
  const fillRandom = (itemIds) => {
    setCells((prev) => {
      const used = new Set(prev.filter((c) => c !== null));
      const pool = itemIds.filter((id) => !used.has(id));
      // Fisher–Yates shuffle
      for (let i = pool.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [pool[i], pool[j]] = [pool[j], pool[i]];
      }
      return prev.map((c) => (c === null && pool.length ? pool.pop() : c));
    });
  };

  // Empty every grid box; all items return to the list. Also ends a running
  // game, which is the only way to leave it now that the game survives reloads.
  const reset = () => {
    setStarted(false);
    setCells(Array(gridSize).fill(null));
    setMarked(new Set());
    setFlagged(new Set());
    endDrag();
  };

  return {
    cells,
    isFull,
    started,
    start,
    fillRandom,
    reset,
    placed,
    dragging,
    overIndex,
    startDrag,
    endDrag,
    endDragFromCell,
    toggleMark,
    isMarked,
    isItemMarked,
    isItemFlagged,
    activateItem,
    score,
    isBingoCell,
    dragOverCell,
    leaveCell,
    dropOnCell,
  };
}