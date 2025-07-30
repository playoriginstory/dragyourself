// app/page.tsx
'use client';

import { useState } from "react";
import * as React from 'react';
import { useRouter } from "next/navigation";
import Upload from "../components/Upload";
import { fal } from "@fal-ai/client";
import StyleSelector from "../components/StyleSelector";

let uploadedFile: File | null = null;

export default function HomePage() {
  const [styles, setStyles] = useState<string[]>([]);
  const router = useRouter();
  const [isUploaded, setIsUploaded] = useState(false);

  const handleUpload = async (file: File) => {
    try {
      const url = await fal.storage.upload(file);
      localStorage.setItem("uploadedImageURL", url);
      setIsUploaded(true);
      console.log("✅ Uploaded URL:", url);
    } catch (err) {
      console.error("❌ Upload failed:", err);  // ← this will show real error
      alert("Failed to upload image.");
      setIsUploaded(false);
    }
  };
    
  const handleSubmit = () => {
    if (styles.length === 0) return alert("Please select at least one style");
    const imageUrl = localStorage.getItem("uploadedImageURL");
    if (!imageUrl) return alert("Please upload an image");
  
    localStorage.setItem("stylePrompt", JSON.stringify(styles));
    router.push("/styles");
  };
  
  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-center">✨ Drag Yourself ✨</h1>
      <Upload onUpload={handleUpload} />
      <StyleSelector selected={styles} setSelected={setStyles} />
      <button
        onClick={handleSubmit}
        className="bg-pink-600 text-white px-4 py-2 rounded w-full mt-4"
      >
        Generate Drag Style
      </button>
    </div>
  );
}
