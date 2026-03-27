export const ARTICLES = {
  regular: [
    { id: "rbi001", title: "RBI cuts repo rate by 25 bps — third cut in 6 months",
      category: "Policy", time: "1 hour ago", stage: 3,
      summary: "MPC votes 4-2 to cut rate to 6.0%, cites easing inflation",
      entities: ["RBI","repo rate","debt fund","FD","home loan"],
      portfolioTags: {
        sneha_003: "Affects your HDFC FD + 3 debt funds",
        rahul_002: "Affects your balanced MF allocation",
        priya_001: null
      },
      img: "https://placehold.co/80x60/003b7a/white?text=RBI",
      hasFullArticle: true, fullArticleId: "rbi001"
    },
    { id: "hdfc001", title: "HDFC Bank Q4: Net profit up 18%, NIM steady at 3.46%",
      category: "Earnings", time: "2 hours ago", stage: 4,
      summary: "Strong retail loan growth; asset quality improves to 1.24% GNPA",
      entities: ["HDFC Bank","Q4","profit","NIM","HDFCBANK"],
      portfolioTags: { sneha_003: "HDFCBANK in your portfolio — 30 shares", rahul_002: null, priya_001: null },
      img: "https://placehold.co/80x60/ff6600/white?text=HDFC",
      hasFullArticle: true, fullArticleId: "hdfc001"
    },
    { id: "sens001", title: "Sensex falls 800 points — IT, banking stocks drag index",
      category: "Markets", time: "3 hours ago", stage: 3,
      summary: "Weak US jobs data triggers sell-off; TCS, Infosys lead decline",
      entities: ["Sensex","TCS","INFY","IT sector"],
      portfolioTags: { sneha_003: "TCS + INFY in your portfolio — ₹91,700 affected", rahul_002: null, priya_001: null },
      img: "https://placehold.co/80x60/cc0000/white?text=MARKET",
      hasFullArticle: false
    },
    { id: "jio001", title: "Jio Financial enters home loans at 8.4% — threat to SBI, HDFC?",
      category: "Banking", time: "5 hours ago", stage: 4,
      summary: "Digital home loans disrupt ₹25L crore market; analysts divided",
      entities: ["Jio Financial","home loan","SBI","HDFC Bank","disruption"],
      portfolioTags: { sneha_003: "You have SBI home loan — refinancing signal", rahul_002: null, priya_001: null },
      img: "https://placehold.co/80x60/6600cc/white?text=JIO",
      hasFullArticle: true, fullArticleId: "jf003"
    },
    { id: "budget001", title: "Budget 2026: Capital gains tax unchanged — markets cheer",
      category: "Budget", time: "6 hours ago", stage: 3,
      summary: "LTCG at 12.5%, STCG at 20%; indexation benefit restored for real estate",
      entities: ["Budget","LTCG","STCG","capital gains","equity"],
      portfolioTags: { sneha_003: "Your equity gains: LTCG applies — review harvest timing", rahul_002: null, priya_001: null },
      img: "https://placehold.co/80x60/003b7a/white?text=BUDGET",
      hasFullArticle: false
    },
  ],

  anticipatory: {
    2: [
      { id: "a201", title: "When your SIP is ready — how to build a multi-fund portfolio",
        category: "Investing", time: "For you today", stage: 3,
        tag: "Preparing you for Stage 3", tagColor: "blue",
        img: "https://placehold.co/80x60/0066cc/white?text=NEXT",
        hasFullArticle: false
      },
      { id: "a202", title: "SIP step-up: How ₹500 more per month changes your wealth",
        category: "SIP", time: "Based on your history", stage: 3,
        tag: "You've been investing 5 months — perfect timing", tagColor: "blue",
        img: "https://placehold.co/80x60/0066cc/white?text=STEPUP",
        hasFullArticle: false
      },
    ],
    3: [
      { id: "a301", title: "Equity investing for MF investors — the natural next step",
        category: "Equity", time: "For you today", stage: 4,
        tag: "Preparing you for Stage 4 (81% likely in 45 days)", tagColor: "purple",
        img: "https://placehold.co/80x60/6600cc/white?text=EQUITY",
        hasFullArticle: false
      },
      { id: "a302", title: "How to open a demat account: complete guide 2026",
        category: "Getting Started", time: "You searched this 3x this week", stage: 4,
        tag: "You've searched 'demat' 3 times this week", tagColor: "purple",
        img: "https://placehold.co/80x60/6600cc/white?text=DEMAT",
        hasFullArticle: false
      },
    ],
    5: [
      { id: "a501", title: "FD maturity: liquid fund vs new FD — which wins in 2026?",
        category: "Debt", time: "Urgent for you", stage: 6,
        tag: "Your HDFC FD matures in 3 months", tagColor: "orange",
        img: "https://placehold.co/80x60/cc6600/white?text=FD",
        hasFullArticle: false
      },
      { id: "a502", title: "Home loan prepayment vs equity investment — the 2026 numbers",
        category: "Wealth", time: "Based on your profile", stage: 6,
        tag: "You have a ₹42L home loan — this is relevant", tagColor: "orange",
        img: "https://placehold.co/80x60/cc6600/white?text=LOAN",
        hasFullArticle: false
      },
    ]
  }
}
