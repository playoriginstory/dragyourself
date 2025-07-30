// app/styles/page.tsx
'use client';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { fal } from '@fal-ai/client';




export default function StylesPage() {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const run = async () => {
      const reference_image_url = localStorage.getItem("uploadedImageURL");
      const prompt = localStorage.getItem("stylePrompt") || "";

      if (!reference_image_url || !prompt) {
        setLoading(false);
        return;
      }

      const result = await fal.subscribe("fal-ai/flux-pulid", {
        input: {
          prompt,
          reference_image_url,
          image_size: "portrait_4_3",
          num_inference_steps: 20,
          guidance_scale: 4,
          negative_prompt: "bad quality, worst quality, text, signature, watermark, extra limbs",
          enable_safety_checker: true,
        },
      });

      const generatedUrl = result.data?.images?.[0]?.url;
      if (generatedUrl) {
        setImageUrl(generatedUrl);
        localStorage.setItem("dragImage", generatedUrl);
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
