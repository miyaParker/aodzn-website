'use client';

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export default function FilterDropdown<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: T[];
  onChange: (value: T) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        onBlur={() => setTimeout(() => setOpen(false), 120)}
        className="flex items-center gap-2 text-sm font-medium text-black hover:text-neutral-600 transition-colors"
      >
        <span className="text-neutral-500">{label}</span>
        <span>{value}</span>
        <ChevronDown className={`w-3.5 h-3.5 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-3 min-w-40 rounded-sm border border-black/10 bg-white shadow-lg overflow-hidden z-20">
          {options.map((opt) => (
            <button
              key={opt}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => {
                onChange(opt);
                setOpen(false);
              }}
              className={`block w-full text-left px-4 py-2.5 text-sm transition-colors ${
                opt === value ? 'bg-black/5 text-black font-medium' : 'text-neutral-600 hover:bg-black/5'
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
