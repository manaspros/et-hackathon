# My ET — AI-Powered Financial Life Newsroom

**ET AI Hackathon 2026 | Problem Statement 8**

> ET gives you 20 articles and says "read." My ET gives you 3 briefing items with YOUR portfolio numbers and says "ask me anything."

My ET transforms Economic Times into an **AI-native financial newsroom** where:
- A personalized **intelligence briefing** replaces the article feed
- You can **ask questions** grounded in ET's journalism + your portfolio data
- Paywalls fire at the **mathematically optimal moment**

**Demo:** Toggle **"ET Today"** vs **"My ET"** — same UI, different intelligence.

---

## The Problem

| Metric | Current State |
|---|---|
| Time-spent gap | Moneycontrol beats ET **5.2x** (Comscore Jan 2026) |
| Unrealised revenue | **₹825 Cr** at 5% conversion vs current 1.7% |
| Dark subscriber churn | **₹38 Cr/year** from inactive Prime members |
| News format | Static articles, same for 30M users, since 2005 |

---

## The Solution: 5 Intelligence Layers

### 1. Account Aggregator Intelligence
- Real financial data (FDs, SIPs, stocks, loans) via mock AA
- Every briefing item scored for portfolio relevance
- "RBI cuts rate" → "Your 3 debt funds gain ₹470, FD rate drops to 6.8%"

### 2. News Navigator — Interactive Intelligence Briefings (CORE)
**The primary interface.** Replaces the passive article feed with personalized BLUF briefings:

> "Good morning Rahul. 3 things affecting your portfolio today:"
> 1. "RBI cut repo rate → Your 3 debt funds gain +₹470"
> 2. "Nifty crossed 24,000 → Your index fund up 1.2% this week"
> 3. "How to open a demat account → You're 45 days from needing this"

**Three parts:**
- **Morning Briefing** — 3-5 BLUF cards with YOUR portfolio numbers
- **Interactive Drill-Down** — tap any card for full analysis + portfolio impact
- **Ask ET** — conversational Q&A chat (RAG over ET articles + your AA data)

Precedents: Bloomberg Terminal (₹20L/yr), FT "Ask FT", TIME AI Agent. We bring this to 185M retail investors at ₹2,549/yr.

### 3. Financial Trajectory Engine
- Classifies users into **8 financial stages**
- Predicts next stage (Rahul: 81% → Stage 4 in 45 days)
- Feeds **anticipatory content** into the briefing

### 4. Story Arc Intelligence
- Tracks narratives over time (Jio Financial 2022→2026)
- FinBERT sentiment analysis + entity relationship graphs
- Pivot detection + predictive signals

### 5. Dark Subscriber Reactivation
- Identifies inactive ET Prime subscribers
- FAISS similarity → finds the **1 perfect article** for re-engagement
- Revenue at risk: ₹38 Cr/year

### 6. PeakMoment AI (Smart Paywall)
- Tracks user behavior every **200ms** (8 signals)
- Computes real-time **P(convert)** via LogisticRegression
- Fires paywall at **first local maximum** (optimal stopping theory)

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
┌──────────────────────────────────────────────────────────────┐
│                        FRONTEND LAYER                        │
│  React + Vite + Tailwind (localhost:5173)                   │
│  ├── ET Today / My ET toggle                                │
│  ├── NewsBriefing.jsx (CORE — briefing cards + drill-down)  │
│  ├── AskET.jsx (conversational Q&A)                         │
│  ├── Article Reader + Live Intent Graph                     │
│  └── Real-time Behavior Tracking (200ms loop)               │
├──────────────────────────────────────────────────────────────┤
│                     API & ML LAYER                           │
│  FastAPI (localhost:8001)                                   │
│  ├── /briefing — personalized BLUF generation               │
│  ├── /ask — RAG Q&A (articles + AA data + LLM)             │
│  └── /score — ML paywall scoring + optimal stopping         │
├──────────────────────────────────────────────────────────────┤
│                 ANALYTICS & ADMIN LAYER                      │
│  Streamlit Dashboard (localhost:8501)                       │
│  ├── Story Arc Intelligence                                 │
│  ├── Subscriber Reactivation Engine                         │
│  └── Paywall Simulation Engine                              │
├──────────────────────────────────────────────────────────────┤
│                      CORE AI LAYERS                          │
│  Python Backend                                             │
│  ├── Layer 1: Account Aggregator Engine                     │
│  ├── Layer 2: News Navigator (briefing + Ask ET)            │
│  ├── Layer 3: Trajectory Prediction Engine                  │
│  ├── Layer 4: Story Arc Intelligence                        │
│  ├── Layer 5: Reactivation Engine (FAISS)                   │
│  └── Layer 6: PeakMoment Paywall AI                         │
└──────────────────────────────────────────────────────────────┘
```

---

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

# Open: localhost:5173 (demo) | localhost:8501 (admin) | localhost:8001/docs (API)
```

---

## Demo Flow (3 minutes)

1. Open `localhost:5173` → "ET Today" mode → generic feed
2. Toggle "My ET" → **News Navigator briefing** appears with portfolio numbers
3. Tap briefing card → inline **drill-down** with analysis + impact
4. Type in **Ask ET**: "Should I open a demat?" → grounded answer
5. Click "Read full analysis" → scroll slowly → **P(convert)** climbs live
6. Re-read a paragraph → P spikes → **paywall fires** with reason
7. Open `localhost:8501` → Story Arc + Dark Subscriber dashboards

---

## Key Numbers

| Metric | Value |
|---|---|
| Time-spent gap | **5.2x** (Moneycontrol vs ET) |
| Revenue opportunity | **₹825 Cr** |
| Dark subscriber churn | **₹38 Cr/year** |
| Bloomberg comparison | **₹20L/yr → ₹2,549/yr** |
| FT conversion benchmark | **+92%** with AI paywall |
| Demat accounts (India) | **185M** |
| AA-enabled accounts | **2.61B** |

---

## Tech Stack

| Layer | Tech |
|---|---|
| Frontend | React 19, Vite 8, Tailwind CSS 4 |
| Backend API | FastAPI |
| ML/Scoring | scikit-learn (LogisticRegression) |
| NLP | ProsusAI/FinBERT |
| Embeddings | sentence-transformers (all-MiniLM-L6-v2) |
| Vector Search | FAISS (CPU) |
| LLM (fast) | Groq (llama-3.3-70b) |
| Visualization | Plotly, NetworkX, pyvis |
| Admin | Streamlit |

---

## Full Documentation

See [`context/`](context/) for complete project docs — problem statement, architecture, personas, algorithm, demo script, research, judge Q&A defense.

---

## Team

- Manas
- Vijayshree
- Vaibhav
- Pooja Bisht

---

*Built for the ET AI Hackathon 2026*
