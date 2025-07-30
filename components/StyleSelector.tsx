'use client';
import * as React from 'react';

const styles = [
  { name: "Glamazon Queen", emoji: "👑" },
  { name: "Cyberpunk Diva", emoji: "🤖" },
  { name: "Disco Inferno", emoji: "🕺" },
  { name: "Baroque Beauty", emoji: "🎭" },
  { name: "Pastel Princess", emoji: "🦄" },
  { name: "Fierce Femme", emoji: "💅" },
  { name: "Alien Royalty", emoji: "👽" },
  { name: "Fantasy Fairy", emoji: "🧚" },
  { name: "Pop Star Chic", emoji: "⭐" },
  { name: "90s Club Kid", emoji: "🌈" },
  { name: "Retro Rebel", emoji: "⚡" },
  { name: "Gothic Elegance", emoji: "🖤" },
  { name: "Mermaid Siren", emoji: "🧜" },
  { name: "Carnival Queen", emoji: "🎪" },
  { name: "Royal Drag", emoji: "💎" },
  { name: "Street Style Icon", emoji: "🔥" },
];

interface StyleSelectorProps {
  selected: string[];
  setSelected: (styles: string[]) => void;
}

export default function StyleSelector({ selected, setSelected }: StyleSelectorProps) {
  const maxStyles = 3; // Reduced for better prompting

  const toggleStyle = (styleName: string) => {
    if (selected.includes(styleName)) {
      setSelected(selected.filter(s => s !== styleName));
    } else if (selected.length < maxStyles) {
      setSelected([...selected, styleName]);
    } else {
      alert(`You can select up to ${maxStyles} styles for the best results.`);
    }
  };

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h2 className="text-lg font-semibold text-gray-800">Choose Your Drag Style</h2>
        <p className="text-sm text-gray-600">
          Select up to {maxStyles} styles ({selected.length}/{maxStyles} selected)
        </p>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {styles.map((style) => {
          const isSelected = selected.includes(style.name);
          return (
            <button
              key={style.name}
              onClick={() => toggleStyle(style.name)}
              className={`
                border-2 p-3 text-sm rounded-lg transition-all duration-200 font-medium
                flex flex-col items-center space-y-1 min-h-[80px] justify-center
                ${
                  isSelected
                    ? "bg-gradient-to-br from-pink-500 to-purple-600 text-white border-pink-500 shadow-lg transform scale-105"
                    : "bg-white hover:bg-gray-50 text-gray-700 border-gray-200 hover:border-pink-300 hover:shadow-md"
                }
                ${selected.length >= maxStyles && !isSelected ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
              `}
              disabled={selected.length >= maxStyles && !isSelected}
            >
              <span className="text-lg">{style.emoji}</span>
              <span className="text-center leading-tight">{style.name}</span>
            </button>
          );
        })}
      </div>

      {selected.length > 0 && (
        <div className="bg-pink-50 border border-pink-200 rounded-lg p-3">
          <p className="text-sm font-medium text-pink-800 mb-2">Selected styles:</p>
          <div className="flex flex-wrap gap-2">
            {selected.map((styleName) => {
              const style = styles.find(s => s.name === styleName);
              return (
                <span
                  key={styleName}
                  className="bg-pink-100 text-pink-800 px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1"
                >
                  <span>{style?.emoji}</span>
                  <span>{styleName}</span>
                  <button
                    onClick={() => toggleStyle(styleName)}
                    className="ml-1 text-pink-600 hover:text-pink-800 font-bold"
                  >
                    ×
                  </button>
                </span>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}