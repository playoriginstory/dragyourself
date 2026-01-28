'use client';
import React from 'react';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import PhraseSelector from '../../components/PhraseSelector';

const presetPhrases = [
    "Go on then, have it.",
    "Alright — let’s see what you’ve got.",
    "This one’s a proper moment.",
    "Yeah… that’s bang on."
];

const voices = [
  "Aria", "Roger", "Sarah", "Laura", "Charlie", "George", "Callum",
  "River", "Liam", "Charlotte", "Alice", "Matilda", "Will", "Jessica",
  "Eric", "Chris", "Brian", "Daniel", "Lily", "Bill"
];

export default function VideoPage() {
  const searchParams = useSearchParams();
  const imageUrl = searchParams.get('pageImage');
  const [prompt, setPrompt] = useState('');
  const [voice, setVoice] = useState('Bill');
  const [mode, setMode] = useState<'basic' | 'premium'>('basic');
  const [videoUrl, setVideoUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!imageUrl) return alert('Missing image URL');
    setLoading(true);

    const payload = {
      imageUrl,
      mode,
      textInput: mode === 'basic'
        ? 'The camera slowly zooms out revealing the full drag transformation in dramatic lighting.'
        : prompt,
      ...(mode === 'premium' && { voice }), // Conditionally add voice if mode is premium
    };

    const res = await fetch('/api/video', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    setLoading(false);
    if (!res.ok) return alert(data.error || 'Video generation failed');
    setVideoUrl(data.videoUrl);
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-xl font-bold mb-4 text-center">
        {mode === 'premium' ? '🎤 Generate Premium Lip Sync Video' : '🎬 Generate Basic Video'}
      </h1>
      {imageUrl && (
        <img src={imageUrl} alt="Preview" className="w-full max-w-xs mx-auto mb-4 rounded" />
      )}
      <div className="space-y-4">
        {mode === 'premium' && (
          <>
            <input
              type="text"
              placeholder="Type your phrase..."
              className="w-full border p-2 rounded"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
            <PhraseSelector options={presetPhrases} onPick={setPrompt} />
            <div className="flex items-center space-x-2">
              <label className="text-sm">Choose a voice:</label>
              <select
                className="w-full p-2 border rounded"
                value={voice}
                onChange={(e) => setVoice(e.target.value)}
              >
                {voices.map((voiceOption) => (
                  <option key={voiceOption} value={voiceOption}>
                    {voiceOption}
                  </option>
                ))}
              </select>
            </div>
          </>
        )}
        <select
          className="w-full p-2 border rounded"
          value={mode}
          onChange={(e) => setMode(e.target.value as 'basic' | 'premium')}
        >
          <option value="basic">Basic Video</option>
          <option value="premium">Premium LipSync Video</option>
        </select>
        <button
          onClick={handleSubmit}
          className="-600 text-white px-4 py-2 rounded w-full"
          disabled={loading}
        >
          {loading
            ? mode === 'premium'
              ? 'Generating Premium Lip Sync...'
              : 'Generating Basic Video...'
            : mode === 'premium'
            ? '🎤 Generate Premium Lip Sync Video'
            : '🎬 Generate Basic Video'}
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
