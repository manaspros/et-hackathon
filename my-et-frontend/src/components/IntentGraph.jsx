import { useEffect, useRef } from 'react'

const TREND_COLORS = {
  rising: '#3b82f6', falling: '#f59e0b', plateau: '#8b5cf6',
  peak: '#22c55e', exit: '#ef4444', fired: '#22c55e',
}
const TREND_LABELS = {
  rising: '↑ Rising', falling: '↓ Falling', plateau: '→ Plateau',
  peak: '⚡ Peak!', exit: '⚠ Exit signal', fired: '✓ Fired',
}

export default function IntentGraph({
  pHistory = [], probability = 0, trend = 'rising',
  shouldFire = false, fireReason = '', signals = {}, userId, mode
}) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const W = canvas.width, H = canvas.height
    const pad = { top: 10, right: 10, bottom: 24, left: 36 }

    ctx.clearRect(0, 0, W, H)
    ctx.fillStyle = '#f8fafc'
    ctx.fillRect(0, 0, W, H)

    // Grid
    ctx.strokeStyle = '#e2e8f0'
    ctx.lineWidth = 1
    ;[0.25, 0.5, 0.75, 1.0].forEach(v => {
      const y = pad.top + (1 - v) * (H - pad.top - pad.bottom)
      ctx.beginPath(); ctx.moveTo(pad.left, y); ctx.lineTo(W - pad.right, y); ctx.stroke()
      ctx.fillStyle = '#94a3b8'; ctx.font = '9px Arial'; ctx.textAlign = 'right'
      ctx.fillText(`${Math.round(v * 100)}%`, pad.left - 3, y + 3)
    })

    if (pHistory.length < 2) return

    const pts = pHistory.map((p, i) => ({
      x: pad.left + (i / (pHistory.length - 1)) * (W - pad.left - pad.right),
      y: pad.top + (1 - p) * (H - pad.top - pad.bottom)
    }))

    const color = TREND_COLORS[trend] || '#3b82f6'
    const grad = ctx.createLinearGradient(0, pad.top, 0, H - pad.bottom)
    grad.addColorStop(0, color + '33'); grad.addColorStop(1, color + '08')

    ctx.beginPath(); ctx.moveTo(pts[0].x, H - pad.bottom)
    pts.forEach(p => ctx.lineTo(p.x, p.y))
    ctx.lineTo(pts[pts.length-1].x, H - pad.bottom); ctx.closePath()
    ctx.fillStyle = grad; ctx.fill()

    ctx.beginPath(); ctx.moveTo(pts[0].x, pts[0].y)
    pts.forEach(p => ctx.lineTo(p.x, p.y))
    ctx.strokeStyle = color; ctx.lineWidth = 2.5; ctx.lineJoin = 'round'; ctx.stroke()

    if (shouldFire && pts.length > 0) {
      const last = pts[pts.length - 1]
      ctx.beginPath(); ctx.arc(last.x, last.y, 6, 0, Math.PI * 2)
      ctx.fillStyle = '#22c55e'; ctx.fill()
      ctx.strokeStyle = 'white'; ctx.lineWidth = 2; ctx.stroke()
      ctx.fillStyle = '#22c55e'; ctx.font = 'bold 10px Arial'; ctx.textAlign = 'center'
      ctx.fillText('FIRED', last.x, last.y - 12)
    }

    ctx.fillStyle = '#94a3b8'; ctx.font = '9px Arial'; ctx.textAlign = 'left'
    ctx.fillText('TIME →', pad.left, H - 6)
  }, [pHistory, trend, shouldFire])

  const color = TREND_COLORS[trend] || '#3b82f6'
  const pPercent = Math.round(probability * 100)

  if (mode !== 'myet') return null

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-3 py-2 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: color }} />
          <span className="text-xs font-bold text-gray-700">PeakMoment AI</span>
        </div>
        <span className="text-[10px] text-gray-400">Live · every 200ms</span>
      </div>

      <div className="flex items-center gap-3 px-3 py-2">
        <div>
          <div className="text-[10px] text-gray-400 mb-0.5">P(convert)</div>
          <div className="text-2xl font-bold tabular-nums" style={{ color }}>{pPercent}%</div>
        </div>
        <div className="flex-1">
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full rounded-full transition-all duration-200"
                 style={{ width: `${pPercent}%`, backgroundColor: color }} />
          </div>
          <div className="flex justify-between mt-0.5">
            <span className="text-[9px] text-gray-400">0%</span>
            <span className="text-[10px] font-medium" style={{ color }}>{TREND_LABELS[trend] || trend}</span>
            <span className="text-[9px] text-gray-400">100%</span>
          </div>
        </div>
      </div>

      <div className="px-2 pb-1">
        <canvas ref={canvasRef} width={260} height={80} className="w-full" style={{ height: 80 }} />
      </div>

      {shouldFire && fireReason && (
        <div className="mx-2 mb-2 bg-green-50 border border-green-200 rounded-lg px-3 py-2">
          <div className="text-xs font-bold text-green-700 mb-0.5">⚡ Optimal moment detected</div>
          <div className="text-[11px] text-green-600">{fireReason}</div>
        </div>
      )}

      <div className="px-3 pb-3 space-y-1">
        <div className="text-[9px] font-bold text-gray-400 uppercase tracking-wide mb-1">Live signals</div>
        {[
          { key: 'scroll_depth', label: 'Depth', fmt: v => `${Math.round(v*100)}%` },
          { key: 'scroll_reversals', label: 'Re-reads', fmt: v => `${v}×` },
          { key: 'paragraph_dwell', label: 'Dwell', fmt: v => `${v}s` },
          { key: 'reading_speed_wpm', label: 'Speed', fmt: v => `${v} wpm` },
          { key: 'data_hover_count', label: 'Hovers', fmt: v => `${v}×` },
        ].map(({ key, label, fmt }) => (
          <div key={key} className="flex items-center justify-between">
            <span className="text-[10px] text-gray-500">{label}</span>
            <span className="text-[10px] font-bold text-gray-700 tabular-nums">{fmt(signals[key] ?? 0)}</span>
          </div>
        ))}
      </div>

      <div className="border-t border-gray-100 px-3 py-2 bg-gray-50">
        <div className="text-[9px] text-gray-400 mb-1 font-bold uppercase">vs Generic ET</div>
        <div className="flex justify-between text-[10px]">
          <span className="text-red-500">❌ Article counter: {signals.article_count ?? 0}/3</span>
          <span className="text-green-600">✅ Optimal: {pPercent}% P(convert)</span>
        </div>
      </div>
    </div>
  )
}
