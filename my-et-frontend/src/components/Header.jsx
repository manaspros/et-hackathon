const TICKERS = [
  { name: "SENSEX", value: "72,140", change: "-1.7%", up: false },
  { name: "NIFTY",  value: "21,840", change: "-1.4%", up: false },
  { name: "GOLD",   value: "₹71,200", change: "+0.3%", up: true },
  { name: "USD/INR", value: "83.42",  change: "+0.1%", up: false },
]

export default function Header({ mode, onToggleMode, user, onPersonaChange }) {
  return (
    <header className="bg-[#003b7a] text-white sticky top-0 z-50 shadow-lg">
      <div className="max-w-[1200px] mx-auto px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="font-bold text-xl tracking-tight cursor-pointer">
            <span className="text-[#e2231a]">THE</span> ECONOMIC TIMES
          </div>
          <nav className="hidden md:flex gap-4 text-sm text-blue-200">
            {["Markets","Industry","Tech","Wealth"].map(n => (
              <a key={n} href="#" className="hover:text-white transition-colors">{n}</a>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          {/* Persona selector */}
          <select onChange={e => onPersonaChange(e.target.value)}
                  className="text-xs bg-white/10 text-white rounded-full px-2 py-1
                             border border-white/20 cursor-pointer [&>option]:text-black">
            <option value="rahul">Rahul · Stage 3</option>
            <option value="priya">Priya · Stage 2</option>
            <option value="sneha">Sneha · Stage 5</option>
          </select>

          {/* Mode toggle */}
          <div className="flex items-center bg-white/10 rounded-full p-1">
            <button onClick={() => onToggleMode('et')}
                    className={`text-xs px-3 py-1 rounded-full transition-all
                      ${mode === 'et' ? 'bg-white text-[#003b7a] font-bold' : 'text-white'}`}>
              ET Today
            </button>
            <button onClick={() => onToggleMode('myet')}
                    className={`text-xs px-3 py-1 rounded-full transition-all
                      ${mode === 'myet' ? 'bg-orange-400 text-white font-bold' : 'text-white'}`}>
              ✨ My ET
            </button>
          </div>
        </div>
      </div>

      {/* Ticker strip */}
      <div className="bg-[#001f4d] text-xs py-1.5">
        <div className="max-w-[1200px] mx-auto px-4 flex gap-6 overflow-x-auto">
          {TICKERS.map(t => (
            <span key={t.name} className="whitespace-nowrap">
              <span className="text-gray-400">{t.name} </span>
              <span className="font-medium">{t.value} </span>
              <span className={t.up ? "text-green-400" : "text-red-400"}>{t.change}</span>
            </span>
          ))}
        </div>
      </div>
    </header>
  )
}
