import { Hono } from "hono";
import { prisma } from "@repo/database";
import type { ApiResponse, User } from "@repo/types";

const users = new Hono();

// GET /users
users.get("/", async (c) => {
  const rows = await prisma.user.findMany({
    select: { id: true, email: true, name: true, createdAt: true, updatedAt: true },
  });

  const body: ApiResponse<User[]> = { data: rows };
  return c.json(body);
});

// GET /users/:id
users.get("/:id", async (c) => {
  const id = c.req.param("id");
  const user = await prisma.user.findUnique({
    where: { id },
    select: { id: true, email: true, name: true, createdAt: true, updatedAt: true },
  });

  if (!user) {
    return c.json({ error: "User not found", statusCode: 404 }, 404);
  }

  const body: ApiResponse<User> = { data: user };
  return c.json(body);
});

export { users };
