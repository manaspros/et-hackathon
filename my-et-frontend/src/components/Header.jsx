import { useState } from 'react'

const TICKERS = [
  { name: "SENSEX", value: "72,140", change: "-1.7%", up: false },
  { name: "NIFTY",  value: "21,840", change: "-1.4%", up: false },
  { name: "GOLD",   value: "₹71,200", change: "+0.3%", up: true },
  { name: "USD/INR", value: "83.42",  change: "+0.1%", up: false },
]

export default function Header({ mode, onToggleMode, user }) {
  return (
    <header className="bg-[#003b7a] text-white sticky top-0 z-50 shadow-lg">
      {/* Top nav */}
      <div className="max-w-[1200px] mx-auto px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-6">
          {/* ET Logo */}
          <div className="font-bold text-xl tracking-tight">
            <span className="text-[#e2231a]">THE</span>{" "}
            <span>ECONOMIC TIMES</span>
          </div>
          <nav className="hidden md:flex gap-4 text-sm">
            {["Markets","Industry","Tech","Wealth","Prime"].map(n => (
              <a key={n} href="#" className="hover:text-orange-300 transition-colors">{n}</a>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          {/* Before/After Toggle */}
          <div className="flex items-center gap-2 bg-white/10 rounded-full px-3 py-1">
            <button
              onClick={() => onToggleMode('et')}
              className={`text-xs px-3 py-1 rounded-full transition-all ${
                mode === 'et' ? 'bg-white text-[#003b7a] font-bold' : 'text-white'
              }`}
            >ET Today</button>
            <button
              onClick={() => onToggleMode('myet')}
              className={`text-xs px-3 py-1 rounded-full transition-all ${
                mode === 'myet'
                  ? 'bg-orange-400 text-white font-bold'
                  : 'text-white'
              }`}
            >✨ My ET</button>
          </div>
          {user && (
            <span className="text-sm text-orange-300">👤 {user.name}</span>
          )}
        </div>
      </div>

      {/* Ticker strip */}
      <div className="bg-[#001f4d] text-xs py-1">
        <div className="max-w-[1200px] mx-auto px-4 flex gap-6">
          {TICKERS.map(t => (
            <span key={t.name}>
              <span className="text-gray-400">{t.name} </span>
              <span className="font-medium">{t.value} </span>
              <span className={t.up ? "text-green-400" : "text-red-400"}>
                {t.change}
              </span>
            </span>
          ))}
        </div>
      </div>
    </header>
  )
}
