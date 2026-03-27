import faiss, numpy as np
from datetime import datetime, timedelta

def get_dark_subscribers(users: list, threshold_days: int = 14) -> list:
    cutoff = datetime.now() - timedelta(days=threshold_days)
    dark = []
    for u in users:
        if not u.get("is_prime"): continue
        last = datetime.strptime(u["last_active"], "%Y-%m-%d")
        if last < cutoff:
            dark.append({**u, "days_inactive": (datetime.now()-last).days})
    return dark

def find_best_article(user: dict, articles: list, embedder) -> dict:
    """
    FAISS cosine similarity: find the ONE article most likely to re-engage.
    user reading history -> preference vector -> nearest article embedding
    """
    # Build user preference text from reading history
    history_text = " ".join(
        f"{h['category'].replace('_',' ')} " * max(1, int(h['count'] * h.get('avg_depth',0.5)))
        for h in user["reading_history"]
    )
    # Encode all articles + user vector
    art_texts = [f"{a['title']} {a['summary']}" for a in articles]
    art_vecs  = embedder.encode(art_texts, normalize_embeddings=True).astype('float32')
    user_vec  = embedder.encode([history_text], normalize_embeddings=True).astype('float32')

    # FAISS inner product = cosine on normalized vectors
    idx = faiss.IndexFlatIP(art_vecs.shape[1])
    idx.add(art_vecs)
    dists, ids = idx.search(user_vec, k=3)

    best = articles[ids[0][0]]
    return {
        "article":    best,
        "score":      float(dists[0][0]),
        "reason":     f"Matches your deep interest in {best['category'].replace('_',' ')}"
    }

def winback_sequence(user: dict, article: dict) -> list:
    days   = user.get("days_inactive", 14)
    topic  = user["reading_history"][0]["category"].replace("_"," ")
    return [
        {"step":1, "day":days,    "channel":"Push",  "framing":"Loss aversion",
         "message":f"While you were away: \"{article['title'][:65]}...\"",
         "why":"Loss aversion outperforms promotional 2:1 in re-engagement studies"},
        {"step":2, "day":days+7,  "channel":"Email", "framing":"FOMO + reminder",
         "message":f"What {topic.title()} looked like this week — your catch-up",
         "why":"Highlights missed value, references remaining subscription"},
        {"step":3, "day":days+30, "channel":"In-app","framing":"Value re-demonstration",
         "message":"Welcome back — here's your personalised catch-up brief",
         "why":"Re-demonstrates product value on return visit"},
        {"step":4, "day":days+60, "channel":"Email", "framing":"Time-limited offer",
         "message":"Your ET Prime renews soon — lock in 2-year rate today",
         "why":"20-30% reactivation rate with time-limited offers (Piano Analytics)"},
    ]
