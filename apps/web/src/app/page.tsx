import { Button } from "@repo/ui";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4">
      <h1 className="text-4xl font-bold">Fullstack Monorepo</h1>
      <p className="text-gray-500">Next.js 16 + Hono + Prisma</p>
      <Button>시작하기</Button>
    </main>
  );
}
