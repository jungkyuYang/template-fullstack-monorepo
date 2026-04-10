# 코딩 컨벤션

## 1. 파일 네이밍

| 종류 | 규칙 | 예시 |
|------|------|------|
| React 컴포넌트 | PascalCase | `UserCard.tsx` |
| 훅 | camelCase, `use` 접두사 | `useUserQuery.ts` |
| 유틸/헬퍼 | camelCase | `formatDate.ts` |
| 상수 파일 | camelCase | `constants.ts` |
| 타입 파일 | camelCase | `user.types.ts` |
| API 라우트 (Hono) | kebab-case | `user-profile.ts` |
| 테스트 파일 | 원본파일명 + `.test.ts` | `formatDate.test.ts` |

---

## 2. TypeScript 규칙

```typescript
// ✅ 올바른 예
export interface User {
  id: string;
  email: string;
  createdAt: Date;
}

export type CreateUserInput = Pick<User, 'email'> & {
  password: string;
};

// ❌ 금지
const user: any = {}; // any 금지
const user = {} as User; // as 단언 지양 (부득이한 경우만)
```

- `interface`는 객체 형태, `type`은 유니온/유틸리티 타입에 사용
- `any` 사용 금지 — `unknown` 사용 후 타입 가드 적용
- 함수 반환 타입 명시 (짧은 인라인 함수 제외)

---

## 3. 컴포넌트 규칙 (React)

```typescript
// ✅ 올바른 형태
interface ButtonProps {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
}

export function Button({ label, onClick, variant = 'primary' }: ButtonProps) {
  return (
    <button onClick={onClick} className={variant}>
      {label}
    </button>
  );
}
```

- 함수형 컴포넌트만 사용 (클래스 컴포넌트 금지)
- Props 타입은 `interface`로 정의, 파일 상단에 위치
- default export 대신 named export 선호 (`packages/ui`는 필수)

---

## 4. API 라우트 규칙 (Hono)

```typescript
// src/routes/users.ts
import { Hono } from 'hono';
import type { User } from '@repo/types';

const users = new Hono();

users.get('/', async (c) => {
  const result: User[] = await prisma.user.findMany();
  return c.json(result);
});

users.post('/', async (c) => {
  const body = await c.req.json<CreateUserInput>();
  // 검증 → 처리 → 응답
  const user = await prisma.user.create({ data: body });
  return c.json(user, 201);
});

export { users };
```

- 라우트 핸들러는 파일당 하나의 리소스
- HTTP 상태 코드 명시적으로 반환
- 에러 처리는 미들웨어로 집중

---

## 5. 임포트 순서

```typescript
// 1. Node.js 내장 모듈
import fs from 'fs';

// 2. 외부 라이브러리
import { z } from 'zod';
import { Hono } from 'hono';

// 3. 내부 워크스페이스 패키지
import type { User } from '@repo/types';
import { prisma } from '@repo/database';

// 4. 현재 앱 내부 모듈 (절대경로 → 상대경로 순)
import { authMiddleware } from '@/middleware/auth';
import { formatDate } from '../utils/date';
```

ESLint의 `import/order` 규칙으로 자동 정렬됩니다.

---

## 6. 환경변수 사용 규칙

```typescript
// apps/api/src/env.ts — 이 파일에서만 process.env 접근
import { z } from 'zod';

const schema = z.object({
  DATABASE_URL: z.string().url(),
  PORT: z.coerce.number().default(3001),
  NODE_ENV: z.enum(['development', 'production', 'test']),
});

export const env = schema.parse(process.env);
```

- `process.env`를 코드 곳곳에서 직접 접근 금지
- 반드시 검증(zod 등)을 거쳐 타입 있는 객체로 export
- 앱 시작 시 검증 실패하면 즉시 종료 (fail-fast)

---

## 7. 에러 처리

```typescript
// ✅ 에러는 명시적으로 처리
try {
  const user = await prisma.user.findUniqueOrThrow({ where: { id } });
  return user;
} catch (error) {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === 'P2025') throw new NotFoundError('User not found');
  }
  throw error; // 알 수 없는 에러는 위로 전파
}

// ❌ 에러 삼키기 금지
try {
  ...
} catch (e) {
  // 아무것도 안 함 — 절대 금지
}
```

---

## 8. 커밋 메시지

```
feat(web): 유저 프로필 페이지 추가
fix(api): 로그인 토큰 만료 시 401 반환하도록 수정
chore(database): Prisma 스키마에 Post 모델 추가
refactor(ui): Button 컴포넌트 variant 타입 정리
```

형식: `타입(범위): 설명`

| 타입 | 용도 |
|------|------|
| `feat` | 새 기능 |
| `fix` | 버그 수정 |
| `chore` | 설정, 의존성, 빌드 |
| `refactor` | 동작 변경 없는 코드 개선 |
| `docs` | 문서만 변경 |
| `test` | 테스트만 변경 |

---

## 9. 금지 패턴 요약

```typescript
// ❌ any 타입
const data: any = response;

// ❌ 내부 패키지를 상대 경로로 참조
import { Button } from '../../packages/ui/src/components/Button';
// ✅ 대신
import { Button } from '@repo/ui';

// ❌ 환경변수 직접 접근
const url = process.env.DATABASE_URL;
// ✅ 대신
import { env } from '@/env';
const url = env.DATABASE_URL;

// ❌ console.log 남기기
console.log('user:', user);
// ✅ 대신 logger 사용 (pino 등)
logger.info({ user }, 'User fetched');
```
