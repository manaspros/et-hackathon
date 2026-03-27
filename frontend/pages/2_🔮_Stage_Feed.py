import streamlit as st, sys, json
sys.path.insert(0,".")
from backend.layers.layer1_aa import load_articles, load_users
from backend.layers.layer3_trajectory import get_stage_aware_feed, get_stage_and_trajectory

st.title("🔮 Stage-Aware Personalised Feed")
st.caption("Left: what every other app shows. Right: what My ET shows.")

user     = st.session_state.get("user")
if not user: st.warning("Select a persona in the sidebar"); st.stop()
articles = load_articles()
feed     = get_stage_aware_feed(user, articles)
traj     = feed["trajectory"]

st.info(f"**{user['name']}** is Stage {traj['current_stage']} ({traj['stage_label']}) "
        f"→ **{traj['probability']:.0%}** chance of reaching Stage {traj['next_stage']} "
        f"({traj['next_stage_label']}) in **{traj['days']} days**")

if traj.get("prime_upsell_ready"):
    st.success(f"💡 ET Prime trigger ready: *\"{traj.get('prime_upsell','')}\"*")

col1, col2 = st.columns(2)
with col1:
    st.subheader("❌ Reactive Feed (Every Other App)")
    st.caption("Shows more of what you already read")
    for a in feed["reactive_feed"]:
        with st.container(border=True):
            st.write(f"**{a['title']}**")
            st.caption(f"Stage {a['stage_target']} content · {a['date']}")

with col2:
    st.subheader("✅ My ET Feed (Anticipatory)")
    st.caption(f"*\"{feed['hook']}\"*")
    for a in feed["anticipatory_feed"]:
        with st.container(border=True):
            is_next = a.get("stage_target",0) == traj["current_stage"]+1
            if is_next:
                st.write(f"🔮 **{a['title']}**")
                st.caption(f"Preparing you for Stage {a['stage_target']} · {a['date']}")
            else:
                st.write(f"**{a['title']}**")
                st.caption(f"Stage {a['stage_target']} content · {a['date']}")
