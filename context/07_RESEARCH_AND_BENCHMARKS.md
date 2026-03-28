# Research & Benchmarks

## Industry Data We Cite

### Market Opportunity

| Data Point | Value | Source |
|---|---|---|
| India demat accounts | 185M | NSDL/CDSL 2025 |
| AA-enabled accounts | 2.61 billion | Sahamati 2025 |
| Moneycontrol vs ET time-spent | 5.2× gap | Comscore Jan 2026 |
| ET Prime conversion rate | ~1.7% | Industry estimate |
| Potential at 5% conversion | ₹825 Cr | Calculated |
| Dark subscriber churn (24hr) | 33% | Industry benchmark |
| Dark subscriber revenue at risk | ₹38 Cr/year | Calculated |

### Paywall Research

| Finding | Value | Source |
|---|---|---|
| FT AI paywall conversion lift | +92% | Digiday 2024, Zuora case study |
| FT LTV increase | +78% | The Media Stack |
| FT funnel progression | +118% | Zuora |
| Optimal paywall scroll depth | 65-75% | Piano Analytics 2024 |
| Direct traffic conversion premium | 3.2× | Piano Analytics |
| Return visitor conversion premium | 8× | Piano Analytics |
| Mobile conversion penalty | -40% | Piano Analytics |
| Avg engaged time on news articles | 70 seconds | Chartbeat Q4 2024 |
| High engagement threshold | >3 minutes | Chartbeat |
| NYT digital subscribers | 10M+ | Press reports |

### Behavioral Economics

| Principle | Application |
|---|---|
| Peak engagement = peak conversion | Fire paywall at LOCAL MAXIMUM of P(convert) |
| Loss aversion (Kahneman) | Dark sub win-back: "You're losing access to..." |
| Anticipatory content | Stage 3 user shown Stage 4 content before they search for it |
| Natural narrative breakpoint | Hook paragraph at ~65% — user wants the ending |

---

## Competitive Landscape

### What Every Major Publisher Does Today

| Publisher | Paywall Method | Weakness |
|---|---|---|
| **ET Today** | 3 articles/month (hard meter) | Ignores all user behavior |
| **NYT** | Dynamic article limit per user | Still count-based, no reading signals |
| **FT** | AI: 50 data points → threshold | Single threshold for all users, not peak-based |
| **Washington Post** | Registered meter (20 free → 5 free) | Registration wall, not behavior-based |
| **The Athletic** | Hard paywall (no free articles) | All-or-nothing, no conversion optimization |
| **Medium** | Metered + blur at 50% | Fixed position, no personalization |

### What We Do Differently

| Feature | Industry Standard | Our System |
|---|---|---|
| Trigger | Article count or fixed threshold | Peak of P(convert) curve |
| Personalization | None or segment-level | Per-user threshold by financial stage |
| Context | None | Portfolio relevance scoring (AA data) |
| Transparency | Hidden | Intent score shown in UI |
| Timing | Fixed position or count | Optimal stopping (mathematical peak) |
| Win-back | Generic "we miss you" email | FAISS-matched personalized article |
| Anticipatory | None | Content for NEXT stage, not current |

---

## OSS Libraries Evaluated

### What We Use

| Need | Library | Stars | Why |
|---|---|---|---|
| ML scoring | scikit-learn | 60K+ | Interpretable, trains instantly |
| Financial sentiment | ProsusAI/FinBERT | HF | Best OSS financial NLP |
| Embeddings | all-MiniLM-L6-v2 | HF | Fast, accurate |
| Similarity | FAISS | 33K+ | Meta, fastest ANN |
| Graph viz | NetworkX + pyvis | 15K+ | Standard, works in Streamlit |
| Paragraph detection | IntersectionObserver (native) | - | Zero deps |
| API | FastAPI | 80K+ | Async, WebSocket support |

### What We Evaluated But Didn't Use

| Library | Why Not |
|---|---|
| `river` (online-ml) | Great for production online learning, overkill for demo |
| `recharts` | Adding a npm dep for one chart when Canvas works |
| `react-intersection-observer` | Native API is 5 lines, one fewer dep |
| `mabwiser` (Fidelity) | Thompson sampling is impressive but adds complexity |
| `graphrag` (Microsoft) | Takes 36 hours on local models |
| `RecBole` | Full recommendation engine, overkill for 3 personas |
| `VowpalWabbit` | Too steep learning curve for 48hrs |

---

## Academic References

| Paper | Relevance |
|---|---|
| "River: ML for streaming data" (JMLR 2021) | Online learning theory behind real-time scoring |
| "Optimal Stopping for Sequential Bayesian Design" (arXiv 2509.21734) | Mathematical foundation for "fire at peak" |
| "Algorithmic Content Selection + User Disengagement" (arXiv 2410.13108) | Why maximizing immediate reward ≠ optimal for retention |
| Piano Analytics Subscription Performance Benchmarks 2024 | 65-75% scroll depth data |
| Chartbeat Global Audience Insights Q4 2024 | Engaged time research |
| Reuters Institute Digital News Report 2025 | Ethics of personalized paywalls |
| Columbia Journalism Review 2024 | Surveillance perception in paywall systems |

---

## Key Numbers to Memorize for Demo

```
5.2×     — Moneycontrol vs ET time-spent gap
₹825 Cr  — Unrealized subscription revenue
₹38 Cr   — Dark subscriber annual churn
+92%     — FT conversion lift with AI paywall
65-75%   — Piano Analytics optimal paywall zone
2.61B    — AA-enabled accounts in India
185M     — Demat accounts in India
8×       — Return visitor conversion premium
200ms    — Our signal collection interval
8        — Behavioral signals we track
```
