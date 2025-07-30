// components/Upload.tsx
'use client';
import * as React from 'react';
import { useState } from "react";

export default function Upload({ onUpload }: { onUpload: (file: File) => void }) {
  const [name, setName] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setName(file.name);
      onUpload(file);
    }
  };

  return (
    <div className="border p-4 rounded text-center">
      <input type="file" accept="image/*" onChange={handleChange} />
      {name && <p className="mt-2 text-sm">Uploaded: {name}</p>}
    </div>
  );
}
