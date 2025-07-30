'use client';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import PhraseSelector from '../../components/PhraseSelector';

const presetPhrases = [
  'Serve face, serve looks, serve attitude.',
  'Sashay into the spotlight.',
  'Eleganza extravaganza in full effect.',
  'You better work that camera, diva!',
];

export default function VideoPage() {
  const searchParams = useSearchParams();
  const imageUrl = searchParams.get('pageImage');
  const [prompt, setPrompt] = useState('');
  const [mode, setMode] = useState<'basic' | 'veo2'>('basic');
  const [videoUrl, setVideoUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!imageUrl) return alert('Missing image URL');
    setLoading(true);

    const res = await fetch('/api/video', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        imageUrl,
        mode,
        phrase:
          mode === 'basic'
            ? 'The camera slowly zooms out revealing the full drag transformation in dramatic lighting.'
            : prompt,
      }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) return alert(data.error || 'Video generation failed');
    setVideoUrl(data.videoUrl);
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-xl font-bold mb-4 text-center">
        {mode === 'veo2' ? '🎤 Generate Lip Sync Video' : '🎬 Generate Stylized Video'}
      </h1>

      {imageUrl && (
        <img src={imageUrl} alt="Preview" className="w-full max-w-xs mx-auto mb-4 rounded" />
      )}

      <div className="space-y-4">
        {mode === 'veo2' && (
          <>
            <input
              type="text"
              placeholder="Type your phrase..."
              className="w-full border p-2 rounded"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
            <PhraseSelector options={presetPhrases} onPick={setPrompt} />
          </>
        )}

        <select
          className="w-full p-2 border rounded"
          value={mode}
          onChange={(e) => setMode(e.target.value as 'basic' | 'veo2')}
        >
          <option value="basic">Basic Stylized Video (WAN)</option>
          <option value="veo2">Veo2 with Voice Prompt</option>
        </select>

        <button
          onClick={handleSubmit}
          className="bg-pink-600 text-white px-4 py-2 rounded w-full"
          disabled={loading}
        >
          {loading
            ? mode === 'veo2'
              ? 'Generating Lip Sync...'
              : 'Generating Video...'
            : mode === 'veo2'
            ? '🎤 Generate Lip Sync Video'
            : '🎬 Generate Stylized Video'}
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
