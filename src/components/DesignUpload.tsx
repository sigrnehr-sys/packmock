"use client";

import { useRef } from "react";

export function DesignUpload({
  previewUrl,
  onFile,
}: {
  previewUrl: string | null;
  onFile: (file: File | null) => void;
}) {
  const ref = useRef<HTMLInputElement>(null);

  return (
    <div>
      <label
        className="upload"
        onClick={() => ref.current?.click()}
      >
        {previewUrl
          ? "다른 이미지로 교체"
          : "PNG / JPG 디자인 업로드 (클릭)"}
        <input
          ref={ref}
          type="file"
          accept="image/png,image/jpeg"
          onChange={(e) => onFile(e.target.files?.[0] ?? null)}
        />
      </label>
      {previewUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img className="thumb" src={previewUrl} alt="design preview" />
      )}
    </div>
  );
}
