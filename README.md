# Fullstack Monorepo

pnpm + Turborepo 기반 풀스택 모노레포입니다.

## 기술 스택

| 영역 | 기술 |
|------|------|
| 프론트엔드 | Next.js 16, Tailwind CSS v4, Framer Motion, React Three Fiber |
| 백엔드 | Hono, Node.js |
| DB / ORM | PostgreSQL, Prisma |
| 상태관리 | Zustand, TanStack Query v5 |
| 폼 | React Hook Form, Zod |
| 모노레포 | pnpm Workspaces, Turborepo |
| 코드 품질 | ESLint, Prettier, Husky, lint-staged, commitlint |
| 아키텍처 | FSD (Feature-Sliced Design) |

## 시작하기

### 사전 요구사항

- Node.js 20+
- pnpm 10+

```bash
npm install -g pnpm
```

### 설치

```bash
git clone <repository-url>
cd template-fullstack-monorepo
pnpm install
```

### 환경변수 설정

```bash
cp apps/web/.env.example apps/web/.env.local
cp apps/api/.env.example apps/api/.env
cp packages/database/.env.example packages/database/.env
```

각 `.env` 파일을 열어 값을 채워주세요.

### 개발 서버 실행

```bash
pnpm dev          # 전체 (프론트 + 백엔드)
pnpm dev:web      # 프론트만 (http://localhost:3000)
pnpm dev:api      # 백엔드만 (http://localhost:3001)
```

## 프로젝트 구조

```
apps/
├── web/        # Next.js 16 프론트엔드 (FSD 아키텍처)
└── api/        # Hono 백엔드
packages/
├── ui/                  # 공유 UI 컴포넌트
├── types/               # 공유 TypeScript 타입
├── database/            # Prisma 스키마 + 클라이언트
├── eslint-config/       # 공유 ESLint 설정
└── typescript-config/   # 공유 tsconfig
```

## 주요 명령어

```bash
pnpm build            # 전체 빌드
pnpm lint             # 전체 린트
pnpm typecheck        # 전체 타입 체크

# 패키지 설치
pnpm --filter @repo/web add 패키지명

# Prisma
pnpm --filter @repo/database db:migrate   # 마이그레이션
pnpm --filter @repo/database db:studio    # Prisma Studio 실행
```

## 커밋 규칙

```
타입(스코프): 설명

# 예시
feat(web): Hero 섹션 추가
fix(api): 인증 토큰 만료 처리
chore(deps): 의존성 업데이트
```

**타입:** `feat` `fix` `chore` `refactor` `docs` `test` `style`

**스코프:** `web` `api` `ui` `types` `database` `deps` `release`

## AI로 작업할 때

작업 전 반드시 `CLAUDE.md`를 읽어주세요.
