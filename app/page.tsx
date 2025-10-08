// app/page.tsx
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Upload from '../components/Upload';
import Quiz90s from '../components/Quiz90s';
import { build90sPrompt, ICONIC_PRESETS, type QuizAnswers } from '../lib/prompt90s';

export default function HomePage() {
  const router = useRouter();

  const [answers, setAnswers] = useState<QuizAnswers>({
    runway: "", house: "", editorial: "", glam: "", custom: ""
  });
  const [base64Image, setBase64Image] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [competitionResults, setCompetitionResults] = useState<
    Array<{ success: boolean; imageUrl?: string; style: string }>
  >([]);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [progress, setProgress] = useState('');
  const [mode, setMode] = useState<'single' | 'competition'>('single');

  const canSubmitSingle = !!base64Image &&
    answers.runway && answers.house && answers.editorial && answers.glam;

  const handleSubmit = async () => {
    if (!base64Image) return alert('Please upload an image');
    if (mode === 'single' && !canSubmitSingle) return alert('Answer all 4 questions');

    setLoading(true);
    setProgress(mode === 'competition' ? 'Generating iconic variations...' : 'Generating your 90s look...');
    setResultUrl(null);
    setCompetitionResults([]);
    setSelectedIdx(null);

    try {
      const payload =
        mode === 'competition'
          ? { file: base64Image, styles: ICONIC_PRESETS, isCompetition: true }
          : { file: base64Image, prompt: build90sPrompt(answers), isCompetition: false };

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
    } catch (e: any) {
      console.error(e);
      alert(`Error: ${e.message}`);
      setProgress('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold text-center">💋 Which 90s Supermodel Are You?</h1>
      <p className="text-center text-gray-600">Upload a photo, answer 4 questions, get your 90s image, then create a lipsync video.</p>

      <Upload onUpload={(b64)=>setBase64Image(b64)} />

      <div className="bg-gray-50 rounded-lg p-4 space-y-4">
        <h2 className="text-lg font-semibold text-center">Choose Your Experience</h2>
        <div className="flex space-x-4 justify-center">
          <button
            onClick={() => { setMode('single'); setCompetitionResults([]); setResultUrl(null); setSelectedIdx(null); }}
            className={`px-6 py-3 rounded-lg font-medium transition-all ${
              mode === 'single'
                ? 'bg-black text-white shadow-lg'
                : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-black'
            }`}
          >
            🧩 Quiz (4 questions)
          </button>
          <button
            onClick={() => { setMode('competition'); setResultUrl(null); setSelectedIdx(null); }}
            className={`px-6 py-3 rounded-lg font-medium transition-all ${
              mode === 'competition'
                ? 'bg-black text-white shadow-lg'
                : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-black'
            }`}
          >
            🏆 Iconic Presets
          </button>
        </div>
      </div>

      {mode === 'single' && <Quiz90s value={answers} onChange={setAnswers} />}

      {mode === 'competition' && competitionResults.length === 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <p className="text-amber-800">We’ll try {ICONIC_PRESETS.length} classic 90s aesthetics and show results.</p>
        </div>
      )}

      <button
        onClick={handleSubmit}
        disabled={loading || (mode==='single' ? !canSubmitSingle : !base64Image)}
        className="w-full px-6 py-3 rounded-lg font-semibold transition bg-black text-white disabled:opacity-50"
      >
        {loading ? (mode==='competition' ? 'Generating iconic variations…' : 'Generating…')
                 : (mode==='competition' ? '🏁 Run Presets' : '💄 See My 90s Look')}
      </button>

      {progress && <div className="text-center text-sm text-gray-600 bg-gray-100 p-2 rounded">{progress}</div>}

      {resultUrl && mode === 'single' && (
        <div className="mt-6 space-y-4 text-center">
          <h2 className="text-xl font-semibold">Your 90s Image</h2>
          <img src={resultUrl} alt="Generated 90s look" className="mx-auto rounded-lg shadow-md max-w-full" />
          <div className="flex justify-center gap-2 flex-wrap">
            <a href={resultUrl} download className="px-4 py-2 bg-green-600 text-white rounded">Download</a>
            <button
              onClick={() => router.push(`/video?pageImage=${encodeURIComponent(resultUrl)}`)}
              className="px-4 py-2 bg-blue-600 text-white rounded"
            >
              🎬 Create Lipsync Video
            </button>
            <button
              onClick={() => { setResultUrl(null); setBase64Image(null); }}
              className="px-4 py-2 bg-gray-600 text-white rounded"
            >
              Start Over
            </button>
          </div>
        </div>
      )}

      {competitionResults.length > 0 && mode === 'competition' && (
        <div className="mt-6 space-y-4">
          <h2 className="text-2xl font-semibold text-center">🏆 Preset Results</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {competitionResults.map((res, i) => (
              <div
                key={i}
                onClick={() => setSelectedIdx(i)}
                className={`cursor-pointer border-2 rounded overflow-hidden ${selectedIdx === i ? 'border-black ring-4 ring-gray-300' : 'border-transparent'}`}
              >
                <div className="aspect-[3/4] bg-gray-100">
                  {res.success && res.imageUrl
                    ? <img src={res.imageUrl} className="w-full h-full object-cover" alt={res.style} />
                    : <div className="flex items-center justify-center h-full text-gray-500">Failed</div>}
                </div>
                <div className="p-2 text-center text-sm">{res.style}</div>
              </div>
            ))}
          </div>
          <div className="flex justify-center gap-2 flex-wrap">
            <button
              disabled={selectedIdx === null}
              onClick={() => {
                const url = competitionResults[selectedIdx!].imageUrl!;
                if (url) router.push(`/video?pageImage=${encodeURIComponent(url)}`);
              }}
              className="px-6 py-3 bg-blue-600 text-white rounded disabled:opacity-50"
            >
              🎬 Create Lipsync Video
            </button>
            <button
              onClick={() => { setCompetitionResults([]); setSelectedIdx(null); setBase64Image(null); }}
              className="px-6 py-3 bg-gray-600 text-white rounded"
            >
              Start Over
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
