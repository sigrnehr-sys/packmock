# Packmock — 과자봉지 목업

봉지 종류를 고르고 → 규격(mm)을 입력하면 → 펼친 **칼선(dieline)** 이
생기고 → 업로드한 디자인이 입혀진 **3D 봉지**를 실시간으로 미리보는 툴.

실링영역(평평)과 질소충전 영역(빵빵)을 나눠 표현하며, 입력 규격에 맞춰
형상 비율만 변형됩니다.

## 기능 (현재)

- 봉지 종류 4종: 질소충전 베개형 / 스탠드형 / 3면 실링 평파우치 / 거셋 베개형
- 규격 입력(mm): 폭·높이·질소깊이·상/하/좌우 실링
- 2D 칼선 자동 생성 (인쇄영역 vs 실링영역)
- PNG/JPG 디자인 업로드 → 3D에 실시간 텍스처 매핑
- 절차적 3D 플레이스홀더 (실링 평평 / 가운데 부풀음, 규격대로 비율 변형)
- 마우스로 3D 회전·확대

## 기술 스택

Next.js 14 (App Router) · React 18 · React Three Fiber · Three.js · TypeScript

## 로컬 실행

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # 프로덕션 빌드 검증
```

## 구조

```
src/
  app/            라우트 (page.tsx = 메인 클라이언트 앱)
  components/     UI (선택/규격폼/칼선/업로드/3D 뷰어)
  lib/
    bagTypes.ts   봉지 종류 + 기본 규격
    layout.ts     규격 → 칼선 레이아웃 (2D·3D 공용 단일 소스)
    texture.ts    칼선대로 아트워크 캔버스 합성
    geometry/     절차적 봉지 메시 생성기
docs/
  3D-MODEL-GUIDE.md   직접 만든 GLB 제작·임베드 규칙
  DEPLOY.md           GitHub 론칭 + Vercel 배포 + 외부 API 가이드
public/models/        실제 GLB 넣는 자리
```

## 3D 모델 직접 넣기

`.glb`(glTF Binary)로 만들어 `/public/models/<종류>.glb` 에 넣습니다.
좌표·UV·메시 분리 규칙은 [`docs/3D-MODEL-GUIDE.md`](docs/3D-MODEL-GUIDE.md).

## 배포

Vercel이 Next.js를 자동 인식 — 설정 파일 불필요.
자세히는 [`docs/DEPLOY.md`](docs/DEPLOY.md).

## 로드맵 (요청 기억용)

- [ ] **로그인/계정** — *추후 추가 예정* (지금은 미구현, 비침투적으로 얹을 수 있게 설계됨)
- [ ] 디자인/목업 저장 (로그인과 함께)
- [ ] 절차적 플레이스홀더 → 실제 GLB 로더 교체
- [ ] 발주/견적 외부 연동 (서버 라우트 프록시)
