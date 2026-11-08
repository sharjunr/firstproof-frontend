import React from "react";

const SVG_COMPANIES = new Set([
  "adidas",
  "amd",
  "cbc",
  "cloudflare",
  "coursera",
  "datadog",
  "dhl",
  "duolingo",
  "figma",
  "framer",
  "garmin",
  "gusto",
  "hilton",
  "hubspot",
  "intercom",
  "marriott",
  "mda-space",
  "nike",
  "nvidia",
  "pearson",
  "shopify",
  "siemens",
  "skyworks-solutions",
  "spotify",
  "stripe",
  "td-bank",
  "thermo-fisher-scientific",
  "unilever",
  "zendesk",
]);

const PNG_COMPANIES = new Set([
  "adobe",
  "ago",
  "arup",
  "astrazeneca",
  "bell-media",
  "bio-rad",
  "blg",
  "brookfield",
  "camh",
  "canva",
  "celestica",
  "corning",
  "deel",
  "deloitte",
  "environics",
  "four-seasons",
  "gallup",
  "gensler",
  "globe-media",
  "gong",
  "habitat",
  "hydro-quebec",
  "illumina",
  "ipsos",
  "live-nation",
  "lululemon",
  "maersk",
  "magna",
  "mccarthy-tetrault",
  "mcgraw-hill",
  "medtronic",
  "mercer",
  "mlse",
  "orsted",
  "osler",
  "patagonia",
  "penguin-random-house",
  "perkins-will",
  "rbc",
  "red-cross",
  "roche",
  "salesforce",
  "sanofi",
  "sony-music",
  "stantec",
  "td-bank",
  "thomson-reuters",
  "tiff",
  "torys-llp",
  "unicef",
  "united-way",
  "workday",
  "wsp",
]);

export function CompanyLogo({
  company,
  big = false,
}: {
  company: string;
  big?: boolean;
}) {
  const cleanName = company.trim();
  const slug = cleanName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  const src = SVG_COMPANIES.has(slug)
    ? `/logos/${slug}.svg`
    : PNG_COMPANIES.has(slug)
      ? `/logos/${slug}.png`
      : null;

  if (src) {
    return (
      <div
        className={big ? "company-icon big has-logo" : "company-icon has-logo"}
        title={cleanName}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={`${cleanName} logo`}
          loading="lazy"
          decoding="async"
        />
      </div>
    );
  }

  const initials = cleanName
    .split(/[\s&-]+/)
    .filter(Boolean)
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className={big ? "company-icon big" : "company-icon"} title={cleanName}>
      {initials}
    </div>
  );
}
