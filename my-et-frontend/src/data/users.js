export const USERS = {
  priya: {
    id: "priya_001", name: "Priya", stage: 2, stageLabel: "SIP Beginner",
    trajectory: { nextStage: 3, nextLabel: "Portfolio Builder", prob: 0.73, days: 90 },
    aa: {
      netWorth: 148100, mfValue: 13500, cashValue: 85000, fdValue: 50000,
      funds: [
        { name: "Axis ELSS Tax Saver", value: 8900, sip: 1500 },
        { name: "Mirae Asset Large Cap", value: 4600, sip: 1000 }
      ],
      fds: [{ bank: "SBI", amount: 50000, months: 8 }],
      events: []
    }
  },
  rahul: {
    id: "rahul_002", name: "Rahul", stage: 3, stageLabel: "Portfolio Builder",
    trajectory: { nextStage: 4, nextLabel: "Equity Explorer", prob: 0.81, days: 45 },
    aa: {
      netWorth: 984000, mfValue: 156000, cashValue: 145000, fdValue: 0,
      funds: [
        { name: "Parag Parikh Flexi Cap", value: 58000, sip: 3000 },
        { name: "Nifty 50 Index Fund",    value: 39000, sip: 2000 },
        { name: "HDFC Mid Cap Opp.",       value: 59000, sip: 3000 }
      ],
      fds: [],
      events: []
    }
  },
  sneha: {
    id: "sneha_003", name: "Sneha", stage: 5, stageLabel: "Active Investor",
    trajectory: { nextStage: 6, nextLabel: "Sophisticated Planner", prob: 0.58, days: 180,
                  lifeEvent: "FD of ₹2L at HDFC matures in 3 months" },
    aa: {
      netWorth: 2145000, mfValue: 650000, cashValue: 320000, fdValue: 200000,
      stocks: [
        { symbol: "TCS",      qty: 15, price: 3580, value: 53700 },
        { symbol: "HDFCBANK", qty: 30, price: 1620, value: 48600 },
        { symbol: "INFY",     qty: 25, price: 1520, value: 38000 },
        { symbol: "RELIANCE", qty: 10, price: 2850, value: 28500 }
      ],
      funds: [
        { name: "Mirae Asset Large Cap", value: 285000, sip: 10000 },
        { name: "Axis Small Cap",         value: 198000, sip: 8000 },
        { name: "ICICI Pru Balanced",     value: 167000, sip: 7000 }
      ],
      fds: [{ bank: "HDFC", amount: 200000, months: 3 }],
      events: [{ type: "FD Maturity", urgency: "high",
                 desc: "₹2,00,000 FD at HDFC matures in 3 months",
                 action: "Consider liquid fund — earning 7.5% vs FD's 7.0%" }]
    }
  }
}
