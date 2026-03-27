export const USERS = {
  priya: {
    id: "priya_001", name: "Priya", age: 26, city: "Mumbai",
    stage: 2, stageLabel: "SIP Beginner",
    trajectory: { nextStage: 3, nextLabel: "Portfolio Builder", prob: 0.73, days: 90,
      keySignals: ["5 months SIP age", "reads MF basics deeply", "tax saving searches"] },
    aa: {
      netWorth: 148100, mfValue: 13500, cashValue: 85000, fdValue: 50000,
      funds: [
        { name: "Axis ELSS Tax Saver", value: 8900, sip: 1500, category: "ELSS" },
        { name: "Mirae Asset Large Cap", value: 4600, sip: 1000, category: "Large Cap" }
      ],
      fds: [{ bank: "SBI", amount: 50000, rate: 6.8, months: 8 }],
      stocks: [], loans: [],
      events: []
    },
    readingHistory: [
      { category: "mutual_fund_basics", count: 12, depth: 0.78 },
      { category: "sip_calculator", count: 6, depth: 0.91 },
      { category: "tax_saving", count: 4, depth: 0.65 }
    ],
    isPrime: false, lastActive: "2026-03-26", consecutiveDays: 3,
    paywallThreshold: 72,
    paywallOffer: {
      headline: "You're clearly planning your next investment move.",
      sub: "ET Prime has everything a growing investor like you needs — free for 7 days.",
      cta: "Start reading for free →", urgency: "low"
    }
  },
  rahul: {
    id: "rahul_002", name: "Rahul", age: 31, city: "Bangalore",
    stage: 3, stageLabel: "Portfolio Builder",
    trajectory: { nextStage: 4, nextLabel: "Equity Explorer", prob: 0.81, days: 45,
      keySignals: ["demat search 3× this week", "reads PE ratio deeply", "18 months SIP"] },
    aa: {
      netWorth: 984000, mfValue: 156000, cashValue: 145000, fdValue: 0,
      funds: [
        { name: "Parag Parikh Flexi Cap", value: 58000, sip: 3000, category: "Flexi Cap" },
        { name: "Nifty 50 Index Fund", value: 39000, sip: 2000, category: "Index" },
        { name: "HDFC Mid Cap Opp.", value: 59000, sip: 3000, category: "Mid Cap" }
      ],
      fds: [], stocks: [], loans: [],
      events: []
    },
    readingHistory: [
      { category: "market_news", count: 22, depth: 0.81 },
      { category: "stock_screener", count: 8, depth: 0.76 },
      { category: "pe_ratio_analysis", count: 5, depth: 0.82 },
      { category: "demat_account_guide", count: 3, depth: 0.91 }
    ],
    isPrime: true, lastActive: "2026-03-26", consecutiveDays: 7,
    paywallThreshold: 68,
    paywallOffer: {
      headline: "You're clearly doing serious research on this.",
      sub: "ET Prime analysts have already done this work. 3 reports, 0 minutes of legwork.",
      cta: "Read the analyst verdict →", urgency: "medium"
    }
  },
  sneha: {
    id: "sneha_003", name: "Sneha", age: 35, city: "Delhi",
    stage: 5, stageLabel: "Active Investor",
    trajectory: { nextStage: 6, nextLabel: "Sophisticated Planner", prob: 0.58, days: 180,
      keySignals: ["FD maturing in 3 months", "home loan holder", "tax optimization"],
      lifeEvent: "FD of ₹2L at HDFC matures in 3 months" },
    aa: {
      netWorth: 2145000, mfValue: 650000, cashValue: 320000, fdValue: 200000,
      funds: [
        { name: "Mirae Asset Large Cap", value: 285000, sip: 10000, category: "Large Cap" },
        { name: "Axis Small Cap", value: 198000, sip: 8000, category: "Small Cap" },
        { name: "ICICI Pru Balanced", value: 167000, sip: 7000, category: "Balanced" }
      ],
      fds: [{ bank: "HDFC", amount: 200000, rate: 7.0, months: 3 }],
      stocks: [
        { symbol: "TCS", qty: 15, price: 3580, value: 53700 },
        { symbol: "HDFCBANK", qty: 30, price: 1620, value: 48600 },
        { symbol: "INFY", qty: 25, price: 1520, value: 38000 },
        { symbol: "RELIANCE", qty: 10, price: 2850, value: 28500 }
      ],
      loans: [{ type: "home_loan", emi: 35000, outstanding: 4200000, bank: "SBI" }],
      events: [{ type: "FD Maturity", urgency: "high",
        desc: "₹2,00,000 FD at HDFC matures in 3 months",
        action: "Consider liquid fund (7.5% yield) vs new FD (6.8%)" }]
    },
    readingHistory: [
      { category: "quarterly_results", count: 18, depth: 0.88 },
      { category: "expert_analysis", count: 12, depth: 0.85 },
      { category: "portfolio_review", count: 6, depth: 0.91 }
    ],
    isPrime: true, lastActive: "2026-03-10", consecutiveDays: 0,
    paywallThreshold: 60,
    paywallOffer: {
      headline: "Your ₹21.45L portfolio is directly affected by what you just read.",
      sub: "ET Prime tells you exactly what analysts recommend — and when to act.",
      cta: "See what analysts recommend →", urgency: "high"
    }
  }
}
