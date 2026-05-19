import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Packmock — 과자봉지 목업",
  description:
    "과자봉지 종류 선택 → 규격 입력 → 칼선 생성 → 3D 미리보기 목업 툴",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
