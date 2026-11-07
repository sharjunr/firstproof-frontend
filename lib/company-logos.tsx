import React from "react";

interface BrandSpec {
  bg: string;
  fg: string;
  accent?: string;
  render?: () => React.ReactNode;
  label?: string;
}

const BRANDS: Record<string, BrandSpec> = {
  AMD: {
    bg: "#111418",
    fg: "#ffffff",
    accent: "#00a896",
    render: () => (
      <svg viewBox="0 0 48 48" width="100%" height="100%" aria-hidden="true">
        <rect width="48" height="48" rx="10" fill="#111418" />
        {/* AMD text + signature arrow */}
        <text
          x="6"
          y="29"
          fill="#ffffff"
          fontFamily="Inter, system-ui, sans-serif"
          fontWeight="900"
          fontSize="12.5"
          letterSpacing="-0.4"
        >
          AMD
        </text>
        <path d="M35 15H43V23L39.5 19.5H35V15Z" fill="#00b49c" />
        <path d="M35 20.5L38.5 24V28H34.5L35 20.5Z" fill="#00b49c" />
      </svg>
    ),
  },
  "Skyworks Solutions": {
    bg: "#005a9c",
    fg: "#ffffff",
    render: () => (
      <svg viewBox="0 0 48 48" width="100%" height="100%" aria-hidden="true">
        <rect width="48" height="48" rx="10" fill="#005a9c" />
        <path
          d="M10 28C14 17 24 13 38 16C28 19 20 24 15 33L10 28Z"
          fill="#4cc3ff"
        />
        <path
          d="M14 33C19 25 27 22 38 23C30 26 24 30 20 36L14 33Z"
          fill="#ffffff"
        />
        <text
          x="24"
          y="14"
          textAnchor="middle"
          fill="#ffffff"
          fontFamily="Inter, system-ui, sans-serif"
          fontWeight="800"
          fontSize="6.5"
          letterSpacing="0.8"
        >
          SKYWORKS
        </text>
      </svg>
    ),
  },
  "MDA Space": {
    bg: "#0b192c",
    fg: "#ffffff",
    render: () => (
      <svg viewBox="0 0 48 48" width="100%" height="100%" aria-hidden="true">
        <rect width="48" height="48" rx="10" fill="#0b192c" />
        <path
          d="M8 32C15 18 29 12 41 15"
          stroke="#ff3b30"
          strokeWidth="2.8"
          strokeLinecap="round"
          fill="none"
        />
        <circle cx="38" cy="14.5" r="2.5" fill="#ff3b30" />
        <text
          x="24"
          y="30"
          textAnchor="middle"
          fill="#ffffff"
          fontFamily="Inter, system-ui, sans-serif"
          fontWeight="900"
          fontSize="12"
          letterSpacing="0.6"
        >
          MDA
        </text>
      </svg>
    ),
  },
  NVIDIA: {
    bg: "#1a1f16",
    fg: "#76b900",
    render: () => (
      <svg viewBox="0 0 48 48" width="100%" height="100%" aria-hidden="true">
        <rect width="48" height="48" rx="10" fill="#141812" />
        <path
          d="M10 24C14 16 23 13 33 17C26 17 19 20 16 24C19 28 26 29 33 27C25 33 15 31 10 24Z"
          fill="#76b900"
        />
        <circle cx="24" cy="23.5" r="4" fill="#76b900" />
        <circle cx="24" cy="23.5" r="1.8" fill="#141812" />
        <text
          x="24"
          y="40"
          textAnchor="middle"
          fill="#ffffff"
          fontFamily="Inter, system-ui, sans-serif"
          fontWeight="800"
          fontSize="7.2"
          letterSpacing="1"
        >
          NVIDIA
        </text>
      </svg>
    ),
  },
  "Thermo Fisher Scientific": {
    bg: "#e31837",
    fg: "#ffffff",
    render: () => (
      <svg viewBox="0 0 48 48" width="100%" height="100%" aria-hidden="true">
        <rect width="48" height="48" rx="10" fill="#e31837" />
        <text
          x="24"
          y="22"
          textAnchor="middle"
          fill="#ffffff"
          fontFamily="Inter, system-ui, sans-serif"
          fontWeight="900"
          fontSize="9"
          letterSpacing="-0.2"
        >
          Thermo
        </text>
        <text
          x="24"
          y="33"
          textAnchor="middle"
          fill="#ffffff"
          fontFamily="Inter, system-ui, sans-serif"
          fontWeight="800"
          fontSize="9"
          letterSpacing="-0.2"
        >
          Fisher
        </text>
      </svg>
    ),
  },
  Shopify: {
    bg: "#95bf47",
    fg: "#ffffff",
    render: () => (
      <svg viewBox="0 0 48 48" width="100%" height="100%" aria-hidden="true">
        <rect width="48" height="48" rx="10" fill="#f3f8ec" />
        <path
          d="M15 16L31 14L35 37L13 37L15 16Z"
          fill="#95bf47"
        />
        <path d="M31 14L35 37L29 37L28 14.5L31 14Z" fill="#5e8e3e" />
        <path
          d="M20 16C20 12.5 22 10.5 24 10.5C26 10.5 27.5 12.5 27.5 15.5"
          stroke="#5e8e3e"
          strokeWidth="2.2"
          fill="none"
          strokeLinecap="round"
        />
        <text
          x="23.5"
          y="31"
          textAnchor="middle"
          fill="#ffffff"
          fontFamily="Georgia, serif"
          fontWeight="900"
          fontStyle="italic"
          fontSize="16"
        >
          S
        </text>
      </svg>
    ),
  },
  Figma: {
    bg: "#1e1e1e",
    fg: "#ffffff",
    render: () => (
      <svg viewBox="0 0 48 48" width="100%" height="100%" aria-hidden="true">
        <rect width="48" height="48" rx="10" fill="#1e1e1e" />
        {/* Figma 5 droplets */}
        <path d="M18 10H24V18H18C15.8 18 14 16.2 14 14C14 11.8 15.8 10 18 10Z" fill="#f24e1e" />
        <path d="M24 10H30C32.2 10 34 11.8 34 14C34 16.2 32.2 18 30 18H24V10Z" fill="#ff7262" />
        <circle cx="29" cy="23" r="4.5" fill="#1abcfe" />
        <path d="M18 19H24V27H18C15.8 27 14 25.2 14 23C14 20.8 15.8 19 18 19Z" fill="#a259ff" />
        <path d="M18 28H24V33C24 35.5 22 37.5 19.5 37.5C17 37.5 15 35.5 15 33C15 30.2 16.2 28 18 28Z" fill="#0acf83" />
      </svg>
    ),
  },
  Celestica: {
    bg: "#005daa",
    fg: "#ffffff",
    render: () => (
      <svg viewBox="0 0 48 48" width="100%" height="100%" aria-hidden="true">
        <rect width="48" height="48" rx="10" fill="#005daa" />
        <circle
          cx="24"
          cy="24"
          r="12"
          stroke="#ffffff"
          strokeWidth="3.5"
          strokeDasharray="54 22"
          fill="none"
        />
        <circle cx="33" cy="16" r="3" fill="#4cc3ff" />
      </svg>
    ),
  },
  Stripe: {
    bg: "#635bff",
    fg: "#ffffff",
    render: () => (
      <svg viewBox="0 0 48 48" width="100%" height="100%" aria-hidden="true">
        <rect width="48" height="48" rx="10" fill="#635bff" />
        <text
          x="24"
          y="33"
          textAnchor="middle"
          fill="#ffffff"
          fontFamily="Inter, system-ui, sans-serif"
          fontWeight="900"
          fontSize="26"
          letterSpacing="-1"
        >
          S
        </text>
      </svg>
    ),
  },
  Datadog: {
    bg: "#632ca6",
    fg: "#ffffff",
    label: "DD",
  },
  Cloudflare: {
    bg: "#f38020",
    fg: "#ffffff",
    render: () => (
      <svg viewBox="0 0 48 48" width="100%" height="100%" aria-hidden="true">
        <rect width="48" height="48" rx="10" fill="#f38020" />
        <path
          d="M14 31H35C37.8 31 40 28.8 40 26C40 23.4 38 21.3 35.5 21C34.5 16.5 30.5 13 25.8 13C20.8 13 16.7 16.6 16 21.4C13.2 21.9 11 24.3 11 27.2C11 29.3 12.3 31 14 31Z"
          fill="#ffffff"
        />
      </svg>
    ),
  },
  Siemens: {
    bg: "#009999",
    fg: "#ffffff",
    render: () => (
      <svg viewBox="0 0 48 48" width="100%" height="100%" aria-hidden="true">
        <rect width="48" height="48" rx="10" fill="#009999" />
        <text
          x="24"
          y="27"
          textAnchor="middle"
          fill="#ffffff"
          fontFamily="Inter, system-ui, sans-serif"
          fontWeight="900"
          fontSize="8.2"
          letterSpacing="0.5"
        >
          SIEMENS
        </text>
      </svg>
    ),
  },
  RBC: {
    bg: "#0051a5",
    fg: "#ffd200",
    render: () => (
      <svg viewBox="0 0 48 48" width="100%" height="100%" aria-hidden="true">
        <rect width="48" height="48" rx="10" fill="#0051a5" />
        <text
          x="24"
          y="29"
          textAnchor="middle"
          fill="#ffd200"
          fontFamily="Inter, system-ui, sans-serif"
          fontWeight="900"
          fontSize="14"
          letterSpacing="0.5"
        >
          RBC
        </text>
      </svg>
    ),
  },
  "TD Bank": {
    bg: "#008a00",
    fg: "#ffffff",
    render: () => (
      <svg viewBox="0 0 48 48" width="100%" height="100%" aria-hidden="true">
        <rect width="48" height="48" rx="10" fill="#008a00" />
        <text
          x="24"
          y="31"
          textAnchor="middle"
          fill="#ffffff"
          fontFamily="Inter, system-ui, sans-serif"
          fontWeight="900"
          fontSize="18"
          letterSpacing="-0.5"
        >
          TD
        </text>
      </svg>
    ),
  },
  Deloitte: {
    bg: "#000000",
    fg: "#ffffff",
    render: () => (
      <svg viewBox="0 0 48 48" width="100%" height="100%" aria-hidden="true">
        <rect width="48" height="48" rx="10" fill="#000000" />
        <text
          x="20"
          y="32"
          textAnchor="middle"
          fill="#ffffff"
          fontFamily="Inter, system-ui, sans-serif"
          fontWeight="900"
          fontSize="22"
        >
          D
        </text>
        <circle cx="33" cy="29" r="3.5" fill="#86bc25" />
      </svg>
    ),
  },
  Canva: {
    bg: "#00c4cc",
    fg: "#ffffff",
    render: () => (
      <svg viewBox="0 0 48 48" width="100%" height="100%" aria-hidden="true">
        <rect width="48" height="48" rx="10" fill="#00c4cc" />
        <text
          x="24"
          y="32"
          textAnchor="middle"
          fill="#ffffff"
          fontFamily="Georgia, serif"
          fontWeight="900"
          fontStyle="italic"
          fontSize="24"
        >
          C
        </text>
      </svg>
    ),
  },
  Adobe: {
    bg: "#fa0f00",
    fg: "#ffffff",
    render: () => (
      <svg viewBox="0 0 48 48" width="100%" height="100%" aria-hidden="true">
        <rect width="48" height="48" rx="10" fill="#fa0f00" />
        <path
          d="M21 12L11 36H17L24 19L31 36H37L27 12H21ZM24 25L21 32H27L24 25Z"
          fill="#ffffff"
        />
      </svg>
    ),
  },
  HubSpot: {
    bg: "#ff7a59",
    fg: "#ffffff",
    render: () => (
      <svg viewBox="0 0 48 48" width="100%" height="100%" aria-hidden="true">
        <rect width="48" height="48" rx="10" fill="#ff7a59" />
        <circle cx="25" cy="25" r="6.5" stroke="#ffffff" strokeWidth="3.2" fill="none" />
        <line x1="25" y1="12" x2="25" y2="18.5" stroke="#ffffff" strokeWidth="3.2" />
        <line x1="30" y1="29" x2="36" y2="35" stroke="#ffffff" strokeWidth="3.2" />
        <line x1="19" y1="28" x2="13" y2="33" stroke="#ffffff" strokeWidth="3.2" />
        <circle cx="25" cy="11" r="2.8" fill="#ffffff" />
        <circle cx="37" cy="35.5" r="2.8" fill="#ffffff" />
        <circle cx="12.5" cy="33.5" r="2.8" fill="#ffffff" />
      </svg>
    ),
  },
  Spotify: {
    bg: "#1db954",
    fg: "#ffffff",
    render: () => (
      <svg viewBox="0 0 48 48" width="100%" height="100%" aria-hidden="true">
        <rect width="48" height="48" rx="10" fill="#1db954" />
        <path d="M13 19C21 16.5 29 17 36 20.5" stroke="#121212" strokeWidth="3.2" strokeLinecap="round" fill="none" />
        <path d="M15 25C21.5 23 27.5 23.5 33.5 26.5" stroke="#121212" strokeWidth="2.8" strokeLinecap="round" fill="none" />
        <path d="M17 31C22 29.5 27 30 31.5 32" stroke="#121212" strokeWidth="2.4" strokeLinecap="round" fill="none" />
      </svg>
    ),
  },
  Nike: {
    bg: "#111111",
    fg: "#ffffff",
    render: () => (
      <svg viewBox="0 0 48 48" width="100%" height="100%" aria-hidden="true">
        <rect width="48" height="48" rx="10" fill="#111111" />
        <path
          d="M14 29C11.5 29 10 27 11.5 23.5C13 20 16 17 16 17C14.5 21 15.5 24 19.5 23.5L38 18.5L20 30C17.5 31.2 15.5 29 14 29Z"
          fill="#ffffff"
        />
      </svg>
    ),
  },
};

const PALETTE: Array<{ bg: string; fg: string }> = [
  { bg: "#0969da", fg: "#ffffff" },
  { bg: "#1f2328", fg: "#ffffff" },
  { bg: "#005a9c", fg: "#ffffff" },
  { bg: "#0b4f6c", fg: "#ffffff" },
  { bg: "#1b4332", fg: "#ffffff" },
  { bg: "#7c2d12", fg: "#ffffff" },
  { bg: "#4c1d95", fg: "#ffffff" },
  { bg: "#831843", fg: "#ffffff" },
];

export function CompanyLogo({
  company,
  big = false,
}: {
  company: string;
  big?: boolean;
}) {
  const cleanName = company.trim();
  const brand = BRANDS[cleanName];
  if (brand?.render) {
    return (
      <div
        className={big ? "company-icon big has-logo" : "company-icon has-logo"}
        title={cleanName}
      >
        {brand.render()}
      </div>
    );
  }
  const hash = Array.from(cleanName).reduce(
    (acc, ch) => acc + ch.charCodeAt(0),
    0,
  );
  const colors = brand || PALETTE[hash % PALETTE.length];
  const initials =
    brand?.label ||
    cleanName
      .split(/[\s&-]+/)
      .filter(Boolean)
      .map((w) => w[0])
      .join("")
      .slice(0, 3)
      .toUpperCase();

  return (
    <div
      className={big ? "company-icon big has-logo" : "company-icon has-logo"}
      title={cleanName}
    >
      <svg viewBox="0 0 48 48" width="100%" height="100%" aria-hidden="true">
        <rect width="48" height="48" rx="10" fill={colors.bg} />
        <text
          x="24"
          y="29"
          textAnchor="middle"
          fill={colors.fg}
          fontFamily="Inter, system-ui, sans-serif"
          fontWeight="800"
          fontSize={initials.length > 2 ? "11.5" : "14"}
          letterSpacing="-0.3"
        >
          {initials}
        </text>
      </svg>
    </div>
  );
}
