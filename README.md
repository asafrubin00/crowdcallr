# CrowdCallr

**A prediction market for academic research. What if the crowd could peer review?**

🔬 [View live →](https://crowdcallr.vercel.app)

Academic research moves slowly. Peer review is opaque, bottlenecked, and often disconnected from the collective intelligence that exists across research communities. CrowdCallr is an experiment in fixing that; a platform where researchers post real problems, the crowd proposes solutions, and market mechanics reveal which answers the community actually believes in.

---

## The Idea

Inspired by my PhD thesis - *Knowledge Management Determinants of Breakthrough Research Productivity*( (Wits University, 2018) -CrowdCallr combines two proven mechanisms:

- **InnoCentive-style challenge markets**: researchers post problems, the crowd solves them
- **Prediction market mechanics**: users stake virtual coins on the solution they think will win

The result is a system where market prices do the work of peer review: a solution trading at 70% market share has 70% of the crowd's conviction behind it. That's a signal worth paying attention to.

---

## How It Works

1. A researcher posts a **challenge** with a virtual coin prize pool
2. Other researchers submit **solutions**
3. Users **bet coins** on the solution they back
4. Market prices update in real time — reflecting collective confidence
5. The challenge poster **selects a winner**
6. The winner claims the prize; backers who picked correctly share the pot

---

## Tech Stack

![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)

React 18 + Vite, Tailwind CSS, React Router v6. Frontend-only prototype — all state is in-memory, pre-loaded with demo data. Deployed on Vercel.

---

## Pages

| Route | Description |
|---|---|
| `/` | Challenge feed with filters |
| `/challenge/:id` | Challenge detail, solutions, and betting |
| `/post` | Post a new research challenge |
| `/leaderboard` | Top solvers, questioners, and market activity |

---

## Prototype Status

This is a **frontend-only prototype**. All interactions are functional but state resets on page refresh. A production version would require user authentication, a persistent database, and moderation tooling. The point here is the mechanic, and whether the market price of an idea is a better signal than a committee's opinion of it.
