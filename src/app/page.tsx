"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { BagTypeSelector } from "@/components/BagTypeSelector";
import { SpecForm } from "@/components/SpecForm";
import { DesignUpload } from "@/components/DesignUpload";
import { DielineSVG } from "@/components/DielineSVG";
import { BAG_TYPES } from "@/lib/bagTypes";
import type { BagSpec, BagTypeId } from "@/lib/types";

const BagViewer3D = dynamic(
  () => import("@/components/BagViewer3D").then((m) => m.BagViewer3D),
  { ssr: false, loading: () => <Loading /> }
);

function Loading() {
  return (
    <div
      style={{
        display: "grid",
        placeItems: "center",
        height: "100%",
        color: "#9aa3ad",
        fontSize: 13,
      }}
    >
      3D 뷰어 로딩 중…
    </div>
  );
}

export default function Page() {
  const [typeId, setTypeId] = useState<BagTypeId>("pillow");
  const [spec, setSpec] = useState<BagSpec>(BAG_TYPES.pillow.defaults);

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [image, setImage] = useState<HTMLImageElement | null>(null);

  // When the bag type changes, reset the spec to that type's defaults.
  function selectType(id: BagTypeId) {
    setTypeId(id);
    setSpec(BAG_TYPES[id].defaults);
  }

  function handleFile(file: File | null) {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    if (!file) {
      setPreviewUrl(null);
      setImage(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => setImage(img);
    img.src = url;
  }

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const shape = BAG_TYPES[typeId].shape;

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="brand">
          Packmock
          <small>과자봉지 목업 — 종류·규격·디자인</small>
        </div>

        <div className="section">
          <h2>1. 봉지 종류</h2>
          <BagTypeSelector value={typeId} onChange={selectType} />
        </div>

        <div className="section">
          <h2>2. 규격 (mm)</h2>
          <SpecForm spec={spec} onChange={setSpec} />
        </div>

        <div className="section">
          <h2>3. 디자인</h2>
          <DesignUpload previewUrl={previewUrl} onFile={handleFile} />
        </div>

        <p className="hint">
          추후: 로그인/계정, 디자인 저장, 발주 연동 예정 (현재 미구현).
        </p>
      </aside>

      <main className="stage">
        <div className="viewer">
          <BagViewer3D spec={spec} shape={shape} image={image} />
        </div>
        <div className="dieline-wrap">
          <DielineSVG spec={spec} />
          <div className="meta">
            <strong>{BAG_TYPES[typeId].name}</strong>
            <br />
            펼친 칼선 — 파란 점선이 인쇄(디자인) 영역, 빗금이 실링영역.
            <br />
            마우스 드래그로 3D 회전, 휠로 확대/축소.
          </div>
        </div>
      </main>
    </div>
  );
}
