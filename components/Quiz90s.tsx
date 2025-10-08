// components/Quiz90s.tsx
'use client';
import React from 'react';
import type { QuizAnswers } from '../lib/prompt90s';

type Props = { value: QuizAnswers; onChange: (v: QuizAnswers) => void };

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="space-y-2">
    <div className="text-sm font-medium">{label}</div>
    {children}
  </div>
);

const Chip = ({ active, onClick, children }:{
  active: boolean; onClick: () => void; children: React.ReactNode
}) => (
  <button
    type="button"
    onClick={onClick}
    className={`px-3 py-2 rounded-lg border text-sm transition
    ${active ? "bg-black text-white border-black" : "bg-white border-gray-300 hover:border-black"}`}
  >
    {children}
  </button>
);

export default function Quiz90s({ value, onChange }: Props) {
  const set = (k: keyof QuizAnswers, v: string) => onChange({ ...value, [k]: v });

  const runway = ["Power-walk like Naomi","Cool minimal like Christy","Couture chameleon like Linda","Effortless grunge like Kate"];
  const house  = ["Versace Baroque","Calvin Klein minimalism","Chanel tweed fantasy","Dolce & Gabbana Sicilian glamour"];
  const edit   = ["High-gloss Vogue cover","Backstage runway candids","Studio beauty close-up","Street-style off-duty"];
  const glam   = ["Brown lip liner + smokey eye","Super-shiny gloss + soft contour","Matte red lip + sharp liner","Dewy skin + brushed brows"];

  const group = (opts: string[], key: keyof QuizAnswers) => (
    <div className="flex flex-wrap gap-2">
      {opts.map(o => (
        <Chip key={o} active={value[key]===o} onClick={()=>set(key,o)}>{o}</Chip>
      ))}
    </div>
  );

  return (
    <div className="bg-gray-50 rounded-lg p-4 space-y-6">
      <Field label="1) Runway energy">{group(runway,'runway')}</Field>
      <Field label="2) Fashion house vibe">{group(house,'house')}</Field>
      <Field label="3) Editorial mood">{group(edit,'editorial')}</Field>
      <Field label="4) Glam details">{group(glam,'glam')}</Field>

      <Field label="Optional: Add your own 90s phrase">
        <input
          value={value.custom ?? ""}
          onChange={e=>set('custom', e.target.value)}
          placeholder={`e.g., "Pepsi '92 hair wind"`}
          className="w-full rounded-lg border border-gray-300 px-3 py-2"
        />
      </Field>
    </div>
  );
}
