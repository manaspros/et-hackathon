import time, streamlit as st

INTENT_THRESHOLDS = {
    "deep_research":    {"min_articles": 4, "same_category": True,  "confidence": 0.88},
    "stage_transition": {"trajectory_prob": 0.75, "days_remaining": 60, "confidence": 0.85},
    "habit_forming":    {"consecutive_days": 3,                         "confidence": 0.72},
    "high_engagement":  {"min_high_depth": 3, "depth_threshold": 0.85,  "confidence": 0.78},
}

# Personalised offers per intent type
OFFERS = {
    "deep_research": {
        "headline": "You're clearly researching {category}. ET Prime has 3 exclusive analyst reports on this.",
        "sub":  "Trusted by 500K investors — 7 days free",
        "cta":  "Read the full analysis →"
    },
    "stage_transition": {
        "headline": "Ready to level up? ET Prime's {next_stage_label} coverage is exactly what you need now.",
        "sub":  "Join investors who made the leap with ET Prime",
        "cta":  "Start free trial →"
    },
    "habit_forming": {
        "headline": "You've opened ET {consecutive_days} days in a row. Serious investors go Prime.",
        "sub":  "2x content, 0 ads, exclusive research",
        "cta":  "Get ET Prime →"
    },
    "high_engagement": {
        "headline": "You read ET deeply and carefully. ET Prime is built for readers like you.",
        "sub":  "Every article you finished today has a deeper version in Prime",
        "cta":  "See what you're missing →"
    }
}

GENERIC_PAYWALL = "Subscribe to ET Prime to continue reading"

def detect_intent(session_events: list, user: dict) -> dict:
    """Analyse session events and return best intent + personalised offer"""
    recent = [e for e in session_events if time.time()-e.get("ts",0) < 1800]

    # Count category reads in last 30 min
    cat_counts = {}
    depth_list = []
    for e in recent:
        cat_counts[e.get("category","misc")] = cat_counts.get(e.get("category","misc"),0) + 1
        depth_list.append(e.get("depth", 0.5))

    intents = []
    traj = user.get("trajectory", {})

    for cat, cnt in cat_counts.items():
        if cnt >= INTENT_THRESHOLDS["deep_research"]["min_articles"]:
            intents.append({
                "type":"deep_research","confidence":min(0.95,0.65+cnt*0.08),
                "category":cat.replace("_"," ").title(),
                "trigger":f"Read {cnt} articles on {cat.replace('_',' ')} in 30 min"
            })

    if traj.get("probability",0) >= 0.75 and traj.get("days",999) <= 60:
        intents.append({
            "type":"stage_transition","confidence":traj["probability"],
            "next_stage_label":traj.get("next_stage_label","the next level"),
            "trigger":f"{traj['probability']:.0%} chance of reaching {traj.get('next_stage_label','')} in {traj.get('days',45)} days"
        })

    if user.get("consecutive_days",0) >= 3:
        intents.append({
            "type":"habit_forming","confidence":0.72,
            "consecutive_days":user["consecutive_days"],
            "trigger":f"{user['consecutive_days']} consecutive days"
        })

    high_depth = [d for d in depth_list if d > 0.85]
    if len(high_depth) >= 3:
        intents.append({"type":"high_engagement","confidence":0.78,
                        "trigger":"Reading articles to full completion"})

    if not intents:
        return {"show":False}

    best = max(intents, key=lambda x: x["confidence"])
    offer_tmpl = OFFERS[best["type"]]
    headline   = offer_tmpl["headline"].format(**best)

    return {
        "show":       True,
        "intent":     best,
        "offer": {"headline":headline, "sub":offer_tmpl["sub"], "cta":offer_tmpl["cta"]},
        "generic":    GENERIC_PAYWALL,
        "lift_claim": "+92% conversion (FT benchmark with AI paywall)"
    }
