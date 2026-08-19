import React from 'react';

// Cycles accent → green → orange, matching the hero section's tag pills.
const TAG_COLORS = ['bg-[#04a3cc] text-black', 'bg-[#A5CD04] text-black', 'bg-[#f59e0b] text-black'];

export default function TagPills({ tags }: { tags: string[] }) {
  if (tags.length === 0) return null;

  return (
    <div className="relative z-20 flex flex-wrap items-center gap-2">
      {tags.map((tag, i) => (
        <span
          key={tag}
          className={`px-3 py-1 rounded-sm font-display text-3xl uppercase select-none ${TAG_COLORS[i % TAG_COLORS.length]}`}
        >
          {tag}
        </span>
      ))}
    </div>
  );
}
