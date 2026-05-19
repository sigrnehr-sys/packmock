import type { BagType, BagTypeId } from "./types";

export const BAG_TYPES: Record<BagTypeId, BagType> = {
  pillow: {
    id: "pillow",
    name: "질소충전 베개형",
    desc: "위/아래 실링, 가운데가 빵빵해지는 가장 흔한 과자봉지 (핀홀·등면 실링).",
    defaults: {
      width: 160,
      height: 240,
      depth: 70,
      sealTop: 14,
      sealBottom: 14,
      sealSide: 0,
    },
    shape: { inflation: 1, bottomGusset: 0, boxiness: 1 },
  },
  standup: {
    id: "standup",
    name: "스탠드형",
    desc: "바닥 거셋(gusset)으로 세워지는 지퍼백 형태. 젤리·견과류 등.",
    defaults: {
      width: 140,
      height: 210,
      depth: 80,
      sealTop: 16,
      sealBottom: 24,
      sealSide: 8,
    },
    shape: { inflation: 0.85, bottomGusset: 1, boxiness: 1.3 },
  },
  "three-side": {
    id: "three-side",
    name: "3면 실링 평파우치",
    desc: "납작한 평면 파우치. 슬림 스낵·1회용.",
    defaults: {
      width: 120,
      height: 180,
      depth: 14,
      sealTop: 12,
      sealBottom: 12,
      sealSide: 10,
    },
    shape: { inflation: 0.4, bottomGusset: 0, boxiness: 1.8 },
  },
  "side-gusset": {
    id: "side-gusset",
    name: "거셋 베개형",
    desc: "옆면 주름이 있는 입체형. 대용량 스낵·커피.",
    defaults: {
      width: 150,
      height: 260,
      depth: 90,
      sealTop: 14,
      sealBottom: 14,
      sealSide: 0,
    },
    shape: { inflation: 1, bottomGusset: 0.3, boxiness: 1.1 },
  },
};

export const BAG_TYPE_LIST: BagType[] = [
  BAG_TYPES.pillow,
  BAG_TYPES.standup,
  BAG_TYPES["three-side"],
  BAG_TYPES["side-gusset"],
];
