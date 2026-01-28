'use client';

import * as React from 'react';
export default function PhraseSelector({
  options,
  onPick,
}: {
  options: string[];
  onPick: (phrase: string) => void;
}) {
  return (
    <div className="mt-2">
      <label className="text-sm block mb-1">Or choose a preset:</label>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {options.map((phrase) => (
          <button
            key={phrase}
            onClick={() => onPick(phrase)}
            className="text-xs bg-gray-100 p-2 rounded hover:bg-black-100"
          >
            {phrase}
          </button>
        ))}
      </div>
    </div>
  );
}
