# GitHub 론칭 & Vercel 배포 가이드

## 1. 현재 상태

- 저장소: `sigrnehr-sys/packmock`
- 작업 브랜치: `claude/snack-bag-mockup-761Fk` (이미 푸시됨)
- 프레임워크: Next.js 14 (App Router) + React Three Fiber
- 빌드 검증: `npm run build` 통과 (정적 생성, 3D 뷰어는 클라이언트
  코드 스플리팅)

## 2. GitHub

코드는 이 브랜치에 커밋·푸시되어 있습니다. 메인에 반영하려면:

1. GitHub에서 `claude/snack-bag-mockup-761Fk` → `main` Pull Request 생성
2. 리뷰 후 머지

(원하시면 PR도 만들어 드립니다 — 말씀해 주세요.)

## 3. Vercel 배포 (가장 쉬운 경로)

Next.js는 Vercel이 자동 인식하므로 **별도 설정 파일 불필요**합니다.

1. https://vercel.com → GitHub로 로그인
2. **Add New ▸ Project** → `sigrnehr-sys/packmock` import
3. 설정 자동 감지값 그대로:
   - Framework Preset: **Next.js**
   - Build Command: `next build` (기본)
   - Output: 자동
   - Install Command: `npm install` (기본)
4. **Deploy** 클릭

### 브랜치 배포
- `main`에 머지 → **Production** 배포
- 그 외 브랜치/PR → 자동 **Preview** URL 생성
  (지금 브랜치도 Vercel에 연결하면 바로 프리뷰 URL이 나옵니다)

### 환경 변수
현재는 **불필요**합니다(전부 클라이언트에서 동작, 외부 API 없음).
나중에 추가되면 Vercel ▸ Project ▸ Settings ▸ Environment Variables 에
넣고 재배포하면 됩니다.

## 4. 외부 API가 필요한가? → 지금은 **아니오**

현재 기능(종류 선택 / 규격 입력 / 칼선 / 이미지 업로드 / 3D 미리보기)은
100% 브라우저에서 처리됩니다. 서버나 외부 API를 끌어올 필요가 없습니다.

외부 연동이 필요해지는 시점과 권장 방식:

| 기능 | 필요 시점 | 권장 구현 |
| --- | --- | --- |
| 디자인/주문 저장 | 사용자가 작업물을 남겨야 할 때 | Next.js Route Handler (`app/api/.../route.ts`) + DB |
| 로그인/계정 | 아래 5번 | Auth.js(NextAuth) |
| 발주/견적 연동 | 외부 인쇄소 API 붙일 때 | 서버 라우트에서 프록시 (키 노출 방지) |
| 대용량 3D/이미지 | 파일이 커질 때 | Vercel Blob 또는 S3 |

외부 API를 붙일 때 **API 키는 절대 클라이언트에 두지 말고** Next.js
서버 라우트(`app/api`)에서만 사용하세요. 그때 가이드 추가로 드립니다.

## 5. 로드맵 — 로그인은 "나중에" (기억함)

요청대로 **로그인 기능은 지금 만들지 않았고, 추후 추가 예정**으로
기록해 둡니다. 추가 시 권장:

- **Auth.js (NextAuth)** — Next.js App Router 네이티브, Vercel 무난
- 현재 구조가 클라이언트 상태 중심이라, 로그인은
  `app/api/auth/...` + 미들웨어로 **비침투적으로** 얹을 수 있게
  설계해 두었습니다 (사이드바 안내 문구에도 명시).
- 로그인 도입 시 함께 붙일 것: 디자인 저장, 내 목업 목록, 발주 연동.

이 로드맵은 `README.md`에도 박아 두었습니다.
