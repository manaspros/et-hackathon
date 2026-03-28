# My ET — Financial Life Newsroom

**ET AI Hackathon 2026 | Problem Statement 8**

> ET gives you 20 articles and says "read." My ET gives you 3 briefing items with YOUR portfolio numbers and says "ask me anything."

My ET transforms Economic Times from a generic news feed into an **AI-native financial life newsroom** — where a personalized intelligence briefing replaces the article feed, you can ask questions grounded in ET's journalism + your portfolio data, and the paywall fires at the mathematically optimal moment.

**Demo:** Toggle **"ET Today"** vs **"My ET"** — same layout, different intelligence.

---

## The Problem

| Metric | Current State |
|---|---|
| Time-spent gap | Moneycontrol beats ET **5.2x** (Comscore Jan 2026) |
| Unrealised revenue | **₹825 Cr** at 5% conversion vs current 1.7% |
| Dark subscriber churn | **₹38 Cr/year** from inactive Prime members |
| News format | Static articles, same for 30M users, since 2005 |

## The Solution: 5 Intelligence Layers

### Layer 1: Account Aggregator Profile
Mock AA integration gives ET the user's **real financial data** — holdings, SIPs, FDs, stocks, loans. Powers everything downstream.

### Layer 2: News Navigator — Interactive Intelligence Briefings (CORE)
**The primary interface.** Replaces the passive article feed with a personalized BLUF (Bottom Line Up Front) briefing:

> "Good morning Rahul. 3 things affecting your portfolio today:"
> 1. "RBI cut repo rate → Your 3 debt funds gain +₹470"
> 2. "Nifty crossed 24,000 → Your index fund up 1.2% this week"
> 3. "How to open a demat account → You're 45 days from needing this"

**Three parts:**
- **Morning Briefing** — 3-5 BLUF cards with YOUR portfolio numbers (not article links)
- **Interactive Drill-Down** — tap any card to expand with full analysis + portfolio impact
- **Ask ET** — conversational Q&A chat grounded in ET articles + your AA data
  - *"Should I break my FD early?"* → answer with YOUR FD details, sourced from ET analysis

**Precedents:** Bloomberg Terminal (₹20L/yr), FT "Ask FT", TIME AI Agent, Forbes Adelaide. We bring this to India's 185M retail investors at ₹2,549/yr.

### Layer 3: Financial Trajectory Engine
Users classified into **8 financial life stages**. Predicts the NEXT stage. Feeds anticipatory content into the briefing.

| Current Stage | Prediction | Anticipatory Content |
|---|---|---|
| Stage 3: Portfolio Builder | 81% → Stage 4 in 45 days | "How to open a demat account" |
| Stage 2: SIP Beginner | 73% → Stage 3 in 90 days | "How to choose your next fund" |

### Layer 4: Story Arc Tracker
Visual narrative for any business story — directly from PS8.

- **FinBERT** sentiment river | **NetworkX + pyvis** character network | **Plotly** timeline
- Pivot detection, coverage velocity, predictive signals

### Layer 5: PeakMoment AI — Smart Paywall
When a user drills from briefing → full article, **8 behavioral signals** collected every 200ms:

```
scroll depth, velocity, reversals (re-reads), paragraph dwell,
reading speed, pause duration, data hovers, hook paragraph
```

```
Signals → LogisticRegression → P(convert) → Optimal Stopping → Fire at PEAK
```

Not after 3 articles. At the mathematical peak of engagement probability.

---

## Demo Personas

| Persona | Stage | Briefing Preview |
|---|---|---|
| **Priya** (26, Mumbai) | Stage 2: SIP Beginner | "Your HDFC Mid-Cap gained 2.3% → +₹310" |
| **Rahul** (31, Bangalore) | Stage 3: Portfolio Builder | "RBI rate cut → your debt funds gain ₹470" |
| **Sneha** (35, Delhi) | Stage 5: Active Investor | "Infosys Q3 beat → your 50 shares +₹8,200" |

Sneha is also a **dark subscriber** (18 days inactive, ₹2,549/yr at risk).

---

## Architecture

```
┌──────────────────────────────────────────────────────┐
│  React + Vite + Tailwind          localhost:5173     │
│  ├── ET Today / My ET toggle                         │
│  ├── NewsBriefing.jsx (CORE — briefing cards)        │
│  ├── AskET.jsx (conversational Q&A)                  │
│  ├── ArticleReader.jsx (drill-down + paywall)        │
│  └── useReadingBehavior hook (200ms signal loop)     │
├──────────────────────────────────────────────────────┤
│  FastAPI Backend                  localhost:8001     │
│  ├── /briefing — personalized BLUF generation        │
│  ├── /ask — RAG Q&A (articles + AA data + LLM)      │
│  └── /score — ML paywall scoring + optimal stopping  │
├──────────────────────────────────────────────────────┤
│  Streamlit Admin Dashboard        localhost:8501     │
│  ├── Story Arc Tracker (FinBERT + pyvis)             │
│  ├── Dark Subscriber Reactivation (FAISS)            │
│  └── Paywall Intelligence Engine                     │
├──────────────────────────────────────────────────────┤
│  Python Backend Layers                               │
│  ├── Layer 1: Account Aggregator (mock AA data)      │
│  ├── Layer 2: News Navigator (briefing + Ask ET)     │
│  ├── Layer 3: Trajectory (stage classifier)          │
│  ├── Layer 4: Story Arc (FinBERT + NetworkX)         │
│  ├── Layer 5: Dark Subs (FAISS + MiniLM)             │
│  └── Layer 6: Paywall (scoring + optimal stopping)   │
└──────────────────────────────────────────────────────┘
```

## Quick Start

```bash
# Clone
git clone https://github.com/manaspros/et-hackathon.git
cd et-hackathon

# Python
pip install -r requirements.txt
python backend/data/generate_data.py
python backend/ml/train_paywall_model.py

# 3 terminals
uvicorn backend.api:app --port 8001                       # T1: Backend
streamlit run frontend/app.py --server.port 8501          # T2: Admin
cd my-et-frontend && npm install && npm run dev            # T3: Demo

# Open
# Demo:    http://localhost:5173
# Admin:   http://localhost:8501
# API:     http://localhost:8001/docs
```

## Demo Flow (3 minutes)

1. **Open** localhost:5173 → "ET Today" mode → generic feed
2. **Toggle** "My ET" → News Navigator briefing appears with Rahul's portfolio numbers
3. **Tap** briefing card → inline drill-down with analysis + portfolio impact
4. **Type** in Ask ET: "Should I open a demat?" → grounded, personalized answer
5. **Click** "Read full analysis" → scroll slowly → watch P(convert) climb
6. **Re-read** a paragraph → P spikes → paywall fires: "Detected 2 re-reads — deeply engaged"
7. **Open** localhost:8501 → Story Arc (Jio Financial) + Dark Subs (Sneha reactivation)

## Key Numbers

```
5.2x     — Moneycontrol vs ET time-spent gap
₹825 Cr  — Unrealised ET Prime revenue
₹38 Cr   — Dark subscriber annual churn
₹20L/yr  — Bloomberg Terminal (we do it for ₹2,549)
+92%     — FT conversion lift with AI paywall
185M     — Demat accounts in India
2.61B    — AA-enabled accounts
```

## Full Documentation

See [`context/`](context/) for complete project documentation:
- Problem statement, 5-layer architecture, personas, tech stack
- Algorithm details, demo script, research, judge Q&A defense

---

*Built for the ET AI Hackathon 2026 by [manaspros](https://github.com/manaspros)*
