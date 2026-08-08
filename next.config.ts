import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /**
   * Fully static output. The site has no server-side needs — booking is by
   * phone, there are no forms and no runtime data — so exporting plain HTML
   * keeps hosting free and portable across Vercel, Cloudflare Pages and
   * Netlify without touching the code.
   *
   * Two consequences worth remembering:
   *  - headers() below would be ignored, so cache and security headers live
   *    in vercel.json instead.
   *  - next/image cannot optimise at runtime; images are pre-generated into
   *    public/images by scripts/optimize-images.ts and served through the
   *    <Picture> component.
   */
  output: 'export',

  /** Mirrors the WordPress URLs exactly (/arak/, not /arak) so years of
   *  indexed links and search rankings survive the migration untouched. */
  trailingSlash: true,

  images: { unoptimized: true },

  reactStrictMode: true,
};

export default nextConfig;
