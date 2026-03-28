# 🚀 My ET — AI-Powered Financial Life Newsroom

**ET AI Hackathon 2026 | Problem Statement 8**

> Reinventing financial journalism for 2026 — from static feeds to intelligent, user-aware experiences.

---

## 🌟 Overview

**My ET** transforms Economic Times into an **AI-native financial newsroom** where:

- Every article understands your **portfolio**
- Content adapts to your **financial journey**
- Paywalls trigger at the **optimal conversion moment**

👉 Same UI. Completely different intelligence.

---

## ⚡ Problem Statement

| Metric | Current State |
|------|-------------|
| Time spent gap | Moneycontrol beats ET **5.2×** |
| Revenue loss | **₹825 Cr** unrealised |
| Subscriber churn | **₹38 Cr/year** |
| Paywall logic | Static article-count model |

---

## 💡 Solution: 5 Intelligence Layers

### 1. Account Aggregator Intelligence
- Real financial data (FDs, SIPs, stocks)
- Context-aware news
- Personalized financial actions

---

### 2. Financial Trajectory Engine
- Classifies users into **8 financial stages**
- Predicts next stage
- Serves **anticipatory content**

---

### 3. Story Arc Intelligence
- Tracks narratives over time
- FinBERT sentiment analysis
- Entity relationship graphs
- Predictive coverage signals

---

### 4. Dark Subscriber Reactivation
- Identifies inactive users
- Uses FAISS similarity search
- Targets **1 perfect article** for re-engagement

---

### 5. PeakMoment AI (Smart Paywall)
- Tracks user behavior every **200ms**
- Computes real-time **P(convert)**
- Fires paywall at **first local maximum**

---

## 🧠 Architecture

```

┌──────────────────────────────────────────────────────────────┐
│                        FRONTEND LAYER                        │
│  React + Vite + Tailwind (localhost:5173)                   │
│  ├── Dual Mode: ET Today vs My ET                           │
│  ├── Persona Engine (Priya / Rahul / Sneha)                 │
│  ├── Article Reader + Live Intent Graph                     │
│  └── Real-time Behavior Tracking (200ms loop)               │
├──────────────────────────────────────────────────────────────┤
│                     API & ML LAYER                           │
│  FastAPI (localhost:8001)                                   │
│  ├── Logistic Regression Model                              │
│  ├── Real-time Scoring Engine                               │
│  └── Optimal Stopping Paywall Detector                      │
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
│  ├── Layer 2: Trajectory Prediction Engine                  │
│  ├── Layer 3: Story Arc Intelligence                        │
│  ├── Layer 4: Reactivation Engine (FAISS)                   │
│  └── Layer 5: PeakMoment Paywall AI                         │
└──────────────────────────────────────────────────────────────┘

```

---

## 📂 Project Structure

```

my-et/
├── backend/
├── frontend/ (Streamlit)
├── my-et-frontend/ (React)
├── requirements.txt
└── .env

````

---

## ⚙️ Quick Start

```bash
# Clone repo
git clone https://github.com/manaspros/et-hackathon.git
cd et-hackathon

# Install dependencies
pip install -r requirements.txt

# Generate data
python backend/data/generate_data.py

# Train model
python backend/ml/train_paywall_model.py

# Start backend
uvicorn backend.ml.scoring_api:app --port 8001

# Start dashboard
streamlit run frontend/app.py

# Start frontend
cd my-et-frontend
npm install
npm run dev
````

---

## 🎯 Demo Flow

1. Open frontend → `http://localhost:5173`
2. Toggle **ET Today vs My ET**
3. Switch personas
4. Open article
5. Observe **real-time conversion probability**
6. Watch paywall fire at peak moment

---

## 📊 Key Insights

* 📈 +92% conversion (FT benchmark)
* 🎯 65–75% scroll = optimal paywall zone
* 💰 ₹825 Cr revenue opportunity
* 👥 185M+ demat accounts in India

---

## 🧰 Tech Stack

| Layer         | Tech                  |
| ------------- | --------------------- |
| Frontend      | React, Vite, Tailwind |
| Backend       | FastAPI, Python       |
| ML            | scikit-learn          |
| NLP           | FinBERT               |
| Embeddings    | sentence-transformers |
| Vector DB     | FAISS                 |
| Visualization | Plotly, NetworkX      |
| Dashboard     | Streamlit             |

---

## 👨‍💻 Team

**Built by:**

* Manas
* Vijayshree
* Vaibhav
* Pooja Bisht

---

## 🏁 Conclusion

My ET is not just a feature upgrade — it’s a **paradigm shift**:

> From *news consumption* → to *financial intelligence systems*

---

## 📎 Reference

Original draft adapted and refined from project notes.

```
