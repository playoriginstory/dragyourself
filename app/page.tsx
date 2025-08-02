'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Upload from '../components/Upload';
import StyleSelector from '../components/StyleSelector';

export default function HomePage() {
  const router = useRouter();

  const [style, setStyle] = useState<string | null>(null);
  const [base64Image, setBase64Image] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [competitionResults, setCompetitionResults] = useState<
    Array<{ success: boolean; imageUrl?: string; style: string }>
  >([]);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [progress, setProgress] = useState('');
  const [mode, setMode] = useState<'single' | 'competition'>('single');

  const handleUpload = (base64: string) => {
    setBase64Image(base64);
  };

  const handleSubmit = async () => {
    if (!base64Image) {
      alert('Please upload an image');
      return;
    }
    if (mode === 'single' && !style) {
      alert('Please select a style');
      return;
    }

    setLoading(true);
    setProgress(mode === 'competition' ? 'Generating 8 variations...' : 'Generating image...');
    setResultUrl(null);
    setCompetitionResults([]);
    setSelectedIdx(null);

    try {
      const payload = {
        file: base64Image,
        styles:
          mode === 'competition'
            ? [
                'Glamazon Queen',
                'Cyberpunk Diva',
                'Disco Inferno',
                'Baroque Beauty',
                'Pastel Princess',
                'Fierce Femme',
                'Alien Royalty',
                'Fantasy Fairy',
              ]
            : [style],
        isCompetition: mode === 'competition',
      };

      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error((await res.json()).error || 'Generation failed');
      const data = await res.json();

      if (data.isCompetition) {
        setCompetitionResults(data.results);
        setProgress('Competition complete!');
      } else {
        setResultUrl(data.imageUrl);
        setProgress('Complete!');
      }
    } catch (err: any) {
      console.error(err);
      alert(`Error: ${err.message}`);
      setProgress('');
    } finally {
      setLoading(false);
    }
  };

  const canSubmit = !!base64Image && (mode === 'competition' || !!style);

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold text-center">✨ Drag Yourself ✨</h1>

      <Upload onUpload={handleUpload} />

      <div className="bg-gray-50 rounded-lg p-4 space-y-4">
        <h2 className="text-lg font-semibold text-center">Choose Your Experience</h2>
        <div className="flex space-x-4 justify-center">
          <button
            onClick={() => {
              setMode('single');
              setStyle(null);
              setCompetitionResults([]);
              setResultUrl(null);
              setSelectedIdx(null);
            }}
            className={`px-6 py-3 rounded-lg font-medium transition-all ${
              mode === 'single'
                ? 'bg-pink-500 text-white shadow-lg'
                : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-pink-300'
            }`}
          >
            🎨 Custom Style
          </button>
          <button
            onClick={() => {
              setMode('competition');
              setStyle(null);
              setCompetitionResults([]);
              setResultUrl(null);
              setSelectedIdx(null);
            }}
            className={`px-6 py-3 rounded-lg font-medium transition-all ${
              mode === 'competition'
                ? 'bg-purple-500 text-white shadow-lg'
                : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-purple-300'
            }`}
          >
            🏆 Competition
          </button>
        </div>
      </div>

      {mode === 'single' && (
        <StyleSelector selected={style} setSelected={setStyle} />
      )}

      {mode === 'competition' && competitionResults.length === 0 && (
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <p className="text-purple-700">
            We'll generate your photo in 8 different drag styles.
          </p>
        </div>
      )}

      <button
        onClick={handleSubmit}
        disabled={loading || !canSubmit}
        className={`w-full px-6 py-3 rounded-lg font-semibold transition ${
          mode === 'competition'
            ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white'
            : 'bg-gradient-to-r from-pink-500 to-purple-600 text-white'
        } disabled:opacity-50`}
      >
        {loading
          ? mode === 'competition'
            ? 'Generating 8 Images...'
            : 'Generating...'
          : mode === 'competition'
          ? '🏆 Start Competition'
          : '🎨 Generate Style'}
      </button>

      {progress && (
        <div className="text-center text-sm text-gray-600 bg-gray-100 p-2 rounded">
          {progress}
        </div>
      )}

      {resultUrl && mode === 'single' && (
        <div className="mt-6 space-y-4 text-center">
          <h2 className="text-xl font-semibold">Your Drag Transformation</h2>
          <img
            src={resultUrl}
            alt="Generated drag transformation"
            className="mx-auto rounded-lg shadow-md max-w-full"
          />
          <div className="flex justify-center space-x-2">
            <a
              href={resultUrl}
              download
              className="px-4 py-2 bg-green-500 text-white rounded"
            >
              Download
            </a>
            <button
              onClick={() =>
                router.push(`/video?pageImage=${encodeURIComponent(resultUrl)}`)
              }
              className="px-4 py-2 bg-blue-600 text-white rounded"
            >
              🎬 Create Video
            </button>
            <button
              onClick={() => {
                setResultUrl(null);
                setStyle(null);
                setBase64Image(null);
              }}
              className="px-4 py-2 bg-gray-500 text-white rounded"
            >
              Start Over
            </button>
          </div>
        </div>
      )}

      {competitionResults.length > 0 && mode === 'competition' && (
        <div className="mt-6 space-y-4">
          <h2 className="text-2xl font-semibold text-center">🏆 Competition Results</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {competitionResults.map((res, i) => (
              <div
                key={i}
                onClick={() => setSelectedIdx(i)}
                className={`cursor-pointer border-2 rounded overflow-hidden ${
                  selectedIdx === i
                    ? 'border-pink-500 ring-4 ring-pink-300'
                    : 'border-transparent'
                }`}
              >
                <div className="aspect-[3/4] bg-gray-100">
                  {res.success && res.imageUrl ? (
                    <img
                      src={res.imageUrl}
                      className="w-full h-full object-cover"
                      alt={res.style}
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-500">
                      Failed
                    </div>
                  )}
                </div>
                <div className="p-2 text-center text-sm">{res.style}</div>
              </div>
            ))}
          </div>
          <div className="flex justify-center space-x-2">
            <button
              disabled={selectedIdx === null}
              onClick={() =>
                router.push(
                  `/video?pageImage=${encodeURIComponent(
                    competitionResults[selectedIdx!].imageUrl!
                  )}`
                )
              }
              className="px-6 py-3 bg-blue-600 text-white rounded disabled:opacity-50"
            >
              🎬 Create Video
            </button>
            <button
              onClick={() => {
                setCompetitionResults([]);
                setSelectedIdx(null);
                setBase64Image(null);
              }}
              className="px-6 py-3 bg-gray-500 text-white rounded"
            >
              Start Over
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
