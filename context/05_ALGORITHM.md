# The Paywall Algorithm — PeakMoment AI

## The Problem with Every Existing Paywall

```
ET Today:     if (articlesRead >= 3) showPaywall()     // ignores behavior
NYT:          if (dynamicLimit(user)) showPaywall()    // still count-based
FT:           if (intentScore >= threshold) showPaywall() // threshold, not peak
```

**All of these fire at a THRESHOLD.** None find the PEAK.

## Our Approach: Optimal Stopping

The probability of conversion changes every second as the user reads. Showing the paywall too early wastes the moment (user isn't invested). Too late (they already got value). The algorithm finds the LOCAL MAXIMUM of the probability curve — the mathematically optimal moment.

```
Every 200ms:
  Collect 8 behavioral signals
  → Feed to pre-trained LogisticRegression
  → Get P(subscribe) = 0.0 to 1.0
  → Track P over sliding window of 12 observations (2.4 seconds)
  → Detect when P is PEAKING (slope crosses from + to -)
  → Fire at the peak
```

## Signal Collection (Frontend)

The `useReadingBehavior` React hook runs a `setInterval` every 200ms:

| Signal | Collection Method | Why It Predicts |
|---|---|---|
| `scroll_depth` | `scrollY / articleHeight` | Deeper = more invested |
| `scroll_velocity` | `dy / dt` (px/sec) | Slow = actually reading |
| `scroll_reversals` | Direction changes (down→up) | Re-reading = STRONGEST intent signal |
| `paragraph_dwell` | IntersectionObserver timer | Time on visible paragraph |
| `reading_speed_wpm` | Words visible / time | Slow reading = careful engagement |
| `pause_duration` | Time when velocity < 10px/s | Pausing = thinking/processing |
| `data_hover_count` | `mouseenter` on data boxes | Looking at numbers = decision-making |
| `is_at_hook` | scroll_depth >= 0.62 | At the natural narrative breakpoint |

## ML Model (Backend)

**Training:** 10,000 synthetic reading sessions → StandardScaler → LogisticRegression
**Features:** The 8 signals above
**Output:** P(subscribe | signals) — a probability from 0 to 1
**AUC:** ~0.82 on held-out test set

The model learns weights like:
- `scroll_reversals`: +1.8 (re-reading is the strongest signal)
- `is_at_hook`: +1.6 (being at the breakpoint matters)
- `data_hover_count`: +1.4 (engaging with data = intent)
- `scroll_velocity`: -0.8 (FAST scrolling = skimming = LOW intent)

## Optimal Stopping Detector

Tracks P(subscribe) as a time series over a sliding window of 12 observations (2.4 seconds).

### Firing Conditions (first match wins)

**Condition 1: Peak Detected**
```
Previous slope > +0.01 AND current slope < -0.01
AND P >= user's threshold AND P >= 92% of max P seen
```
"P was climbing, now it's falling. This is the peak. Fire."

**Condition 2: Scroll Reversal**
```
scroll_reversals >= 2 AND P >= threshold × 0.8
```
"User scrolled back up twice. They're re-reading. This is proven intent."

**Condition 3: Long Dwell**
```
paragraph_dwell >= 60s AND P >= threshold
```
"User has been reading this paragraph for over a minute. Maximum engagement."

**Condition 4: Exit Signal**
```
scroll_velocity > 600px/s AND P >= threshold × 1.2
```
"User is scrolling fast to leave. P was already high. Last chance to convert."

**Condition 5: Hook Paragraph**
```
is_at_hook == 1 AND P >= threshold AND trend in (plateau, falling)
```
"At the natural breakpoint, reading slowly, engagement is stable/declining. Fire now."

## Per-User Thresholds

| User | Stage | Threshold | Rationale |
|---|---|---|---|
| Priya | 2 (SIP Beginner) | 72 | New user, needs high engagement to convert |
| Rahul | 3 (Portfolio Builder) | 68 | Active researcher, medium bar |
| Sneha | 5 (Active Investor) | 60 | High value, fire earlier |

## Why This Is Better

| System | What It Does | Problem |
|---|---|---|
| Article count | `articles >= 3` | Ignores all reading behavior |
| Scroll threshold | `depth > 70%` | Same for everyone, fires once |
| Intent threshold | `score >= 0.65` | One-size-fits-all cutoff |
| **PeakMoment AI** | **Peak of P(convert) curve** | **Per-user, adapts in real-time, fires at LOCAL MAXIMUM** |

## The Fallback

When the ML backend isn't running, `useReadingBehavior.js` has a client-side fallback with hardcoded logistic regression weights. The demo works either way — the fallback produces similar results using the same signal weights.

## Piano Analytics Validation

Piano's research across 2,000+ publishers confirms:
- **65-75% scroll depth** is the optimal paywall zone → our hook paragraph is at 62%
- **3+ minutes engaged time** = highest subscription propensity → our `paragraph_dwell` tracks this
- **Direct traffic converts 3.2x better** → we track return visits
- **FT achieved +92% conversion lift** with their AI paywall → we go further with per-user thresholds + optimal stopping

## Files

```
backend/ml/train_paywall_model.py   ← Train once: python backend/ml/train_paywall_model.py
backend/ml/scoring_api.py           ← FastAPI endpoint: uvicorn backend.ml.scoring_api:app --port 8001
backend/ml/paywall_model.pkl        ← Auto-generated model file
my-et-frontend/src/hooks/useReadingBehavior.js  ← 200ms signal collector + fallback scoring
my-et-frontend/src/components/IntentGraph.jsx   ← Live P(convert) canvas chart
```
