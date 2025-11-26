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

const Chip = ({
  active,
  onClick,
  children,
  disabled,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  disabled?: boolean;
}) => (
  <button
    type="button"
    onClick={!disabled ? onClick : undefined}
    disabled={disabled}
    className={`px-3 py-2 rounded-lg border text-sm transition flex items-center gap-1
      ${
        disabled
          ? 'bg-gray-200 text-gray-400 border-gray-200 cursor-not-allowed'
          : active
          ? 'bg-black text-white border-black'
          : 'bg-white border-gray-300 hover:border-black'
      }`}
  >
    {children}
    {disabled && <span className="ml-1">🔒</span>}
  </button>
);

export default function Quiz90s({ value, onChange }: Props) {
  const set = (v: string) => onChange({ ...value, style: v });

  const styleOptions = [
    'Lad Britpop / Madchester',
    'Sophisticated Britpop',
    'Britpop Casual',
    '90s Pop Female',
    'All Saints urban cool',
    'Boy Band',
    'Red Carpet Glamour',
    '90s Grunge',
    '90s Rave',
    'US Hip Hop - Street Wear',
    'Supermodel',
    'Garage | Drums and Bass Look',
  ];

  // ✅ Locked styles (until quiz is completed)
  const LOCKED_STYLES = [
    'US Hip Hop - Street Wear',
    'Supermodel',
    'Red Carpet Glamour',
    'Garage | Drums and Bass Look',
  ];

  return (
    <div className="bg-gray-50 rounded-lg p-4 space-y-6">
      <Field label="✨ Pick Your 90s Style Persona">
        <div className="flex flex-wrap gap-2">
          {styleOptions.map((o) => (
            <Chip
              key={o}
              active={value.style === o}
              onClick={() => set(o)}
              disabled={LOCKED_STYLES.includes(o)}
            >
              {LOCKED_STYLES.includes(o) ? (
                <span title="Complete the quiz to unlock!">{o}</span>
              ) : (
                o
              )}
            </Chip>
          ))}
        </div>
      </Field>
    </div>
  );
}
