import { PrismaClient } from "@prisma/client";

// 개발 환경에서 Hot Reload 시 PrismaClient 인스턴스가 중복 생성되지 않도록 전역 싱글톤 패턴 사용
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log:
      process.env["NODE_ENV"] === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });

if (process.env["NODE_ENV"] !== "production") {
  globalForPrisma.prisma = prisma;
}

export type { Prisma } from "@prisma/client";
