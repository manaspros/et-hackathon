# My ET — Financial Life Newsroom

**ET AI Hackathon 2026 | Problem Statement 8**

> The same news experience since 2005. In 2026, we fix it.

My ET transforms Economic Times from a generic news feed into an **AI-native financial life newsroom** — where every article knows your portfolio, your financial stage, and fires the paywall at the mathematically optimal moment.

**Demo:** Toggle **"ET Today"** vs **"✨ My ET"** — same layout, different intelligence.

---

## The Problem

| Metric | Current State |
|---|---|
| Time-spent gap | Moneycontrol beats ET **5.2×** (Comscore Jan 2026) |
| Unrealised revenue | **₹825 Cr** at 5% conversion vs current 1.7% |
| Dark subscriber churn | **₹38 Cr/year** from inactive Prime members |
| Paywall intelligence | Article count trigger — same for everyone |

## The Solution: 5 Intelligence Layers

### Layer 1: Account Aggregator Profile
Mock AA integration gives ET the user's **real financial data** — holdings, SIPs, FDs, stocks, loans. Every article is contextualised against your actual portfolio.

- "RBI cuts rate by 25 bps" → *"Affects your HDFC FD + 3 debt funds"*
- Post-article bridge: *"Your FD at HDFC is earning 7.0%. New rates will drop to 6.8%. Consider early renewal."*

### Layer 2: Financial Trajectory Engine
Users are classified into **8 financial life stages**. The feed serves content for where you're **going**, not where you are.

| Stage | Label | Example Content |
|---|---|---|
| 2 | SIP Beginner | "How to choose your first mutual fund" |
| 3 | Portfolio Builder | "When should you review your MF portfolio?" |
| 4 | Equity Explorer | "How to open a demat account" |
| 5 | Active Investor | "How to analyse quarterly results like a fund manager" |

**Anticipatory content:** If you're Stage 3 with 81% probability of reaching Stage 4 in 45 days, we start showing equity content now — before you even search for it.

### Layer 3: Story Arc Tracker
Visual narrative for any business story. Tracks **Jio Financial** (2022→2026) and **HDFC Bank** across ET's complete coverage.

- **FinBERT** sentiment analysis on every article
- **Sentiment river** chart (Plotly) with pivot moment detection
- **Character network** graph (pyvis + NetworkX) showing entity relationships
- **Velocity indicator** — is coverage accelerating?
- **Predictive signals** — what ET is watching next

### Layer 4: Dark Subscriber Reactivation
Identifies dormant ET Prime subscribers and finds the **one article** most likely to bring them back.

- **FAISS** cosine similarity between user reading history and article embeddings
- **sentence-transformers/all-MiniLM-L6-v2** for fast encoding
- **4-step win-back sequence** with loss aversion framing
- Revenue at risk calculation per subscriber

### Layer 5: PeakMoment AI — Smart Paywall
Replaces article-count paywalls with **ML-scored optimal stopping**.

| System | Method | Problem |
|---|---|---|
| ET Today | `articles >= 3` | Ignores all behaviour |
| NYT | Dynamic article limit | Still count-based |
| FT | 50 data points, threshold | Threshold, not peak |
| **PeakMoment AI** | **Optimal stopping on P(convert)** | **Fires at the mathematical peak** |

**8 real-time signals** collected every 200ms:
scroll depth, velocity, reversals (re-reads), paragraph dwell time, reading speed (WPM), pause duration, data hover count, hook paragraph proximity

**How it works:**
1. Signals → StandardScaler → LogisticRegression → P(convert)
2. Optimal stopping detector tracks P over sliding window
3. Fires at the **first local maximum** — not before (user not invested), not after (already got value)

**FT benchmark:** +92% conversion lift with AI paywall. Piano Analytics: 65-75% scroll depth is the optimal zone.

---

## Demo Personas

| Persona | Stage | Story |
|---|---|---|
| **Priya** (26, Mumbai) | Stage 2: SIP Beginner | 5-month SIP, reads MF basics, 73% → Stage 3 |
| **Rahul** (31, Bangalore) | Stage 3: Portfolio Builder | 18-month SIP, searching demat, 81% → Stage 4 |
| **Sneha** (35, Delhi) | Stage 5: Active Investor | ₹21.45L portfolio, FD maturing, **dark subscriber** (18 days inactive) |

---

## Architecture

```
┌──────────────────────────────────────────────────────┐
│  React + Vite + Tailwind          localhost:5173     │
│  ├── ET Today / My ET toggle                         │
│  ├── Persona switcher (Priya / Rahul / Sneha)        │
│  ├── ArticleReader + IntentGraph (two-column)        │
│  └── useReadingBehavior hook (200ms signal loop)     │
├──────────────────────────────────────────────────────┤
│  FastAPI ML Scoring API           localhost:8001     │
│  ├── LogisticRegression (10K synthetic sessions)     │
│  └── OptimalStoppingDetector                         │
├──────────────────────────────────────────────────────┤
│  Streamlit Admin Dashboard        localhost:8501     │
│  ├── Story Arc Tracker (FinBERT + pyvis)             │
│  ├── Dark Subscriber Reactivation (FAISS)            │
│  └── Paywall Intelligence Engine                     │
├──────────────────────────────────────────────────────┤
│  Python Backend                                      │
│  ├── Layer 1: Account Aggregator (mock AA data)      │
│  ├── Layer 2: Trajectory Engine (stage classifier)   │
│  ├── Layer 3: Story Arc (FinBERT + NetworkX)         │
│  ├── Layer 4: Dark Subs (FAISS + MiniLM)             │
│  └── Layer 5: Paywall (scoring + optimal stopping)   │
└──────────────────────────────────────────────────────┘
```

## Project Structure

```
my-et/
├── backend/
│   ├── data/
│   │   ├── generate_data.py        # Creates 3 users + 20 articles
│   │   ├── users.json              # Generated user profiles
│   │   └── articles.json           # Generated article corpus
│   ├── layers/
│   │   ├── layer1_aa.py            # Account Aggregator + portfolio impact
│   │   ├── layer3_trajectory.py    # Stage classifier + anticipatory feed
│   │   ├── layer5_story_arc.py     # FinBERT sentiment + pyvis network
│   │   ├── layer6_dark_sub.py      # FAISS similarity + win-back sequence
│   │   └── layer7_paywall.py       # Intent detection (Streamlit version)
│   ├── ml/
│   │   ├── train_paywall_model.py  # Train LogisticRegression (run once)
│   │   ├── scoring_api.py          # FastAPI endpoint with optimal stopping
│   │   └── paywall_model.pkl       # Trained model (auto-generated)
│   └── utils/
│       ├── models.py               # Cached FinBERT + MiniLM loaders
│       └── llm.py                  # Groq (fast) + Claude (quality) wrapper
├── frontend/                       # Streamlit admin pages
│   ├── app.py                      # Main dashboard
│   └── pages/
│       ├── 1_📊_Dashboard.py
│       ├── 2_🔮_Stage_Feed.py
│       ├── 3_📈_Story_Arc.py
│       ├── 4_💤_Dark_Subs.py
│       └── 5_💡_Paywall.py
├── my-et-frontend/                 # React demo frontend
│   ├── src/
│   │   ├── App.jsx                 # Main app with feed + sidebar
│   │   ├── components/
│   │   │   ├── Header.jsx          # ET header + mode toggle
│   │   │   ├── ArticleCard.jsx     # Feed card with portfolio tags
│   │   │   ├── ArticleReader.jsx   # Full article + scroll paywall
│   │   │   ├── IntentGraph.jsx     # Live P(convert) canvas chart
│   │   │   ├── AAProfileSidebar.jsx# Portfolio + journey + events
│   │   │   └── PaywallModal.jsx    # Generic vs personalised modal
│   │   ├── hooks/
│   │   │   └── useReadingBehavior.js # 200ms signal collector
│   │   └── data/
│   │       ├── users.js            # 3 persona profiles
│   │       ├── articles.js         # Feed articles + anticipatory
│   │       └── articleContent.js   # Full article text (free + locked)
│   └── vite.config.js
├── .env                            # API keys (GROQ_API_KEY)
├── .gitignore
└── requirements.txt
```

---

## Quick Start

```bash
# 1. Clone
git clone https://github.com/manaspros/et-hackathon.git
cd et-hackathon

# 2. Install Python dependencies
pip install -r requirements.txt

# 3. Generate mock data
python backend/data/generate_data.py

# 4. Train the ML model (once)
python backend/ml/train_paywall_model.py

# 5. Start ML scoring API
python -m uvicorn backend.ml.scoring_api:app --port 8001 &

# 6. Start Streamlit admin dashboard
streamlit run frontend/app.py --server.port 8501 &

# 7. Start React frontend
cd my-et-frontend
npm install
npm run dev
# → http://localhost:5173
```

## Demo Flow (for judges)

1. **Open** http://localhost:5173
2. **Toggle** "ET Today" → generic news feed, no personalisation
3. **Toggle** "✨ My ET" → sidebar shows AA profile, feed shows anticipatory articles
4. **Switch personas** — Priya sees SIP content, Rahul sees equity prep, Sneha sees FD maturity alerts
5. **Click an article** (RBI or HDFC Bank) — scroll slowly
6. **Watch the IntentGraph** on the right — P(convert) climbs in real-time
7. **Scroll back up** (re-read) — P(convert) spikes, paywall fires with the reason
8. **Compare** the personalised paywall vs the generic "Subscribe to continue"
9. **Open** http://localhost:8501 for technical deep-dives:
   - Story Arc: Jio Financial sentiment river + character network
   - Dark Subs: Sneha shows as inactive, FAISS finds her best re-engagement article
   - Paywall Intelligence: simulated reading session

## Key Numbers

- **185M** demat accounts in India
- **2.61B** AA-enabled accounts
- **5.2×** Moneycontrol vs ET time-spent gap
- **₹825 Cr** unrealised ET Prime revenue
- **₹38 Cr/yr** dark subscriber churn
- **+92%** FT conversion lift with AI paywall
- **65-75%** optimal paywall zone (Piano Analytics)

---

## Tech Stack

| Component | Technology |
|---|---|
| Frontend | React 19, Vite 8, Tailwind CSS 4 |
| Admin Dashboard | Streamlit |
| ML Scoring | FastAPI, scikit-learn, LogisticRegression |
| Embeddings | sentence-transformers (all-MiniLM-L6-v2) |
| Sentiment | ProsusAI/FinBERT |
| Similarity Search | FAISS (CPU) |
| Graph Viz | NetworkX, pyvis, Plotly |
| LLM | Groq (llama-3.3-70b, free tier) |
| Signal Collection | Intersection Observer API, Canvas API |

---

*Built for the ET AI Hackathon 2026 by [manaspros](https://github.com/manaspros)*
