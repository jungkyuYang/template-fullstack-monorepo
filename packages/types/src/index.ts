// ─── 공통 응답 래퍼 ─────────────────────────────────────────────
export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface ApiError {
  error: string;
  statusCode: number;
}

// ─── 페이지네이션 ────────────────────────────────────────────────
export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// ─── 유저 ────────────────────────────────────────────────────────
export interface User {
  id: string;
  email: string;
  name: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export type CreateUserInput = {
  email: string;
  name?: string;
  password: string;
};

export type UpdateUserInput = Partial<Pick<User, "name">>;
