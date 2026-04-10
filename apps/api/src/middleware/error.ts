import type { Context } from "hono";
import type { ApiError } from "@repo/types";

export async function errorHandler(
  err: Error,
  c: Context
): Promise<Response> {
  console.error(err);

  const body: ApiError = {
    error: err.message ?? "Internal Server Error",
    statusCode: 500,
  };

  return c.json(body, 500);
}
