/** TOKIVA brand mark and colors, shared by the app shell and generated favicon. */
export const MARK_VIEWBOX = "0 0 28 28";
export const BRAND = {
  purple: "#8b2cff",
  blue: "#00aaff",
  pink: "#ff2d78",
  mark: "#ffffff",
  ink: "#08080d",
  accent: "#a855f7",
} as const;
export const SITE_NAME = "Tokiva";

/** Original TOKIVA T/play mark with a purple-to-cyan orbital stroke. */
export function markSvg(size = 24): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 28 28">
  <defs><linearGradient id="tokivaOrbit" x1="3" y1="22" x2="24" y2="4" gradientUnits="userSpaceOnUse"><stop stop-color="#8b2cff"/><stop offset="1" stop-color="#00baff"/></linearGradient></defs>
  <path d="M4.1 7.2h17.1l-1.8 3.5h-5.6l-2.2 12H7.7l2.2-12H2.7z" fill="#fff"/>
  <path d="m15.1 12.2 5.1 3.1-5.1 3.1z" fill="#fff"/>
  <path d="M5.1 15.5C1.9 20 5.7 23.5 11.2 21.9c6.1-1.8 13.1-8.8 13.1-13.7 0-4.3-5.1-4.4-9.7-1.7" fill="none" stroke="url(#tokivaOrbit)" stroke-width="2.1" stroke-linecap="round"/>
  </svg>`;
}

export function logoSvg(): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="560" height="120" viewBox="0 0 140 30">${markSvg(24).replace('<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 28 28">','<g transform="translate(1 3)">').replace('</svg>','</g>')}<text x="31" y="22" font-family="Arial,sans-serif" font-size="20" font-weight="700" letter-spacing="-0.5" fill="#ffffff">Tokiva</text></svg>`;
}
