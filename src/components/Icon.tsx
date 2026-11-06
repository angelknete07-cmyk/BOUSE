export function Icon({ name, size = 20 }: { name: string; size?: number }) {
  const paths: Record<string, React.ReactNode> = {
    home: (
      <>
        <rect x="3" y="3" width="7" height="7" rx="1.5" />
        <rect x="14" y="3" width="7" height="7" rx="1.5" />
        <rect x="3" y="14" width="7" height="7" rx="1.5" />
        <rect x="14" y="14" width="7" height="7" rx="1.5" />
      </>
    ),
    book: (
      <>
        <path d="M3 4h6l3 2 3-2h6v15h-6l-3 2-3-2H3zM12 6v15" />
      </>
    ),
    lab: (
      <>
        <path d="M9 3h6M10 3v7L4 20h16l-6-10V3M7 15h10" />
      </>
    ),
    chart: (
      <>
        <path d="M4 3v17h17M8 15l4-5 4 2 5-7" />
      </>
    ),
    idea: (
      <>
        <path d="M9 18h6M10 21h4M8 14a7 7 0 1 1 8 0l-1 2H9z" />
      </>
    ),
    ai: (
      <>
        <path d="m12 2 2.8 7.2L22 12l-7.2 2.8L12 22l-2.8-7.2L2 12l7.2-2.8z" />
      </>
    ),
    radar: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 3v9l7 5M7 8a6 6 0 0 0 7 10" />
        <circle cx="7" cy="8" r="1" />
      </>
    ),
    search: (
      <>
        <circle cx="10.5" cy="10.5" r="6.5" />
        <path d="m16 16 5 5" />
      </>
    ),
    arrow: (
      <>
        <path d="M4 12h16m-6-6 6 6-6 6" />
      </>
    ),
    back: <path d="M20 12H4m6-6-6 6 6 6" />,
    external: <path d="M7 17 17 7M7 7h10v10" />,
    plus: <path d="M12 5v14M5 12h14" />,
    check: <path d="m5 12 4 4L19 6" />,
    clock: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
      </>
    ),
    settings: (
      <>
        <circle cx="12" cy="8" r="4" />
        <path d="M4 21v-3a8 8 0 0 1 16 0v3" />
      </>
    ),
    copy: (
      <>
        <rect x="8" y="8" width="12" height="13" rx="2" />
        <path d="M15 4H4v12" />
      </>
    ),
    edit: <path d="m15 4 5 5M4 20l5-1L21 7l-5-5L4 14z" />,
    close: <path d="m6 6 12 12M6 18 18 6" />,
    menu: <path d="M4 6h16M4 12h16M4 18h16" />,
    node: (
      <>
        <circle cx="6" cy="5" r="3" />
        <circle cx="18" cy="12" r="3" />
        <circle cx="6" cy="20" r="3" />
        <path d="m9 6 6 4M9 18l6-4M6 8v9" />
      </>
    ),
    lock: (
      <>
        <rect x="5" y="10" width="14" height="11" rx="2" />
        <path d="M8 10V7a4 4 0 0 1 8 0v3" />
      </>
    ),
    // Domain icons (passe 26): one fine line drawing per domain.
    building: (
      <>
        <path d="M4 21V5l8-3v19M12 9h8v12M3 21h18" />
        <path d="M7.5 7v.01M7.5 11v.01M7.5 15v.01M15.5 13v.01M15.5 17v.01" />
      </>
    ),
    wallet: (
      <>
        <path d="M4 7a2 2 0 0 1 2-2h12v4" />
        <rect x="3" y="7" width="18" height="13" rx="2" />
        <path d="M16 13.5h2" />
      </>
    ),
    trend: (
      <>
        <path d="m3 17 6-6 4 4 8-8" />
        <path d="M15 7h6v6" />
      </>
    ),
    target: (
      <>
        <circle cx="12" cy="12" r="9" />
        <circle cx="12" cy="12" r="5" />
        <circle cx="12" cy="12" r="1" />
      </>
    ),
    bars: <path d="M5 20v-6M10 20V9M15 20v-8M20 20V4" />,
    layers: <path d="m12 3 9 5-9 5-9-5zM3 13l9 5 9-5M3 17.5l9 5 9-5" />,
    calendar: (
      <>
        <rect x="3.5" y="5" width="17" height="15.5" rx="2.5" />
        <path d="M8 3v4M16 3v4M3.5 10h17M8 14h2M14 14h2M8 17h2" />
      </>
    ),
    chevron: <path d="m9 5 7 7-7 7" />,
    play: <path d="M8 5.5v13l10-6.5z" />,
  };
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[name] || paths.book}
    </svg>
  );
}
