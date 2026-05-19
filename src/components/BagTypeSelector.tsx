"use client";

import { BAG_TYPE_LIST } from "@/lib/bagTypes";
import type { BagTypeId } from "@/lib/types";

export function BagTypeSelector({
  value,
  onChange,
}: {
  value: BagTypeId;
  onChange: (id: BagTypeId) => void;
}) {
  return (
    <div className="types">
      {BAG_TYPE_LIST.map((t) => (
        <button
          key={t.id}
          className={`type-card${t.id === value ? " active" : ""}`}
          onClick={() => onChange(t.id)}
          type="button"
        >
          <div className="t-name">{t.name}</div>
          <div className="t-desc">{t.desc}</div>
        </button>
      ))}
    </div>
  );
}
