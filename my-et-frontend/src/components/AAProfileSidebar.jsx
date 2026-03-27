export default function AAProfileSidebar({ user }) {
  const { aa, trajectory, stage, stageLabel } = user
  const pct = Math.round(trajectory.prob * 100)
  const stageNames = ["","Saver","SIP","Portfolio","Equity","Active","Expert","Wealth"]

  return (
    <div className="space-y-4">
      {/* Net Worth Card */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wide">
            Your Portfolio (AA)
          </h3>
          <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
            ✓ Connected
          </span>
        </div>

        <div className="text-2xl font-bold text-[#003b7a] mb-4">
          ₹{aa.netWorth.toLocaleString('en-IN')}
        </div>

        {[
          { label: "Mutual Funds", value: aa.mfValue, color: "bg-blue-500" },
          { label: "Cash & Bank",  value: aa.cashValue, color: "bg-green-500" },
          ...(aa.fdValue > 0 ? [{ label: "Fixed Deposits", value: aa.fdValue, color: "bg-yellow-400" }] : []),
          ...(aa.stocks?.length > 0 ? [{
            label: "Stocks",
            value: aa.stocks.reduce((s,x) => s + x.value, 0),
            color: "bg-purple-500"
          }] : [])
        ].map(item => (
          <div key={item.label} className="mb-2.5">
            <div className="flex justify-between text-xs text-gray-600 mb-1">
              <span>{item.label}</span>
              <span className="font-medium">₹{item.value.toLocaleString('en-IN')}</span>
            </div>
            <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div className={`h-full rounded-full transition-all ${item.color}`}
                   style={{ width: `${Math.round(item.value / aa.netWorth * 100)}%` }} />
            </div>
          </div>
        ))}
      </div>

      {/* Journey Stage */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">
          Your Financial Journey
        </h3>

        <div className="flex flex-wrap gap-1 mb-3">
          {stageNames.slice(1).map((s, i) => {
            const stageNum = i + 1
            return (
              <span key={s} className={`text-[10px] px-2 py-0.5 rounded-full font-medium
                ${stageNum === stage   ? 'bg-[#003b7a] text-white' :
                  stageNum < stage     ? 'bg-gray-300 text-gray-600' :
                                         'bg-gray-100 text-gray-400'}`}>
                {s}
              </span>
            )
          })}
        </div>

        <div className="text-xs text-gray-600 mb-2">
          <span className="font-bold text-[#003b7a]">{pct}%</span> chance you'll need{' '}
          <span className="font-bold">{trajectory.nextLabel}</span> content in{' '}
          <span className="font-bold">{trajectory.days} days</span>
        </div>
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-[#003b7a] to-blue-400 rounded-full"
               style={{ width: `${pct}%` }} />
        </div>

        {trajectory.keySignals?.length > 0 && (
          <div className="mt-3 space-y-1">
            {trajectory.keySignals.slice(0, 2).map((s, i) => (
              <div key={i} className="text-[10px] text-gray-500 flex items-center gap-1">
                <span className="text-blue-400">→</span> {s}
              </div>
            ))}
          </div>
        )}

        {trajectory.lifeEvent && (
          <div className="mt-3 bg-orange-50 border border-orange-200 rounded-lg p-2
                          text-[11px] text-orange-800">
            ⚠️ {trajectory.lifeEvent}
          </div>
        )}
      </div>

      {/* Events */}
      {aa.events?.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3">
          <h3 className="text-xs font-bold text-amber-800 mb-2">📅 Upcoming Decisions</h3>
          {aa.events.map((ev, i) => (
            <div key={i}>
              <div className="text-xs font-medium text-amber-800">{ev.desc}</div>
              <div className="text-[11px] text-amber-600 mt-0.5">→ {ev.action}</div>
            </div>
          ))}
        </div>
      )}

      {/* Story Arc Link */}
      <a href="http://localhost:8501/Story_Arc" target="_blank" rel="noreferrer"
         className="block bg-white rounded-xl border border-gray-200 p-3
                    hover:shadow-md transition-shadow cursor-pointer">
        <div className="text-[10px] text-gray-500 mb-1 uppercase font-bold">Story Arc Tracker</div>
        <div className="text-sm font-bold text-[#003b7a]">📈 Jio Financial Services</div>
        <div className="text-[11px] text-gray-500 mt-0.5">Coverage accelerating ⚡ · View full arc →</div>
      </a>

      {/* ET Prime CTA */}
      <div className="bg-gradient-to-br from-[#003b7a] to-[#001f4d] rounded-xl p-4 text-white">
        <div className="text-xs font-bold text-orange-300 uppercase mb-1">ET Prime</div>
        <div className="text-sm font-bold mb-1">Exclusive analysis for Stage {stage + 1}</div>
        <div className="text-[11px] text-blue-200 mb-3">
          Research depth that matches where you're going
        </div>
        <button className="w-full bg-orange-400 hover:bg-orange-500 text-white
                           text-xs font-bold py-2 rounded-lg transition-colors">
          Start 7-day free trial →
        </button>
      </div>
    </div>
  )
}
