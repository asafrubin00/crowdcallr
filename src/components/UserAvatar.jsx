import React from 'react';
import { MOCK_USERS } from '../data/mockData';

const AVATAR_COLORS = [
  'bg-violet-500', 'bg-sky-500', 'bg-pink-500', 'bg-orange-500',
  'bg-emerald-500', 'bg-cyan-500', 'bg-amber-500', 'bg-rose-500',
];

export default function UserAvatar({ userId, size = 'sm' }) {
  const user = MOCK_USERS.find(u => u.id === userId) || {
    name: 'You', institution: '', avatar: 'ME'
  };
  const colorIndex = Math.abs(userId.split('').reduce((a, c) => a + c.charCodeAt(0), 0)) % AVATAR_COLORS.length;
  const color = userId === 'user_me' ? 'bg-indigo-500' : AVATAR_COLORS[colorIndex];
  const sizeClass = size === 'sm' ? 'w-7 h-7 text-xs' : size === 'md' ? 'w-9 h-9 text-sm' : 'w-11 h-11 text-base';

  return (
    <div className={`${sizeClass} ${color} rounded-full flex items-center justify-center text-white font-bold shrink-0`}>
      {user.avatar}
    </div>
  );
}

export function getUserName(userId) {
  if (userId === 'user_me') return 'You';
  const user = MOCK_USERS.find(u => u.id === userId);
  return user ? user.name : 'Unknown';
}

export function getUserInstitution(userId) {
  if (userId === 'user_me') return 'Your Institution';
  const user = MOCK_USERS.find(u => u.id === userId);
  return user ? user.institution : '';
}
