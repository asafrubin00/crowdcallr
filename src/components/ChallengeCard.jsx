import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import FieldBadge from './FieldBadge';
import MarketBar from './MarketBar';
import { getUserName } from './UserAvatar';

export default function ChallengeCard({ challenge }) {
  const navigate = useNavigate();
  const { getSolutionPercent, getTotalBetsForChallenge } = useApp();

  const totalBets = getTotalBetsForChallenge(challenge);
  const sortedSolutions = [...challenge.solutions].sort((a, b) => b.totalBets - a.totalBets);
  const topSolution = sortedSolutions[0];
  const topPercent = topSolution ? getSolutionPercent(challenge, topSolution) : 0;
  const isResolved = challenge.status === 'resolved';

  const timeLabel = challenge.daysAgo === 0 ? 'Today' : `${challenge.daysAgo}d ago`;

  return (
    <div
      onClick={() => navigate(`/challenge/${challenge.id}`)}
      className="bg-white rounded-xl border border-slate-200 p-5 hover:border-sky-300 hover:shadow-md cursor-pointer transition-all group"
    >
      {/* Header row */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2 flex-wrap">
          <FieldBadge field={challenge.field} />
          {isResolved ? (
            <span className="text-xs px-2 py-0.5 bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-full font-medium">
              ✓ Resolved
            </span>
          ) : (
            <span className="text-xs px-2 py-0.5 bg-sky-100 text-sky-700 border border-sky-200 rounded-full font-medium">
              Open
            </span>
          )}
        </div>
        {/* Prize pool */}
        <div className="flex items-center gap-1 shrink-0 bg-amber-50 border border-amber-200 rounded-lg px-2.5 py-1">
          <span className="text-amber-500 text-sm">◎</span>
          <span className="text-amber-700 font-bold text-sm">{challenge.prizePool.toLocaleString()}</span>
        </div>
      </div>

      {/* Title */}
      <h3 className="font-semibold text-slate-900 text-sm leading-snug mb-3 group-hover:text-sky-700 transition-colors line-clamp-2">
        {challenge.title}
      </h3>

      {/* Market section */}
      {challenge.solutions.length > 0 && (
        <div className="mb-3">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs text-slate-400 font-medium">
              {isResolved ? 'Winning solution' : 'Market leader'}
            </span>
            <span className="text-xs text-slate-500">
              {challenge.solutions.length} solution{challenge.solutions.length !== 1 ? 's' : ''}
            </span>
          </div>
          {topSolution && (
            <>
              <p className="text-xs text-slate-600 mb-1.5 line-clamp-1 italic">
                "{topSolution.text.slice(0, 90)}…"
              </p>
              <MarketBar percent={topPercent} label size="sm" />
            </>
          )}
        </div>
      )}

      {challenge.solutions.length === 0 && (
        <div className="mb-3 py-3 text-center text-slate-400 text-xs bg-slate-50 rounded-lg border border-dashed border-slate-200">
          No solutions yet — be the first to propose one
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-slate-100">
        <span className="text-xs text-slate-400">
          By {getUserName(challenge.postedById)} · {timeLabel}
        </span>
        <div className="flex items-center gap-1 text-xs text-slate-500">
          <span className="text-amber-400">◎</span>
          <span>{totalBets.toLocaleString()} in market</span>
        </div>
      </div>
    </div>
  );
}
