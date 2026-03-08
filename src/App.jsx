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
        <div className="min-h-screen bg-slate-100">
          <Header />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/challenge/:id" element={<ChallengePage />} />
              <Route path="/post" element={<PostChallenge />} />
              <Route path="/leaderboard" element={<Leaderboard />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </AppProvider>
  );
}
