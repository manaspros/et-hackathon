import json
from pathlib import Path

def load_users():
    with open(Path(__file__).parent.parent / "data/users.json") as f:
        return json.load(f)

def load_articles():
    with open(Path(__file__).parent.parent / "data/articles.json") as f:
        return json.load(f)

def get_user(user_id: str) -> dict:
    return next((u for u in load_users() if u["id"] == user_id), None)

def get_aa_summary(user: dict) -> dict:
    aa = user["aa"]
    mf_val  = sum(f["current_value"] for f in aa["mutual_funds"])
    stk_val = sum(s["qty"] * s["current_price"] for s in aa.get("stocks", []))
    fd_val  = sum(f["amount"] for f in aa.get("fds", []))
    return {
        "net_worth":      aa["bank_balance"] + mf_val + stk_val + fd_val,
        "bank_balance":   aa["bank_balance"],
        "mf_value":       mf_val,
        "stock_value":    stk_val,
        "fd_value":       fd_val,
        "monthly_income": aa["monthly_income"],
        "monthly_savings":aa["monthly_income"] - aa["monthly_expenses"],
        "savings_rate":   round((aa["monthly_income"]-aa["monthly_expenses"])/aa["monthly_income"]*100,1),
        "mutual_funds":   aa["mutual_funds"],
        "stocks":         aa.get("stocks", []),
        "fds":            aa.get("fds", []),
        "upcoming_events": _upcoming_events(aa)
    }

def _upcoming_events(aa: dict) -> list:
    events = []
    for fd in aa.get("fds", []):
        if fd["maturity_months"] <= 4:
            events.append({
                "type": "fd_maturity", "urgency": "high" if fd["maturity_months"]<=2 else "medium",
                "description": f"FD of ₹{fd['amount']:,} at {fd['bank']} matures in {fd['maturity_months']} months",
                "action": "Review reinvestment: liquid fund (7.5%) vs new FD (6.8%)"
            })
    for loan in aa.get("loans", []):
        if loan.get("type") == "home_loan":
            events.append({
                "type": "home_loan", "urgency": "low",
                "description": f"Home loan EMI ₹{loan['emi']:,}/month at {loan['bank']}",
                "action": "Check if refinancing saves money — rates dropped 0.5% this year"
            })
    return events

def get_portfolio_impact(user: dict, article: dict) -> list:
    """For post-article bridge: what does this article mean for THIS user's portfolio?"""
    aa    = user["aa"]
    ents  = [e.lower() for e in article.get("entities", [])]
    impacts = []
    for fund in aa["mutual_funds"]:
        if "debt fund" in ents or "repo rate" in ents:
            if fund["category"] in ["Balanced","Debt","ELSS"]:
                impacts.append({
                    "asset": fund["name"], "value": fund["current_value"],
                    "impact": "positive",
                    "detail": "Rate cut → NAV likely ↑ 0.3–0.5% over 30 days"
                })
        if "repo rate" in ents and fund["category"] in ["Large Cap","Flexi Cap","Index"]:
            impacts.append({
                "asset": fund["name"], "value": fund["current_value"],
                "impact": "neutral",
                "detail": "Rate cuts are mildly positive for equities — banking sector benefits most"
            })
    for fd in aa.get("fds", []):
        if "repo rate" in ents or "rbi" in ents:
            impacts.append({
                "asset": f"FD at {fd['bank']}", "value": fd["amount"],
                "impact": "caution",
                "detail": f"New FD rates will drop ~0.25%. Your rate {fd['rate']}% is locked — consider early renewal before next cut."
            })
    for stock in aa.get("stocks", []):
        if stock["symbol"].lower() in ents or stock["symbol"].lower().replace(" ","") in " ".join(ents):
            impacts.append({
                "asset": f"{stock['symbol']} ({stock['qty']} shares @ ₹{stock['current_price']})",
                "value": stock["qty"]*stock["current_price"],
                "impact": "review",
                "detail": f"This article directly covers {stock['symbol']} — read full analysis"
            })
    return impacts
