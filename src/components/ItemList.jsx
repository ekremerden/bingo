import { markedBgClass, markedClasses } from "@/components/markedClasses.js";
import { useDoubleTap } from "@/hooks/useDoubleTap.js";

export default function ItemList({
  items,
  dnd,
  onlyPlaced = false,
  query = "",
  onItemActivated,
}) {
  const {
    placed,
    started,
    dragging,
    selected,
    tapItem,
    startDrag,
    endDrag,
    isItemMarked,
    isItemFlagged,
    activateItem,
  } = dnd;
  const handleTap = useDoubleTap();

  // case-insensitive text match, or an exact id match (the board shows ids)
  const q = query.trim().toLocaleLowerCase("de");
  const visibleItems = items.filter(
    (item) =>
      (!onlyPlaced || placed.has(item.id)) &&
      (!q ||
        String(item.id) === q ||
        item.text.toLocaleLowerCase("de").includes(q)),
  );

  return (
    <ol className="columns-2 gap-4 sm:columns-2 lg:columns-2">
      {visibleItems.map((item) => {
        const isPlaced = placed.has(item.id);
        const isBeingDragged =
          dragging?.itemId === item.id && dragging.from === null;
        const isSelected = selected?.itemId === item.id;

        return (
          <li
            key={item.id}
            draggable={!isPlaced} // replaces the dragstart + preventDefault
            onDragStart={startDrag(item.id, null)}
            onDragEnd={endDrag}
            // keep the double click from selecting a word
            onMouseDown={(e) => e.detail > 1 && e.preventDefault()}
            // setup: single tap selects for tap-to-place; game: double tap marks/flags
            onClick={(e) =>
              started
                ? handleTap(item.id, e, () => {
                    activateItem(item.id);
                    onItemActivated?.();
                  })
                : tapItem(item.id)
            }
            // touch-manipulation: no double-tap-to-zoom, so the 2nd tap reaches us
            className={`flex touch-manipulation items-center break-inside-avoid min-h-7
              gap-1 border-t border-black/20 ${
              isPlaced ? "font-bold" : "cursor-grab"
            } ${isBeingDragged ? "opacity-100 text-[#227679]" : ""} ${
              isSelected ? "bg-[#227679]/15 text-[#227679]" : ""
            } ${onlyPlaced ? "min-h-7" : ""} ${
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
