# The 5 Intelligence Layers

## Overview

Each layer solves a specific problem in how ET delivers news today.

```
User opens My ET
      ↓
[Layer 1] AA Profile → "Rahul holds ₹1.56L in 3 MF schemes"
      ↓
[Layer 2] NEWS NAVIGATOR → "3 things affecting your portfolio today"
      ├── Briefing card 1: "RBI cut rates → your debt funds gain +0.3%"
      ├── Briefing card 2: "HDFC Q3 results → you hold this stock"
      └── Briefing card 3: "Demat accounts 101 → preparing you for Stage 4"
      ↓
User taps briefing card → expands inline → asks follow-up question
      ↓
[Layer 2] "Ask ET" → "Should I move my FD to a liquid fund?" → grounded answer
      ↓
User goes deeper → full article → [Layer 5] Scroll tracking + smart paywall
      ↓
[Layer 3] Financial Trajectory → anticipatory content in briefing + feed
      ↓
[Layer 4] Story Arc → "Jio Financial: the full narrative" (visual)
      ↓
[Layer 5] Paywall fires at peak engagement (not article count)
```

---

## Layer 1: Account Aggregator Foundation

**PS8 maps to:** "My ET — The Personalized Newsroom" (data foundation)

**What it does:** Mock AA integration gives ET the user's actual financial life — SIPs, FDs, stocks, loan EMIs. Every briefing item and article is scored for portfolio relevance.

**What judges see:**
- ET Today sidebar → generic Sensex/Nifty numbers (same for everyone)
- My ET sidebar → "₹1,56,000 in MFs | SBI FD matures in 3 months | ₹45,000 monthly savings"

**What it is NOT:** A form asking "what do you invest in?" — it's AA pulling real data.

**Files:** `backend/layers/layer1_aa.py`, `my-et-frontend/src/components/AAProfileSidebar.jsx`

---

## Layer 2: News Navigator — Interactive Intelligence Briefings (CORE LAYER)

**PS8 maps to:** "News Navigator — Interactive Intelligence Briefings" (directly from PS)

**What it does:** Replaces the passive article feed with a personalized, interactive intelligence briefing. Users don't scroll through 20 articles — they get 3-5 structured briefing items tailored to their portfolio + financial stage, with the ability to drill down and ask questions.

### What Is an Intelligence Briefing?

Borrowed from military/intelligence and financial services (Bloomberg Terminal, Reuters Eikon):

| Dimension | Traditional Article (ET Today) | Intelligence Briefing (My ET) |
|---|---|---|
| Structure | Inverted pyramid narrative | **BLUF** (Bottom Line Up Front) → evidence → implications |
| Purpose | Inform broadly | **Enable a decision or action** |
| Length | 800-1500 words of prose | Concise: what happened, how it affects YOU, what to do |
| Personalization | Same for everyone | Tailored to your holdings, stage, life events |
| Interactivity | Read and leave | **Expand, ask, drill down** |
| Source | Single article | **Synthesized from multiple articles + your AA data** |

### The Three Parts of News Navigator

**Part A: Morning Briefing**
When a user opens My ET, they don't see a feed of 20 articles. They see:
> "Good morning Rahul. 3 things affecting your portfolio today:"
> 1. "RBI cut repo rate to 6.0% → Your 3 debt funds gain ~0.3%. Your SBI FD rate drops from 7.0% to 6.8%."
> 2. "HDFC Bank Q3 beat estimates → You don't hold this, but Nifty50 (your index fund) includes it."
> 3. "How to open a demat account → You're 45 days from needing this." (anticipatory, from Layer 3)

Each item is a card — BLUF format. Not an article link. A synthesized briefing with YOUR numbers.

**Part B: Interactive Drill-Down**
Tap any briefing card → it expands inline with:
- Full analysis (first few paragraphs free, rest behind paywall)
- Portfolio impact calculation (from Layer 1 AA data)
- Sentiment trend (from Layer 4 FinBERT)
- Related briefing items

**Part C: "Ask ET" — Conversational Q&A**
A chat interface at the bottom of the briefing. Powered by Groq (llama-3.3-70b) with RAG over the article corpus.

User asks: *"Should I break my FD early given the rate cut?"*
ET answers: *"Based on your SBI FD (₹50,000, 7.0%, matures Aug 2026): Breaking early incurs a 1% penalty. At the new 6.8% rate, rolling over saves you ₹100 over 5 months. ET's recommendation: hold to maturity. [Source: ET Markets analysis, Mar 28 2026]"*

The answer is grounded in ET articles + personalized with AA data. This is what makes it "interactive intelligence" — not just reading, but ASKING.

### What judges see:
| ET Today | My ET (News Navigator) |
|---|---|
| 20 article links in a feed | 3 personalized briefing cards |
| Click → read full article | Tap → inline expansion with YOUR portfolio impact |
| No way to ask questions | "Ask ET" chat with grounded answers |
| Same for everyone | Briefing synthesized from AA + stage + article corpus |

### Why this is the CORE layer:
This is what PS8 is actually asking for — "build something that makes people say 'I can't go back to reading news the old way.'" The briefing IS the new way. Articles are 2005. Briefings with drill-down + Q&A are 2026.

**What it is NOT:** A filtered feed of article links. It's a SYNTHESIZED briefing you can interact with.

**Real-world precedents:**
- Bloomberg Terminal: BLUF alerts linked to portfolio positions
- FT "Ask FT": Conversational Q&A grounded in FT journalism
- TIME AI Agent: RAG over 100+ years of archives
- Forbes Adelaide: AI assistant for business news

**Files:** `backend/layers/layer2_news_navigator.py`, `my-et-frontend/src/components/NewsBriefing.jsx`, `my-et-frontend/src/components/AskET.jsx`

---

## Layer 3: Financial Trajectory Engine

**PS8 maps to:** "My ET — The Personalized Newsroom" (anticipatory intelligence)

**What it does:** Classifies users into financial stages (1-8) and predicts their NEXT stage. Feeds anticipatory content into the News Navigator briefing.

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

**How it feeds Layer 2 (News Navigator):**
Rahul is Stage 3 with 81% probability of reaching Stage 4 in 45 days. So his briefing includes:
- Briefing item 3: "How to open a demat account" (anticipatory — he'll need this in 45 days)
- This appears alongside portfolio-relevant items, not as a separate "recommended" section

**What it is NOT:** A topic filter ("show me more tech news"). It predicts your financial future.

**Files:** `backend/layers/layer3_trajectory.py`, integrated into briefing generation

---

## Layer 4: Story Arc Tracker

**PS8 maps to:** "Story Arc Tracker" (directly in problem statement)

**What it does:** Pick any ongoing business story (Jio Financial, HDFC merger) and AI builds a visual narrative: timeline, sentiment shifts, key players, and what to watch next.

**Components:**
- **FinBERT** sentiment scoring on each article → sentiment river chart
- **NetworkX + pyvis** entity graph → who drives the story
- **Plotly** interactive timeline → 2022-2026 coverage arc
- **Pivot detection** → moments when sentiment shifted
- **Predictions** → what ET is watching next

**How it connects to Layer 2 (News Navigator):**
When a briefing card mentions "Jio Financial," the user can tap "See full story arc" → visual narrative loads. The briefing is the starting point; the story arc is the deep dive.

**What judges see:** Not 10 separate articles about Jio Financial. One visual that shows the ENTIRE story — where it came from, who drove it, where it's going.

**What it is NOT:** A timeline of article links.

**Files:** `backend/layers/layer5_story_arc.py`, `frontend/pages/3_📈_Story_Arc.py`

---

## Layer 5: PeakMoment AI — Smart Paywall

**PS8 maps to:** Monetization of the news experience

**What it does:** When a user drills down from a briefing card into a full article, the system tracks real-time reading behavior and fires the paywall at the mathematically optimal moment.

**How it connects to Layer 2 (News Navigator):**
- The briefing is FREE (BLUF summaries, portfolio impact, basic Q&A)
- The full article analysis is PRIME (deep analysis, analyst views, recommendations)
- The paywall fires when the user is most engaged with the drill-down — not after an article count

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

**What judges see:**
- ET Today: "You've read 3 articles. Subscribe." (same for everyone)
- My ET: "You've been reading HDFC Bank research for 4 minutes. Here's what our analysts found." (fires at peak engagement, with context)

**What it is NOT:** A counter after 3 articles.

**Files:** `backend/ml/scoring_api.py`, `backend/ml/train_paywall_model.py`, `my-et-frontend/src/hooks/useReadingBehavior.js`, `my-et-frontend/src/components/IntentGraph.jsx`

---

## How the 5 Layers Connect

```
Layer 1 (AA) ──→ Layer 2 (News Navigator) ← THIS IS THE PRODUCT
                  ├── Uses AA data for portfolio-aware briefings
                  ├── Uses Layer 3 (Trajectory) for anticipatory content
                  ├── Links to Layer 4 (Story Arc) for deep dives
                  └── Layer 5 (Paywall) monetizes the drill-down
```

The News Navigator is the HUB. Every other layer feeds into it or extends it:
- **Layer 1** provides the data (what you hold)
- **Layer 3** provides the intelligence (where you're going)
- **Layer 4** provides the depth (full story narratives)
- **Layer 5** provides the monetization (paywall at peak engagement)
