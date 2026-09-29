const paths = {
  envelope: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3.5 7 8.5 6 8.5-6" />
    </>
  ),
  pin: (
    <>
      <path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21Z" />
      <circle cx="12" cy="9.5" r="2.5" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </>
  ),
  faq: (
    <>
      <path d="M21 12a8.5 8.5 0 0 1-12.3 7.6L4 20.5l1-4.3A8.5 8.5 0 1 1 21 12Z" />
      <path d="M9.9 9.6a2.2 2.2 0 0 1 4.2.9c0 1.5-2.1 1.9-2.1 3.1" />
      <path d="M12 16.4h.01" />
    </>
  ),
  image: (
    <>
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <circle cx="9" cy="10" r="1.8" />
      <path d="m21 15.5-4.5-4.5L7 20" />
    </>
  ),
  hourglass: (
    <>
      <path d="M6 3h12M6 21h12" />
      <path d="M8 3v3.2a4 4 0 0 0 1.6 3.2L12 11.5l2.4-2.1A4 4 0 0 0 16 6.2V3" />
      <path d="M8 21v-3.2a4 4 0 0 1 1.6-3.2l2.4-2.1 2.4 2.1a4 4 0 0 1 1.6 3.2V21" />
    </>
  ),
  rsvp: (
    <>
      <rect x="5" y="4" width="14" height="17" rx="2" />
      <path d="M9 4V2.8h6V4" />
      <path d="m9 12.5 2.2 2.2L15.5 10" />
    </>
  ),
  seating: (
    <>
      <circle cx="12" cy="12" r="4.5" />
      <circle cx="12" cy="3.8" r="1.5" />
      <circle cx="12" cy="20.2" r="1.5" />
      <circle cx="3.8" cy="12" r="1.5" />
      <circle cx="20.2" cy="12" r="1.5" />
    </>
  ),
  placecard: (
    <>
      <path d="M3.5 19 7 6h10l3.5 13Z" />
      <path d="M9 13.5h6" />
    </>
  ),
  sheet: (
    <>
      <rect x="4" y="3" width="16" height="18" rx="2" />
      <path d="M4 9h16M4 15h16M10 3v18" />
    </>
  ),
  check: <path d="m5 12.5 4.5 4.5L19 7.5" />,
  arrow: <path d="M5 12h14m-5.5-6 6 6-6 6" />,
  down: <path d="M12 5v14m-6-5.5 6 6 6-6" />,
  plus: <path d="M12 5v14M5 12h14" />,
  gift: (
    <>
      <rect x="3.5" y="8" width="17" height="4" rx="1" />
      <path d="M5 12v8h14v-8M12 8v12" />
      <path d="M12 8S11 4 8.5 4a2 2 0 0 0 0 4H12Zm0 0s1-4 3.5-4a2 2 0 0 1 0 4H12Z" />
    </>
  ),
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
}

export default function Icon({ name, size = 20, className }) {
  return (
    <svg
      className={className}
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
      {paths[name]}
    </svg>
  )
}

export function MessengerIcon({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M12 2C6.36 2 2 6.13 2 11.7c0 2.91 1.19 5.44 3.14 7.17.16.14.26.35.27.57l.05 1.78c.02.57.6.94 1.12.71l1.98-.87c.17-.08.36-.09.54-.04.91.25 1.87.38 2.9.38 5.64 0 10-4.13 10-9.7S17.64 2 12 2Zm6 7.46-2.93 4.65a1.5 1.5 0 0 1-2.17.4l-2.33-1.75a.6.6 0 0 0-.72 0l-3.15 2.39c-.42.32-.97-.18-.69-.63l2.93-4.65a1.5 1.5 0 0 1 2.17-.4l2.33 1.75a.6.6 0 0 0 .72 0l3.15-2.39c.42-.32.97.18.69.63Z"
      />
    </svg>
  )
}
