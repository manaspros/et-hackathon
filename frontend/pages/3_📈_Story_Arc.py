import streamlit as st, sys
import streamlit.components.v1 as components
sys.path.insert(0,".")
from backend.layers.layer1_aa import load_articles
from backend.layers.layer5_story_arc import build_story_arc, sentiment_chart, render_network_html
from backend.utils.models import get_finbert

st.title("📈 Story Arc Tracker")
st.caption("ET's complete coverage of any business story — timeline, sentiment, character network, predictions")

articles = load_articles()
finbert  = get_finbert()
company  = st.selectbox("Track a company story:", ["Jio Financial","HDFC Bank"])

if st.button("🔍 Build Story Arc", type="primary"):
    with st.spinner("Analysing ET's complete coverage..."):
        arc = build_story_arc(company, articles, finbert)

    if "error" in arc:
        st.error(arc["error"]); st.stop()

    c1,c2,c3,c4 = st.columns(4)
    c1.metric("ET Articles Found", arc["count"])
    c2.metric("Coverage Since",    arc["date_range"]["first"])
    c3.metric("Coverage Trend",    arc["velocity"]["signal"])
    c4.metric("Pivot Moments",     sum(1 for t in arc["timeline"] if t["is_pivot"]))

    st.subheader("📊 Sentiment River")
    st.plotly_chart(sentiment_chart(arc["timeline"]), use_container_width=True)

    st.subheader("📅 Timeline")
    for item in arc["timeline"]:
        label = "🔴 PIVOT" if item["is_pivot"] else "•"
        sent  = item["sentiment"]["label"].upper()
        st.write(f"{label} **{item['date']}** — {item['title']} `[{sent}]`")

    col1, col2 = st.columns(2)
    with col1:
        st.subheader("🎯 First Signal")
        fs = arc["first_signal"]
        st.info(f"**{fs['date']}** — *\"{fs['title']}\"*\n\nET's first coverage — {arc['count']-1} articles followed")
    with col2:
        st.subheader("🔮 What ET Is Watching Next")
        for p in arc["whats_next"]:
            st.success(f"→ {p}")

    st.subheader("🕸️ Character Network")
    components.html(render_network_html(arc["character_net"]), height=400)
