"use client";

import { useMemo } from "react";
import { computeLayout } from "@/lib/layout";
import type { BagSpec } from "@/lib/types";

/**
 * 2D dieline (칼선). Driven by the SAME computeLayout() the 3D texture
 * uses, so the printable area always matches between 2D and 3D.
 */
export function DielineSVG({ spec }: { spec: BagSpec }) {
  const layout = useMemo(() => computeLayout(spec), [spec]);

  const VBW = 240;
  const ar = spec.width / spec.height;
  const VBH = Math.round(VBW / Math.max(0.2, ar));

  const d = layout.design;
  const px = (n: number) => n * VBW;
  const py = (n: number) => n * VBH;

  return (
    <svg
      width={VBW}
      height={VBH}
      viewBox={`0 0 ${VBW} ${VBH}`}
      style={{ background: "#0c0e12", borderRadius: 8 }}
    >
      <defs>
        <pattern
          id="seal"
          width="7"
          height="7"
          patternUnits="userSpaceOnUse"
          patternTransform="rotate(45)"
        >
          <rect width="7" height="7" fill="#1a1f29" />
          <line x1="0" y1="0" x2="0" y2="7" stroke="#39414f" strokeWidth="1.5" />
        </pattern>
      </defs>

      {/* panel outline (칼선) */}
      <rect
        x="0.5"
        y="0.5"
        width={VBW - 1}
        height={VBH - 1}
        fill="url(#seal)"
        stroke="#5b6675"
        strokeWidth="1"
      />

      {/* design / print area */}
      <rect
        x={px(d.x)}
        y={py(d.y)}
        width={px(d.w)}
        height={py(d.h)}
        fill="#11161f"
        stroke="#4f8cff"
        strokeWidth="1.5"
        strokeDasharray="5 4"
      />

      <text
        x={px(d.x + d.w / 2)}
        y={py(d.y + d.h / 2)}
        fill="#6f7b8a"
        fontSize="11"
        textAnchor="middle"
      >
        디자인 영역
      </text>

      {/* dimension labels */}
      <text x={VBW / 2} y={VBH - 6} fill="#9aa3ad" fontSize="11" textAnchor="middle">
        W {spec.width}mm
      </text>
      <text
        x={10}
        y={VBH / 2}
        fill="#9aa3ad"
        fontSize="11"
        textAnchor="middle"
        transform={`rotate(-90 10 ${VBH / 2})`}
      >
        H {spec.height}mm
      </text>
    </svg>
  );
}
