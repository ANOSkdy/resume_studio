"use client";

import { useFormContext } from "react-hook-form";
import { IResumeFormData } from "@/types";

export function PhotoUpload() {
  const { setValue, watch } = useFormContext<IResumeFormData>();
  const photo = watch("photo");

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = String(reader.result || "");
      setValue("photo", base64, { shouldDirty: true });
    };
    reader.readAsDataURL(file);
  };

  return (
    <div>
      <label htmlFor="photo-upload">証明写真</label>
      <input id="photo-upload" className="touch-target" type="file" accept="image/*" onChange={onFileChange} />
      {photo ? <img className="photo-preview" src={photo} alt="証明写真のプレビュー" /> : null}
    </div>
  );
}
