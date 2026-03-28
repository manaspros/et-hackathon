# Tech Stack & Dependencies

## Architecture Overview

```
┌────────────────────────────────────────────────────────┐
│  React + Vite + Tailwind              localhost:5173   │
│  ├── ET Today / My ET toggle                           │
│  ├── Persona switcher (Priya / Rahul / Sneha)          │
│  ├── NewsBriefing.jsx (Layer 2 — CORE)                 │
│  │   ├── Briefing cards (BLUF format)                  │
│  │   ├── Inline drill-down (expandable)                │
│  │   └── AskET.jsx (conversational Q&A)                │
│  ├── ArticleReader + scroll tracking                   │
│  └── useReadingBehavior hook (200ms signal loop)       │
├────────────────────────────────────────────────────────┤
│  FastAPI Backend                      localhost:8001   │
│  ├── /briefing — generate personalized briefing        │
│  ├── /ask — conversational Q&A (RAG over articles)     │
│  ├── /score — ML paywall scoring + optimal stopping    │
│  └── LogisticRegression (10K synthetic sessions)       │
├────────────────────────────────────────────────────────┤
│  Streamlit Admin Dashboard            localhost:8501   │
│  ├── Story Arc Tracker (FinBERT + pyvis)               │
│  ├── Dark Subscriber Reactivation (FAISS)              │
│  └── Paywall Intelligence Engine                       │
├────────────────────────────────────────────────────────┤
│  Python Backend Layers                                 │
│  ├── Layer 1: Account Aggregator (mock AA data)        │
│  ├── Layer 2: News Navigator (briefing gen + Ask ET)   │
│  ├── Layer 3: Trajectory Engine (stage classifier)     │
│  ├── Layer 4: Story Arc (FinBERT + NetworkX)           │
│  ├── Layer 5: Dark Subs (FAISS + MiniLM)               │
│  └── Layer 6: Paywall (scoring + optimal stopping)     │
└────────────────────────────────────────────────────────┘
```

## Frontend Stack

| Component | Technology | Why |
|---|---|---|
| Framework | React 19 | Industry standard, component model |
| Build tool | Vite 8 | Instant HMR, fast builds |
| Styling | Tailwind CSS 4 | Rapid prototyping, matches ET design |
| Briefing cards | React components | BLUF format, expandable drill-down |
| Ask ET chat | React + fetch to /ask | Streaming LLM response |
| Scroll detection | Intersection Observer API (native) | Zero deps, paragraph-level tracking |
| Signal collection | Custom hook (useReadingBehavior) | 200ms interval, 8 behavioral signals |
| Charts | Canvas API (native) | Lightweight, no charting lib needed |

**No extra npm packages needed** — everything uses native browser APIs.

## Backend Stack (Python)

| Component | Library | Why |
|---|---|---|
| API framework | FastAPI | Async, fast, WebSocket + REST |
| LLM (fast, demo) | Groq (llama-3.3-70b) | Free tier, 750 tok/s — instant "Ask ET" answers |
| LLM (quality) | Claude / Anthropic | Quality briefing generation |
| ML model | scikit-learn (LogisticRegression) | Simple, interpretable, trains in seconds |
| Financial NLP | ProsusAI/FinBERT (HuggingFace) | Best OSS model for financial sentiment |
| Embeddings | sentence-transformers/all-MiniLM-L6-v2 | Fast, accurate, runs locally |
| Vector search | FAISS (CPU) | Meta's ANN search, cosine similarity |
| Graph viz | NetworkX + pyvis | Entity relationship graphs |
| Charts | Plotly | Interactive charts in Streamlit |
| Admin UI | Streamlit | Zero CSS, instant dashboards |
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

**Why Groq for Ask ET?** Demo speed. Groq serves llama-3.3-70b at 750 tokens/sec. When a judge types a question in Ask ET, they see the answer stream instantly. Claude is used for quality tasks (briefing generation, paywall copy).

**Why not a full RAG pipeline (LangChain + ChromaDB)?** For 20 articles, we don't need a vector DB. We embed articles with MiniLM, do cosine similarity in memory, and feed top-3 results as context to the LLM. Simple, fast, fewer failure points.

**Why scikit-learn over deep learning?** Interpretability. We can show judges the exact weight of each signal. A neural net is a black box. For a hackathon demo, "scroll reversals have weight +1.8" is more convincing than "the model says 74%."

**Why native Intersection Observer?** One fewer dependency. The native API is 5 lines of code. Fewer deps = fewer things that break during demo.

## Ports

| Service | Port | Command |
|---|---|---|
| React frontend | 5173 | `cd my-et-frontend && npm run dev` |
| FastAPI backend | 8001 | `uvicorn backend.api:app --port 8001` |
| Streamlit admin | 8501 | `streamlit run frontend/app.py --server.port 8501` |
