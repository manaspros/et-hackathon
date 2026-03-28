# The 5 Intelligence Layers

## Overview

Each layer solves a specific problem in how ET delivers news today.

```
User opens My ET
      ↓
[Layer 1] AA Profile → "Rahul holds ₹1.56L in 3 MF schemes"
      ↓
[Layer 2] Trajectory → "Stage 3 → 81% Stage 4 in 45 days"
      ↓
[Layer 2] Feed → 3 current articles + 2 anticipatory (equity basics)
      ↓
User clicks article → [Layer 5] Scroll tracking begins
      ↓
User reads deeply → [Layer 5] P(subscribe) = 74% → Paywall fires
      ↓
[Layer 4] Sneha is dark → Win-back: one perfect article
      ↓
[Layer 3] Story Arc → Jio Financial visual narrative
```

---

## Layer 1: Account Aggregator Foundation

**PS8 maps to:** "My ET — The Personalized Newsroom" (data foundation)

**What it does:** Mock AA integration gives ET the user's actual financial life — SIPs, FDs, stocks, loan EMIs. Every article is scored for portfolio relevance.

**What judges see:**
- ET Today sidebar → generic Sensex/Nifty numbers (same for everyone)
- My ET sidebar → "₹1,56,000 in MFs | SBI FD matures in 3 months | ₹45,000 monthly savings"

**What it is NOT:** A form asking "what do you invest in?" — it's AA pulling real data.

**Files:** `backend/layers/layer1_aa.py`, `my-et-frontend/src/components/AAProfileSidebar.jsx`

---

## Layer 2: Financial Trajectory Engine

**PS8 maps to:** "My ET — The Personalized Newsroom" (intelligence layer)

**What it does:** Classifies users into financial stages (1-8) and serves content for the NEXT stage, not the current one.

**The 8 stages:**
| Stage | Label | Example |
|---|---|---|
| 1 | Savings Only | FDs, savings account, no market exposure |
| 2 | SIP Beginner | Started first SIP, reading basics |
| 3 | Portfolio Builder | Multiple MFs, comparing funds |
| 4 | Equity Explorer | Searching for demat, reading PE ratios |
| 5 | Active Investor | Direct stocks, quarterly results reader |
| 6 | Diversifier | Multiple asset classes, global exposure |
| 7 | Wealth Manager | Tax optimization, estate planning |
| 8 | HNI | Alternate investments, PE/VC |

**What judges see:**
| ET Today (Reactive) | My ET (Anticipatory) |
|---|---|
| 5 MF articles (what you already read) | 3 MF + 2 equity prep articles |
| Content for where you ARE | Content for where you're GOING |

**Key insight:** Rahul is Stage 3 with 81% probability of reaching Stage 4 (equity) in 45 days. We show him equity content NOW — before he searches for it.

**What it is NOT:** A topic filter ("show me more tech news"). It predicts your financial future.

**Files:** `backend/layers/layer3_trajectory.py`, `my-et-frontend/src/components/ArticleCard.jsx`

---

## Layer 3: Story Arc Tracker

**PS8 maps to:** "Story Arc Tracker" (directly in problem statement)

**What it does:** Pick any ongoing business story (Jio Financial, HDFC merger) and AI builds a visual narrative: timeline, sentiment shifts, key players, and what to watch next.

**Components:**
- **FinBERT** sentiment scoring on each article → sentiment river chart
- **NetworkX + pyvis** entity graph → who drives the story
- **Plotly** interactive timeline → 2022-2026 coverage arc
- **Pivot detection** → moments when sentiment shifted
- **Predictions** → what ET is watching next

**What judges see:** Not 10 separate articles about Jio Financial. One visual that shows the ENTIRE story — where it came from, who drove it, where it's going.

**What it is NOT:** A timeline of article links.

**Files:** `backend/layers/layer5_story_arc.py`, `frontend/pages/3_📈_Story_Arc.py`

---

## Layer 4: Dark Subscriber Reactivation

**PS8 maps to:** Business impact + scalability evaluation

**What it does:** AI identifies dormant ET Prime subscribers and finds the ONE article most likely to bring them back using FAISS similarity search against their reading history.

**How it works:**
1. User hasn't opened ET in 14+ days → flagged as "dark"
2. Their past reading history → encoded via `all-MiniLM-L6-v2`
3. FAISS cosine similarity against new article corpus
4. Best match → personalized win-back notification
5. 4-step sequence with loss aversion framing

**What judges see:** Sneha (18 days inactive). Revenue at risk: ₹2,549/year. FAISS finds her best re-engagement article: "Infosys Q3 Results" (she held Infosys). Push notification preview.

**What it is NOT:** A generic "we miss you" email blast.

**Files:** `backend/layers/layer6_dark_sub.py`, `frontend/pages/4_💤_Dark_Subs.py`

---

## Layer 5: PeakMoment AI — Smart Paywall

**PS8 maps to:** "News Navigator — Interactive Intelligence Briefings" (the paywall IS the briefing tease)

**What it does:** Instead of "you've read 3 articles, subscribe," the system tracks real-time reading behavior and fires the paywall at the mathematically optimal moment.

**Signals collected every 200ms:**
| Signal | What It Measures | Why It Matters |
|---|---|---|
| `scroll_depth` | Position in article (0-100%) | Deeper = more invested |
| `scroll_velocity` | Speed of scrolling (px/s) | Slow = actually reading |
| `scroll_reversals` | Times scrolled back up | Re-reading = STRONG intent |
| `paragraph_dwell` | Seconds on visible paragraph | Long = deep engagement |
| `reading_speed_wpm` | Words per minute estimate | Slow = careful reading |
| `pause_duration` | Total time not scrolling | Thinking = processing |
| `data_hover_count` | Hovers over data boxes | Looking at numbers = intent |
| `is_at_hook` | Reached ~65% depth | Natural narrative breakpoint |

**The algorithm:**
```
Signals → Pre-trained LogisticRegression → P(subscribe)
P over time → Optimal Stopping Detector → Fire at PEAK
```

**Per-user thresholds:** Priya = 72 (gentle), Rahul = 68 (medium), Sneha = 60 (aggressive — she's high value)

**Fires when:**
1. P(subscribe) peaks (was rising, now falling) AND P ≥ threshold
2. OR scroll reversals ≥ 2 (re-reading proven intent)
3. OR paragraph dwell > 60s (deep engagement)
4. OR exit signal detected (velocity spike + high P)
5. OR at hook paragraph + slow reading

**What judges see:**
- ET Today: "You've read 3 articles. Subscribe." (same for everyone)
- My ET: "You've been reading HDFC Bank research for 4 minutes, re-reading paragraphs. Here's what our analysts found." (personalized, with reason)

**What it is NOT:** A counter after 3 articles.

**Files:** `backend/ml/scoring_api.py`, `backend/ml/train_paywall_model.py`, `my-et-frontend/src/hooks/useReadingBehavior.js`, `my-et-frontend/src/components/IntentGraph.jsx`

---

## How They Work Together

The 5 layers aren't independent features — they're a pipeline:

1. **Layer 1** (AA data) feeds into **Layer 2** (stage classification) — you can't predict someone's financial future without knowing their present
2. **Layer 2** (trajectory) feeds into **Layer 5** (paywall) — the stage determines the threshold and the offer copy
3. **Layer 3** (story arc) provides the CONTENT that makes users subscribe — deep narratives you can't get elsewhere
4. **Layer 4** (dark sub) uses **Layer 1** (AA data) to find the right win-back article — portfolio relevance drives re-engagement
5. **Layer 5** (paywall) is the monetization of everything — it converts the great experience into revenue
