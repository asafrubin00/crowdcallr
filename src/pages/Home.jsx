import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import ChallengeCard from '../components/ChallengeCard';
import { FIELDS } from '../data/mockData';

const STATUS_FILTERS = ['All', 'Open', 'Resolved'];

export default function Home() {
  const { challenges, coins } = useApp();
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState('All');
  const [fieldFilter, setFieldFilter] = useState('All');
  const [search, setSearch] = useState('');

  const filtered = challenges.filter(ch => {
    if (statusFilter === 'Open' && ch.status !== 'open') return false;
    if (statusFilter === 'Resolved' && ch.status !== 'resolved') return false;
    if (fieldFilter !== 'All' && ch.field !== fieldFilter) return false;
    if (search && !ch.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const openCount = challenges.filter(c => c.status === 'open').length;
  const totalPool = challenges.reduce((s, c) => s + c.prizePool + c.solutions.reduce((ss, sol) => ss + sol.totalBets, 0), 0);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">

      {/* Hero */}
      <div className="mb-8 bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-8 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle at 80% 20%, #0ea5e9 0%, transparent 50%)' }}
        />
        <div className="relative">
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="text-xs font-semibold bg-sky-500/20 text-sky-300 border border-sky-500/30 px-2.5 py-1 rounded-full">
              Research Challenge Market
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold mb-2 leading-tight">
            What does the crowd think?
          </h1>
          <p className="text-slate-300 text-sm sm:text-base max-w-xl leading-relaxed mb-6">
            Post a research challenge. The crowd proposes solutions and bets virtual coins on the best one.
            Market prices reveal collective confidence. The challenge poster picks a winner.
          </p>
          <div className="flex flex-wrap gap-6">
            <div>
              <div className="text-2xl font-bold text-sky-400">{openCount}</div>
              <div className="text-xs text-slate-400">Open challenges</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-amber-400">◎ {totalPool.toLocaleString()}</div>
              <div className="text-xs text-slate-400">Total coins in market</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-emerald-400">◎ {coins.toLocaleString()}</div>
              <div className="text-xs text-slate-400">Your balance</div>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        {/* Search */}
        <div className="relative flex-1">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search challenges..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
          />
        </div>

        {/* Status filter */}
        <div className="flex gap-1 bg-white border border-slate-200 rounded-lg p-1">
          {STATUS_FILTERS.map(f => (
            <button
              key={f}
              onClick={() => setStatusFilter(f)}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                statusFilter === f
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Field filter */}
        <select
          value={fieldFilter}
          onChange={e => setFieldFilter(e.target.value)}
          className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500"
        >
          <option value="All">All fields</option>
          {FIELDS.map(f => <option key={f} value={f}>{f}</option>)}
        </select>

        {/* Post button */}
        <button
          onClick={() => navigate('/post')}
          className="sm:hidden bg-sky-500 hover:bg-sky-400 text-white font-semibold text-sm px-4 py-2 rounded-lg transition-colors"
        >
          + Post Challenge
        </button>
      </div>

      {/* Challenge grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-slate-400">
          <div className="text-4xl mb-3">🔬</div>
          <p className="font-medium">No challenges match your filters.</p>
          <button onClick={() => { setStatusFilter('All'); setFieldFilter('All'); setSearch(''); }}
            className="mt-3 text-sky-600 text-sm hover:underline">
            Clear filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(ch => (
            <ChallengeCard key={ch.id} challenge={ch} />
          ))}
        </div>
      )}
    </div>
  );
}
