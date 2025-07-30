// app/page.tsx
'use client';

import { useState } from "react";
import * as React from 'react';
import { useRouter } from "next/navigation";
import Upload from "../components/Upload";
import StyleSelector from "../components/StyleSelector";

let uploadedFile: File | null = null;

export default function HomePage() {
  const [style, setStyle] = useState<string | null>(null);
  const router = useRouter();

  const handleUpload = (file: File) => {
    uploadedFile = file;
  };

  const handleSubmit = () => {
    if (!style || !uploadedFile) return alert("Please upload and select style");
    localStorage.setItem("stylePrompt", style);
    router.push("/styles");
  };

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-center">✨ Drag Yourself ✨</h1>
      <Upload onUpload={handleUpload} />
      <StyleSelector selected={style} setSelected={setStyle} />
      <button
        onClick={handleSubmit}
        className="bg-pink-600 text-white px-4 py-2 rounded w-full mt-4"
      >
        Generate Drag Style
      </button>
    </div>
  );
}
