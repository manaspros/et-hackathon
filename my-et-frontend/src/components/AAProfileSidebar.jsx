export default function AAProfileSidebar({ user }) {
  const { aa, trajectory } = user
  const pct = Math.round(trajectory.prob * 100)

  return (
    <div className="space-y-4">
      {/* AA Profile Card */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wide">
            Your Portfolio (AA)
          </h3>
          <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
            ✓ Connected
          </span>
        </div>

        <div className="text-2xl font-bold text-[#003b7a] mb-3">
          ₹{aa.netWorth.toLocaleString('en-IN')}
        </div>

        {/* Allocation bars */}
        {[
          { label: "Mutual Funds", value: aa.mfValue, color: "bg-blue-500" },
          { label: "Cash",         value: aa.cashValue, color: "bg-green-500" },
          { label: "FDs",          value: aa.fdValue,  color: "bg-yellow-500" },
          ...(aa.stocks ? [{ label: "Stocks",
              value: aa.stocks.reduce((s,x)=>s+x.value,0), color: "bg-purple-500" }] : [])
        ].filter(i => i.value > 0).map(item => (
          <div key={item.label} className="mb-2">
            <div className="flex justify-between text-[11px] text-gray-600 mb-0.5">
              <span>{item.label}</span>
              <span className="font-medium">₹{item.value.toLocaleString('en-IN')}</span>
            </div>
            <div className="h-1.5 bg-gray-100 rounded-full">
              <div className={`h-full rounded-full ${item.color}`}
                   style={{ width: `${Math.round(item.value/aa.netWorth*100)}%` }} />
            </div>
          </div>
        ))}
      </div>

      {/* Journey Stage Card */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">
          Your Journey
        </h3>

        {/* Stage pills */}
        <div className="flex items-center gap-1 mb-3 flex-wrap">
          {["Saver","SIP","Portfolio","Equity","Active","Expert"].map((s,i) => {
            const isActive = i === user.stage - 1
            const isPast   = i < user.stage - 1
            return (
              <div key={s} className="flex items-center">
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium
                  ${isActive ? 'bg-[#003b7a] text-white' :
                    isPast   ? 'bg-gray-200 text-gray-500' :
                               'bg-gray-100 text-gray-400'}`}>
                  {s}
                </span>
                {i < 5 && <span className="text-gray-300 text-[10px] mx-0.5">›</span>}
              </div>
            )
          })}
        </div>

        <div className="text-[11px] text-gray-600 mb-2">
          <span className="font-bold text-[#003b7a]">{pct}%</span> chance you'll want{" "}
          <span className="font-bold">{trajectory.nextLabel}</span> content
          in <span className="font-bold">{trajectory.days} days</span>
        </div>
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-[#003b7a] to-blue-400 rounded-full transition-all"
               style={{ width: `${pct}%` }} />
        </div>

        {trajectory.lifeEvent && (
          <div className="mt-3 text-[11px] bg-orange-50 border border-orange-200
                          rounded p-2 text-orange-700">
            ⚠️ {trajectory.lifeEvent}
          </div>
        )}
      </div>

      {/* Upcoming Events */}
      {aa.events?.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
          <h3 className="text-xs font-bold text-amber-800 mb-2">📅 Upcoming</h3>
          {aa.events.map((ev,i) => (
            <div key={i} className="text-[11px] text-amber-800">
              <div className="font-medium">{ev.desc}</div>
              <div className="text-amber-600 mt-0.5">→ {ev.action}</div>
            </div>
          ))}
        </div>
      )}

      {/* Story Arc Link */}
      <a href="http://localhost:8501/Story_Arc" target="_blank" rel="noreferrer"
         className="block bg-white border rounded-lg p-3 hover:shadow-md transition">
        <div className="text-xs text-gray-500 mb-1">Story Arc Tracker</div>
        <div className="font-bold text-sm text-[#003b7a]">🔴 Jio Financial</div>
        <div className="text-xs text-gray-500">Coverage accelerating ⚡</div>
        <div className="text-xs text-blue-500 mt-1">View full arc →</div>
      </a>

      {/* ET Prime CTA */}
      <div className="bg-gradient-to-br from-[#003b7a] to-[#001f4d]
                      rounded-lg p-4 text-white">
        <div className="text-xs font-bold text-orange-300 uppercase mb-1">ET Prime</div>
        <div className="text-sm font-bold mb-1">
          The analysis you need for Stage {user.stage + 1}
        </div>
        <div className="text-[11px] text-blue-200 mb-3">
          Exclusive research for investors like {user.name}
        </div>
        <button className="w-full bg-orange-400 hover:bg-orange-500 text-white
                           text-xs font-bold py-2 rounded transition-colors">
          Start 7-day free trial →
        </button>
      </div>
    </div>
  )
}
