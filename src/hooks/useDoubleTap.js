import { useRef } from "react";

// max gap between two taps/clicks on the same target to count as a double tap
export const DOUBLE_TAP_MS = 350;

// onDoubleClick is unreliable on mobile (iOS Safari, Chrome Android), so we
// detect the double tap ourselves from two clicks; works for mouse too.
// Returns handleTap(key, event, action): runs action() on the 2nd tap on the
// same key within DOUBLE_TAP_MS. Pair it with the `touch-manipulation` class
// on the target so double-tap-to-zoom doesn't swallow the 2nd tap.
export function useDoubleTap() {
  const lastTap = useRef({ key: null, time: 0 });
  return (key, e, action) => {
    const now = e.timeStamp; // ms, monotonic
    const prev = lastTap.current;
    if (prev.key === key && now - prev.time < DOUBLE_TAP_MS) {
      lastTap.current = { key: null, time: 0 }; // a third tap starts over
      action();
    } else {
      lastTap.current = { key, time: now };
    }
  };
}
