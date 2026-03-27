import streamlit as st, sys
sys.path.insert(0,".")
from backend.layers.layer1_aa import load_users, load_articles
from backend.layers.layer6_dark_sub import get_dark_subscribers, find_best_article, winback_sequence
from backend.utils.models import get_embedder

st.title("💤 Dark Subscriber Reactivation")
st.caption("Find dormant Prime subscribers. Send the one article that brings them back.")

users    = load_users()
articles = load_articles()
embedder = get_embedder()
dark     = get_dark_subscribers(users)

c1,c2,c3 = st.columns(3)
c1.metric("Dark Subscribers",     len(dark),
          help="Prime members inactive 14+ days")
c2.metric("Monthly Rev at Risk",  f"₹{len(dark)*2549//12:,}",
          delta="per month if they churn")
c3.metric("Annual Rev at Risk",   f"₹{len(dark)*2549:,}",
          delta="if all lapse at renewal")

st.caption("**Industry benchmark:** FT cancellation retention improved +100% with AI-personalised win-back")
st.divider()

for u in dark:
    with st.expander(f"😴 {u['name']} — {u['days_inactive']} days inactive | Stage {u['stage']}"):
        col1, col2 = st.columns(2)
        with col1:
            st.write(f"**Stage:** {u['stage_label']}")
            st.write(f"**Last active:** {u['last_active']}")
            st.write(f"**Top interest:** {u['reading_history'][0]['category'].replace('_',' ').title()}")
        with col2:
            with st.spinner("Finding best re-engagement article..."):
                best = find_best_article(u, articles, embedder)
            st.success(f"**Best article:** {best['article']['title']}\n\n"
                       f"Match: {best['score']:.0%} | {best['reason']}")

        st.write("**Win-back sequence:**")
        for step in winback_sequence(u, best["article"]):
            col1,col2 = st.columns([1,4])
            col1.write(f"Day {step['day']}\n{step['channel']}")
            col2.write(f"*\"{step['message']}\"*\n\n_{step['why']}_")
