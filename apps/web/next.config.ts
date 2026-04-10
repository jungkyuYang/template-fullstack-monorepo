import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 모노레포 내 workspace 패키지를 트랜스파일
  transpilePackages: ["@repo/ui"],
};

export default nextConfig;
