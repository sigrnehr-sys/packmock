"use client";

import type { BagSpec } from "@/lib/types";

const FIELDS: { key: keyof BagSpec; label: string }[] = [
  { key: "width", label: "전체 폭 W" },
  { key: "height", label: "전체 높이 H" },
  { key: "depth", label: "질소 충전 깊이 D" },
  { key: "sealTop", label: "상단 실링 높이" },
  { key: "sealBottom", label: "하단 실링 높이" },
  { key: "sealSide", label: "좌/우 실링 폭" },
];

export function SpecForm({
  spec,
  onChange,
}: {
  spec: BagSpec;
  onChange: (next: BagSpec) => void;
}) {
  return (
    <div>
      {FIELDS.map((f) => (
        <div className="field" key={f.key}>
          <label htmlFor={`f-${f.key}`}>{f.label}</label>
          <input
            id={`f-${f.key}`}
            type="number"
            min={0}
            step={1}
            value={spec[f.key]}
            onChange={(e) =>
              onChange({
                ...spec,
                [f.key]: Math.max(0, Number(e.target.value) || 0),
              })
            }
          />
        </div>
      ))}
      <p className="hint">단위: mm. 실링영역은 평평하게, 가운데는 질소로 빵빵하게 표현됩니다.</p>
    </div>
  );
}
