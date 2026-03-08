# CrowdCallr — Research Challenge Market

A prediction market for academic research. Researchers post problems, the crowd proposes solutions and bets virtual coins on the best one. Market prices reveal collective confidence.

## The Idea

Inspired by my PhD thesis (2018) *Knowledge Management Determinants of Breakthrough Research Productivity*, this platform combines:

- **InnoCentive-style challenge markets** — researchers post real problems, the crowd solves them
- **Prediction market mechanics** — users bet virtual coins on which solution will win
- **Collective intelligence aggregation** — market percentages reveal crowd confidence at a glance
- **Parimutuel payout** — bettors who picked the winner share the full pot proportionally

## How It Works

1. A researcher posts a **challenge** with a virtual coin prize pool
2. Other researchers propose **solutions**
3. Users **bet coins** on the solution they think is best
4. Market prices update in real time — a 60% market share means 60% of coins back that solution
5. The challenge poster **picks a winner**
6. The winner gets the prize. Bettors who backed the winner share the pot.

## Running Locally

```bash
npm install
npm run dev
```

Then open [http://localhost:5173](http://localhost:5173)

## Tech Stack

- React 18 + Vite
- Tailwind CSS
- React Router v6
- All state in-memory (no backend — refreshing resets to demo data)

## Pages

| Route | Description |
|-------|-------------|
| `/` | Challenge feed with filters |
| `/challenge/:id` | Challenge detail, solutions, betting |
| `/post` | Post a new research challenge |
| `/leaderboard` | Top solvers, questioners, market activity |

## Prototype Status

This is a **frontend-only prototype** with pre-loaded demo data. All interactions work but state resets on page refresh. A production version would need:

- User authentication
- Persistent database (Postgres / Supabase)
- Real-money or token mechanics (with appropriate licensing)
- Email notifications
- Moderation tools
