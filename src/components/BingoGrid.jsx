import { items } from "@/items.js";
import { markedBgClass, markedClasses } from "@/components/markedClasses.js";
import { useDoubleTap } from "@/hooks/useDoubleTap.js";

const textById = new Map(items.map((item) => [item.id, item.text]));

export default function BingoGrid({ dnd }) {
  const {
    cells,
    started,
    dragging,
    overIndex,
    startDrag,
    endDragFromCell,
    toggleMark,
    isMarked,
    isBingoCell,
    dragOverCell,
    leaveCell,
    dropOnCell,
  } = dnd;
  // double tap marks a cell, so a stray tap doesn't (un)mark it by mistake
  const handleTap = useDoubleTap();

  return (
    <div className="grid grid-cols-5 w-80 select-none border border-gray-400">
      {cells.map((itemId, index) => (
        <div
          key={index}
          onDragOver={dragOverCell(index)}
          onDragLeave={leaveCell}
          onDrop={dropOnCell(index)}
          onClick={(e) => handleTap(index, e, () => toggleMark(index))}
          // touch-manipulation: no double-tap-to-zoom, so the 2nd tap reaches us
          className={`relative touch-manipulation aspect-square border border-gray-400 ${
            overIndex === index ? "bg-blue-100 ring-2 ring-blue-400 ring-inset" : ""
          } ${isMarked(index) ? markedClasses : ""}`}
        >
          {itemId !== null && (
            <div
              draggable={!started} // board is locked once the game started
              title={textById.get(itemId)}
              onDragStart={startDrag(itemId, index)}
              onDragEnd={endDragFromCell(index)}
              // bingo highlight (legacy .bingo-highlight) replaces the gray background
              className={`flex h-full w-full ${started ? "cursor-pointer" : "cursor-grab"} items-center justify-center font-medium text-[1.5rem] transition-colors duration-1000 ${
                isBingoCell(index)
                  ? "bg-[rgba(49,161,165,0.251)]"
                  : isMarked(index)
                    ? markedBgClass
                    : "bg-gray-50"
              } ${
                dragging?.from === index ? "opacity-50" : ""
              }`}
            >
              {itemId}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}