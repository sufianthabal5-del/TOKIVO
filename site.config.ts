// The owner's details for the share cards and (in a later session) the public
// pages. Nothing here is secret: it all shows on the site.
//
// No imports on purpose, so `node --test` can load it directly.

export const siteConfig = {
  /** The site's name in titles and share cards. */
  siteName: "Tokiva",
  /** One line about the site, for share cards and search results. */
  description: "Create, share and discover short videos on Tokiva.",
} as const;

export type SiteConfig = typeof siteConfig;
