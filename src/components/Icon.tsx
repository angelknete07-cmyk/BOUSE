export function Icon({ name, size = 20 }: { name: string; size?: number }) {
  const paths: Record<string, React.ReactNode> = {
    home: (
      <>
        <rect x="3.5" y="3.5" width="7" height="7" rx="2.2" />
        <rect x="13.5" y="3.5" width="7" height="7" rx="2.2" />
        <rect x="3.5" y="13.5" width="7" height="7" rx="2.2" />
        <rect x="13.5" y="13.5" width="7" height="7" rx="3.5" />
      </>
    ),
    book: (
      <>
        <path d="M12 6.5C10 5 7.2 4.6 4 5v13c3.2-.4 6 0 8 1.5 2-1.5 4.8-1.9 8-1.5V5c-3.2-.4-6 0-8 1.5ZM12 6.5v13" />
      </>
    ),
    lab: (
      <>
        <path d="M9.5 3.5h5M10 3.5v5.2L5.2 17a2.3 2.3 0 0 0 2 3.5h9.6a2.3 2.3 0 0 0 2-3.5L14 8.7V3.5M7.4 14h9.2" />
      </>
    ),
    chart: (
      <>
        <path d="M4 19.5h16M5 15.5c2.5 0 3-5 6-5s3 3 5.5 3S19 7 20 5.5" />
      </>
    ),
    idea: (
      <>
        <path d="M9 17.5h6M10 20.5h4M8.5 14.5a6 6 0 1 1 7 0c-.6.5-1 1.2-1 2v1h-5v-1c0-.8-.4-1.5-1-2Z" />
      </>
    ),
    ai: (
      <>
        <path d="M12 3.5c.6 3.9 2.6 5.9 6.5 6.5-3.9.6-5.9 2.6-6.5 6.5-.6-3.9-2.6-5.9-6.5-6.5 3.9-.6 5.9-2.6 6.5-6.5ZM18.5 15.5c.3 1.6 1 2.3 2.5 2.5-1.5.3-2.2 1-2.5 2.5-.3-1.5-1-2.2-2.5-2.5 1.5-.2 2.2-.9 2.5-2.5Z" />
      </>
    ),
    radar: (
      <>
        <circle cx="12" cy="12" r="8.5" />
        <path d="m15.5 8.5-2 5-5 2 2-5 5-2Z" />
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
        <path d="M4.5 12a7.5 7.5 0 1 0 2.2-5.3M4 4.5v3.2h3.2M12 8v4.2l2.8 1.8" />
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
        <circle cx="6" cy="6" r="2.3" />
        <circle cx="6" cy="18" r="2.3" />
        <circle cx="18" cy="12" r="2.3" />
        <path d="M6 8.3v7.4M8 7.2l7.9 3.7M8 16.8l7.9-3.7" />
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
