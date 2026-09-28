import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Header from './components/Header';
import Home from './pages/Home';
import ChallengePage from './pages/ChallengePage';
import PostChallenge from './pages/PostChallenge';
import Leaderboard from './pages/Leaderboard';

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-slate-100 flex flex-col">
          <Header />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/challenge/:id" element={<ChallengePage />} />
              <Route path="/post" element={<PostChallenge />} />
              <Route path="/leaderboard" element={<Leaderboard />} />
            </Routes>
          </main>
          <footer className="mt-auto px-4 py-6 text-center text-xs text-slate-500">
            © 2026 <a className="underline underline-offset-2 hover:text-slate-700" href="https://asafrubin00.github.io/asaf-rubin-website/">Asaf Rubin</a>. All rights reserved.
          </footer>
        </div>
      </BrowserRouter>
    </AppProvider>
  );
}
