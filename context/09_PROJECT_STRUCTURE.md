# Project Structure — Complete File Map

## Directory Tree

```
my-et/
├── context/                          ← YOU ARE HERE — all project context
│   ├── 01_PROBLEM_STATEMENT.md       ← PS8 brief + market gap
│   ├── 02_FIVE_LAYERS.md             ← The 5 intelligence layers explained
│   ├── 03_PERSONAS.md                ← Priya, Rahul, Sneha profiles
│   ├── 04_TECH_STACK.md              ← All libraries + why we chose them
│   ├── 05_ALGORITHM.md               ← PeakMoment AI paywall algorithm
│   ├── 06_DEMO_SCRIPT.md             ← 3-minute demo script for judges
│   ├── 07_RESEARCH_AND_BENCHMARKS.md ← Industry data + competitive analysis
│   ├── 08_CRITICS_DEFENSE.md         ← Anticipated judge questions + answers
│   └── 09_PROJECT_STRUCTURE.md       ← This file
│
├── backend/
│   ├── __init__.py
│   ├── data/
│   │   ├── __init__.py
│   │   ├── generate_data.py          ← Run first: creates 3 users + 20 articles
│   │   ├── users.json                ← Auto-generated user profiles
│   │   └── articles.json             ← Auto-generated article corpus
│   ├── layers/
│   │   ├── __init__.py
│   │   ├── layer1_aa.py              ← Account Aggregator mock + portfolio impact
│   │   ├── layer3_trajectory.py      ← Stage classifier + anticipatory feed
│   │   ├── layer5_story_arc.py       ← FinBERT sentiment + NetworkX + pyvis
│   │   ├── layer6_dark_sub.py        ← FAISS similarity + win-back sequence
│   │   └── layer7_paywall.py         ← Intent detection (Streamlit version)
│   ├── ml/
│   │   ├── __init__.py
│   │   ├── train_paywall_model.py    ← Train LogisticRegression (run once)
│   │   ├── scoring_api.py            ← FastAPI endpoint + optimal stopping
│   │   └── paywall_model.pkl         ← Trained model (auto-generated)
│   └── utils/
│       ├── __init__.py
│       ├── models.py                 ← Cached FinBERT + MiniLM model loaders
│       └── llm.py                    ← Groq (fast) + Claude (quality) wrapper
│
├── frontend/                         ← Streamlit admin dashboard
│   ├── app.py                        ← Main entry point
│   └── pages/
│       ├── 1_📊_Dashboard.py         ← Overview metrics
│       ├── 2_🔮_Stage_Feed.py        ← Stage-aware feed demo
│       ├── 3_📈_Story_Arc.py         ← Story arc visualization
│       ├── 4_💤_Dark_Subs.py         ← Dark subscriber dashboard
│       └── 5_💡_Paywall.py           ← Paywall intelligence demo
│
├── my-et-frontend/                   ← React demo (main presentation UI)
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── src/
│   │   ├── main.jsx                  ← React entry point
│   │   ├── index.css                 ← Tailwind + ET theme
│   │   ├── App.jsx                   ← Feed layout + mode toggle + persona switcher
│   │   ├── components/
│   │   │   ├── Header.jsx            ← ET header + "ET Today" / "✨ My ET" toggle
│   │   │   ├── ArticleCard.jsx       ← Feed card + stage badge + portfolio tag
│   │   │   ├── ArticleReader.jsx     ← Full article reader + scroll paywall
│   │   │   ├── AAProfileSidebar.jsx  ← Financial profile + journey + life events
│   │   │   ├── IntentGraph.jsx       ← Live P(convert) canvas chart
│   │   │   └── PaywallModal.jsx      ← Generic vs personalized comparison
│   │   ├── hooks/
│   │   │   └── useReadingBehavior.js ← 200ms signal collector + ML scoring
│   │   ├── data/
│   │   │   ├── users.js              ← 3 persona profiles with AA data
│   │   │   ├── articles.js           ← Feed articles + anticipatory articles
│   │   │   └── articleContent.js     ← Full article text (free + locked sections)
│   │   └── pages/                    ← (reserved for future route-based pages)
│   └── dist/                         ← Built output (auto-generated)
│
├── .env                              ← API keys (GROQ_API_KEY)
├── .gitignore
├── requirements.txt                  ← Python dependencies
└── README.md                         ← Project overview + quick start
```

## How Files Connect

```
User opens localhost:5173
  → App.jsx loads
  → Header.jsx renders ET Today / My ET toggle
  → users.js provides persona data
  → articles.js provides feed articles
  → AAProfileSidebar.jsx shows if mode = "myet"
  → ArticleCard.jsx shows stage badges if mode = "myet"

User clicks an article
  → ArticleReader.jsx opens
  → articleContent.js provides full text (free + locked)
  → useReadingBehavior.js starts 200ms signal loop
  → Signals POST to localhost:8001/score (scoring_api.py)
  → scoring_api.py → LogisticRegression → P(convert)
  → OptimalStoppingDetector decides: fire or monitor
  → Response sent back to useReadingBehavior.js
  → IntentGraph.jsx renders live P(convert) chart
  → When fire=true → paywall appears in ArticleReader.jsx

Admin opens localhost:8501
  → frontend/app.py loads Streamlit
  → pages/ load individual dashboards
  → Each page imports from backend/layers/
  → layer5_story_arc.py uses FinBERT + NetworkX
  → layer6_dark_sub.py uses FAISS + MiniLM
  → layer7_paywall.py runs simulated intent sessions
```

## Quick Start Commands

```bash
# Clone
git clone https://github.com/manaspros/et-hackathon.git
cd et-hackathon

# Python setup
pip install -r requirements.txt
python backend/data/generate_data.py     # mock data
python backend/ml/train_paywall_model.py # train model

# Start services (3 terminals)
uvicorn backend.ml.scoring_api:app --port 8001           # Terminal 1
streamlit run frontend/app.py --server.port 8501          # Terminal 2
cd my-et-frontend && npm install && npm run dev            # Terminal 3

# Open
# React demo:    http://localhost:5173
# Streamlit:     http://localhost:8501
# ML API:        http://localhost:8001/docs
```
