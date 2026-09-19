import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  agentRules: false,
  // pdfjs-dist (via pdf-parse) resolves its worker script by relative path at
  // runtime; bundling it breaks that lookup, so keep it as a native require.
  serverExternalPackages: ["pdf-parse", "pdfjs-dist"],
};

export default nextConfig;
