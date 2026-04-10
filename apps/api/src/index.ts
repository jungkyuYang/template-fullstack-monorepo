import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { env } from "./env.js";
import { users } from "./routes/users.js";

const app = new Hono();

// ─── 미들웨어 ──────────────────────────────────────────────────
app.use("*", logger());
app.use(
  "*",
  cors({
    origin: env.NODE_ENV === "production" ? ["https://yourdomain.com"] : "*",
  })
);

// ─── 헬스체크 ──────────────────────────────────────────────────
app.get("/health", (c) => c.json({ status: "ok" }));

// ─── 라우트 ────────────────────────────────────────────────────
app.route("/users", users);

// ─── 서버 시작 ─────────────────────────────────────────────────
serve({ fetch: app.fetch, port: env.PORT }, (info) => {
  console.warn(`API server running: http://localhost:${String(info.port)}`);
});

export default app;
