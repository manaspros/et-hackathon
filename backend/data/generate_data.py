import json, random
from faker import Faker
fake = Faker('en_IN')  # Indian locale — names, banks, etc.
Faker.seed(42)

# ─── 3 DEMO USERS ──────────────────────────────────────────────────────────────
USERS = [
    {
        "id": "priya_001", "name": "Priya Sharma", "age": 26, "city": "Mumbai",
        "stage": 2, "stage_label": "SIP Beginner",
        "aa": {
            "bank_balance": 85000, "monthly_income": 65000, "monthly_expenses": 42000,
            "mutual_funds": [
                {"name": "Axis ELSS Tax Saver", "category": "ELSS",
                 "sip_amount": 1500, "current_value": 8900, "sip_start_months_ago": 5},
                {"name": "Mirae Asset Large Cap", "category": "Large Cap",
                 "sip_amount": 1000, "current_value": 4600, "sip_start_months_ago": 4}
            ],
            "fds": [{"bank": "SBI", "amount": 50000, "rate": 6.8, "maturity_months": 8}],
            "stocks": [], "loans": [],
            "insurance": [{"type": "health", "cover": 500000, "premium": 8500}]
        },
        "reading_history": [
            {"category": "mutual_fund_basics", "count": 12, "avg_depth": 0.78},
            {"category": "sip_calculator",      "count": 6,  "avg_depth": 0.91},
            {"category": "tax_saving",           "count": 4,  "avg_depth": 0.65},
            {"category": "market_news",          "count": 3,  "avg_depth": 0.32}
        ],
        "trajectory": {
            "next_stage": 3, "probability": 0.73, "days": 90,
            "key_signals": ["5 months SIP age", "reads MF basics deeply", "tax saving searches"]
        },
        "is_prime": False,
        "last_active": "2026-03-26",
        "consecutive_days": 3
    },
    {
        "id": "rahul_002", "name": "Rahul Verma", "age": 31, "city": "Bangalore",
        "stage": 3, "stage_label": "Portfolio Builder",
        "aa": {
            "bank_balance": 145000, "monthly_income": 120000, "monthly_expenses": 75000,
            "mutual_funds": [
                {"name": "Parag Parikh Flexi Cap", "category": "Flexi Cap",
                 "sip_amount": 3000, "current_value": 58000, "sip_start_months_ago": 18},
                {"name": "Nifty 50 Index Fund",    "category": "Index",
                 "sip_amount": 2000, "current_value": 39000, "sip_start_months_ago": 17},
                {"name": "HDFC Mid Cap Opp.",       "category": "Mid Cap",
                 "sip_amount": 3000, "current_value": 59000, "sip_start_months_ago": 20}
            ],
            "fds": [], "stocks": [], "loans": [],
            "insurance": [
                {"type": "term",   "cover": 10000000, "premium": 15000},
                {"type": "health", "cover": 1000000,  "premium": 12000}
            ]
        },
        "reading_history": [
            {"category": "market_news",         "count": 22, "avg_depth": 0.81},
            {"category": "stock_screener",       "count": 8,  "avg_depth": 0.76},
            {"category": "pe_ratio_analysis",    "count": 5,  "avg_depth": 0.82},
            {"category": "demat_account_guide",  "count": 3,  "avg_depth": 0.91},
            {"category": "equity_investing",     "count": 4,  "avg_depth": 0.78}
        ],
        "trajectory": {
            "next_stage": 4, "probability": 0.81, "days": 45,
            "key_signals": ["demat search 3x this week", "reads PE ratio deeply",
                            "18 months SIP experience", "stock screener sessions"]
        },
        "is_prime": True,
        "last_active": "2026-03-26",
        "consecutive_days": 7
    },
    {
        "id": "sneha_003", "name": "Sneha Iyer", "age": 35, "city": "Delhi",
        "stage": 5, "stage_label": "Active Investor",
        "aa": {
            "bank_balance": 320000, "monthly_income": 210000, "monthly_expenses": 120000,
            "mutual_funds": [
                {"name": "Mirae Asset Large Cap",       "category": "Large Cap",
                 "sip_amount": 10000, "current_value": 285000, "sip_start_months_ago": 48},
                {"name": "Axis Small Cap",              "category": "Small Cap",
                 "sip_amount": 8000,  "current_value": 198000, "sip_start_months_ago": 46},
                {"name": "ICICI Pru Balanced Advantage", "category": "Balanced",
                 "sip_amount": 7000,  "current_value": 167000, "sip_start_months_ago": 39}
            ],
            "fds": [{"bank": "HDFC", "amount": 200000, "rate": 7.0, "maturity_months": 3}],
            "stocks": [
                {"symbol": "TCS",      "qty": 15, "avg_price": 3200, "current_price": 3580},
                {"symbol": "HDFCBANK", "qty": 30, "avg_price": 1450, "current_price": 1620},
                {"symbol": "INFY",     "qty": 25, "avg_price": 1380, "current_price": 1520},
                {"symbol": "RELIANCE", "qty": 10, "avg_price": 2400, "current_price": 2850}
            ],
            "loans": [{"type": "home_loan", "emi": 35000, "outstanding": 4200000,
                       "bank": "SBI", "remaining_months": 168}],
            "insurance": [
                {"type": "term",   "cover": 20000000, "premium": 22000},
                {"type": "health", "cover": 2000000,  "premium": 18500}
            ]
        },
        "reading_history": [
            {"category": "quarterly_results", "count": 18, "avg_depth": 0.88},
            {"category": "expert_analysis",   "count": 12, "avg_depth": 0.85},
            {"category": "portfolio_review",  "count": 6,  "avg_depth": 0.91},
            {"category": "macro_economics",   "count": 10, "avg_depth": 0.82}
        ],
        "trajectory": {
            "next_stage": 6, "probability": 0.58, "days": 180,
            "key_signals": ["FD maturing in 3 months", "home loan holder", "tax optimization"],
            "life_event": "FD of ₹2L at HDFC maturing in 3 months — reinvestment decision"
        },
        "is_prime": True,
        "last_active": "2026-03-10",
        "consecutive_days": 0
    }
]

# ─── ARTICLES (Jio Financial story arc + stage-mapped content) ─────────────────
ARTICLES = [
    # Stage 2 content
    {"id":"a001","title":"How to choose your first mutual fund in 2026",
     "category":"mutual_fund_basics","stage_target":2,
     "summary":"Beginner guide: choosing MFs based on risk profile and tax goals",
     "entities":["mutual fund","SIP","NAV","ELSS","risk profile"],
     "sentiment":0.65,"date":"2026-03-20"},
    {"id":"a002","title":"ELSS vs PPF: Which gives better returns for tax saving?",
     "category":"tax_saving","stage_target":2,
     "summary":"Comparing ELSS and PPF for 80C deductions with real numbers",
     "entities":["ELSS","PPF","80C","tax saving","returns"],
     "sentiment":0.60,"date":"2026-03-15"},
    {"id":"a003","title":"SIP step-up: How increasing ₹500/month changes your wealth",
     "category":"sip_calculator","stage_target":2,
     "summary":"The power of annual SIP step-up illustrated with compound growth",
     "entities":["SIP","step-up","compound interest","wealth"],
     "sentiment":0.75,"date":"2026-03-10"},
    # Stage 3 content
    {"id":"a010","title":"How to build a multi-fund portfolio — the 3-fund strategy",
     "category":"portfolio_building","stage_target":3,
     "summary":"Diversify across large-cap, mid-cap, debt for risk-adjusted returns",
     "entities":["portfolio","large-cap","mid-cap","diversification","debt fund"],
     "sentiment":0.70,"date":"2026-03-22"},
    {"id":"a011","title":"When should you review your mutual fund portfolio?",
     "category":"portfolio_review","stage_target":3,
     "summary":"Annual review checklist: performance, overlap, rebalancing triggers",
     "entities":["portfolio review","rebalancing","fund overlap","XIRR"],
     "sentiment":0.68,"date":"2026-03-18"},
    # Stage 4 content (anticipatory for Stage 3 users)
    {"id":"a020","title":"Equity investing for mutual fund investors — the natural next step",
     "category":"equity_basics","stage_target":4,
     "summary":"When and how MF investors should consider direct equity stocks",
     "entities":["demat","equity","fundamental analysis","P/E ratio","blue-chip"],
     "sentiment":0.65,"date":"2026-03-18"},
    {"id":"a021","title":"How to open a demat account: step-by-step guide 2026",
     "category":"demat_account_guide","stage_target":4,
     "summary":"Complete guide to opening demat with CDSL/NSDL, charges explained",
     "entities":["demat","CDSL","NSDL","brokerage","KYC"],
     "sentiment":0.70,"date":"2026-03-14"},
    {"id":"a022","title":"P/E ratio explained: how to judge if a stock is cheap or expensive",
     "category":"pe_ratio_analysis","stage_target":4,
     "summary":"Understanding P/E, PEG, and EV/EBITDA for stock valuation",
     "entities":["P/E ratio","valuation","stock analysis","PEG","EV/EBITDA"],
     "sentiment":0.72,"date":"2026-03-12"},
    # Stage 5 content
    {"id":"a030","title":"How to analyse quarterly results like a fund manager",
     "category":"quarterly_results","stage_target":5,
     "summary":"Breaking down PAT, revenue growth, margins, guidance in Q3 results",
     "entities":["quarterly results","PAT","revenue","margins","guidance","analyst"],
     "sentiment":0.74,"date":"2026-03-25"},
    # RBI article (for paywall demo — Rahul reads 4 HDFC articles)
    {"id":"rbi001","title":"RBI cuts repo rate by 25 bps — third cut in 6 months",
     "category":"rbi_policy","stage_target":3,
     "summary":"RBI MPC votes 4-2 to cut repo rate to 6.0%, cites easing inflation",
     "entities":["RBI","repo rate","MPC","inflation","debt fund","FD","home loan"],
     "sentiment":0.70,"date":"2026-03-25"},
    # HDFC Bank series (for paywall intent demo)
    {"id":"hdfc001","title":"HDFC Bank Q4 2026: Net profit up 18%, NIM holds steady",
     "category":"quarterly_results","stage_target":4,
     "summary":"HDFC Bank posts ₹16,512 Cr PAT, loan growth 15% YoY",
     "entities":["HDFC Bank","Q4","profit","NIM","loan growth"],
     "sentiment":0.75,"date":"2026-03-20"},
    {"id":"hdfc002","title":"HDFC Bank vs Kotak Mahindra: which is the better buy now?",
     "category":"stock_screener","stage_target":4,
     "summary":"Valuation comparison: HDFC at 2.8x P/B vs Kotak at 3.2x P/B",
     "entities":["HDFC Bank","Kotak","valuation","P/B ratio","comparison"],
     "sentiment":0.65,"date":"2026-03-19"},
    {"id":"hdfc003","title":"HDFC Bank's loan growth strategy under new MD Sashidhar Jagdishan",
     "category":"expert_analysis","stage_target":5,
     "summary":"CEO interview: retail vs corporate loan mix, rural expansion",
     "entities":["HDFC Bank","Jagdishan","loan strategy","retail","rural"],
     "sentiment":0.78,"date":"2026-03-18"},
    {"id":"hdfc004","title":"HDFC Bank net interest margin outlook for FY27 — analyst consensus",
     "category":"expert_analysis","stage_target":5,
     "summary":"5 brokerages weigh in on NIM compression risk for HDFC Bank",
     "entities":["HDFC Bank","NIM","FY27","analyst","Motilal Oswal","Kotak Securities"],
     "sentiment":0.62,"date":"2026-03-17"},
    # Jio Financial story arc (for Story Arc Tracker demo)
    {"id":"jf001","title":"Reliance announces demerger of financial services arm",
     "company":"Jio Financial","category":"corporate_news","stage_target":4,
     "summary":"Reliance Industries to spin off Jio Financial as independent entity",
     "entities":["Reliance","Jio Financial","NBFC","Mukesh Ambani","demerger","BSE"],
     "sentiment":0.75,"date":"2022-10-27"},
    {"id":"jf002","title":"Jio Financial gets NBFC-ICC licence from RBI",
     "company":"Jio Financial","category":"regulatory_news","stage_target":4,
     "summary":"RBI grants NBFC-Investment and Credit Company status",
     "entities":["Jio Financial","RBI","NBFC","licence","financial services","regulatory"],
     "sentiment":0.82,"date":"2023-03-15"},
    {"id":"jf003","title":"Jio Financial lists at ₹262 — below grey market premium",
     "company":"Jio Financial","category":"market_news","stage_target":4,
     "summary":"Stock debuts tepidly but analysts bullish on long-term digital finance story",
     "entities":["Jio Financial","BSE","NSE","listing","analysts","grey market"],
     "sentiment":0.58,"date":"2023-08-21"},
    {"id":"jf004","title":"Jio Financial and BlackRock launch asset management JV",
     "company":"Jio Financial","category":"business_news","stage_target":5,
     "summary":"JV to target India's ₹50 lakh crore MF market with digital-first approach",
     "entities":["Jio Financial","BlackRock","mutual fund","JV","SEBI","digital"],
     "sentiment":0.88,"date":"2024-07-10"},
    {"id":"jf005","title":"Jio Financial enters home loan market — threat to HDFC Bank?",
     "company":"Jio Financial","category":"competitive_analysis","stage_target":5,
     "summary":"Digital home loans at 8.4% — analysts assess disruption risk to incumbents",
     "entities":["Jio Financial","home loan","HDFC Bank","SBI","disruption","digital lending"],
     "sentiment":0.70,"date":"2025-04-22"},
    {"id":"jf006","title":"Jio Financial Q3 FY26: profit up 6%, digital lending crosses ₹5,000 Cr",
     "company":"Jio Financial","category":"quarterly_results","stage_target":5,
     "summary":"Quarterly results show profitable growth; digital loan book expanding",
     "entities":["Jio Financial","Q3","profit","digital lending","AUM","growth"],
     "sentiment":0.68,"date":"2026-01-20"},
]

if __name__ == "__main__":
    import os
    os.makedirs("backend/data", exist_ok=True)
    with open("backend/data/users.json","w") as f:
        json.dump(USERS, f, indent=2)
    with open("backend/data/articles.json","w") as f:
        json.dump(ARTICLES, f, indent=2)
    print(f"Generated {len(USERS)} users and {len(ARTICLES)} articles")
