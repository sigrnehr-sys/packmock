import * as THREE from "three";
import type { BagSpec, BagType } from "../types";

/** mm -> scene units */
export const SCENE_SCALE = 0.01;

const NF = 64; // segments across the front panel width
const NV = 80; // rows along the height

/**
 * Procedural placeholder pouch.
 *
 * Geometry rules that mirror a real bag:
 *  - The seal bands (top/bottom/sides) stay FLAT (no inflation).
 *  - The middle "nitrogen" region bulges out to `depth`.
 *  - Width / height / depth come straight from the mm spec, so the
 *    silhouette scales without breaking proportion.
 *
 * Two groups are emitted:
 *  - group 0 : front surface  -> textured (artwork) material
 *  - group 1 : back surface   -> plain foil material
 *
 * Replace this with a real GLB later — see docs/3D-MODEL-GUIDE.md.
 */
export function makePouchGeometry(
  spec: BagSpec,
  shape: BagType["shape"]
): THREE.BufferGeometry {
  const W = Math.max(1, spec.width) * SCENE_SCALE;
  const H = Math.max(1, spec.height) * SCENE_SCALE;
  const D = Math.max(0, spec.depth) * SCENE_SCALE;

  const sb = clamp(spec.sealBottom / spec.height, 0, 0.45);
  const st = clamp(spec.sealTop / spec.height, 0, 0.45);
  const tb = Math.min(0.07, (1 - sb - st) / 3); // transition band

  const cols = NF + 1;
  const rows = NV + 1;
  const vertsPerSurface = cols * rows;

  const positions = new Float32Array(vertsPerSurface * 2 * 3);
  const uvs = new Float32Array(vertsPerSurface * 2 * 2);

  const half = W / 2;

  const writeSurface = (front: boolean, vOffset: number) => {
    let pi = vOffset * 3;
    let ui = vOffset * 2;
    for (let r = 0; r < rows; r++) {
      const v = r / NV; // 0 = bottom, 1 = top
      const inf = inflation(v, sb, st, tb);
      for (let c = 0; c < cols; c++) {
        const p = -1 + (2 * c) / NF; // -1 .. 1 across width
        const x = p * half;
        const y = v * H;

        const prof = profile(p, shape.boxiness);
        const gusset =
          shape.bottomGusset > 0
            ? 1 + shape.bottomGusset * Math.max(0, (0.35 - v) / 0.35)
            : 1;
        const bulge =
          (D / 2) * shape.inflation * inf * prof * gusset;

        positions[pi++] = x;
        positions[pi++] = y;
        positions[pi++] = front ? bulge : -bulge;

        // Front maps the artwork canvas 1:1; back is untextured.
        uvs[ui++] = front ? c / NF : 0;
        uvs[ui++] = front ? v : 0;
      }
    }
  };

  writeSurface(true, 0);
  writeSurface(false, vertsPerSurface);

  const quadsPerSurface = NF * NV;
  const indices = new Uint32Array(quadsPerSurface * 2 * 6);

  const buildIndices = (base: number, offset: number, flip: boolean) => {
    let k = offset;
    for (let r = 0; r < NV; r++) {
      for (let c = 0; c < NF; c++) {
        const a = base + r * cols + c;
        const b = a + 1;
        const d = a + cols;
        const e = d + 1;
        if (!flip) {
          indices[k++] = a; indices[k++] = d; indices[k++] = b;
          indices[k++] = b; indices[k++] = d; indices[k++] = e;
        } else {
          indices[k++] = a; indices[k++] = b; indices[k++] = d;
          indices[k++] = b; indices[k++] = e; indices[k++] = d;
        }
      }
    }
  };

  const idxPerSurface = quadsPerSurface * 6;
  buildIndices(0, 0, false); // front faces +z
  buildIndices(vertsPerSurface, idxPerSurface, true); // back faces -z

  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geo.setAttribute("uv", new THREE.BufferAttribute(uvs, 2));
  geo.setIndex(new THREE.BufferAttribute(indices, 1));

  geo.addGroup(0, idxPerSurface, 0); // front -> material 0
  geo.addGroup(idxPerSurface, idxPerSurface, 1); // back -> material 1

  geo.computeVertexNormals();

  // Center on origin so OrbitControls behaves predictably.
  geo.translate(0, -H / 2, 0);
  geo.computeBoundingSphere();

  return geo;
}

/** Scene-unit height, used to frame the camera. */
export function sceneHeight(spec: BagSpec): number {
  return Math.max(1, spec.height) * SCENE_SCALE;
}

function inflation(
  v: number,
  sb: number,
  st: number,
  tb: number
): number {
  if (v <= sb || v >= 1 - st) return 0;
  const up = smoothstep(sb, sb + tb, v);
  const down = 1 - smoothstep(1 - st - tb, 1 - st, v);
  return Math.min(up, down);
}

function profile(p: number, boxiness: number): number {
  const a = Math.min(1, Math.abs(p));
  const inner = Math.max(0, 1 - Math.pow(a, 2 * boxiness));
  return Math.pow(inner, 0.5);
}

function smoothstep(edge0: number, edge1: number, x: number): number {
  if (edge0 === edge1) return x < edge0 ? 0 : 1;
  const t = clamp((x - edge0) / (edge1 - edge0), 0, 1);
  return t * t * (3 - 2 * t);
}

function clamp(x: number, lo: number, hi: number): number {
  return x < lo ? lo : x > hi ? hi : x;
}
