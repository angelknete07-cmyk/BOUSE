import { useEffect, useState } from "react";

/** Refresh scheduled UI when time passes or a background tab becomes active. */
export function useClock() {
  const [, setTick] = useState(0);
  useEffect(() => {
    const refresh = () => setTick((tick) => tick + 1);
    const timer = window.setInterval(refresh, 60_000);
    window.addEventListener("focus", refresh);
    document.addEventListener("visibilitychange", refresh);
    return () => {
      window.clearInterval(timer);
      window.removeEventListener("focus", refresh);
      document.removeEventListener("visibilitychange", refresh);
    };
  }, []);
  // A new quiz or review may trigger a render between timer ticks. Its timestamp
  // must be compared with the real current time, not the previous minute's time.
  return new Date();
}
