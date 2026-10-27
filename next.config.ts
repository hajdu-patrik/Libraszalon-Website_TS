import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* Plain static HTML: the site has no forms, accounts or runtime data (booking is by
     phone), so it needs no server. Two consequences: headers() is ignored, so cache and
     security headers live in vercel.json; and next/image cannot optimise at runtime, so
     scripts/optimize-images.ts pre-generates the AVIF/WebP sets that <Picture> serves. */
  output: 'export',

  /* /arak/, not /arak: mirrors the old WordPress URLs so indexed links keep working. */
  trailingSlash: true,

  /* Don't write AGENTS.md / CLAUDE.md into the repo on `next dev`. */
  agentRules: false,
};

export default nextConfig;
