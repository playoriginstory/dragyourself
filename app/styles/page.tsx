// app/styles/page.tsx
'use client';
import * as React from 'react';
import { useEffect, useState } from "react";
import { uploadImageAndGenerate } from "../../lib/fal";

let uploadedFile: File | null = null;

export default function StylesPage() {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const run = async () => {
      if (!uploadedFile) return;
      const prompt = localStorage.getItem("stylePrompt") || "";
      const url = await uploadImageAndGenerate(prompt, uploadedFile);
      if (url) {
        setImageUrl(url);
        localStorage.setItem("dragImage", url); // 👈 Store it here
      }
      setLoading(false);
    };
    run();
  }, []);

  return (
    <div className="p-6 max-w-xl mx-auto text-center">
      <h1 className="text-xl font-bold mb-4">Your Drag Look 👑</h1>
      {loading ? (
        <p>Generating image...</p>
      ) : imageUrl ? (
        <img src={imageUrl} alt="Drag result" className="rounded shadow" />
      ) : (
        <p>Something went wrong.</p>
      )}
    </div>
  );
}
