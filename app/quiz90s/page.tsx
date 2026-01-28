'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { getRandomQuestions, type Question } from '../../lib/quiz90s-data';

export default function Ultimate90sQuiz() {
  const [questions, setQuestions] = useState<Question[]>(getRandomQuestions());
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const current = questions[currentIdx];

  const handleSelect = (option: string) => {
    setSelected(option);
    if (option === current.answer) setScore((s) => s + 1);
    setTimeout(() => {
      if (currentIdx < questions.length - 1) {
        setCurrentIdx((i) => i + 1);
        setSelected(null);
      } else setFinished(true);
    }, 1000);
  };

  const restartQuiz = () => {
    setQuestions(getRandomQuestions());
    setCurrentIdx(0);
    setScore(0);
    setSelected(null);
    setFinished(false);
  };

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-8 text-center">
      <h1 className="text-4xl font-bold">🎧 Ultimate 90s Quiz</h1>
      <p className="text-gray-600">
        Test your knowledge of Britpop, fashion, film, and all things 90s.
      </p>

      {/* ✅ make this a link back to homepage instead */}
      <Link
        href="/"
        className="inline-block px-6 py-3 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition"
      >
        ⬅ Back Home
      </Link>

      {!finished ? (
        <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
          <div className="text-sm text-gray-500 uppercase tracking-wide">
            {current.category}
          </div>
          <h2 className="text-xl font-semibold">{current.question}</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
            {current.options.map((opt) => {
              const isCorrect = selected && opt === current.answer;
              const isWrong = selected && opt === selected && opt !== current.answer;
              return (
                <button
                  key={opt}
                  disabled={!!selected}
                  onClick={() => handleSelect(opt)}
                  className={`px-4 py-2 rounded-lg border transition text-sm font-medium ${
                    selected
                      ? isCorrect
                        ? 'bg-green-600 text-white border-green-600'
                        : isWrong
                        ? 'bg-red-600 text-white border-red-600'
                        : 'opacity-70 border-gray-300'
                      : 'bg-white border-gray-300 hover:border-black'
                  }`}
                >
                  {opt}
                </button>
              );
            })}
          </div>

          <div className="text-gray-500 mt-4">
            Question {currentIdx + 1} / {questions.length}
          </div>
        </div>
      ) : (
        <div className="bg-gray-100 p-6 rounded-lg">
          <h2 className="text-2xl font-bold mb-4">🕹 Quiz Complete!</h2>
          <p className="text-lg">
            You got <span className="font-bold">{score}</span> / {questions.length} correct!
          </p>
          <div className="flex justify-center gap-3 mt-6 flex-wrap">
            <button
              onClick={restartQuiz}
              className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition"
            >
              🔁 Try Again
            </button>
            <Link
              href="/"
              className="px-6 py-3 bg-black-600 text-white rounded-lg hover:bg-blackk-700 transition"
            >
              🏠 Home
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
