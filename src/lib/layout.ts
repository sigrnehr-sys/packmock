import type { BagSpec, DielineLayout, NRect } from "./types";

/**
 * Convert a millimeter spec into a normalized (0..1) front-panel layout.
 * Origin is top-left. This single source of truth feeds BOTH the 2D
 * dieline (SVG) and the 3D artwork texture, so they can never drift.
 */
export function computeLayout(spec: BagSpec): DielineLayout {
  const W = Math.max(1, spec.width);
  const H = Math.max(1, spec.height);

  const top = clamp01(spec.sealTop / H);
  const bottom = clamp01(spec.sealBottom / H);
  const side = clamp01(spec.sealSide / W);

  // Guard against seals overlapping when the user enters extreme values.
  const vTop = Math.min(top, 0.45);
  const vBottom = Math.min(bottom, 0.45);
  const vSide = Math.min(side, 0.45);

  const design: NRect = {
    x: vSide,
    y: vTop,
    w: 1 - vSide * 2,
    h: 1 - vTop - vBottom,
  };

  const seals = {
    top: { x: 0, y: 0, w: 1, h: vTop },
    bottom: { x: 0, y: 1 - vBottom, w: 1, h: vBottom },
    left: { x: 0, y: 0, w: vSide, h: 1 },
    right: { x: 1 - vSide, y: 0, w: vSide, h: 1 },
  };

  return {
    mm: { width: W, height: H },
    panel: { x: 0, y: 0, w: 1, h: 1 },
    design,
    seals,
  };
}

function clamp01(v: number): number {
  if (!Number.isFinite(v) || v < 0) return 0;
  return v > 1 ? 1 : v;
}
