import streamlit as st, sys
sys.path.insert(0,".")
from backend.layers.layer1_aa import load_users, load_articles, get_aa_summary, get_portfolio_impact
from backend.layers.layer3_trajectory import get_stage_and_trajectory

st.title("📊 Dashboard — User Financial Profile")

user = st.session_state.get("user")
if not user: st.warning("Select a persona in the sidebar"); st.stop()

aa   = get_aa_summary(user)
traj = get_stage_and_trajectory(user)

# ── AA Profile ────────────────────────────────────────────────────────────────
st.subheader(f"👋 {user['name']}'s Account Aggregator Profile")
st.caption("One consent tap — complete financial X-ray")

c1,c2,c3,c4 = st.columns(4)
c1.metric("Net Worth",      f"₹{aa['net_worth']:,.0f}")
c2.metric("MF Portfolio",   f"₹{aa['mf_value']:,.0f}")
c3.metric("Stocks",         f"₹{aa['stock_value']:,.0f}")
c4.metric("Monthly Savings",f"₹{aa['monthly_savings']:,.0f} ({aa['savings_rate']}%)")

# ── MF Details ────────────────────────────────────────────────────────────────
if aa["mutual_funds"]:
    st.subheader("💰 Mutual Fund Holdings")
    for mf in aa["mutual_funds"]:
        c1,c2,c3 = st.columns(3)
        c1.write(f"**{mf['name']}** ({mf['category']})")
        c2.write(f"SIP: ₹{mf['sip_amount']:,}/month")
        c3.write(f"Value: ₹{mf['current_value']:,}")

# ── Stock Holdings ────────────────────────────────────────────────────────────
if aa["stocks"]:
    st.subheader("📈 Stock Holdings")
    for s in aa["stocks"]:
        gain = (s["current_price"] - s["avg_price"]) * s["qty"]
        pct = (s["current_price"]/s["avg_price"] - 1) * 100
        c1,c2,c3 = st.columns(3)
        c1.write(f"**{s['symbol']}** ({s['qty']} shares)")
        c2.write(f"₹{s['avg_price']} → ₹{s['current_price']}")
        c3.metric("P&L", f"₹{gain:,.0f}", f"{pct:+.1f}%")

# ── Trajectory ────────────────────────────────────────────────────────────────
st.subheader(f"🔮 Financial Journey Prediction")
c1,c2 = st.columns([1,3])
with c1:
    st.metric("Current Stage",   f"Stage {traj['current_stage']}: {traj['stage_label']}")
    st.metric("Predicted Next",  f"Stage {traj['next_stage']}: {traj['next_stage_label']}")
    st.metric("Probability",     f"{traj['probability']:.0%}")
    if traj.get("life_event"):
        st.warning(f"⚠️ {traj['life_event']}")
with c2:
    st.progress(traj["probability"], text=f"{traj['probability']:.0%} likely in {traj['days']} days")
    for s in traj["key_signals"]:
        st.write(f"  → {s}")

# ── Upcoming Events ───────────────────────────────────────────────────────────
if aa["upcoming_events"]:
    st.subheader("📅 Upcoming Financial Decisions")
    for ev in aa["upcoming_events"]:
        icon = "🔴" if ev["urgency"]=="high" else "🟡" if ev["urgency"]=="medium" else "🟢"
        st.info(f"{icon} **{ev['type'].replace('_',' ').title()}:** {ev['description']}\n\n*Suggested action: {ev['action']}*")

# ── Post-Article Bridge Demo ─────────────────────────────────────────────────
st.divider()
st.subheader("📰 Post-Article Bridge: What does this mean for YOUR portfolio?")
articles = load_articles()
rbi_article = next((a for a in articles if a["id"] == "rbi001"), None)
if rbi_article:
    st.write(f"**Article:** {rbi_article['title']}")
    st.caption(rbi_article["summary"])
    impacts = get_portfolio_impact(user, rbi_article)
    if impacts:
        for imp in impacts:
            color = {"positive":"🟢","neutral":"🟡","caution":"🟠","review":"🔵"}.get(imp["impact"],"⚪")
            st.write(f"{color} **{imp['asset']}** (₹{imp['value']:,}) — {imp['detail']}")
    else:
        st.info("No direct portfolio impact detected for this article.")
