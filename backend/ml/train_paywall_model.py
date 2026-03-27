"""
Paywall Timing Predictor — Real ML Model
=========================================
Trains a LogisticRegression on synthetic reading behavior data.
The model predicts P(convert | behavioral_signals) in real-time.

The system uses OPTIMAL STOPPING:
  - Don't fire when P > threshold (naive)
  - Fire when P is at its PEAK (slope crosses zero from positive to negative)
  - This finds the exact moment of maximum conversion probability

Signals tracked every 200ms:
  1. scroll_depth         (0-1)      position in article
  2. scroll_velocity      (px/s)     negative = scrolling back up
  3. scroll_reversals     (count)    times user scrolled back up (re-reading)
  4. paragraph_dwell      (seconds)  time on current paragraph
  5. reading_speed_wpm    (wpm)      estimated — slow = engaged, fast = skimming
  6. pause_duration       (seconds)  total time not scrolling
  7. data_hover_count     (count)    times user hovered on data boxes
  8. is_at_hook           (0/1)      has reached the hook paragraph (65% depth)

Run this once to generate the model:
  python backend/ml/train_paywall_model.py
"""

import numpy as np
import pickle
from sklearn.linear_model import LogisticRegression
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import Pipeline
from sklearn.metrics import roc_auc_score

np.random.seed(42)

# ── Feature names (order matters — must match scoring endpoint) ───────────────
FEATURE_NAMES = [
    "scroll_depth",
    "scroll_velocity",
    "scroll_reversals",
    "paragraph_dwell",
    "reading_speed_wpm",
    "pause_duration",
    "data_hover_count",
    "is_at_hook",
]

def generate_synthetic_sessions(n=5000):
    """
    Generate synthetic reading sessions for training.

    Converting user (label=1): reads deeply, slow, re-reads, pauses, hovers on data
    Non-converting user (label=0): skims fast, doesn't re-read, quick exit
    """
    X, y = [], []

    for _ in range(n):
        converts = np.random.random() < 0.15  # 15% natural conversion rate

        if converts:
            # High-intent reading pattern
            depth      = np.random.beta(5, 2)            # Skewed toward deep reading
            velocity   = np.random.normal(80, 30)         # Slow scrolling (px/s)
            reversals  = np.random.poisson(2.5)           # Re-reads 2-3 times
            dwell      = np.random.exponential(45)        # 45 sec avg on a paragraph
            wpm        = np.random.normal(180, 40)        # Slow reading (180 wpm)
            pause      = np.random.exponential(30)        # Long pauses
            hovers     = np.random.poisson(2)             # Hovers on data boxes
            at_hook    = 1 if depth > 0.60 else 0
        else:
            # Low-intent skim pattern
            depth      = np.random.beta(1.5, 3)           # Skewed toward shallow
            velocity   = np.random.normal(300, 100)       # Fast scrolling
            reversals  = np.random.poisson(0.3)           # Rarely re-reads
            dwell      = np.random.exponential(8)         # Quick reads
            wpm        = np.random.normal(350, 80)        # Fast "reading"
            pause      = np.random.exponential(5)         # Short pauses
            hovers     = np.random.poisson(0.2)           # Rarely hovers
            at_hook    = 1 if depth > 0.60 else 0

        X.append([
            np.clip(depth, 0, 1),
            np.clip(velocity, 10, 800),
            max(0, reversals),
            np.clip(dwell, 0, 300),
            np.clip(wpm, 50, 600),
            np.clip(pause, 0, 300),
            max(0, hovers),
            at_hook,
        ])
        y.append(int(converts))

    return np.array(X), np.array(y)

def train():
    print("Generating synthetic reading sessions...")
    X, y = generate_synthetic_sessions(10000)

    print(f"Training on {len(X)} sessions ({y.sum()} converters, {(~y.astype(bool)).sum()} non-converters)")

    pipeline = Pipeline([
        ("scaler", StandardScaler()),
        ("model",  LogisticRegression(
            C=1.0,
            class_weight="balanced",  # Handle class imbalance
            max_iter=1000,
            random_state=42
        ))
    ])

    # Train/val split
    split = int(0.8 * len(X))
    X_train, X_val = X[:split], X[split:]
    y_train, y_val = y[:split], y[split:]

    pipeline.fit(X_train, y_train)

    # Evaluate
    y_pred = pipeline.predict_proba(X_val)[:, 1]
    auc = roc_auc_score(y_val, y_pred)
    print(f"Validation AUC: {auc:.3f}")

    # Print feature importances
    coefs = pipeline.named_steps["model"].coef_[0]
    print("\nFeature importances (higher = stronger predictor of conversion):")
    for name, coef in sorted(zip(FEATURE_NAMES, coefs), key=lambda x: abs(x[1]), reverse=True):
        bar = "█" * int(abs(coef) * 10)
        direction = "↑ converts" if coef > 0 else "↓ converts"
        print(f"  {name:<22} {coef:+.3f}  {bar} {direction}")

    # Save model
    import os
    os.makedirs("backend/ml", exist_ok=True)
    with open("backend/ml/paywall_model.pkl", "wb") as f:
        pickle.dump(pipeline, f)

    print("\n✅ Model saved to backend/ml/paywall_model.pkl")
    print("   Run the FastAPI server to start scoring in real-time.")
    return pipeline

if __name__ == "__main__":
    train()
