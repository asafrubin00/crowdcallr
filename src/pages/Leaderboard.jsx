import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { MOCK_USERS } from '../data/mockData';
import UserAvatar, { getUserName, getUserInstitution } from '../components/UserAvatar';

function computeStats(challenges) {
  const stats = {};

  MOCK_USERS.forEach(u => {
    stats[u.id] = {
      userId: u.id,
      challengesPosted: 0,
      solutionsPosted: 0,
      solutionsWon: 0,
      totalBetsPlaced: 0,
      totalCoinsInMarket: 0,
    };
  });

  challenges.forEach(ch => {
    if (stats[ch.postedById]) {
      stats[ch.postedById].challengesPosted++;
    }
    ch.solutions.forEach(sol => {
      if (!stats[sol.postedById]) {
        stats[sol.postedById] = {
          userId: sol.postedById,
          challengesPosted: 0,
          solutionsPosted: 0,
          solutionsWon: 0,
          totalBetsPlaced: 0,
          totalCoinsInMarket: 0,
        };
      }
      stats[sol.postedById].solutionsPosted++;
      stats[sol.postedById].totalCoinsInMarket += sol.totalBets;
      if (ch.winningSolutionId === sol.id) {
        stats[sol.postedById].solutionsWon++;
      }
    });
  });

  return Object.values(stats).filter(s => s.solutionsPosted > 0 || s.challengesPosted > 0);
}

const TABS = ['Top Solvers', 'Top Questioners', 'Market Activity'];

export default function Leaderboard() {
  const navigate = useNavigate();
  const { challenges } = useApp();
  const [activeTab, setActiveTab] = useState('Top Solvers');

  const allStats = computeStats(challenges);

  const topSolvers = [...allStats]
    .sort((a, b) => b.solutionsWon * 3 + b.solutionsPosted - (a.solutionsWon * 3 + a.solutionsPosted))
    .slice(0, 10);

  const topQuestioners = [...allStats]
    .sort((a, b) => b.challengesPosted - a.challengesPosted)
    .slice(0, 10);

  const topMarket = [...allStats]
    .sort((a, b) => b.totalCoinsInMarket - a.totalCoinsInMarket)
    .slice(0, 10);

  const getCurrentList = () => {
    if (activeTab === 'Top Solvers') return topSolvers;
    if (activeTab === 'Top Questioners') return topQuestioners;
    return topMarket;
  };

  const getRankIcon = (i) => {
    if (i === 0) return '🥇';
    if (i === 1) return '🥈';
    if (i === 2) return '🥉';
    return `#${i + 1}`;
  };

  const getStatLabel = (stat) => {
    if (activeTab === 'Top Solvers') {
      return (
        <div className="text-right">
          <div className="text-sm font-bold text-slate-800">
            {stat.solutionsPosted} solution{stat.solutionsPosted !== 1 ? 's' : ''}
          </div>
          <div className="text-xs text-emerald-600 font-medium">
            {stat.solutionsWon} win{stat.solutionsWon !== 1 ? 's' : ''}
          </div>
        </div>
      );
    }
    if (activeTab === 'Top Questioners') {
      return (
        <div className="text-right">
          <div className="text-sm font-bold text-slate-800">
            {stat.challengesPosted} challenge{stat.challengesPosted !== 1 ? 's' : ''}
          </div>
          <div className="text-xs text-slate-400">posted</div>
        </div>
      );
    }
    return (
      <div className="text-right">
        <div className="text-sm font-bold text-amber-600">◎{stat.totalCoinsInMarket.toLocaleString()}</div>
        <div className="text-xs text-slate-400">in markets</div>
      </div>
    );
  };

  const currentList = getCurrentList();

  // Overall stats
  const totalChallenges = challenges.length;
  const totalSolutions = challenges.reduce((s, c) => s + c.solutions.length, 0);
  const totalResolved = challenges.filter(c => c.status === 'resolved').length;
  const totalMarket = challenges.reduce((s, c) => s + c.solutions.reduce((ss, sol) => ss + sol.totalBets, 0), 0);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <button
        onClick={() => navigate('/')}
        className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 mb-6 group"
      >
        <svg className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back
      </button>

      <h1 className="text-2xl font-bold text-slate-900 mb-2">Leaderboard</h1>
      <p className="text-slate-500 text-sm mb-6">Top contributors to the CrowdCallr research community.</p>

      {/* Platform stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Challenges', value: totalChallenges, color: 'text-sky-600' },
          { label: 'Solutions', value: totalSolutions, color: 'text-violet-600' },
          { label: 'Resolved', value: totalResolved, color: 'text-emerald-600' },
          { label: 'In market', value: `◎${totalMarket.toLocaleString()}`, color: 'text-amber-600' },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-white border border-slate-200 rounded-xl p-4 text-center">
            <div className={`text-xl font-bold ${color}`}>{value}</div>
            <div className="text-xs text-slate-400 mt-0.5">{label}</div>
          </div>
        ))}
      </div>

      {/* Tab bar */}
      <div className="flex bg-white border border-slate-200 rounded-xl p-1 mb-4">
        {TABS.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${
              activeTab === tab
                ? 'bg-slate-900 text-white'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Rankings */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        {currentList.length === 0 ? (
          <div className="py-12 text-center text-slate-400">No data yet</div>
        ) : (
          <div className="divide-y divide-slate-100">
            {currentList.map((stat, i) => (
              <div
                key={stat.userId}
                className={`flex items-center gap-4 px-5 py-4 ${i < 3 ? 'bg-slate-50' : 'hover:bg-slate-50'} transition-colors`}
              >
                {/* Rank */}
                <div className="w-8 text-center text-lg shrink-0">
                  {typeof getRankIcon(i) === 'string' && getRankIcon(i).startsWith('#') ? (
                    <span className="text-sm font-bold text-slate-400">{getRankIcon(i)}</span>
                  ) : (
                    getRankIcon(i)
                  )}
                </div>

                {/* Avatar + name */}
                <UserAvatar userId={stat.userId} size="md" />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-slate-800 text-sm truncate">
                    {getUserName(stat.userId)}
                  </p>
                  <p className="text-xs text-slate-400 truncate">
                    {getUserInstitution(stat.userId)}
                  </p>
                </div>

                {/* Stats */}
                {getStatLabel(stat)}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* How scoring works */}
      <div className="mt-6 bg-slate-50 border border-slate-200 rounded-xl p-4">
        <h3 className="text-sm font-semibold text-slate-700 mb-2">How rankings work</h3>
        <ul className="text-xs text-slate-500 space-y-1">
          <li><span className="font-medium text-slate-700">Top Solvers</span> — ranked by winning solutions (3pts) + total solutions posted (1pt)</li>
          <li><span className="font-medium text-slate-700">Top Questioners</span> — ranked by number of challenges posted</li>
          <li><span className="font-medium text-slate-700">Market Activity</span> — ranked by total coins attracted to their solutions</li>
        </ul>
      </div>
    </div>
  );
}
