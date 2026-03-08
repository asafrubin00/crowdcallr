import React, { createContext, useContext, useState, useCallback } from 'react';
import { INITIAL_CHALLENGES } from '../data/mockData';

const AppContext = createContext(null);

const CURRENT_USER = {
  id: 'user_me',
  name: 'You',
  institution: 'Your Institution',
  avatar: 'ME',
};

const STARTING_COINS = 1000;

export function AppProvider({ children }) {
  const [challenges, setChallenges] = useState(INITIAL_CHALLENGES);
  const [coins, setCoins] = useState(STARTING_COINS);
  // bets: { [challengeId_solutionId]: amount }
  const [myBets, setMyBets] = useState({});
  const [notifications, setNotifications] = useState([]);

  const addNotification = useCallback((msg, type = 'success') => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, msg, type }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 3500);
  }, []);

  // Place a bet on a solution
  const placeBet = useCallback((challengeId, solutionId, amount) => {
    const amt = parseInt(amount, 10);
    if (!amt || amt <= 0 || amt > coins) return false;

    setCoins(prev => prev - amt);
    setMyBets(prev => {
      const key = `${challengeId}_${solutionId}`;
      return { ...prev, [key]: (prev[key] || 0) + amt };
    });
    setChallenges(prev =>
      prev.map(ch => {
        if (ch.id !== challengeId) return ch;
        return {
          ...ch,
          solutions: ch.solutions.map(s => {
            if (s.id !== solutionId) return s;
            return { ...s, totalBets: s.totalBets + amt };
          }),
        };
      })
    );
    addNotification(`Bet of ${amt} coins placed!`);
    return true;
  }, [coins, addNotification]);

  // Post a new challenge
  const postChallenge = useCallback((data) => {
    const cost = data.prizePool;
    if (cost > coins) return false;

    setCoins(prev => prev - cost);
    const newChallenge = {
      id: Date.now(),
      title: data.title,
      description: data.description,
      field: data.field,
      tags: data.tags.split(',').map(t => t.trim()).filter(Boolean),
      prizePool: cost,
      postedById: 'user_me',
      daysAgo: 0,
      deadline: data.deadline,
      status: 'open',
      winningSolutionId: null,
      solutions: [],
    };
    setChallenges(prev => [newChallenge, ...prev]);
    addNotification('Challenge posted!');
    return newChallenge.id;
  }, [coins, addNotification]);

  // Post a solution to a challenge
  const postSolution = useCallback((challengeId, text) => {
    if (!text.trim()) return false;
    const newSolution = {
      id: Date.now(),
      text: text.trim(),
      postedById: 'user_me',
      daysAgo: 0,
      totalBets: 0,
    };
    setChallenges(prev =>
      prev.map(ch => {
        if (ch.id !== challengeId) return ch;
        return { ...ch, solutions: [...ch.solutions, newSolution] };
      })
    );
    addNotification('Solution submitted!');
    return true;
  }, [addNotification]);

  // Pick a winning solution (only for challenges you posted)
  const pickWinner = useCallback((challengeId, solutionId) => {
    setChallenges(prev =>
      prev.map(ch => {
        if (ch.id !== challengeId) return ch;
        const totalPool = ch.prizePool + ch.solutions.reduce((s, sol) => s + sol.totalBets, 0);
        const winningSol = ch.solutions.find(s => s.id === solutionId);
        if (!winningSol) return ch;

        // Pay out to current user if they bet on the winner
        const betKey = `${challengeId}_${solutionId}`;
        const myBetAmt = myBets[betKey] || 0;
        if (myBetAmt > 0 && winningSol.totalBets > 0) {
          const payout = Math.round((myBetAmt / winningSol.totalBets) * totalPool);
          setCoins(c => c + payout);
          addNotification(`Your bet paid out ${payout} coins!`, 'success');
        }

        return { ...ch, status: 'resolved', winningSolutionId: solutionId };
      })
    );
    addNotification('Winner selected! Challenge resolved.');
  }, [myBets, addNotification]);

  const getChallenge = useCallback((id) => {
    return challenges.find(c => c.id === parseInt(id, 10) || c.id === id);
  }, [challenges]);

  const getMyBetForSolution = useCallback((challengeId, solutionId) => {
    return myBets[`${challengeId}_${solutionId}`] || 0;
  }, [myBets]);

  const getTotalBetsForChallenge = useCallback((challenge) => {
    return challenge.solutions.reduce((sum, s) => sum + s.totalBets, 0);
  }, []);

  const getSolutionPercent = useCallback((challenge, solution) => {
    const total = getTotalBetsForChallenge(challenge);
    if (total === 0) return 0;
    return Math.round((solution.totalBets / total) * 100);
  }, [getTotalBetsForChallenge]);

  const value = {
    challenges,
    coins,
    myBets,
    notifications,
    currentUser: CURRENT_USER,
    placeBet,
    postChallenge,
    postSolution,
    pickWinner,
    getChallenge,
    getMyBetForSolution,
    getTotalBetsForChallenge,
    getSolutionPercent,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside AppProvider');
  return ctx;
}
