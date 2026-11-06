/**
 * A silver progress ring. The value is shown in text next to or inside the
 * ring, so the ring itself stays decorative for assistive technologies.
 */
export function ProgressRing({
  value,
  size = 56,
  stroke = 4,
  label,
}: {
  /** Between 0 and 1. */
  value: number;
  size?: number;
  stroke?: number;
  /** Text shown in the centre, such as « 33 % ». */
  label?: string;
}) {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.max(0, Math.min(1, value));
  return (
    <span
      className="progress-ring"
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle
          className="progress-ring-track"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={stroke}
        />
        <circle
          className="progress-ring-value"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={stroke}
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - clamped)}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </svg>
      {label && <span className="progress-ring-label">{label}</span>}
    </span>
  );
}

/** A silver bar; the caller writes the value in text beside it. */
export function ProgressBar({ value }: { value: number }) {
  return (
    <span className="progress-bar" aria-hidden="true">
      <i style={{ width: `${Math.max(0, Math.min(1, value)) * 100}%` }} />
    </span>
  );
}
