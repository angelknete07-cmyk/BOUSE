import { useId } from "react";

/**
 * The BOUSE mark: a silver « B » drawn as folded ribbons, lit from the top
 * right. Decorative: the brand name is always written next to it.
 */
export function BrandLogo({ size = 34 }: { size?: number }) {
  const id = useId().replace(/:/g, "");
  return (
    <svg
      className="brand-logo"
      width={size}
      height={size}
      viewBox="0 0 40 40"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id={`${id}-metal`} x1="0.85" y1="0" x2="0.1" y2="1">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="0.38" stopColor="#d9d9de" />
          <stop offset="0.7" stopColor="#8d8d95" />
          <stop offset="1" stopColor="#4a4a52" />
        </linearGradient>
        <linearGradient id={`${id}-shade`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#6c6c74" />
          <stop offset="1" stopColor="#2c2c32" />
        </linearGradient>
      </defs>
      {/* Back ribbons, in shadow, give the fold its depth. */}
      <path
        d="M11.6 6.2 8.4 33.6"
        stroke={`url(#${id}-shade)`}
        strokeWidth="5.4"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M12.4 6.4H23.2C30.2 6.4 31.4 14.2 25.4 17.6 23 19 19.6 19.4 15.6 19.4"
        stroke={`url(#${id}-metal)`}
        strokeWidth="4.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <path
        d="M14.4 21.2H25.4C33.4 21.2 34.2 31.6 25.6 33.4 22.4 34.1 15.4 33.9 8.8 33.7"
        stroke={`url(#${id}-metal)`}
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      {/* A thin highlight runs along the lit edge of each ribbon. */}
      <path
        d="M14 5.2H23.2C27.6 5.2 30 7.6 30.4 10.6M16 20H25.6C30.4 20 33 22.6 33.4 26"
        stroke="#ffffff"
        strokeOpacity="0.75"
        strokeWidth="0.8"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}
