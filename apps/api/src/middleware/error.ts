import type { Context } from "hono";
import type { ApiError } from "@repo/types";

export function errorHandler(
  err: Error,
  c: Context
): Response {
  console.error(err);

  const body: ApiError = {
    error: err.message || "Internal Server Error",
    statusCode: 500,
  };

  return c.json(body, 500);
}
