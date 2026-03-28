# Tech Stack & Dependencies

## Architecture Overview

```
┌────────────────────────────────────────────────────────┐
│  React + Vite + Tailwind              localhost:5173   │
│  ├── ET Today / My ET toggle                           │
│  ├── Persona switcher (Priya / Rahul / Sneha)          │
│  ├── ArticleReader + scroll tracking                   │
│  └── useReadingBehavior hook (200ms signal loop)       │
├────────────────────────────────────────────────────────┤
│  FastAPI ML Scoring API               localhost:8001   │
│  ├── LogisticRegression (10K synthetic sessions)       │
│  └── OptimalStoppingDetector (sliding window peak)     │
├────────────────────────────────────────────────────────┤
│  Streamlit Admin Dashboard            localhost:8501   │
│  ├── Story Arc Tracker (FinBERT + pyvis)               │
│  ├── Dark Subscriber Reactivation (FAISS)              │
│  └── Paywall Intelligence Engine                       │
├────────────────────────────────────────────────────────┤
│  Python Backend Layers                                 │
│  ├── Layer 1: Account Aggregator (mock AA data)        │
│  ├── Layer 2: Trajectory Engine (stage classifier)     │
│  ├── Layer 3: Story Arc (FinBERT + NetworkX)           │
│  ├── Layer 4: Dark Subs (FAISS + MiniLM)               │
│  └── Layer 5: Paywall (scoring + optimal stopping)     │
└────────────────────────────────────────────────────────┘
```

## Frontend Stack

| Component | Technology | Why |
|---|---|---|
| Framework | React 19 | Industry standard, component model |
| Build tool | Vite 8 | Instant HMR, fast builds |
| Styling | Tailwind CSS 4 | Rapid prototyping, matches ET design |
| Scroll detection | Intersection Observer API (native) | Zero dependencies, paragraph-level tracking |
| Signal collection | Custom hook (useReadingBehavior) | 200ms interval, 8 behavioral signals |
| Charts | Canvas API (native) | Lightweight, no charting lib needed |

**No extra npm packages needed** — everything uses native browser APIs.

## Backend Stack (Python)

| Component | Library | Why |
|---|---|---|
| API framework | FastAPI | Async, fast, WebSocket support |
| ML model | scikit-learn (LogisticRegression) | Simple, interpretable, trains in seconds |
| Financial NLP | ProsusAI/FinBERT (HuggingFace) | Best OSS model for financial sentiment |
| Embeddings | sentence-transformers/all-MiniLM-L6-v2 | Fast, accurate, runs locally |
| Similarity search | FAISS (CPU) | Meta's ANN search, cosine similarity |
| Graph visualization | NetworkX + pyvis | Entity relationship graphs |
| Charts | Plotly | Interactive charts in Streamlit |
| Admin UI | Streamlit | Zero CSS, instant dashboards |
| LLM | Groq (llama-3.3-70b) | Free tier, 750 tokens/sec for demo speed |
| Data generation | Faker (en_IN locale) | Realistic Indian financial data |

## Key Dependencies

```bash
# Python (requirements.txt)
streamlit plotly pyvis networkx pandas numpy
sentence-transformers faiss-cpu
scikit-learn
transformers torch
fastapi uvicorn websockets
groq anthropic
faker python-dotenv
```

```bash
# Node (package.json)
react react-dom
tailwindcss
vite @vitejs/plugin-react
```

## Why These Specific Choices

**Why scikit-learn over deep learning?** LogisticRegression is interpretable — we can show judges the exact weight of each signal. A neural net is a black box. For a hackathon demo, "scroll reversals have weight +1.8" is more convincing than "the model says 74%."

**Why FAISS over ChromaDB?** FAISS is faster for pure cosine similarity. We don't need ChromaDB's persistence or metadata filtering — we have 20 articles, not 20 million.

**Why Groq over direct Claude API?** Demo speed. Groq serves llama-3.3-70b at 750 tokens/sec. When a judge watches the Story Arc generate a summary, they see instant responses. Claude is used for quality tasks (paywall copy generation).

**Why native Intersection Observer over react-intersection-observer?** One fewer dependency. The native API is 5 lines of code. For a hackathon, fewer deps = fewer things that break.

**Why Canvas API over Recharts?** The IntentGraph is a single small chart. Pulling in a charting library for one component is overkill. Canvas gives us pixel-level control for the probability curve animation.

## Ports

| Service | Port | Command |
|---|---|---|
| React frontend | 5173 | `cd my-et-frontend && npm run dev` |
| ML scoring API | 8001 | `uvicorn backend.ml.scoring_api:app --port 8001` |
| Streamlit admin | 8501 | `streamlit run frontend/app.py --server.port 8501` |
