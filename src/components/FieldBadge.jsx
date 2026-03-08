import React from 'react';
import { FIELD_COLORS } from '../data/mockData';

export default function FieldBadge({ field, size = 'sm' }) {
  const colors = FIELD_COLORS[field] || {
    bg: 'bg-slate-100', text: 'text-slate-600', border: 'border-slate-200'
  };
  const sizeClass = size === 'sm'
    ? 'text-xs px-2 py-0.5'
    : 'text-sm px-2.5 py-1';

  return (
    <span className={`inline-flex items-center rounded-full border font-medium ${colors.bg} ${colors.text} ${colors.border} ${sizeClass}`}>
      {field}
    </span>
  );
}
