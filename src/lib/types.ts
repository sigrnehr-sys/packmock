// All dimensions are in millimeters (mm).

export type BagTypeId =
  | "pillow"
  | "standup"
  | "three-side"
  | "side-gusset";

export interface BagSpec {
  /** Overall flat panel width (mm) */
  width: number;
  /** Overall flat panel height (mm) */
  height: number;
  /**
   * Inflation / gusset depth (mm). How "puffy" the bag becomes in the
   * middle (nitrogen) region. For flat 3-side-seal this is small.
   */
  depth: number;
  /** Top seal band height (mm) */
  sealTop: number;
  /** Bottom seal band height (mm) */
  sealBottom: number;
  /** Left/right seal band width, each side (mm) */
  sealSide: number;
}

export interface BagType {
  id: BagTypeId;
  /** Korean display name */
  name: string;
  /** Short description shown in the picker */
  desc: string;
  /** Default spec used when the type is selected */
  defaults: BagSpec;
  /**
   * Procedural geometry tuning. Replaced by a real GLB later
   * (see docs/3D-MODEL-GUIDE.md) — these only drive the placeholder.
   */
  shape: {
    /** 0..1 multiplier on `depth` for the middle bulge */
    inflation: number;
    /** Extra bottom-gusset spread so the bag can "stand" (0 = none) */
    bottomGusset: number;
    /** Cross-section roundness: 1 = ellipse, >1 = boxier */
    boxiness: number;
  };
}

/** A normalized rectangle (0..1) inside the front panel, origin top-left. */
export interface NRect {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface DielineLayout {
  /** mm dimensions echoed back for labels */
  mm: { width: number; height: number };
  /** Whole front panel (always 0,0,1,1) */
  panel: NRect;
  /** Printable design area (between the seals) */
  design: NRect;
  /** Seal bands for drawing/labeling */
  seals: {
    top: NRect;
    bottom: NRect;
    left: NRect;
    right: NRect;
  };
}
