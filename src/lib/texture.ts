import type { DielineLayout } from "./types";

export interface ArtworkOptions {
  layout: DielineLayout;
  /** Loaded artwork image, or null for a placeholder grid */
  image: HTMLImageElement | null;
  /** Long-edge resolution of the generated canvas */
  resolution?: number;
}

const FOIL = "#c9ccce";
const FOIL_SEAL = "#b6babd";

/**
 * Builds the front-panel artwork as a canvas: metallic foil base, seal
 * bands (with a subtle emboss line) and the uploaded design placed into
 * the printable area exactly where the dieline says it goes.
 */
export function buildArtworkCanvas(opts: ArtworkOptions): HTMLCanvasElement {
  const { layout, image } = opts;
  const longEdge = opts.resolution ?? 1024;
  const ar = layout.mm.width / layout.mm.height;

  const cw = ar >= 1 ? longEdge : Math.round(longEdge * ar);
  const ch = ar >= 1 ? Math.round(longEdge / ar) : longEdge;

  const canvas = document.createElement("canvas");
  canvas.width = cw;
  canvas.height = ch;
  const ctx = canvas.getContext("2d")!;

  // Foil base
  ctx.fillStyle = FOIL;
  ctx.fillRect(0, 0, cw, ch);

  // Seal bands
  const d = layout.design;
  ctx.fillStyle = FOIL_SEAL;
  ctx.fillRect(0, 0, cw, d.y * ch); // top
  ctx.fillRect(0, (d.y + d.h) * ch, cw, ch); // bottom
  ctx.fillRect(0, 0, d.x * cw, ch); // left
  ctx.fillRect((d.x + d.w) * cw, 0, d.x * cw + 2, ch); // right

  // Seal emboss lines
  ctx.strokeStyle = "rgba(255,255,255,0.35)";
  ctx.lineWidth = Math.max(1, longEdge / 512);
  strokeRect(ctx, d.x * cw, d.y * ch, d.w * cw, d.h * ch);

  // Design area
  const dx = d.x * cw;
  const dy = d.y * ch;
  const dwp = d.w * cw;
  const dhp = d.h * ch;

  if (image) {
    drawCover(ctx, image, dx, dy, dwp, dhp);
  } else {
    drawPlaceholder(ctx, dx, dy, dwp, dhp);
  }

  return canvas;
}

function strokeRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number
) {
  ctx.strokeRect(x + 0.5, y + 0.5, w - 1, h - 1);
}

/** object-fit: cover into the target rect */
function drawCover(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  x: number,
  y: number,
  w: number,
  h: number
) {
  const ir = img.width / img.height;
  const tr = w / h;
  let sw = img.width;
  let sh = img.height;
  let sx = 0;
  let sy = 0;
  if (ir > tr) {
    sw = img.height * tr;
    sx = (img.width - sw) / 2;
  } else {
    sh = img.width / tr;
    sy = (img.height - sh) / 2;
  }
  ctx.save();
  ctx.beginPath();
  ctx.rect(x, y, w, h);
  ctx.clip();
  ctx.drawImage(img, sx, sy, sw, sh, x, y, w, h);
  ctx.restore();
}

function drawPlaceholder(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number
) {
  ctx.fillStyle = "#eef1f3";
  ctx.fillRect(x, y, w, h);
  ctx.strokeStyle = "#cdd3d8";
  ctx.lineWidth = 1;
  const step = Math.max(20, Math.min(w, h) / 12);
  for (let gx = x; gx < x + w; gx += step) {
    ctx.beginPath();
    ctx.moveTo(gx, y);
    ctx.lineTo(gx, y + h);
    ctx.stroke();
  }
  for (let gy = y; gy < y + h; gy += step) {
    ctx.beginPath();
    ctx.moveTo(x, gy);
    ctx.lineTo(x + w, gy);
    ctx.stroke();
  }
  ctx.fillStyle = "#9aa3ab";
  ctx.font = `${Math.max(14, w / 16)}px sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("디자인 영역 (이미지 업로드)", x + w / 2, y + h / 2);
}
