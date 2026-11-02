/** Original contour artwork: decorative, monochrome and entirely static. */
export function Terrain() {
  const contours = Array.from({ length: 32 }, (_, line) => {
    const points = Array.from({ length: 85 }, (_, step) => {
      const x = step * 8;
      const ridge = 145 * Math.exp(-((x - 395) ** 2) / 17000);
      const shoulder = 56 * Math.exp(-((x - 590) ** 2) / 6500);
      const y =
        260 +
        line * 5.8 -
        ridge * (1 - line * 0.012) -
        shoulder +
        Math.sin(x / 53 + line * 0.07) * 5;
      return `${step === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
    }).join(" ");
    return <path key={line} d={points} opacity={0.18 + (31 - line) / 70} />;
  });
  return (
    <svg
      className="terrain-artwork"
      viewBox="0 0 672 450"
      fill="none"
      aria-hidden="true"
      preserveAspectRatio="xMidYMid slice"
    >
      <g stroke="currentColor" strokeWidth="0.65">
        {contours}
      </g>
    </svg>
  );
}
