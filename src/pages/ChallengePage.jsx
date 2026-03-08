import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import FieldBadge from '../components/FieldBadge';
import MarketBar from '../components/MarketBar';
import UserAvatar, { getUserName, getUserInstitution } from '../components/UserAvatar';

function BetPanel({ challenge, solution, onClose }) {
  const { coins, placeBet, getMyBetForSolution } = useApp();
  const [amount, setAmount] = useState('');
  const myCurrentBet = getMyBetForSolution(challenge.id, solution.id);

  const handleBet = () => {
    const ok = placeBet(challenge.id, solution.id, amount);
    if (ok) onClose();
  };

  const parsedAmt = parseInt(amount, 10) || 0;
  const totalPool = challenge.solutions.reduce((s, sol) => s + sol.totalBets, 0) + parsedAmt;
  const newBets = solution.totalBets + parsedAmt;
  const newPercent = totalPool > 0 ? Math.round((newBets / totalPool) * 100) : 0;

  return (
    <div className="mt-4 bg-slate-50 border border-slate-200 rounded-xl p-4">
      <h4 className="font-semibold text-slate-800 text-sm mb-1">Place a Bet</h4>
      <p className="text-slate-500 text-xs mb-3">
        Bet coins that this solution will be chosen as the winner.
        {myCurrentBet > 0 && <span className="ml-1 text-amber-600 font-medium">You've already bet ◎{myCurrentBet} on this.</span>}
      </p>
      <div className="flex gap-2 mb-3">
        <div className="relative flex-1">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-500 text-sm">◎</span>
          <input
            type="number"
            min="1"
            max={coins}
            value={amount}
            onChange={e => setAmount(e.target.value)}
            placeholder="Amount"
            className="w-full pl-7 pr-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
        </div>
        <button
          onClick={() => setAmount(String(Math.floor(coins * 0.1)))}
          className="px-2.5 py-2 text-xs bg-slate-200 hover:bg-slate-300 text-slate-600 rounded-lg font-medium"
        >10%</button>
        <button
          onClick={() => setAmount(String(Math.floor(coins * 0.25)))}
          className="px-2.5 py-2 text-xs bg-slate-200 hover:bg-slate-300 text-slate-600 rounded-lg font-medium"
        >25%</button>
        <button
          onClick={() => setAmount(String(coins))}
          className="px-2.5 py-2 text-xs bg-slate-200 hover:bg-slate-300 text-slate-600 rounded-lg font-medium"
        >All</button>
      </div>

      {parsedAmt > 0 && (
        <div className="bg-white border border-slate-200 rounded-lg p-3 mb-3 text-xs text-slate-600 space-y-1">
          <div className="flex justify-between">
            <span>Projected market share after bet:</span>
            <span className="font-semibold text-sky-700">{newPercent}%</span>
          </div>
          <div className="flex justify-between">
            <span>Your balance after:</span>
            <span className={`font-semibold ${coins - parsedAmt < 0 ? 'text-red-600' : 'text-slate-800'}`}>
              ◎{(coins - parsedAmt).toLocaleString()}
            </span>
          </div>
        </div>
      )}

      <div className="flex gap-2">
        <button
          onClick={handleBet}
          disabled={!parsedAmt || parsedAmt > coins || parsedAmt <= 0}
          className="flex-1 bg-sky-600 hover:bg-sky-500 disabled:bg-slate-200 disabled:text-slate-400 text-white font-semibold text-sm py-2 rounded-lg transition-colors"
        >
          Place Bet · ◎{parsedAmt > 0 ? parsedAmt.toLocaleString() : '—'}
        </button>
        <button onClick={onClose} className="px-4 py-2 text-sm text-slate-500 hover:text-slate-700 border border-slate-200 rounded-lg">
          Cancel
        </button>
      </div>
      <p className="text-xs text-slate-400 mt-2">
        Balance: ◎{coins.toLocaleString()} available
      </p>
    </div>
  );
}

function SolutionCard({ challenge, solution, rank }) {
  const { getSolutionPercent, getMyBetForSolution, coins, pickWinner } = useApp();
  const [bettingOpen, setBettingOpen] = useState(false);
  const percent = getSolutionPercent(challenge, solution);
  const myBet = getMyBetForSolution(challenge.id, solution.id);
  const isWinner = challenge.winningSolutionId === solution.id;
  const isResolved = challenge.status === 'resolved';
  const isMyChallenge = challenge.postedById === 'user_me';

  const totalPool = challenge.prizePool + challenge.solutions.reduce((s, sol) => s + sol.totalBets, 0);
  const potentialPayout = solution.totalBets > 0 ? Math.round((solution.totalBets / challenge.solutions.reduce((s, sol) => s + sol.totalBets, 0)) * totalPool) : 0;
  const impliedOdds = percent > 0 ? (100 / percent).toFixed(2) : '—';

  return (
    <div className={`border rounded-xl p-5 transition-all ${
      isWinner
        ? 'border-emerald-300 bg-emerald-50 shadow-md'
        : 'border-slate-200 bg-white hover:border-slate-300'
    }`}>
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2.5">
          <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
            rank === 1 ? 'bg-amber-100 text-amber-700' :
            rank === 2 ? 'bg-slate-100 text-slate-600' :
            'bg-slate-100 text-slate-500'
          }`}>
            {rank}
          </div>
          <UserAvatar userId={solution.postedById} size="sm" />
          <div>
            <p className="text-sm font-semibold text-slate-800 leading-tight">
              {getUserName(solution.postedById)}
            </p>
            <p className="text-xs text-slate-400">{getUserInstitution(solution.postedById)}</p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1 shrink-0">
          {isWinner && (
            <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-300">
              ✓ Winner
            </span>
          )}
          {myBet > 0 && (
            <span className="text-xs font-medium text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full border border-amber-200">
              Your bet: ◎{myBet}
            </span>
          )}
        </div>
      </div>

      {/* Solution text */}
      <p className="text-slate-700 text-sm leading-relaxed mb-4 whitespace-pre-line">
        {solution.text}
      </p>

      {/* Market data */}
      <div className="bg-slate-50 rounded-lg p-3 mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Market</span>
          <div className="flex gap-4 text-xs text-slate-500">
            <span>◎{solution.totalBets.toLocaleString()} bet</span>
            <span className="font-semibold text-slate-700">{percent}%</span>
          </div>
        </div>
        <MarketBar percent={percent} size="md" />
        {!isResolved && solution.totalBets > 0 && (
          <div className="flex justify-between mt-2 text-xs text-slate-400">
            <span>Implied odds: {impliedOdds}x</span>
            <span>Pool share: {percent}%</span>
          </div>
        )}
      </div>

      {/* Actions */}
      {!isResolved && (
        <div className="flex gap-2">
          <button
            onClick={() => setBettingOpen(!bettingOpen)}
            disabled={coins <= 0}
            className="flex-1 border border-sky-500 text-sky-600 hover:bg-sky-50 disabled:opacity-40 font-semibold text-sm py-2 rounded-lg transition-colors"
          >
            {bettingOpen ? 'Cancel' : '◎ Bet on this'}
          </button>
          {isMyChallenge && (
            <button
              onClick={() => pickWinner(challenge.id, solution.id)}
              className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm py-2 rounded-lg transition-colors"
            >
              Pick as Winner
            </button>
          )}
        </div>
      )}

      {bettingOpen && !isResolved && (
        <BetPanel
          challenge={challenge}
          solution={solution}
          onClose={() => setBettingOpen(false)}
        />
      )}
    </div>
  );
}

export default function ChallengePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getChallenge, postSolution, getTotalBetsForChallenge, getSolutionPercent } = useApp();
  const [solutionText, setSolutionText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const challenge = getChallenge(id);

  if (!challenge) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <p className="text-slate-500">Challenge not found.</p>
        <button onClick={() => navigate('/')} className="mt-4 text-sky-600 hover:underline text-sm">
          ← Back to challenges
        </button>
      </div>
    );
  }

  const sortedSolutions = [...challenge.solutions].sort((a, b) => b.totalBets - a.totalBets);
  const totalBetsInMarket = getTotalBetsForChallenge(challenge);
  const totalPool = challenge.prizePool + totalBetsInMarket;
  const isResolved = challenge.status === 'resolved';
  const isMyChallenge = challenge.postedById === 'user_me';

  const handleSubmitSolution = () => {
    if (!solutionText.trim()) return;
    setSubmitting(true);
    postSolution(challenge.id, solutionText);
    setSolutionText('');
    setSubmitting(false);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      {/* Back */}
      <button
        onClick={() => navigate('/')}
        className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 mb-6 group"
      >
        <svg className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        All challenges
      </button>

      {/* Challenge header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 mb-6">
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <FieldBadge field={challenge.field} size="md" />
          {isResolved ? (
            <span className="text-sm px-2.5 py-1 bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-full font-medium">
              ✓ Resolved
            </span>
          ) : (
            <span className="text-sm px-2.5 py-1 bg-sky-100 text-sky-700 border border-sky-200 rounded-full font-medium">
              Open
            </span>
          )}
          {challenge.tags.map(tag => (
            <span key={tag} className="text-xs px-2 py-0.5 bg-slate-100 text-slate-500 rounded-full">
              #{tag}
            </span>
          ))}
        </div>

        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 leading-snug mb-4">
          {challenge.title}
        </h1>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-4 mb-5 bg-slate-50 rounded-xl p-4 border border-slate-100">
          <div className="text-center">
            <div className="text-lg font-bold text-amber-600">◎ {challenge.prizePool.toLocaleString()}</div>
            <div className="text-xs text-slate-400">Prize pool</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-sky-600">◎ {totalPool.toLocaleString()}</div>
            <div className="text-xs text-slate-400">Total pot</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-slate-800">{challenge.solutions.length}</div>
            <div className="text-xs text-slate-400">Solutions</div>
          </div>
        </div>

        {/* Description */}
        <div className="prose prose-sm max-w-none">
          {challenge.description.split('\n').map((line, i) => (
            line.trim() ? (
              <p key={i} className="text-slate-700 text-sm leading-relaxed mb-2">{line}</p>
            ) : <br key={i} />
          ))}
        </div>

        {/* Posted by */}
        <div className="flex items-center gap-2 mt-5 pt-4 border-t border-slate-100">
          <UserAvatar userId={challenge.postedById} size="sm" />
          <div className="text-xs text-slate-500">
            Posted by <span className="font-semibold text-slate-700">{getUserName(challenge.postedById)}</span>
            {' · '}{getUserInstitution(challenge.postedById)}
            {' · '}{challenge.daysAgo === 0 ? 'Today' : `${challenge.daysAgo} days ago`}
          </div>
        </div>
      </div>

      {/* Market overview */}
      {sortedSolutions.length > 1 && (
        <div className="bg-white border border-slate-200 rounded-xl p-4 mb-6">
          <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3">Market Overview</h3>
          <div className="space-y-2">
            {sortedSolutions.map((sol, i) => {
              const pct = getSolutionPercent(challenge, sol);
              const isWinner = challenge.winningSolutionId === sol.id;
              return (
                <div key={sol.id} className="flex items-center gap-3">
                  <span className="text-xs text-slate-400 w-4 shrink-0">{i + 1}</span>
                  <div className="flex-1">
                    <MarketBar percent={pct} size="sm" />
                  </div>
                  <span className="text-xs font-semibold w-8 text-right text-slate-600">{pct}%</span>
                  <span className="text-xs text-slate-400 w-20 text-right shrink-0">◎{sol.totalBets.toLocaleString()}</span>
                  {isWinner && <span className="text-xs text-emerald-600 font-bold shrink-0">✓</span>}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Solutions */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-slate-900 text-lg">
            {sortedSolutions.length} Solution{sortedSolutions.length !== 1 ? 's' : ''}
          </h2>
          {isMyChallenge && !isResolved && (
            <p className="text-xs text-slate-400 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full text-amber-700">
              This is your challenge — pick a winner when ready
            </p>
          )}
        </div>
        {sortedSolutions.length === 0 ? (
          <div className="bg-white border border-dashed border-slate-300 rounded-xl py-12 text-center">
            <div className="text-3xl mb-2">💡</div>
            <p className="text-slate-500 text-sm font-medium">No solutions yet.</p>
            <p className="text-slate-400 text-xs mt-1">Be the first to propose one below.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {sortedSolutions.map((sol, i) => (
              <SolutionCard
                key={sol.id}
                challenge={challenge}
                solution={sol}
                rank={i + 1}
              />
            ))}
          </div>
        )}
      </div>

      {/* Post a solution */}
      {!isResolved && (
        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <h3 className="font-bold text-slate-900 mb-1">Propose a Solution</h3>
          <p className="text-slate-500 text-xs mb-4">
            Share your expertise. Other researchers will bet coins on whether yours will be chosen as the best.
          </p>
          <textarea
            value={solutionText}
            onChange={e => setSolutionText(e.target.value)}
            placeholder="Write your proposed solution here. Be specific, cite relevant literature where possible, and explain your reasoning…"
            rows={6}
            className="w-full border border-slate-200 rounded-lg p-3 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 resize-y mb-3"
          />
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">{solutionText.length} chars</span>
            <button
              onClick={handleSubmitSolution}
              disabled={!solutionText.trim() || submitting}
              className="bg-sky-600 hover:bg-sky-500 disabled:bg-slate-200 disabled:text-slate-400 text-white font-semibold text-sm px-5 py-2 rounded-lg transition-colors"
            >
              Submit Solution
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
