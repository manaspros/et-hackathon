# Demo Script — 3 Minutes for Judges

## Setup Before Demo

```bash
# Terminal 1: ML scoring
python backend/ml/train_paywall_model.py   # once
uvicorn backend.ml.scoring_api:app --port 8001

# Terminal 2: React frontend
cd my-et-frontend && npm run dev
# → http://localhost:5173

# Terminal 3: Streamlit admin
streamlit run frontend/app.py --server.port 8501
# → http://localhost:8501
```

---

## The 3-Minute Flow

### 0:00 — 0:20 | The Hook

Open `localhost:5173`. Toggle is on **"ET Today"**.

**Say:** *"This is how ET looks today. Same homepage for 30 million users. Moneycontrol beats ET 5.2x on time-spent. We're going to show you why — and how we fix it."*

### 0:20 — 0:50 | The Toggle Moment

Click **"✨ My ET"**. Select **Rahul** as persona.

**What changes visually:**
- Sidebar transforms → AA portfolio appears (₹1,56,000 across 3 MF schemes)
- Feed changes → anticipatory articles appear ("How to open a demat account")
- Stage badge visible → "Stage 3 → 81% Stage 4 in 45 days"

**Say:** *"Same layout. Same branding. But now ET knows Rahul holds ₹1.56 lakh in 3 mutual fund schemes — via Account Aggregator. And because he's been searching 'demat account' and 'PE ratio,' we predict he's 45 days away from buying his first stock. So we show him equity content NOW — before he searches for it."*

### 0:50 — 1:30 | The Article + Smart Paywall

Click an article (RBI rate cut or HDFC Bank). Start scrolling slowly.

**Point to the IntentGraph** on the right sidebar:
- P(subscribe) starts at 8%
- As you scroll deeper, it climbs: 15%... 28%... 42%...
- Scroll back up (re-read a paragraph) — P jumps to 67%
- The graph turns green → "⚡ Peak detected"
- Paywall fires with reason: "Detected 2 re-reads — deeply engaged"

**Say:** *"Every 200 milliseconds, we collect 8 behavioral signals. A pre-trained ML model scores the probability of subscription. We don't fire at a fixed threshold — we find the PEAK of the probability curve. Optimal stopping theory. Not before the user is invested. Not after they've gotten the value. At the exact peak."*

**Point to the paywall comparison at the bottom:**
- ❌ Generic ET: "Article counter: 1/3"
- ✅ PeakMoment AI: "P(subscribe) = 67%"

### 1:30 — 2:10 | Switch to Sneha + Dark Subscriber

Switch persona to **Sneha**. Open Streamlit (`localhost:8501`).

Navigate to **Dark Subscriber** page.

**What judges see:**
- Sneha: 18 days inactive, ET Prime subscriber
- Revenue at risk: ₹2,549/year
- FAISS found her best article: "Infosys Q3 Results" (she holds Infosys)
- Push notification preview with loss aversion framing

**Say:** *"33% of ET Prime subscribers go dark within 24 hours. That's ₹38 crore a year leaving silently. Our system finds each dormant subscriber's one article — the exact one most likely to bring them back. For Sneha, it's Infosys Q3 results. She holds Infosys. FAISS found this match in under 50 milliseconds."*

### 2:10 — 2:40 | Story Arc Tracker

Navigate to **Story Arc** page. Select "Jio Financial."

**What judges see:**
- Timeline: 2022 → 2026 with sentiment river
- FinBERT sentiment scores per article
- Character network graph (Jio Financial → Ambani → RBI → BlackRock)
- Velocity indicator: coverage accelerating
- Predictive: "What ET is watching next"

**Say:** *"Every business story is 10 disconnected articles on ET today. This is the same story as a narrative. FinBERT scores sentiment. NetworkX maps the characters. And the system predicts what's next. This is what 'Story Arc Tracker' from the problem statement looks like when you build it."*

### 2:40 — 3:00 | The Close

**Show the 4 numbers:**

| Metric | Value |
|---|---|
| Time-spent gap | 5.2x (Moneycontrol vs ET) |
| Unrealized revenue | ₹825 Cr |
| Dark subscriber risk | ₹38 Cr/year |
| FT benchmark | +92% conversion with AI paywall |

**Say:** *"Five layers. One experience. Account Aggregator gives ET your actual financial life. Trajectory engine predicts where you're going. Story Arc makes narratives explorable. Dark subscriber AI prevents churn. And PeakMoment fires the paywall at the mathematically optimal moment. We didn't build features — we built the news experience that makes you say 'I can't go back.'"*

---

## Anticipated Judge Questions + Answers

**"How is this different from the FT paywall?"**
> "FT uses a single threshold for all professional users. We use per-user thresholds based on financial life stage — a Stage 2 beginner gets a different threshold than a Stage 5 active investor. And we find the PEAK of the probability, not just when it crosses a threshold."

**"Is the AA data real?"**
> "It's mock data structured exactly like AA responses. India has 2.61 billion AA-enabled accounts. The integration is a REST API call — the intelligence is what we do with the data, not the data itself."

**"The model was trained on synthetic data — is it valid?"**
> "The synthetic data captures real behavioral patterns documented in Piano Analytics and Chartbeat research. The signal weights are interpretable — scroll reversals have the highest weight because re-reading is the strongest engagement signal across all publisher research. In production, you'd train on real ET user data."

**"Why not use deep learning?"**
> "Interpretability. We can show you that scroll reversals have weight +1.8 and fast scrolling has weight -0.8. A neural net gives you a number with no explanation. For a paywall that users can see, transparency builds trust."

**"What about privacy?"**
> "All behavioral signals are collected client-side and processed in real-time. Nothing is stored. The intent score is shown transparently in the UI — the user sees exactly why the paywall fired."
