import React from "react";

type IconProps = React.SVGProps<SVGSVGElement>;

const base = (children: React.ReactNode, props: IconProps) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.8}
    strokeLinecap="round"
    strokeLinejoin="round"
    width={20}
    height={20}
    {...props}
  >
    {children}
  </svg>
);

export const IconDashboard = (p: IconProps) =>
  base(
    <>
      <rect x="3" y="3" width="7" height="9" rx="1.5" />
      <rect x="14" y="3" width="7" height="5" rx="1.5" />
      <rect x="14" y="12" width="7" height="9" rx="1.5" />
      <rect x="3" y="16" width="7" height="5" rx="1.5" />
    </>,
    p
  );

export const IconUpload = (p: IconProps) =>
  base(
    <>
      <path d="M12 16V4" />
      <path d="M6 10l6-6 6 6" />
      <path d="M4 20h16" />
    </>,
    p
  );

export const IconFactory = (p: IconProps) =>
  base(
    <>
      <path d="M3 21V9l6 4V9l6 4V9l6 4v8H3z" />
      <path d="M3 21h18" />
    </>,
    p
  );

export const IconBox = (p: IconProps) =>
  base(
    <>
      <path d="M21 8l-9-5-9 5 9 5 9-5z" />
      <path d="M3 8v8l9 5 9-5V8" />
      <path d="M12 13v8" />
    </>,
    p
  );

export const IconTruck = (p: IconProps) =>
  base(
    <>
      <rect x="1" y="7" width="13" height="10" rx="1" />
      <path d="M14 10h4l3 3v4h-7z" />
      <circle cx="6" cy="19" r="1.6" />
      <circle cx="17" cy="19" r="1.6" />
    </>,
    p
  );

export const IconBell = (p: IconProps) =>
  base(
    <>
      <path d="M6 9a6 6 0 0 1 12 0c0 5 2 6 2 6H4s2-1 2-6" />
      <path d="M10 20a2 2 0 0 0 4 0" />
    </>,
    p
  );

export const IconAlert = (p: IconProps) =>
  base(
    <>
      <path d="M12 3l10 18H2L12 3z" />
      <path d="M12 10v4" />
      <path d="M12 17.5h.01" />
    </>,
    p
  );

export const IconCheck = (p: IconProps) => base(<path d="M20 6L9 17l-5-5" />, p);

export const IconX = (p: IconProps) =>
  base(
    <>
      <path d="M18 6L6 18" />
      <path d="M6 6l12 12" />
    </>,
    p
  );

export const IconMail = (p: IconProps) =>
  base(
    <>
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="M2 6l10 7 10-7" />
    </>,
    p
  );

export const IconChevronRight = (p: IconProps) => base(<path d="M9 6l6 6-6 6" />, p);

export const IconLogout = (p: IconProps) =>
  base(
    <>
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <path d="M16 17l5-5-5-5" />
      <path d="M21 12H9" />
    </>,
    p
  );

export const IconSend = (p: IconProps) =>
  base(
    <>
      <path d="M22 2L11 13" />
      <path d="M22 2l-7 20-4-9-9-4 20-7z" />
    </>,
    p
  );

export const IconClock = (p: IconProps) =>
  base(
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 3" />
    </>,
    p
  );

export const IconUsers = (p: IconProps) =>
  base(
    <>
      <circle cx="9" cy="8" r="3.2" />
      <path d="M2.5 20c0-3.6 2.9-6 6.5-6s6.5 2.4 6.5 6" />
      <circle cx="17.5" cy="9" r="2.6" />
      <path d="M15.8 14.3c2.6.4 4.7 2.4 4.7 5.7" />
    </>,
    p
  );

export const IconSparkles = (p: IconProps) =>
  base(
    <>
      <path d="M12 2l1.8 5.2L19 9l-5.2 1.8L12 16l-1.8-5.2L5 9l5.2-1.8L12 2z" />
      <path d="M19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8L19 15z" />
    </>,
    p
  );
