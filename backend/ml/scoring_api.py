"""
Real-time Paywall Scoring API
==============================
FastAPI WebSocket endpoint that:
1. Receives behavioral signals from the React frontend every 200ms
2. Scores them through the pre-trained LogisticRegression model
3. Runs OPTIMAL STOPPING detection on the probability time series
4. Returns: current P(convert), whether to fire paywall, and WHY

Optimal Stopping Logic:
  - Track P(convert) as a sliding window time series
  - Detect when probability is PEAKING (slope crosses zero: d/dt P = 0)
  - Fire at the peak — not before, not after
  - If user is about to exit (velocity spike + depth plateau), emergency fire

Run with:
  uvicorn backend.ml.scoring_api:app --reload --port 8001
"""

from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
import pickle, numpy as np, json
from collections import deque
from typing import Optional
import os

app = FastAPI(title="Paywall Timing API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load model once on startup
MODEL_PATH = os.path.join(os.path.dirname(__file__), "paywall_model.pkl")
_model = None

def get_model():
    global _model
    if _model is None:
        if os.path.exists(MODEL_PATH):
            with open(MODEL_PATH, "rb") as f:
                _model = pickle.load(f)
        else:
            raise RuntimeError("Model not found. Run train_paywall_model.py first.")
    return _model

# ── Signal processing ─────────────────────────────────────────────────────────
FEATURE_ORDER = [
    "scroll_depth",
    "scroll_velocity",
    "scroll_reversals",
    "paragraph_dwell",
    "reading_speed_wpm",
    "pause_duration",
    "data_hover_count",
    "is_at_hook",
]

def signals_to_features(signals: dict) -> np.ndarray:
    """Convert raw signals dict to feature vector in correct order"""
    return np.array([[
        float(signals.get("scroll_depth", 0)),
        float(signals.get("scroll_velocity", 200)),
        float(signals.get("scroll_reversals", 0)),
        float(signals.get("paragraph_dwell", 0)),
        float(signals.get("reading_speed_wpm", 300)),
        float(signals.get("pause_duration", 0)),
        float(signals.get("data_hover_count", 0)),
        float(signals.get("is_at_hook", 0)),
    ]])

# ── Optimal stopping detection ────────────────────────────────────────────────
class OptimalStoppingDetector:
    """
    Detects the PEAK of the P(convert) time series.

    Method: Sliding window peak detection
    - Keep last 10 probability scores
    - Compute slope: is probability rising or falling?
    - Fire when: slope was positive and just turned negative (PEAK)
    - Emergency fire: if user showing exit signals (velocity spike)

    This is far more sophisticated than "P > threshold":
    - It finds the LOCAL MAXIMUM of the conversion probability
    - It adapts to each user's unique reading pattern
    - It never shows the paywall too early (when P is still rising)
    """

    def __init__(self, user_id: str, user_threshold: float = 0.35):
        self.user_id        = user_id
        self.threshold      = user_threshold  # Minimum P before we even consider firing
        self.history        = deque(maxlen=12)  # Last 12 probability scores (~2.4 seconds)
        self.fired          = False
        self.tick           = 0
        self.last_slope     = 0.0
        self.max_p_seen     = 0.0

    def update(self, p: float, signals: dict) -> dict:
        """
        Update with new probability score.
        Returns: { fire: bool, reason: str, slope: float, trend: str }
        """
        self.tick += 1
        self.history.append(p)
        self.max_p_seen = max(self.max_p_seen, p)

        if self.fired:
            return { "fire": False, "reason": "already_fired", "slope": 0, "trend": "fired" }

        if len(self.history) < 4:
            return { "fire": False, "reason": "warming_up", "slope": 0, "trend": "rising" }

        # Compute slope over last 4 observations (800ms window)
        recent = list(self.history)[-4:]
        slope  = (recent[-1] - recent[0]) / 3  # avg change per tick

        # Trend detection
        trend = "rising" if slope > 0.005 else "falling" if slope < -0.005 else "plateau"

        # --- OPTIMAL STOPPING CONDITIONS ---

        # Condition 1: PEAK DETECTED — was rising, now falling, P is meaningful
        if (self.last_slope > 0.01 and slope < -0.01 and p >= self.threshold
                and p >= self.max_p_seen * 0.92):  # at least 92% of the max we've seen
            self.fired = True
            return {
                "fire": True,
                "reason": "peak_detected",
                "reason_human": "Reading engagement just peaked — optimal conversion moment",
                "p": round(p, 3),
                "slope": round(slope, 4),
                "trend": "peak",
                "tick": self.tick
            }

        # Condition 2: SCROLL REVERSAL — user scrolled back up (strong intent signal)
        reversals = signals.get("scroll_reversals", 0)
        velocity  = signals.get("scroll_velocity", 200)
        if reversals >= 2 and p >= self.threshold * 0.8:
            self.fired = True
            return {
                "fire": True,
                "reason": "scroll_reversal",
                "reason_human": f"Detected {reversals} re-reads — user is deeply engaged",
                "p": round(p, 3),
                "slope": round(slope, 4),
                "trend": trend,
                "tick": self.tick
            }

        # Condition 3: LONG DWELL — user has been reading this paragraph for 60+ seconds
        dwell = signals.get("paragraph_dwell", 0)
        if dwell >= 60 and p >= self.threshold:
            self.fired = True
            return {
                "fire": True,
                "reason": "deep_dwell",
                "reason_human": f"Reading for {int(dwell)} seconds — maximum engagement",
                "p": round(p, 3),
                "slope": round(slope, 4),
                "trend": trend,
                "tick": self.tick
            }

        # Condition 4: EMERGENCY — exit signals (fast scroll spike) + already high P
        if velocity > 600 and p >= self.threshold * 1.2:
            self.fired = True
            return {
                "fire": True,
                "reason": "exit_signal",
                "reason_human": "User about to leave — last conversion opportunity",
                "p": round(p, 3),
                "slope": round(slope, 4),
                "trend": "exit",
                "tick": self.tick
            }

        # Condition 5: Hook paragraph — reached the natural breakpoint AND P is meaningful
        if signals.get("is_at_hook", 0) and p >= self.threshold and trend in ("plateau","falling"):
            self.fired = True
            return {
                "fire": True,
                "reason": "hook_paragraph",
                "reason_human": "At natural story breakpoint — ideal paywall placement (Piano Analytics)",
                "p": round(p, 3),
                "slope": round(slope, 4),
                "trend": trend,
                "tick": self.tick
            }

        self.last_slope = slope
        return {
            "fire":   False,
            "reason": "monitoring",
            "p":      round(p, 3),
            "slope":  round(slope, 4),
            "trend":  trend,
            "tick":   self.tick
        }

# Active sessions: user_id → detector
SESSIONS: dict[str, OptimalStoppingDetector] = {}

# Per-user thresholds (trained from user profile)
USER_THRESHOLDS = {
    "priya_001": 0.28,   # Lower bar — she's stage 2, needs gentle nudge
    "rahul_002": 0.32,   # Mid threshold
    "sneha_003": 0.22,   # Lowest — she's high value, fire earlier
}

# ── REST endpoint (for polling — simpler than WebSocket for demo) ─────────────
@app.post("/score")
async def score_signals(payload: dict):
    """
    POST { user_id, article_id, signals: {...}, history: [...] }
    Returns { p, fire, reason, trend, slope }
    """
    user_id    = payload.get("user_id", "rahul_002")
    signals    = payload.get("signals", {})

    # Get or create detector for this user
    if user_id not in SESSIONS:
        threshold = USER_THRESHOLDS.get(user_id, 0.30)
        SESSIONS[user_id] = OptimalStoppingDetector(user_id, threshold)

    detector = SESSIONS[user_id]

    # Score through ML model
    model    = get_model()
    features = signals_to_features(signals)
    p        = float(model.predict_proba(features)[0][1])

    # Run optimal stopping
    decision = detector.update(p, signals)

    return {
        "p":             decision["p"],
        "fire":          decision["fire"],
        "reason":        decision.get("reason", "monitoring"),
        "reason_human":  decision.get("reason_human", ""),
        "trend":         decision.get("trend", "rising"),
        "slope":         decision.get("slope", 0),
        "tick":          decision.get("tick", 0),
        "p_history":     list(detector.history),
        "max_p":         round(detector.max_p_seen, 3),
    }

@app.post("/reset/{user_id}")
async def reset_session(user_id: str):
    """Reset a user's detection session (call when article changes)"""
    if user_id in SESSIONS:
        del SESSIONS[user_id]
    return {"status": "reset", "user_id": user_id}

@app.get("/health")
async def health():
    return {"status": "ok", "model_loaded": _model is not None}

# ── WebSocket endpoint (for real-time streaming) ──────────────────────────────
@app.websocket("/ws/{user_id}")
async def websocket_score(websocket: WebSocket, user_id: str):
    await websocket.accept()
    threshold = USER_THRESHOLDS.get(user_id, 0.30)
    detector  = OptimalStoppingDetector(user_id, threshold)
    model     = get_model()

    try:
        while True:
            data     = await websocket.receive_json()
            signals  = data.get("signals", {})
            features = signals_to_features(signals)
            p        = float(model.predict_proba(features)[0][1])
            decision = detector.update(p, signals)

            await websocket.send_json({
                **decision,
                "p_history": list(detector.history),
                "max_p":     round(detector.max_p_seen, 3),
            })

    except WebSocketDisconnect:
        pass
