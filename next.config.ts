import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Multiple lockfiles exist above this directory (~/package-lock.json), so
  // Next would otherwise infer the home directory as the workspace root.
  turbopack: {
    root: path.join(__dirname),
  },
};

export default nextConfig;
