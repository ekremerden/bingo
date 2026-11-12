// X symbol on a marked element (port of .grid-box.is-marked::before/::after).
// The element using it needs `relative` positioning.
export const markedClasses = [
  "before:absolute before:left-0 before:top-1/2 before:h-[3px] before:w-[105%] before:rotate-45",
  "after:absolute after:left-0 after:top-1/2 after:h-[3px] after:w-[105%] after:-rotate-45",
  "before:bg-[rgba(49,161,165,0.5)] after:bg-[rgba(49,161,165,0.5)]",
  "before:pointer-events-none after:pointer-events-none",
].join(" ");

// Background of a marked board cell / list row.
export const markedBgClass = "bg-gray-200";
