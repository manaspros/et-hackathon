import networkx as nx
from pyvis.network import Network
import plotly.graph_objects as go
import sys, json

# ── Sentiment (FinBERT, cached in utils/models.py) ────────────────────────────
def batch_sentiment(texts: list, finbert_pipe) -> list:
    """Run FinBERT on a list of texts, return label + score per text"""
    results = finbert_pipe(texts, batch_size=8, truncation=True, max_length=512)
    out = []
    for r in results:
        scores = {x["label"]: x["score"] for x in r}
        label  = max(scores, key=scores.get)
        out.append({"label": label, "score": scores[label], "scores": scores})
    return out

# ── Story Arc Builder ─────────────────────────────────────────────────────────
def build_story_arc(company: str, articles: list, finbert_pipe) -> dict:
    """Core function — call this from Streamlit page"""
    company_articles = [
        a for a in articles
        if company.lower() in a.get("company","").lower()
        or company.lower() in a.get("title","").lower()
        or company in a.get("entities",[])
    ]
    company_articles.sort(key=lambda x: x["date"])
    if not company_articles:
        return {"error": f"No articles found for {company}"}

    texts      = [a["title"] + ". " + a["summary"] for a in company_articles]
    sentiments = batch_sentiment(texts, finbert_pipe)

    timeline = []
    for i, (art, sent) in enumerate(zip(company_articles, sentiments)):
        is_pivot = False
        if i > 0:
            prev = sentiments[i-1]["scores"].get("positive",0)
            curr = sent["scores"].get("positive",0)
            is_pivot = abs(curr - prev) > 0.30
        timeline.append({**art, "sentiment": sent, "is_pivot": is_pivot})

    return {
        "company":       company,
        "count":         len(timeline),
        "date_range":    {"first": timeline[0]["date"], "last": timeline[-1]["date"]},
        "timeline":      timeline,
        "character_net": _build_network(company_articles),
        "velocity":      _velocity(company_articles),
        "first_signal":  timeline[0],
        "whats_next":    _predict_next(company, company_articles)
    }

def _build_network(articles: list) -> dict:
    G = nx.Graph()
    for art in articles:
        for e in art.get("entities",[]):
            G.add_node(e)
        ents = art.get("entities",[])
        for i,e1 in enumerate(ents):
            for e2 in ents[i+1:]:
                if G.has_edge(e1,e2): G[e1][e2]["w"] += 1
                else: G.add_edge(e1, e2, w=1)
    nodes = [{"id":n,"label":n,"size":G.degree(n)*4+6} for n in G.nodes()]
    edges = [{"from":u,"to":v,"width":G[u][v]["w"]} for u,v in G.edges()]
    return {"nodes":nodes,"edges":edges}

def _velocity(articles: list) -> dict:
    recent = [a for a in articles if a["date"] >= "2025-01-01"]
    older  = [a for a in articles if a["date"] <  "2025-01-01"]
    trend  = "accelerating" if len(recent)>len(older)*0.4 else "stable"
    return {"trend":trend,"recent":len(recent),"older":len(older),
            "signal":"⚡ Accelerating" if trend=="accelerating" else "📊 Steady"}

def _predict_next(company: str, articles: list) -> list:
    cats = set(a["category"] for a in articles)
    preds = []
    if "regulatory_news" in cats:
        preds.append("Watch for SEBI/RBI follow-up action on recent regulatory news")
    if len(articles) >= 4:
        preds.append("Coverage volume signals potential major announcement in 30-60 days")
    preds.append(f"Analyst consensus on {company} likely to shift given recent earnings trend")
    return preds[:3]

# ── Plotly Sentiment River ────────────────────────────────────────────────────
def sentiment_chart(timeline: list) -> go.Figure:
    dates  = [t["date"]  for t in timeline]
    scores = [t["sentiment"]["scores"].get("positive",0)
             -t["sentiment"]["scores"].get("negative",0) for t in timeline]
    labels = [t["title"][:55]+"..." for t in timeline]
    colors = ["#e74c3c" if t["is_pivot"] else "#3498db" for t in timeline]

    fig = go.Figure()
    fig.add_trace(go.Scatter(
        x=dates, y=scores, mode="lines+markers", fill="tozeroy",
        line=dict(color="#3498db",width=2),
        marker=dict(size=[14 if t["is_pivot"] else 7 for t in timeline], color=colors),
        text=labels,
        hovertemplate="<b>%{text}</b><br>%{x} | Sentiment: %{y:.2f}<extra></extra>"
    ))
    fig.update_layout(
        title="ET Coverage Sentiment River", height=280,
        xaxis_title="Date", yaxis_title="Sentiment",
        yaxis=dict(range=[-1,1]), plot_bgcolor="white",
        shapes=[dict(type="line",x0=dates[0],x1=dates[-1],y0=0,y1=0,
                     line=dict(color="gray",dash="dot"))]
    )
    return fig

# ── pyvis Network for Streamlit ───────────────────────────────────────────────
def render_network_html(net_data: dict) -> str:
    net = Network(height="380px", width="100%", bgcolor="#f8f9fa", font_color="#333")
    for n in net_data["nodes"][:20]:
        net.add_node(n["id"], label=n["label"], size=n["size"], color="#e74c3c")
    for e in net_data["edges"][:40]:
        net.add_edge(e["from"], e["to"], width=e["width"])
    net.set_options('{"physics":{"stabilization":{"iterations":80}}}')
    net.save_graph("/tmp/arc_net.html")
    return open("/tmp/arc_net.html").read()
