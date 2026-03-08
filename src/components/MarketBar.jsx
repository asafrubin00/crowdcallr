import React from 'react';

export default function MarketBar({ percent, label, size = 'md' }) {
  const height = size === 'sm' ? 'h-1.5' : 'h-2.5';
  const color =
    percent >= 60 ? 'bg-emerald-500' :
    percent >= 40 ? 'bg-sky-500' :
    percent >= 20 ? 'bg-amber-500' :
    'bg-slate-400';

  return (
    <div className="flex items-center gap-2 w-full">
      <div className={`flex-1 bg-slate-100 rounded-full ${height} overflow-hidden`}>
        <div
          className={`${height} rounded-full ${color} market-bar-fill`}
          style={{ width: `${Math.max(percent, 1)}%` }}
        />
      </div>
      {label !== undefined && (
        <span className="text-xs font-semibold text-slate-500 w-10 text-right shrink-0">
          {percent}%
        </span>
      )}
    </div>
  );
}
