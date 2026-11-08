// X symbol on a marked element (port of .grid-box.is-marked::before/::after).
// The element using it needs `relative` positioning.
export const markedClasses = [
  "before:absolute before:left-0 before:top-1/2 before:h-px before:w-full before:rotate-45",
  "after:absolute after:left-0 after:top-1/2 after:h-px after:w-full after:-rotate-45",
  "before:bg-[rgba(49,161,165,0.755)] after:bg-[rgba(49,161,165,0.755)]",
  "before:pointer-events-none after:pointer-events-none",
].join(" ");
