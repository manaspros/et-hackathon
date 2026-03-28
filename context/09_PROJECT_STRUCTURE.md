# Project Structure — Complete File Map

## Directory Tree

```
my-et/
├── context/                          ← YOU ARE HERE — all project context
│   ├── 01_PROBLEM_STATEMENT.md       ← PS8 brief + market gap
│   ├── 02_FIVE_LAYERS.md             ← The 5 layers (News Navigator = core)
│   ├── 03_PERSONAS.md                ← Priya, Rahul, Sneha profiles + briefings
│   ├── 04_TECH_STACK.md              ← All libraries + architecture
│   ├── 05_ALGORITHM.md               ← PeakMoment AI paywall algorithm
│   ├── 06_DEMO_SCRIPT.md             ← 3-minute demo script for judges
│   ├── 07_RESEARCH_AND_BENCHMARKS.md ← Industry data + competitive analysis
│   ├── 08_CRITICS_DEFENSE.md         ← 11 judge questions + answers
│   └── 09_PROJECT_STRUCTURE.md       ← This file
│
├── backend/
│   ├── __init__.py
│   ├── api.py                        ← FastAPI app (briefing + ask + score)
│   ├── data/
│   │   ├── __init__.py
│   │   ├── generate_data.py          ← Creates 3 users + 20 articles
│   │   ├── users.json                ← Auto-generated user profiles
│   │   └── articles.json             ← Auto-generated article corpus
│   ├── layers/
│   │   ├── __init__.py
│   │   ├── layer1_aa.py              ← Account Aggregator mock + portfolio impact
│   │   ├── layer2_news_navigator.py  ← CORE: briefing gen + Ask ET (RAG + LLM)
│   │   ├── layer3_trajectory.py      ← Stage classifier + anticipatory feed
│   │   ├── layer5_story_arc.py       ← FinBERT sentiment + NetworkX + pyvis
│   │   ├── layer6_dark_sub.py        ← FAISS similarity + win-back sequence
│   │   └── layer7_paywall.py         ← Intent detection (Streamlit version)
│   ├── ml/
│   │   ├── __init__.py
│   │   ├── train_paywall_model.py    ← Train LogisticRegression (run once)
│   │   ├── scoring_api.py            ← Scoring endpoint + optimal stopping
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
│   │   ├── main.jsx
│   │   ├── index.css                 ← Tailwind + ET theme
│   │   ├── App.jsx                   ← Layout + mode toggle + persona switcher
│   │   ├── components/
│   │   │   ├── Header.jsx            ← ET header + toggle
│   │   │   ├── NewsBriefing.jsx      ← NEWS NAVIGATOR (core component)
│   │   │   │                         ← Renders briefing cards, drill-down
│   │   │   ├── AskET.jsx             ← Conversational Q&A chat interface
│   │   │   ├── ArticleCard.jsx       ← Feed card (ET Today mode)
│   │   │   ├── ArticleReader.jsx     ← Full article + scroll paywall
│   │   │   ├── AAProfileSidebar.jsx  ← Financial profile + life events
│   │   │   ├── IntentGraph.jsx       ← Live P(convert) canvas chart
│   │   │   └── PaywallModal.jsx      ← Generic vs personalized comparison
│   │   ├── hooks/
│   │   │   └── useReadingBehavior.js ← 200ms signal collector + ML scoring
│   │   └── data/
│   │       ├── users.js              ← 3 persona profiles with AA data
│   │       ├── articles.js           ← Feed + anticipatory articles
│   │       └── articleContent.js     ← Full article text
│   └── dist/                         ← Built output (auto-generated)
│
├── .env                              ← API keys (GROQ_API_KEY)
├── .gitignore
├── requirements.txt
└── README.md
```

## How Files Connect

```
User opens localhost:5173
  → App.jsx loads → mode = "et_today" or "myet"

IF mode = "et_today":
  → ArticleCard.jsx renders generic feed
  → Click article → ArticleReader.jsx → paywall after 3 articles

IF mode = "myet":
  → NewsBriefing.jsx loads (THE CORE COMPONENT)
  → Calls POST /briefing with user_id → backend generates briefing
  → layer2_news_navigator.py:
      ├── Loads user AA profile (Layer 1)
      ├── Gets financial stage + trajectory (Layer 3)
      ├── Scores articles for portfolio relevance
      ├── Generates 3-5 BLUF briefing cards via LLM
      └── Returns structured briefing JSON
  → NewsBriefing.jsx renders cards
  → User taps card → inline drill-down expands
  → User types question → AskET.jsx
      → POST /ask with question + user_id + article context
      → layer2_news_navigator.py:
          ├── Embeds question with MiniLM
          ├── Finds top-3 relevant articles (cosine similarity)
          ├── Builds prompt with articles + AA data
          └── Streams answer from Groq
  → User clicks "Read full analysis" → ArticleReader.jsx
      → useReadingBehavior.js starts 200ms signal loop
      → POST /score → scoring_api.py → P(convert)
      → IntentGraph.jsx shows live chart
      → When fire=true → paywall fires

Admin opens localhost:8501
  → Streamlit pages call backend/layers/ directly
```

## Quick Start

```bash
git clone https://github.com/manaspros/et-hackathon.git
cd et-hackathon

# Python
pip install -r requirements.txt
python backend/data/generate_data.py
python backend/ml/train_paywall_model.py

# 3 terminals
uvicorn backend.api:app --port 8001                       # T1
streamlit run frontend/app.py --server.port 8501          # T2
cd my-et-frontend && npm install && npm run dev            # T3

# Open: localhost:5173 (demo) | localhost:8501 (admin) | localhost:8001/docs (API)
```
