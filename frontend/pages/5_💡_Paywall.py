import streamlit as st, sys, time
sys.path.insert(0,".")
from backend.layers.layer7_paywall import detect_intent
from backend.layers.layer3_trajectory import get_stage_and_trajectory

st.title("💡 Paywall Intelligence Engine")
st.caption("FT got +92% conversion with AI paywall. ET has zero propensity model. We built one.")

col1,col2 = st.columns(2)
col1.metric("FT AI Paywall",    "+92% conversion", delta="industry benchmark")
col2.metric("ET Current Model", "Article count trigger", delta="no intent detection")
st.divider()

user = st.session_state.get("user")
if not user: st.warning("Select a persona in the sidebar"); st.stop()

traj = get_stage_and_trajectory(user)
st.session_state.setdefault("events",[])

st.subheader(f"Simulating {user['name']}'s reading session")
HDFC_ARTICLES = [
    "HDFC Bank Q4: Net profit up 18%",
    "HDFC Bank vs Kotak: which is the better buy?",
    "HDFC Bank loan growth strategy — analyst view",
    "HDFC Bank NIM outlook FY27 — analyst consensus",
]

col1, col2 = st.columns(2)
with col1:
    st.write("**Reading session:**")
    read_count = len([e for e in st.session_state["events"]
                      if e.get("category")=="quarterly_results"])
    for i, art in enumerate(HDFC_ARTICLES[:read_count]):
        st.write(f"✅ **Article {i+1}:** {art}")
    if read_count < 4:
        if st.button(f"📰 Read: {HDFC_ARTICLES[read_count]}"):
            st.session_state["events"].append({
                "category":"quarterly_results","depth":0.87,"ts":time.time()
            })
            st.rerun()

with col2:
    st.write("**Intent detection:**")
    result = detect_intent(st.session_state["events"], {**user,"trajectory":traj})
    if result.get("show"):
        st.error(f"🚨 Intent: **{result['intent']['type'].replace('_',' ').title()}**\n\n"
                 f"Confidence: {result['intent']['confidence']:.0%}\n\n"
                 f"Signal: {result['intent']['trigger']}")
        st.divider()
        st.subheader("Paywall Comparison")
        c1,c2 = st.columns(2)
        c1.error(f"❌ **Generic (current ET)**\n\n\"{result['generic']}\"")
        c2.success(f"✅ **PeakMoment AI**\n\n\"{result['offer']['headline']}\"\n\n"
                   f"_{result['offer']['sub']}_\n\n**{result['offer']['cta']}**")
        st.caption(result["lift_claim"])
    else:
        articles_read = len([e for e in st.session_state["events"] if e.get("category")])
        st.info(f"Reading {articles_read}/4 articles — monitoring intent...")
        st.progress(articles_read/4)
