# CLAUDE.md — AI 작업 가이드

이 파일은 Claude Code가 이 모노레포에서 작업할 때 반드시 먼저 읽어야 하는 최우선 참조 문서입니다.
**여기 정의된 규칙을 어기면 PR이 거부됩니다. 예외 없이 따르세요.**

---

## 1. 프로젝트 개요

회사 홈페이지 풀스택 모노레포입니다.
- 패키지 매니저: **pnpm** (npm, yarn 절대 사용 금지)
- 빌드 오케스트레이터: **Turborepo**
- 언어: **TypeScript** (모든 패키지, 모든 앱)
- 워크스페이스: `apps/*`, `packages/*`
- 프론트엔드 아키텍처: **FSD (Feature-Sliced Design)**

---

## 2. 확정된 기술 스택

이 목록은 팀이 합의한 스택입니다. **임의로 변경하지 마세요.**

| 영역 | 기술 | 비고 |
|------|------|------|
| 프론트엔드 | Next.js 16 (App Router) | `apps/web` |
| 백엔드 | Hono + @hono/node-server | `apps/api` |
| ORM | Prisma | `packages/database` |
| 공유 UI | CVA 기반 컴포넌트 | `packages/ui` |
| UI 문서 | Storybook 10 (react-vite + addon-docs) | `pnpm storybook` |
| 공유 타입 | 직접 정의 | `packages/types` |
| ESLint | 공유 config + FSD boundaries | `packages/eslint-config` |
| TypeScript | 공유 config | `packages/typescript-config` |
| 스타일 | Tailwind CSS v4 | — |
| 상태관리 | Zustand | — |
| 서버 상태 | TanStack Query v5 | — |
| 폼 | React Hook Form + Zod | — |
| 3D | React Three Fiber + Drei | — |
| 애니메이션 | Framer Motion | — |
| 아이콘 | Lucide React | named import만 사용 |
| 다크모드 | next-themes | Providers에 설정됨 |
| 토스트 | Sonner | Providers에 설정됨 |
| 에러 추적 | Sentry (`@sentry/nextjs`) | DSN 키 필요 |
| 분석 | GA4 (`@next/third-parties`) | 측정 ID 필요 |
| 배포 분석 | Vercel Analytics + Speed Insights | — |

---

## 3. 전체 디렉터리 구조

```
template-fullstack-monorepo/
├── apps/
│   ├── web/                        # Next.js 16 프론트엔드 (FSD)
│   └── api/                        # Hono 백엔드
├── packages/
│   ├── ui/                         # 공유 UI 컴포넌트
│   ├── types/                      # 공유 TypeScript 타입
│   ├── database/                   # Prisma 클라이언트 + 스키마
│   ├── eslint-config/              # 공유 ESLint 규칙
│   └── typescript-config/          # 공유 tsconfig
├── .editorconfig                   # 에디터 통일 설정 (LF 강제)
├── .npmrc                          # pnpm 설정
├── .husky/
│   ├── pre-commit                  # lint-staged 실행
│   └── commit-msg                  # commitlint 실행
├── .github/
│   └── workflows/
│       └── ci.yml                  # GitHub Actions CI (lint → typecheck → build)
├── commitlint.config.js            # 커밋 메시지 규칙
├── CLAUDE.md
├── docs/
│   ├── architecture.md
│   └── conventions.md
├── turbo.json
├── pnpm-workspace.yaml
└── package.json
```

---

## 4. apps/web FSD 디렉터리 구조

`apps/web/src/`는 **FSD** 아키텍처를 따릅니다.

```
apps/web/src/
├── app/                    # Next.js App Router (라우팅 + Providers만)
│   ├── layout.tsx          # Providers 연결 (QueryClient, ThemeProvider, Toaster)
│   ├── providers.tsx       # 클라이언트 Providers 모음
│   ├── page.tsx
│   ├── globals.css
│   └── (route-group)/
├── widgets/                # 페이지를 구성하는 독립 UI 블록
│   ├── header/
│   ├── hero/
│   ├── footer/
│   └── contact-section/
├── features/               # 유저 인터랙션 단위 기능
│   ├── contact-form/
│   └── theme-toggle/
├── entities/               # 비즈니스 엔티티
│   └── user/
└── shared/                 # 재사용 가능한 리소스
    ├── ui/                 # 공통 컴포넌트 (@repo/ui re-export)
    ├── lib/                # 유틸리티 함수
    ├── api/                # fetch 래퍼 (API 클라이언트)
    ├── config/             # 상수, 설정값
    └── types/              # 이 앱 전용 타입
```

### FSD 레이어 import 규칙 (ESLint로 자동 강제)

```
app → widgets → features → entities → shared
```

- 상위 레이어는 하위 레이어만 import 가능
- **같은 레이어끼리 import 금지**
- `shared`는 아무것도 import하지 않음

```typescript
// ✅ features → shared (허용)
import { api } from "@/shared/api";

// ❌ features → widgets (ESLint 에러)
import { Header } from "@/widgets/header";

// ❌ shared → features (ESLint 에러)
import { ContactForm } from "@/features/contact-form";
```

### Path Alias (tsconfig.json에 설정됨)

```typescript
"@/*"          → src/*
"@/widgets/*"  → src/widgets/*
"@/features/*" → src/features/*
"@/entities/*" → src/entities/*
"@/shared/*"   → src/shared/*
```

---

## 5. Providers 구조

`apps/web/src/app/providers.tsx`에 모든 클라이언트 Provider가 집중되어 있습니다.
**새 Provider 추가 시 이 파일에만 추가하세요.**

현재 등록된 Provider:
- `QueryClientProvider` — TanStack Query (staleTime: 1분, retry: 1)
- `ThemeProvider` — next-themes (다크모드)
- `Toaster` — Sonner (우상단, richColors)
- `ReactQueryDevtools` — 개발 환경에서만 렌더링

---

## 6. 커밋 메시지 규칙 (commitlint로 강제)

```
타입(스코프): 설명
```

**허용된 타입:** `feat` `fix` `chore` `refactor` `docs` `test` `style`

**허용된 스코프:** `web` `api` `ui` `types` `database` `eslint-config` `typescript-config` `deps` `release`

```bash
# ✅ 올바른 예시
feat(web): Hero 섹션 3D 키오스크 모델 추가
fix(api): 유저 목록 조회 시 500 에러 수정
chore(deps): TanStack Query 버전 업그레이드

# ❌ 거부되는 예시 (commitlint 에러)
update some things
수정함
feat: 뭔가 추가
```

---

## 7. 패키지 네이밍 규칙

| 위치 | 형식 | 예시 |
|------|------|------|
| `apps/*` | `@repo/앱이름` | `@repo/web`, `@repo/api` |
| `packages/*` | `@repo/패키지이름` | `@repo/ui`, `@repo/types` |

**스코프는 항상 `@repo`를 사용합니다.**

---

## 8. 워크스페이스 의존성 참조

```json
{
  "dependencies": {
    "@repo/ui": "workspace:*",
    "@repo/types": "workspace:*"
  }
}
```

**`"workspace:*"`** 를 항상 사용합니다. 실제 버전 번호 사용 금지.

---

## 9. Turborepo 태스크 규칙

| 태스크 | 캐시 | 의존성 |
|--------|------|--------|
| `build` | O | `^build` |
| `dev` | X | — |
| `lint` | O | `^lint` |
| `typecheck` | O | `^typecheck` |
| `test` | O | — |
| `format` | X | — |
| `storybook` | X (persistent) | — |
| `build-storybook` | O | — |

**새 태스크 추가 시 반드시 `turbo.json`에 먼저 등록 후 각 앱 `package.json`에 스크립트 추가.**

---

## 10. 환경변수 규칙

```
apps/web/.env.local       # 프론트엔드 전용 (NEXT_PUBLIC_ 접두사 필수)
apps/api/.env             # 백엔드 전용
packages/database/.env    # DB 연결 (DATABASE_URL)
```

- 루트에 `.env` 만들지 말 것
- 백엔드 시크릿을 `NEXT_PUBLIC_`으로 노출하지 말 것
- `.env` 파일 git 커밋 금지 (`.env.example`만 커밋)

---

## 11. 알아야 할 특이사항

### Next.js 16 — `next lint` 제거됨
Next.js 16부터 `next lint` CLI 명령이 없습니다. 린트는 `eslint .`로 직접 실행합니다.

```json
// apps/web/package.json
"lint": "eslint ."
```

### React import 필수 (`jsx: preserve`)
`tsconfig`에 `"jsx": "preserve"` 설정으로 인해 JSX를 사용하는 모든 파일에 React를 명시적으로 import해야 합니다.

```typescript
// 필수
import React from "react";
```

### ESLint config 파일 자체를 ignore 처리
각 패키지의 `eslint.config.js`는 `tsconfig`에 포함되지 않으므로 반드시 ignores에 추가해야 합니다.

```js
{ ignores: ["eslint.config.js", "dist/**"] }
```

### Prisma 빌드 스크립트
pnpm이 기본적으로 Prisma 빌드 스크립트를 차단합니다. `package.json`의 `pnpm.onlyBuiltDependencies`로 허용 목록이 관리됩니다. CI에서는 별도로 `pnpm --filter @repo/database db:generate`를 실행합니다.

### Storybook 컴포넌트 작성 규칙
- `import React from "react"` 필수 (render 함수 또는 JSX 직접 사용 시)
- `Meta`, `StoryObj`는 `@storybook/react`에서 import
- `tags: ["autodocs"]` 사용 시 `@storybook/addon-docs`가 반드시 설치되어 있어야 함

---

## 12. 절대 하지 말 것 (AI 금지 행위)

- `npm install` 또는 `yarn add` — **pnpm만 사용**
- 루트 `package.json`에 앱/비즈니스 로직 의존성 추가
- `packages/eslint-config` 없이 개별 앱에 ESLint 설정 중복 작성
- `turbo.json` 등록 없이 새 스크립트 추가
- `workspace:*` 대신 버전 번호로 내부 패키지 참조
- FSD 레이어 규칙 위반 import
- `providers.tsx` 외 다른 곳에 Provider 추가
- `any` 타입 사용
- `console.log` 프로덕션 코드에 남기기

---

## 13. 자주 쓰는 명령어

```bash
# 개발 서버
pnpm dev              # 전체
pnpm dev:web          # 프론트만
pnpm dev:api          # 백엔드만
pnpm storybook        # UI 컴포넌트 문서 (http://localhost:6006)

# 빌드
pnpm build            # 전체
pnpm build:web        # 프론트만
pnpm build:api        # 백엔드만

# 코드 품질
pnpm lint             # 전체 린트
pnpm typecheck        # 전체 타입 체크
pnpm --filter @repo/web format        # 포맷
pnpm --filter @repo/web format:check  # 포맷 검사

# 패키지 설치
pnpm --filter @repo/web add 패키지명
pnpm --filter @repo/web add -D 패키지명  # devDependency

# Prisma
pnpm --filter @repo/database db:migrate   # 마이그레이션
pnpm --filter @repo/database db:generate  # 클라이언트 생성
pnpm --filter @repo/database db:studio    # Prisma Studio
```

---

## 14. 작업 시작 전 체크리스트 (AI용)

- [ ] 이 `CLAUDE.md` 전체를 읽었는가
- [ ] `docs/architecture.md`를 읽었는가
- [ ] `docs/conventions.md`를 읽었는가
- [ ] 패키지 `name`이 `@repo/` 스코프인가
- [ ] 내부 패키지를 `workspace:*`로 참조하는가
- [ ] 새 태스크를 `turbo.json`에 등록했는가
- [ ] FSD 레이어 import 방향이 올바른가
- [ ] 커밋 메시지가 `타입(스코프): 설명` 형식인가
- [ ] `pnpm install`을 루트에서 실행했는가
- [ ] Prisma 관련 작업 후 `db:generate`를 실행했는가
- [ ] JSX 사용 파일에 `import React from "react"`가 있는가
- [ ] 새 ESLint config에 `eslint.config.js` ignore 처리를 했는가
