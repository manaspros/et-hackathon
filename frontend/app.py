import streamlit as st, sys, json
sys.path.insert(0, ".")   # so backend imports work
from backend.layers.layer1_aa import load_users, get_aa_summary
from backend.layers.layer3_trajectory import get_stage_and_trajectory

st.set_page_config(page_title="My ET", page_icon="📊", layout="wide")

# ── Sidebar — Persona Switcher ────────────────────────────────────────────────
PERSONAS = {
    "Priya — Stage 2 (SIP Beginner)":       "priya_001",
    "Rahul — Stage 3 (Portfolio Builder)":  "rahul_002",
    "Sneha — Stage 5 (Active + Dark Sub)":  "sneha_003",
}
with st.sidebar:
    st.title("👤 Demo Persona")
    persona    = st.radio("Select:", list(PERSONAS.keys()))
    user_id    = PERSONAS[persona]
    users      = load_users()
    user       = next(u for u in users if u["id"] == user_id)
    st.session_state["user"]     = user
    st.session_state["user_id"]  = user_id
    if "events" not in st.session_state:
        st.session_state["events"] = []
    st.divider()
    st.caption("Navigate using the pages above ↑")

# ── Hero metrics ──────────────────────────────────────────────────────────────
st.title("📊 My ET — Financial Life Newsroom")
st.caption("The news experience that knows where your financial life is going")

c1,c2,c3,c4 = st.columns(4)
c1.metric("Moneycontrol Gap",  "5.2×",       help="Time-spent vs ET — Comscore Jan 2026")
c2.metric("Unrealised Revenue","₹825 Cr",    help="At 5% conversion vs current 1.7%")
c3.metric("Dark Sub Risk",     "₹38 Cr/yr",  help="30% of ~500K Prime subs are inactive")
c4.metric("FT Paywall Benchmark","+92%",     help="FT's AI paywall conversion lift")
st.divider()

# ── AA Profile ────────────────────────────────────────────────────────────────
aa   = get_aa_summary(user)
traj = get_stage_and_trajectory(user)

st.subheader(f"👋 {user['name']}'s Account Aggregator Profile")
st.caption("One consent tap — complete financial X-ray")

c1,c2,c3,c4 = st.columns(4)
c1.metric("Net Worth",      f"₹{aa['net_worth']:,.0f}")
c2.metric("MF Portfolio",   f"₹{aa['mf_value']:,.0f}")
c3.metric("Stocks",         f"₹{aa['stock_value']:,.0f}")
c4.metric("Monthly Savings",f"₹{aa['monthly_savings']:,.0f} ({aa['savings_rate']}%)")

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
