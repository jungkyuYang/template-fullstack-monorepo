# 아키텍처 문서

## 왜 모노레포인가?

| 문제 | 모노레포 해결책 |
|------|----------------|
| 프론트/백이 타입을 각자 정의해서 불일치 | `packages/types`에서 단일 소스 관리 |
| 공통 유틸 복붙으로 분기 | `packages/utils` 공유 |
| 프론트/백 동시 변경 시 두 번 PR | 단일 PR로 원자적 변경 |
| 린트/TS 설정이 팀마다 달라짐 | 공유 config 패키지로 강제 통일 |

---

## 전체 아키텍처

```
Client (Browser)
    │  HTTP / WebSocket
    ▼
apps/web (Next.js 16)     ──────────────────────────────┐
    │  Server Actions /                                  │
    │  API Routes (BFF)                                  │
    ▼                                                    │
apps/api (Hono)                                         │
    │  Prisma Client                                     │  공유
    ▼                                                    │
packages/database (Prisma) ── PostgreSQL / SQLite       │
                                                        ▼
                                              packages/types
                                              packages/ui
                                              packages/eslint-config
                                              packages/typescript-config
```

---

## 각 레이어 책임

### `apps/web` — Next.js 16 프론트엔드

- **역할:** UI 렌더링, 라우팅, 인증 처리
- **통신:** `apps/api`에 HTTP 요청 (fetch / react-query)
- **의존:** `@repo/ui`, `@repo/types`
- **규칙:**
  - 비즈니스 로직은 `apps/api`에 위임, 화면 로직만 담당
  - `app/` 디렉터리 = App Router 페이지만
  - `components/` = 이 앱 전용 컴포넌트 (재사용 가능한 건 `packages/ui`로)

### `apps/api` — Hono 백엔드

- **역할:** REST API, 인증 검증, 비즈니스 로직
- **통신:** Prisma를 통해 DB 접근
- **의존:** `@repo/types`, `@repo/database`
- **규칙:**
  - 라우트별로 `src/routes/` 디렉터리 분리
  - 미들웨어는 `src/middleware/` 분리
  - 환경변수는 `src/env.ts`에서 검증 후 export (zod 사용)

### `packages/ui` — 공유 UI 컴포넌트

- **역할:** 재사용 가능한 React 컴포넌트 제공
- **기반:** shadcn/ui 컴포넌트를 래핑/확장
- **의존:** React, Tailwind CSS
- **규칙:**
  - 비즈니스 로직 없음 — 순수 UI만
  - `src/index.ts`에서 모든 컴포넌트 named export
  - Storybook은 선택사항 (추후 추가 가능)

### `packages/types` — 공유 타입

- **역할:** 프론트/백이 공유하는 TypeScript 타입 정의
- **규칙:**
  - 런타임 코드 없음 — 타입만
  - Prisma 생성 타입은 여기 재export 가능
  - API 요청/응답 타입은 반드시 여기 정의

### `packages/database` — Prisma 레이어

- **역할:** DB 스키마 정의, PrismaClient 싱글톤 export
- **규칙:**
  - `prisma/schema.prisma`에 모든 모델 정의
  - `src/index.ts`에서 `prisma` 인스턴스 export
  - 마이그레이션은 `prisma/migrations/` 자동 생성

### `packages/eslint-config` — 공유 린트 설정

- **역할:** 팀 전체 ESLint 규칙 통일
- **규칙:**
  - 각 앱은 이 패키지를 extends해서 사용
  - 앱별 override는 최소화

### `packages/typescript-config` — 공유 TS 설정

- **역할:** tsconfig 기본값 통일
- **파일:**
  - `base.json` — 공통 strict 설정
  - `nextjs.json` — Next.js용 (base 상속)
  - `node.json` — Node.js/Hono용 (base 상속)

---

## 데이터 흐름 예시

### 클라이언트가 유저 목록을 요청하는 경우

```
1. apps/web의 컴포넌트에서 fetch("/api/users") 호출
2. apps/api의 GET /users 핸들러 실행
3. @repo/database의 prisma.user.findMany() 실행
4. DB에서 데이터 반환
5. apps/api가 @repo/types의 User[] 타입으로 직렬화
6. apps/web이 응답 받아 렌더링
```

---

## 빌드 순서 (Turborepo가 자동 처리)

```
packages/typescript-config
packages/eslint-config
    ↓
packages/types
packages/database
packages/ui
    ↓
apps/web
apps/api
```

Turborepo의 `dependsOn: ["^build"]` 설정으로 의존 순서가 자동 보장됩니다.

---

## 확장 가이드

### 새 앱 추가 (예: 어드민 패널)

1. `apps/admin/` 생성
2. Next.js 또는 Vite로 초기화
3. `@repo/ui`, `@repo/types` 의존성 추가
4. `turbo.json`에 별도 태스크 필요 시 추가

### 새 패키지 추가 (예: 이메일 유틸)

1. `packages/email/` 생성
2. 이메일 발송 로직 구현
3. `apps/api`에서 `@repo/email` 의존성 추가

### 마이크로서비스 분리 시

- `apps/` 하위에 별도 서비스 추가
- `packages/`의 공유 레이어는 그대로 활용
- 서비스 간 통신은 HTTP 또는 메시지 큐 (RabbitMQ, BullMQ 등)
