# Fullstack Monorepo

pnpm + Turborepo 기반 풀스택 모노레포입니다.

## 기술 스택

| 영역 | 기술 |
|------|------|
| 프론트엔드 | Next.js 16 (App Router), Tailwind CSS v4, Framer Motion, React Three Fiber |
| 백엔드 | Hono + @hono/node-server |
| DB / ORM | PostgreSQL, Prisma |
| 상태관리 | Zustand, TanStack Query v5 |
| 폼 | React Hook Form, Zod |
| 공유 UI | CVA 기반 컴포넌트, Storybook 10 |
| 모노레포 | pnpm Workspaces, Turborepo |
| 코드 품질 | ESLint, Prettier, Husky, lint-staged, commitlint |
| CI | GitHub Actions |
| 아키텍처 | FSD (Feature-Sliced Design) |

## 사전 요구사항

- Node.js 22+
- pnpm 10+

```bash
npm install -g pnpm
```

## 시작하기

```bash
git clone https://github.com/jungkyuYang/template-fullstack-monorepo.git
cd template-fullstack-monorepo
pnpm install
```

### 환경변수 설정

```bash
cp apps/web/.env.example apps/web/.env.local
cp apps/api/.env.example apps/api/.env
cp packages/database/.env.example packages/database/.env
```

### Prisma 클라이언트 생성

```bash
pnpm --filter @repo/database db:generate
```

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
├── ui/                  # 공유 UI 컴포넌트 (Storybook)
├── types/               # 공유 TypeScript 타입
├── database/            # Prisma 스키마 + 클라이언트
├── eslint-config/       # 공유 ESLint 설정
└── typescript-config/   # 공유 tsconfig
.github/
└── workflows/ci.yml     # GitHub Actions CI
```

## 주요 명령어

```bash
# 개발
pnpm dev              # 전체
pnpm dev:web          # 프론트만
pnpm dev:api          # 백엔드만

# 빌드
pnpm build            # 전체
pnpm build:web        # 프론트만
pnpm build:api        # 백엔드만

# 코드 품질
pnpm lint             # 전체 린트
pnpm typecheck        # 전체 타입 체크

# UI 컴포넌트
pnpm storybook        # Storybook 실행 (http://localhost:6006)

# 패키지 설치
pnpm --filter @repo/web add 패키지명

# Prisma
pnpm --filter @repo/database db:generate  # 클라이언트 생성
pnpm --filter @repo/database db:migrate   # 마이그레이션
pnpm --filter @repo/database db:studio    # Prisma Studio 실행
```

## CI

`master` / `main` 브랜치 push 및 PR 시 GitHub Actions가 자동으로 실행됩니다.

- Install → Prisma Generate → Lint → Typecheck → Build

## 커밋 규칙

```
타입(스코프): 설명

# 예시
feat(web): Hero 섹션 추가
fix(api): 인증 토큰 만료 처리
chore(deps): 의존성 업데이트
```

**타입:** `feat` `fix` `chore` `refactor` `docs` `test` `style`

**스코프:** `web` `api` `ui` `types` `database` `eslint-config` `typescript-config` `deps` `release`

## AI로 작업할 때

작업 전 반드시 `CLAUDE.md`를 읽어주세요.
