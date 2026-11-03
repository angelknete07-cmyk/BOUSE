import { useId } from "react";

/** A continuous relief, built from shared contour and cross-section geometry. */
export function Terrain() {
  const id = useId().replace(/:/g, "");
  function point(u: number, v: number) {
    const ridge =
      182 *
      Math.exp(-Math.pow((u - 0.57 - v * 0.055) / 0.145, 2)) *
      (0.78 + v * 0.22);
    const shoulder = 75 * Math.exp(-Math.pow((u - 0.88 + v * 0.1) / 0.18, 2));
    const fold = 20 * Math.sin(u * 13 + v * 2.2) * Math.sin(v * Math.PI);
    return [u * 830 + (v - 0.5) * 100, 324 + v * 137 - ridge - shoulder + fold];
  }
  const path = (points: number[][]) =>
    points
      .map(([x, y], i) => `${i ? "L" : "M"}${x!.toFixed(2)},${y!.toFixed(2)}`)
      .join(" ");
  return (
    <svg
      className="terrain-artwork"
      viewBox="0 0 870 500"
      fill="none"
      aria-hidden="true"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <linearGradient id={`${id}-mass`} x1=".2" y1="0" x2=".8" y2="1">
          <stop stopColor="var(--accent)" stopOpacity=".13" />
          <stop offset=".55" stopColor="var(--surface-low)" stopOpacity=".8" />
          <stop offset="1" stopColor="var(--bg)" />
        </linearGradient>
      </defs>
      <g className="terrain-relief" stroke="currentColor" strokeWidth=".7">
        <path
          d={`${path(Array.from({ length: 101 }, (_, i) => point(i / 100, 0)))} L930 510H-60Z`}
          fill={`url(#${id}-mass)`}
          stroke="none"
        />
        {Array.from({ length: 42 }, (_, j) => (
          <path
            key={j}
            d={path(
              Array.from({ length: 101 }, (_, i) => point(i / 100, j / 41)),
            )}
            opacity={0.16 + Math.sin((j / 41) * Math.PI) * 0.5}
          />
        ))}
        {Array.from({ length: 37 }, (_, j) => (
          <path
            key={`c${j}`}
            d={path(
              Array.from({ length: 43 }, (_, i) => point(j / 36, i / 42)),
            )}
            opacity=".10"
            strokeWidth=".5"
          />
        ))}
      </g>
    </svg>
  );
}
