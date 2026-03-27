import numpy as np
import json

STAGES = {0:"Non-Investor",1:"Cautious Saver",2:"SIP Beginner",
          3:"Portfolio Builder",4:"Equity Explorer",5:"Active Investor",
          6:"Sophisticated Planner",7:"Wealth Manager"}

# Content categories to show for NEXT stage (anticipatory)
NEXT_STAGE_CONTENT = {
    2: {
        "categories":["portfolio_building","equity_basics","sip_calculator"],
        "hook":"Your SIP is growing — here's what serious investors do next",
        "prime_upsell":"Get deeper analysis as you level up"
    },
    3: {
        "categories":["equity_basics","demat_account_guide","pe_ratio_analysis","stock_screener"],
        "hook":"Ready for direct equity? Start with these fundamentals",
        "prime_upsell":"ET Prime has exclusive equity research for first-time investors"
    },
    4: {
        "categories":["quarterly_results","portfolio_review","expert_analysis"],
        "hook":"Build your research process like a professional investor",
        "prime_upsell":"ET Prime: where serious investors get their edge"
    },
    5: {
        "categories":["tax_optimization","rebalancing","macro_economics"],
        "hook":"Your portfolio is substantial — now protect and optimise it",
        "prime_upsell":"ET Prime Annual: your financial co-pilot for the long game"
    }
}

def get_stage_and_trajectory(user: dict) -> dict:
    """Main function — returns stage, trajectory, and anticipatory content plan"""
    stage = user["stage"]
    traj  = user.get("trajectory", {})
    return {
        "current_stage":      stage,
        "stage_label":        STAGES[stage],
        "next_stage":         traj.get("next_stage", stage),
        "next_stage_label":   STAGES.get(traj.get("next_stage", stage), ""),
        "probability":        traj.get("probability", 0.5),
        "days":               traj.get("days", 90),
        "key_signals":        traj.get("key_signals", []),
        "life_event":         traj.get("life_event"),
        "anticipatory":       NEXT_STAGE_CONTENT.get(stage, {}),
        "prime_upsell_ready": traj.get("probability", 0) > 0.7
    }

def get_stage_aware_feed(user: dict, articles: list) -> dict:
    """
    Returns reactive_feed (what everyone else shows) vs
    anticipatory_feed (what My ET shows — next-stage content mixed in).
    Side-by-side is the demo money shot.
    """
    stage = user["stage"]
    traj  = get_stage_and_trajectory(user)
    next_cats = traj["anticipatory"].get("categories", [])

    reactive = [a for a in articles if a.get("stage_target") == stage][:5]

    current_arts = [a for a in articles if a.get("stage_target") == stage][:3]
    next_arts    = [a for a in articles
                    if a.get("category") in next_cats
                    and a.get("stage_target") == stage+1][:2]

    return {
        "reactive_feed":      reactive,
        "anticipatory_feed":  current_arts + next_arts,
        "trajectory":         traj,
        "hook":               traj["anticipatory"].get("hook", ""),
        "prime_upsell":       traj["anticipatory"].get("prime_upsell", ""),
    }
