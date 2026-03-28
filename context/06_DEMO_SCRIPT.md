# Demo Script — 3 Minutes for Judges

## Setup Before Demo

```bash
# Terminal 1: FastAPI backend (briefing + Ask ET + ML scoring)
python backend/ml/train_paywall_model.py   # once
uvicorn backend.api:app --port 8001

# Terminal 2: React frontend
cd my-et-frontend && npm run dev
# → http://localhost:5173

# Terminal 3: Streamlit admin
streamlit run frontend/app.py --server.port 8501
# → http://localhost:8501
```

---

## The 3-Minute Flow

### 0:00 — 0:15 | The Hook

Open `localhost:5173`. Toggle is on **"ET Today"**.

**Say:** *"This is how 30 million people read ET today. Same homepage. Same articles. Same format since 2005. Moneycontrol beats ET 5.2x on time-spent. Here's why — and here's the fix."*

### 0:15 — 0:50 | The News Navigator Moment (THE WOW)

Click **"My ET"**. Select **Rahul** as persona.

**What changes:**
- The article feed DISAPPEARS
- A **personalized intelligence briefing** appears:
  > "Good morning Rahul. 3 things affecting your portfolio today:"
  > 1. "RBI cut repo rate → Your 3 debt funds gain +₹470"
  > 2. "Nifty crossed 24,000 → Your index fund up 1.2% this week"
  > 3. "How to open a demat account → You're 45 days from needing this"
- AA sidebar shows: ₹1,56,000 across 3 MF schemes
- Stage badge: "Stage 3 → 81% Stage 4 in 45 days"

**Say:** *"Rahul doesn't see 20 articles. He sees 3 things that affect HIS portfolio — with HIS actual numbers from Account Aggregator. Item 3 is anticipatory: our trajectory engine predicts he's 45 days from opening a demat account, so we show him that content NOW."*

### 0:50 — 1:20 | Ask ET (Interactive Intelligence)

Tap on briefing card 1 (RBI rate cut) → it expands with analysis + portfolio impact.

Then type in **"Ask ET"** chat: *"Should I move my FD to a liquid fund?"*

Answer streams in: *"Based on your portfolio... At the new 6.0% repo rate..."*

**Say:** *"This is what 'Interactive Intelligence Briefing' means. Not reading an article and hoping the answer is in there. ASKING your question and getting an answer grounded in ET's journalism — personalized with your actual data. Bloomberg does this for ₹20 lakh a year. We do it for ₹2,549."*

### 1:20 — 1:50 | Smart Paywall (Drill-Down)

Click "Read full analysis" on the expanded briefing card → full article opens.
Start scrolling slowly. Point to the IntentGraph sidebar:
- P(subscribe) climbing: 15%... 32%... 58%...
- Scroll back up (re-read) → spike to 71%
- Paywall fires: "Detected 2 re-reads — deeply engaged"

**Say:** *"The briefing is free. The deep analysis is Prime. And the paywall doesn't fire after 3 articles — it fires at the PEAK of engagement. Optimal stopping theory. For Rahul, that's when he re-reads the rate impact paragraph."*

### 1:50 — 2:20 | Story Arc Tracker

Open Streamlit. Navigate to **Story Arc** → select "Jio Financial."

**What judges see:** Timeline, sentiment river (FinBERT), character network, predictions.

**Say:** *"Every business story is 10 disconnected articles on ET. This is the same story as a narrative — FinBERT scores sentiment, NetworkX maps the key players, and the system predicts what's next. Tap 'Jio Financial' in your briefing and this is what loads."*

### 2:20 — 2:40 | Dark Subscriber (Business Case)

Switch to **Dark Subscriber** page. Select Sneha.

**Say:** *"Sneha was a Prime subscriber. 18 days inactive. ₹2,549/year at risk. FAISS found her one article: Infosys Q3 results — she holds Infosys. If she'd had the News Navigator briefing, she would have seen 'Infosys Q3 beat → your 50 shares gained ₹8,200' on day 1. She never would have gone dark."*

### 2:40 — 3:00 | The Close

**Say:** *"Five layers. One experience. Account Aggregator knows your financial life. News Navigator gives you a briefing, not a feed. You can ASK it questions. The Trajectory Engine predicts your next move. Story Arc makes narratives visual. And PeakMoment fires the paywall at the mathematical peak — not after 3 articles."*

*"We didn't build features. We built the experience that makes you say: I can't go back to reading news the old way."*

---

## Anticipated Judge Questions

**"How is Ask ET different from ChatGPT?"**
> "ChatGPT hallucinates. Ask ET answers are grounded in ET's published articles — every answer has a source citation. And it knows your portfolio via AA. ChatGPT can't tell Rahul that his specific debt funds gain 0.3% from the rate cut."

**"The briefing is just a summary — why not just write better headlines?"**
> "Headlines inform. Briefings enable decisions. 'RBI cuts rate to 6%' is a headline. 'Your 3 debt funds gain ₹470, your FD rate drops to 6.8%, net impact positive' is an intelligence briefing. The difference is YOUR data."

**"How is this different from Bloomberg Terminal?"**
> "Bloomberg costs ₹20 lakh/year and targets institutional traders. We target India's 185 million retail investors at ₹2,549/year. Same BLUF format, same portfolio-awareness, but for the SIP investor — not the hedge fund."

**"Is the AA data real?"**
> "Mock data in the exact AA response format. India has 2.61 billion AA-enabled accounts. The integration is a REST API call. The innovation is what we DO with the data — portfolio-aware briefings that no publisher has built."

**"What about the model trained on synthetic data?"**
> "The behavioral signals (scroll reversals, dwell time) are documented across Piano Analytics and Chartbeat research. In production, you train on real ET sessions. The demo shows the architecture, not final weights."

**"Why not use a transformer/deep learning model?"**
> "Interpretability. We show scroll reversals have weight +1.8. A neural net is a black box. For a paywall, transparency builds trust."
