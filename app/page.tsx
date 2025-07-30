'use client';
import { useState, useRef } from "react";
import Upload from "../components/Upload";
import StyleSelector from "../components/StyleSelector";

export default function HomePage() {
  const [styles, setStyles] = useState<string[]>([]);
  const fileRef = useRef<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [competitionResults, setCompetitionResults] = useState<any[]>([]);
  const [progress, setProgress] = useState<string>("");
  const [mode, setMode] = useState<'single' | 'competition'>('single');

  const handleUpload = (file: File) => {
    fileRef.current = file;
    console.log("✅ File uploaded:", file.name, file.size, "bytes");
  };

  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = async () => {
    if (mode === 'single' && styles.length === 0) {
      alert("Please select at least one style");
      return;
    }

    if (!fileRef.current) {
      alert("Please upload an image");
      return;
    }

    setLoading(true);
    setProgress(mode === 'competition' ? "Generating 8 variations..." : "Generating image...");
    setResultUrl(null);
    setCompetitionResults([]);

    try {
      const fileBase64 = await convertFileToBase64(fileRef.current);
      const requestBody = {
        file: fileBase64,
        styles: mode === 'competition' ? [
          "Glamazon Queen", "Cyberpunk Diva", "Disco Inferno", "Baroque Beauty",
          "Pastel Princess", "Fierce Femme", "Alien Royalty", "Fantasy Fairy"
        ] : styles,
        isCompetition: mode === 'competition'
      };

      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Generation failed');
      }

      const data = await response.json();

      if (data.isCompetition) {
        setCompetitionResults(data.results);
        setProgress("Competition complete!");
      } else {
        setResultUrl(data.imageUrl);
        setProgress("Complete!");
      }

    } catch (error: any) {
      console.error("❌ Error:", error);
      alert(`Error: ${error.message}`);
      setProgress("");
    } finally {
      setLoading(false);
    }
  };

  const canSubmit = !!fileRef.current && (mode === 'competition' || styles.length > 0);

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold text-center bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
        ✨ Drag Yourself ✨
      </h1>

      <div className="space-y-6">
        <Upload onUpload={handleUpload} />

        <div className="bg-gray-50 rounded-lg p-4 space-y-4">
          <h2 className="text-lg font-semibold text-center">Choose Your Experience</h2>
          <div className="flex space-x-4 justify-center">
            <button
              onClick={() => {
                setMode('single');
                setStyles([]);
                setCompetitionResults([]);
                setResultUrl(null);
              }}
              className={`px-6 py-3 rounded-lg font-medium transition-all ${
                mode === 'single'
                  ? 'bg-pink-500 text-white shadow-lg'
                  : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-pink-300'
              }`}
            >
              🎨 Custom Style
              <div className="text-xs mt-1">Choose your own styles</div>
            </button>
            <button
              onClick={() => {
                setMode('competition');
                setStyles([]);
                setCompetitionResults([]);
                setResultUrl(null);
              }}
              className={`px-6 py-3 rounded-lg font-medium transition-all ${
                mode === 'competition'
                  ? 'bg-purple-500 text-white shadow-lg'
                  : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-purple-300'
              }`}
            >
              🏆 Competition
              <div className="text-xs mt-1">Generate 8 variations</div>
            </button>
          </div>
        </div>

        {mode === 'single' && (
          <StyleSelector selected={styles} setSelected={setStyles} />
        )}

        {mode === 'competition' && (
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <h3 className="font-semibold text-purple-800 mb-2">Competition Mode</h3>
            <p className="text-sm text-purple-700 mb-3">
              We'll generate your photo in 8 different drag styles:
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              {["Glamazon Queen", "Cyberpunk Diva", "Disco Inferno", "Baroque Beauty",
                "Pastel Princess", "Fierce Femme", "Alien Royalty", "Fantasy Fairy"].map(style => (
                <div key={style} className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-center">
                  {style}
                </div>
              ))}
            </div>
          </div>
        )}

        <button
          onClick={handleSubmit}
          className={`px-6 py-3 rounded-lg w-full font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
            mode === 'competition'
              ? 'bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white'
              : 'bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white'
          }`}
          disabled={loading || !canSubmit}
        >
          {loading
            ? (mode === 'competition' ? "Generating 8 Images..." : "Generating...")
            : (mode === 'competition' ? "🏆 Start Competition" : "🎨 Generate Style")
          }
        </button>

        {progress && (
          <div className="text-center text-sm text-gray-600 bg-gray-100 p-2 rounded">
            {progress}
          </div>
        )}

        {resultUrl && mode === 'single' && (
          <div className="mt-6 space-y-4">
            <h2 className="text-xl font-semibold text-center">Your Drag Transformation:</h2>
            <img
              src={resultUrl}
              alt="Generated drag transformation"
              className="w-full max-w-md mx-auto rounded-lg shadow-lg"
            />
            <div className="flex space-x-2 max-w-md mx-auto">
              <a
                href={resultUrl}
                download="drag-transformation.jpg"
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded flex-1 text-center transition-colors"
              >
                Download
              </a>
              <a
                href={`/video?pageImage=${encodeURIComponent(resultUrl ?? "")}`}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex-1 text-center transition-colors"
              >
                🎬 Create Video
              </a>
              <button
                onClick={() => {
                  setResultUrl(null);
                  setStyles([]);
                  fileRef.current = null;
                }}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded flex-1 transition-colors"
              >
                Start Over
              </button>
            </div>
          </div>
        )}

        {competitionResults.length > 0 && mode === 'competition' && (
          <div className="mt-6 space-y-4">
            <h2 className="text-2xl font-semibold text-center">🏆 Your Drag Competition Results</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {competitionResults.map((result, index) => (
                <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="aspect-[3/4] relative">
                    {result.success && result.imageUrl ? (
                      <img
                        src={result.imageUrl}
                        alt={result.style}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-500 text-sm">Failed to generate</span>
                      </div>
                    )}
                  </div>
                  <div className="p-3">
                    <h3 className="font-semibold text-sm text-center">{result.style}</h3>
                    {result.success && result.imageUrl && (
                      <a
                        href={result.imageUrl}
                        download={`${result.style.replace(/\s+/g, '_')}.jpg`}
                        className="mt-2 bg-pink-500 hover:bg-pink-600 text-white px-3 py-1 rounded text-xs w-full block text-center transition-colors"
                      >
                        Download
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex space-x-2 justify-center mt-4">
              <a
                href={`/video?pageImage=${encodeURIComponent(
                  competitionResults.find(r => r.success && r.imageUrl)?.imageUrl ?? ""
                )}`}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex-1 text-center transition-colors"
              >
                🎬 Create Video
              </a>
              <button
                onClick={() => {
                  setCompetitionResults([]);
                  setStyles([]);
                  fileRef.current = null;
                }}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded flex-1 transition-colors"
              >
                Start Over
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
