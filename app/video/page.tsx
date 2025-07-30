'use client';
import * as React from 'react';
import { useState } from "react";
import { generateBasicVideo, generateVeo2Video } from "../../lib/video";
import PhraseSelector from "../../components/PhraseSelector";

const presetPhrases = [
  "Serve face, serve looks, serve attitude.",
  "Sashay into the spotlight.",
  "Eleganza extravaganza in full effect.",
  "You better work that camera, diva!",
];

export default function VideoPage() {
  const [mode, setMode] = useState<"basic" | "veo2">("basic");
  const [prompt, setPrompt] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null); // Set this from prior result
  const [videoUrl, setVideoUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!imageUrl) return alert("Missing image URL");
    setLoading(true);
    const video =
      mode === "basic"
        ? await generateBasicVideo(imageUrl, prompt)
        : await generateVeo2Video(imageUrl, prompt);
    if (video) setVideoUrl(video);
    setLoading(false);
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-xl font-bold mb-4 text-center">🎬 Generate Drag Video</h1>

      <div className="space-y-4">
        <label className="block text-sm font-medium">Choose Prompt:</label>
        <input
          type="text"
          placeholder="Type your phrase..."
          className="w-full border p-2 rounded"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />

        <PhraseSelector options={presetPhrases} onPick={setPrompt} />

        <div className="mt-4">
          <label className="block text-sm font-medium">Choose Mode:</label>
          <select
            className="w-full p-2 border rounded"
            value={mode}
            onChange={(e) => setMode(e.target.value as any)}
          >
            <option value="basic">Basic Stylized Video</option>
            <option value="veo2">Veo 2 with Voice Prompt</option>
          </select>
        </div>

        <button
          onClick={handleSubmit}
          className="bg-pink-600 text-white px-4 py-2 rounded w-full mt-4"
          disabled={loading}
        >
          {loading ? "Generating..." : "Generate Video"}
        </button>

        {videoUrl && (
          <div className="mt-6">
            <video src={videoUrl} controls className="w-full rounded" />
            <a
              href={videoUrl}
              download
              className="block text-center mt-2 underline text-sm text-blue-600"
            >
              Download Video
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
