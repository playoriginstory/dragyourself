// components/StyleSelector.tsx
'use client';
import * as React from 'react';
const styles = [
  "Glamazon Queen", "Cyberpunk Diva", "Disco Inferno", "Baroque Beauty",
  "Pastel Princess", "Fierce Femme", "Alien Royalty", "Fantasy Fairy",
  "Pop Star Chic", "90s Club Kid", "Retro Rebel", "Gothic Elegance",
  "Mermaid Siren", "Carnival Queen", "Royal Drag", "Street Style Icon",
];

export default function StyleSelector({
  selected, setSelected
}: {
  selected: string | null;
  setSelected: (style: string) => void;
}) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
      {styles.map((style) => (
        <button
          key={style}
          onClick={() => setSelected(style)}
          className={`border p-2 text-xs rounded ${selected === style ? "bg-pink-500 text-white" : "bg-white"}`}
        >
          {style}
        </button>
      ))}
    </div>
  );
}
