import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { FIELDS } from '../data/mockData';

export default function PostChallenge() {
  const navigate = useNavigate();
  const { postChallenge, coins } = useApp();

  const [form, setForm] = useState({
    title: '',
    description: '',
    field: FIELDS[0],
    tags: '',
    prizePool: 100,
    deadline: '',
  });
  const [errors, setErrors] = useState({});

  const update = (key, value) => setForm(f => ({ ...f, [key]: value }));

  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = 'Title is required';
    else if (form.title.length < 20) e.title = 'Title should be at least 20 characters';
    if (!form.description.trim()) e.description = 'Description is required';
    else if (form.description.length < 50) e.description = 'Please provide more detail (50+ chars)';
    if (!form.deadline) e.deadline = 'Please set a deadline';
    if (form.prizePool < 10) e.prizePool = 'Minimum prize is ◎10';
    if (form.prizePool > coins) e.prizePool = `You only have ◎${coins} available`;
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    const newId = postChallenge(form);
    if (newId) navigate(`/challenge/${newId}`);
  };

  const remainingCoins = coins - form.prizePool;

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
      <button
        onClick={() => navigate('/')}
        className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 mb-6 group"
      >
        <svg className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back
      </button>

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Post a Research Challenge</h1>
        <p className="text-slate-500 text-sm mt-1">
          Describe your research problem. The crowd will propose solutions and bet on the best one.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Title */}
        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <label className="block text-sm font-semibold text-slate-800 mb-1">
            Challenge Title <span className="text-red-500">*</span>
          </label>
          <p className="text-xs text-slate-400 mb-2">
            Be specific. Frame it as a research question.
          </p>
          <input
            type="text"
            value={form.title}
            onChange={e => update('title', e.target.value)}
            placeholder="e.g. What is the most robust method for measuring academic impact beyond citations?"
            className="w-full border border-slate-200 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
          {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
        </div>

        {/* Description */}
        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <label className="block text-sm font-semibold text-slate-800 mb-1">
            Description <span className="text-red-500">*</span>
          </label>
          <p className="text-xs text-slate-400 mb-2">
            Explain the context, what you've already tried, and what a good answer would look like.
            More detail gets better solutions.
          </p>
          <textarea
            value={form.description}
            onChange={e => update('description', e.target.value)}
            placeholder="Provide background, existing approaches you're aware of, constraints, and what success looks like for your research..."
            rows={7}
            className="w-full border border-slate-200 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 resize-y"
          />
          {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
          <p className="text-xs text-slate-400 mt-1 text-right">{form.description.length} chars</p>
        </div>

        {/* Field + Tags */}
        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-800 mb-1">Research Field</label>
              <select
                value={form.field}
                onChange={e => update('field', e.target.value)}
                className="w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
              >
                {FIELDS.map(f => <option key={f} value={f}>{f}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-800 mb-1">Tags</label>
              <input
                type="text"
                value={form.tags}
                onChange={e => update('tags', e.target.value)}
                placeholder="e.g. methods, citations, peer-review"
                className="w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
              <p className="text-xs text-slate-400 mt-1">Comma-separated</p>
            </div>
          </div>
        </div>

        {/* Prize + Deadline */}
        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Prize */}
            <div>
              <label className="block text-sm font-semibold text-slate-800 mb-1">
                Prize Pool <span className="text-red-500">*</span>
              </label>
              <p className="text-xs text-slate-400 mb-2">
                Coins you commit to the winner. The betting pool from other users will be added on top.
              </p>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-500">◎</span>
                <input
                  type="number"
                  min="10"
                  max={coins}
                  value={form.prizePool}
                  onChange={e => update('prizePool', parseInt(e.target.value) || 0)}
                  className="w-full border border-slate-200 rounded-lg pl-7 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>
              {errors.prizePool && <p className="text-red-500 text-xs mt-1">{errors.prizePool}</p>}

              <div className="flex gap-2 mt-2">
                {[50, 100, 250, 500].map(amt => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => update('prizePool', Math.min(amt, coins))}
                    className="flex-1 text-xs py-1 border border-slate-200 rounded text-slate-500 hover:bg-slate-50"
                  >
                    ◎{amt}
                  </button>
                ))}
              </div>

              <div className={`mt-3 text-xs px-3 py-2 rounded-lg ${remainingCoins < 0 ? 'bg-red-50 text-red-600' : 'bg-slate-50 text-slate-500'}`}>
                Balance after posting: ◎{remainingCoins.toLocaleString()} (you have ◎{coins.toLocaleString()})
              </div>
            </div>

            {/* Deadline */}
            <div>
              <label className="block text-sm font-semibold text-slate-800 mb-1">
                Deadline <span className="text-red-500">*</span>
              </label>
              <p className="text-xs text-slate-400 mb-2">
                When you'll choose a winning solution.
              </p>
              <input
                type="date"
                value={form.deadline}
                min={new Date().toISOString().split('T')[0]}
                onChange={e => update('deadline', e.target.value)}
                className="w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
              {errors.deadline && <p className="text-red-500 text-xs mt-1">{errors.deadline}</p>}
            </div>
          </div>
        </div>

        {/* How it works */}
        <div className="bg-sky-50 border border-sky-200 rounded-xl p-4">
          <h3 className="text-sm font-semibold text-sky-800 mb-2">How this works</h3>
          <ul className="text-xs text-sky-700 space-y-1">
            <li>→ Your prize pool is locked in immediately when you post</li>
            <li>→ Other researchers propose solutions and the community bets coins on the best one</li>
            <li>→ Market percentages show collective confidence in each solution</li>
            <li>→ You pick the winner — they receive the full pot (your prize + all bets)</li>
            <li>→ Bettors who picked the winner share the pot proportionally to their bets</li>
          </ul>
        </div>

        {/* Submit */}
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={remainingCoins < 0}
            className="flex-1 bg-sky-600 hover:bg-sky-500 disabled:bg-slate-200 disabled:text-slate-400 text-white font-bold py-3 rounded-xl transition-colors"
          >
            Post Challenge · Lock ◎{form.prizePool.toLocaleString()}
          </button>
          <button
            type="button"
            onClick={() => navigate('/')}
            className="px-5 py-3 border border-slate-200 text-slate-600 rounded-xl font-medium hover:bg-slate-50"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
