import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export default function Header() {
  const { coins, notifications } = useApp();
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { to: '/', label: 'Challenges' },
    { to: '/leaderboard', label: 'Leaderboard' },
  ];

  const isActive = (to) => {
    if (to === '/') return location.pathname === '/';
    return location.pathname.startsWith(to);
  };

  return (
    <>
      {/* Notification toasts */}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
        {notifications.map(n => (
          <div
            key={n.id}
            className="bg-emerald-600 text-white text-sm font-medium px-4 py-2.5 rounded-lg shadow-lg animate-bounce pointer-events-none"
          >
            {n.msg}
          </div>
        ))}
      </div>

      <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 rounded-lg bg-sky-500 flex items-center justify-center font-bold text-white text-sm">
                CC
              </div>
              <span className="font-bold text-white text-lg tracking-tight">
                CrowdCallr
              </span>
              <span className="hidden sm:inline text-slate-400 text-xs font-medium bg-slate-800 px-2 py-0.5 rounded-full">
                Research Market
              </span>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map(({ to, label }) => (
                <Link
                  key={to}
                  to={to}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    isActive(to)
                      ? 'bg-slate-700 text-white'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  {label}
                </Link>
              ))}
            </nav>

            {/* Right side */}
            <div className="flex items-center gap-3">
              {/* Coin balance */}
              <div className="flex items-center gap-1.5 bg-slate-800 rounded-full px-3 py-1.5">
                <span className="text-amber-400 text-base">◎</span>
                <span className="text-white font-semibold text-sm">{coins.toLocaleString()}</span>
                <span className="text-slate-400 text-xs">coins</span>
              </div>

              {/* Post challenge button */}
              <button
                onClick={() => navigate('/post')}
                className="hidden sm:flex items-center gap-1.5 bg-sky-500 hover:bg-sky-400 text-white font-semibold text-sm px-3.5 py-1.5 rounded-lg transition-colors"
              >
                <span className="text-lg leading-none">+</span>
                Post Challenge
              </button>

              {/* Mobile menu button */}
              <button
                className="md:hidden p-2 text-slate-400 hover:text-white"
                onClick={() => setMenuOpen(!menuOpen)}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile menu */}
          {menuOpen && (
            <div className="md:hidden border-t border-slate-800 py-3 flex flex-col gap-1">
              {navLinks.map(({ to, label }) => (
                <Link
                  key={to}
                  to={to}
                  onClick={() => setMenuOpen(false)}
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    isActive(to)
                      ? 'bg-slate-700 text-white'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {label}
                </Link>
              ))}
              <Link
                to="/post"
                onClick={() => setMenuOpen(false)}
                className="mt-1 px-3 py-2 bg-sky-500 text-white font-semibold text-sm rounded-md text-center"
              >
                + Post Challenge
              </Link>
            </div>
          )}
        </div>
      </header>
    </>
  );
}
