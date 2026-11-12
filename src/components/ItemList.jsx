import { useRef } from "react";
import { markedBgClass, markedClasses } from "@/components/markedClasses.js";

// max gap between two taps/clicks on the same item to count as a double tap
const DOUBLE_TAP_MS = 350;

export default function ItemList({ items, dnd, onlyPlaced = false }) {
  const {
    placed,
    dragging,
    startDrag,
    endDrag,
    isItemMarked,
    isItemFlagged,
    activateItem,
  } = dnd;
  // onDoubleClick is unreliable on mobile (iOS Safari, Chrome Android), so we
  // detect the double tap ourselves from two clicks; works for mouse too.
  const lastTap = useRef({ itemId: null, time: 0 });
  const handleTap = (itemId, e) => {
    const now = e.timeStamp; // ms, monotonic
    const prev = lastTap.current;
    if (prev.itemId === itemId && now - prev.time < DOUBLE_TAP_MS) {
      lastTap.current = { itemId: null, time: 0 }; // a third tap starts over
      activateItem(itemId);
    } else {
      lastTap.current = { itemId, time: now };
    }
  };

  const visibleItems = onlyPlaced
    ? items.filter((item) => placed.has(item.id))
    : items;

  return (
    <ol className="columns-2 gap-6 sm:columns-2 lg:columns-3">
      {visibleItems.map((item) => {
        const isPlaced = placed.has(item.id);
        const isBeingDragged =
          dragging?.itemId === item.id && dragging.from === null;

        return (
          <li
            key={item.id}
            draggable={!isPlaced} // replaces the dragstart + preventDefault
            onDragStart={startDrag(item.id, null)}
            onDragEnd={endDrag}
            // keep the double click from selecting a word
            onMouseDown={(e) => e.detail > 1 && e.preventDefault()}
            onClick={(e) => handleTap(item.id, e)}
            // touch-manipulation: no double-tap-to-zoom, so the 2nd tap reaches us
            className={`flex touch-manipulation items-center break-inside-avoid gap-2 border-t border-black/20 ${
              isPlaced ? "font-bold" : "cursor-grab"
            } ${isBeingDragged ? "opacity-100 text-[#227679]" : ""} ${onlyPlaced ? "min-h-7" : ""} ${
              isItemFlagged(item.id)
                ? "bg-red-100"
                : isItemMarked(item.id)
                  ? markedBgClass
                  : ""
            }`}
          >
            <span
              className={`relative w-6 shrink-0 text-right tabular-nums ${
                isItemMarked(item.id) ? markedClasses : ""
              }`}
            >
              {item.id}.
            </span>
            <span className={item.bold ? "font-bold" : undefined}>
              {item.text}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
