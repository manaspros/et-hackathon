import { useState, useEffect, useRef, useCallback } from 'react'
import { ARTICLE_CONTENT, INTENT_WEIGHTS } from '../data/articleContent'

function score(user, signals) {
  const w = INTENT_WEIGHTS
  let s = 0
  s += w.scrollDepth.maxScore * Math.min(1, signals.scrollDepth / w.scrollDepth.threshold)
  s += w.timeOnPage.maxScore * Math.min(1, signals.timeOnPage / w.timeOnPage.threshold)
  s += w.sameCategoryCount.maxScore * Math.min(1, signals.sameCategory / w.sameCategoryCount.threshold)
  if (signals.isAnticipatory)      s += w.isAnticipatory.bonus
  if (signals.portfolioRelevant)   s += w.isPortfolioRelevant.bonus
  return Math.min(100, Math.round(s))
}

function Block({ b }) {
  if (b.type === 'lead') return (
    <p className="text-lg font-serif leading-relaxed mb-5 font-medium border-l-4 border-[#e2231a] pl-4 text-[#1a1a1a]">
      {b.text}
    </p>
  )
  if (b.type === 'paragraph') return (
    <p className="text-base font-serif leading-relaxed mb-4 text-[#333]">{b.text}</p>
  )
  if (b.type === 'quote') return (
    <blockquote className="border-l-4 border-[#003b7a] pl-5 my-6">
      <p className="text-lg italic font-serif mb-2 text-[#1a1a1a]">"{b.text}"</p>
      <cite className="text-sm text-gray-500 not-italic">— {b.attribution}</cite>
    </blockquote>
  )
  if (b.type === 'databox') return (
    <div className="bg-[#f0f4f8] border border-[#d0dce8] rounded-lg p-4 my-5">
      <div className="text-xs font-bold text-[#003b7a] uppercase tracking-wide mb-3">{b.label}</div>
      <div className="grid grid-cols-2 gap-3">
        {b.items.map((item, i) => (
          <div key={i} className="bg-white rounded p-3 border border-[#e0e8f0]">
            <div className="text-[11px] text-gray-500 mb-1">{item.label}</div>
            <div className="font-bold text-sm text-[#1a1a1a]">{item.value}</div>
            <div className={`text-[11px] mt-0.5 font-medium
              ${item.change.startsWith('↑')||item.change.startsWith('+') ? 'text-green-600'
              : item.change.startsWith('↓')||item.change.startsWith('-') ? 'text-red-500'
              : 'text-gray-500'}`}>{item.change}</div>
          </div>
        ))}
      </div>
    </div>
  )
  if (b.type === 'section_header') return (
    <h2 className="text-xl font-bold text-[#003b7a] font-serif mt-8 mb-4 pb-2 border-b-2 border-[#e0e8f0]">
      {b.text}
    </h2>
  )
  if (b.type === 'hook') return (
    <p className="text-base font-serif leading-relaxed mb-4 text-[#1a1a1a] font-medium bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg">
      {b.text}
    </p>
  )
  return <p className="text-base font-serif leading-relaxed mb-4 text-[#333]">{b.text}</p>
}

export default function ArticleReader({
  articleId, user, mode, onClose, sameCategory = 1, isAnticipatory = false
}) {
  const art = ARTICLE_CONTENT[articleId]
  const [depth,     setDepth]     = useState(0)
  const [elapsed,   setElapsed]   = useState(0)
  const [intent,    setIntent]    = useState(0)
  const [paywall,   setPaywall]   = useState(false)
  const [fired,     setFired]     = useState(false)
  const [subscribed,setSubscribed]= useState(false)
  const artRef   = useRef(null)
  const startRef = useRef(Date.now())

  const relevant = art?.affectedAssets?.some(a =>
    user.aa.stocks?.some(s => s.symbol === a) ||
    user.aa.funds?.some(f => f.category.toLowerCase().includes(a.toLowerCase())) ||
    (user.aa.fds?.length > 0 && ['FD','repo rate'].includes(a))
  ) || false

  const onScroll = useCallback(() => {
    if (!artRef.current) return
    const el = artRef.current
    const d  = Math.max(0, Math.min(1,
      (window.scrollY - el.offsetTop) / (el.scrollHeight - window.innerHeight)
    ))
    setDepth(d)
  }, [])

  useEffect(() => {
    window.addEventListener('scroll', onScroll, { passive: true })
    const timer = setInterval(() => setElapsed(Math.round((Date.now()-startRef.current)/1000)), 1000)
    return () => { window.removeEventListener('scroll', onScroll); clearInterval(timer) }
  }, [onScroll])

  useEffect(() => {
    if (fired || subscribed || !art) return
    const s = score(user, { scrollDepth: depth, timeOnPage: elapsed,
                             sameCategory, isAnticipatory, portfolioRelevant: relevant })
    setIntent(s)

    const atHook = depth > 0.62
    const threshold = user.paywallThreshold || 68

    if (mode === 'myet' && atHook && (s >= threshold || elapsed > 120)) {
      setFired(true)
      setTimeout(() => setPaywall(true), 500)
    } else if (mode === 'et' && atHook && sameCategory >= 3) {
      setFired(true)
      setTimeout(() => setPaywall(true), 200)
    }
  }, [depth, elapsed, sameCategory, mode, fired, subscribed, art, user, isAnticipatory, relevant])

  if (!art) return (
    <div className="fixed inset-0 bg-white z-50 flex items-center justify-center">
      <p className="text-gray-500">Article not found</p>
      <button onClick={onClose} className="ml-4 text-blue-500 underline">Close</button>
    </div>
  )

  return (
    <div className="fixed inset-0 bg-[#f5f5f5] z-50 overflow-y-auto">
      {/* Sticky header with progress */}
      <div className="sticky top-0 bg-white border-b border-gray-200 z-10 shadow-sm">
        <div className="max-w-[800px] mx-auto px-4 h-11 flex items-center justify-between">
          <button onClick={onClose} className="text-sm text-[#003b7a] hover:underline">
            ← Back
          </button>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-20 h-1.5 bg-gray-200 rounded-full">
                <div className="h-full bg-[#003b7a] rounded-full transition-all"
                     style={{ width: `${Math.round(depth*100)}%` }} />
              </div>
              <span className="text-xs text-gray-500">{Math.round(depth*100)}%</span>
            </div>
            {mode === 'myet' && !paywall && !subscribed && (
              <div className={`text-[11px] font-bold px-2 py-0.5 rounded-full
                ${intent >= 70 ? 'bg-red-100 text-red-700' :
                  intent >= 40 ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-500'}`}>
                Intent {intent}/100
              </div>
            )}
            <span className="text-xs text-gray-400">{art.readTime}</span>
          </div>
        </div>
        <div className="h-0.5 bg-gray-100">
          <div className="h-full bg-[#e2231a] transition-all" style={{ width: `${Math.round(depth*100)}%` }} />
        </div>
      </div>

      <div ref={artRef} className="max-w-[800px] mx-auto px-4 py-8">
        {/* Article header */}
        <span className="text-xs font-bold text-[#e2231a] uppercase tracking-widest">{art.category}</span>
        <h1 className="text-3xl font-bold font-serif text-[#1a1a1a] leading-tight mt-2 mb-4">{art.title}</h1>

        <div className="flex items-center gap-3 pb-4 mb-6 border-b border-gray-200">
          <div className="w-9 h-9 rounded-full bg-[#003b7a] text-white flex items-center justify-center text-sm font-bold">
            {art.author.split(' ').map(n=>n[0]).join('')}
          </div>
          <div>
            <div className="text-sm font-medium text-[#1a1a1a]">{art.author}</div>
            <div className="text-xs text-gray-500">{art.authorRole}</div>
          </div>
          <div className="ml-auto text-xs text-gray-400">{art.publishedAt}</div>
        </div>

        <img src={art.img} alt={art.title} className="w-full rounded-lg mb-6 aspect-video object-cover" />

        <div className="flex flex-wrap gap-2 mb-6">
          {art.tags.map(t => (
            <span key={t} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">{t}</span>
          ))}
        </div>

        {/* Free content */}
        {art.freeContent.map((b, i) => <Block key={i} b={b} />)}

        {/* Hook paragraph */}
        <Block b={art.hookParagraph} />

        {/* Paywall zone */}
        {paywall && !subscribed && (
          <div className="relative mt-2">
            {/* Blurred preview */}
            <div className="relative overflow-hidden rounded-lg mb-0">
              <div className="blur-sm pointer-events-none select-none opacity-50 p-1">
                {art.lockedContent.slice(0,2).map((b,i) => <Block key={i} b={b} />)}
                <p className="text-base font-serif text-[#333] mb-4">
                  The full analysis continues with specific fund recommendations, analyst price targets,
                  and a decision framework tailored to your portfolio composition and risk profile...
                </p>
              </div>
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/70 to-white pointer-events-none" />
            </div>

            {/* Paywall card */}
            <div className={`rounded-2xl shadow-xl border overflow-hidden
              ${mode === 'myet'
                ? 'border-[#003b7a]/20 bg-gradient-to-br from-[#003b7a] to-[#001f4d]'
                : 'border-gray-300 bg-white'}`}>
              <div className="p-6">
                {mode === 'myet' ? (
                  <>
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        {user.paywallOffer?.urgency === 'high' && (
                          <span className="text-[10px] bg-red-100 text-red-700 px-2 py-0.5
                                           rounded-full uppercase font-bold mb-2 inline-block">
                            Portfolio at stake
                          </span>
                        )}
                        <h3 className="text-lg font-bold text-white">{user.paywallOffer?.headline}</h3>
                      </div>
                      <div className="text-right ml-4">
                        <div className="text-[10px] text-blue-300">Intent score</div>
                        <div className="text-2xl font-bold text-orange-400">{intent}</div>
                        <div className="text-[10px] text-blue-300">/100</div>
                      </div>
                    </div>
                    {relevant && (
                      <div className="bg-white/10 rounded-lg p-3 mb-4 text-sm text-white">
                        💼 This article directly affects assets in your portfolio
                      </div>
                    )}
                    <p className="text-sm text-blue-100 mb-5">{user.paywallOffer?.sub}</p>
                  </>
                ) : (
                  <>
                    <h3 className="text-lg font-bold text-[#1a1a1a] mb-2">You've reached your article limit</h3>
                    <p className="text-sm text-gray-600 mb-5">Subscribe to ET Prime for unlimited access.</p>
                  </>
                )}

                <div className={`grid grid-cols-2 gap-2 mb-5 text-xs
                  ${mode === 'myet' ? 'text-blue-100' : 'text-gray-600'}`}>
                  {["Expert analyst verdicts","Zero ads","Exclusive deep-dives","Portfolio insights"].map(f => (
                    <div key={f} className="flex items-center gap-1.5">
                      <span className={mode === 'myet' ? 'text-green-400' : 'text-green-500'}>✓</span> {f}
                    </div>
                  ))}
                </div>

                <div className={`text-center mb-4 ${mode === 'myet' ? 'text-white' : 'text-[#1a1a1a]'}`}>
                  <span className="text-3xl font-bold">₹2,549</span>
                  <span className={`text-sm ml-1 ${mode === 'myet' ? 'text-blue-200' : 'text-gray-500'}`}>/year</span>
                </div>

                <button onClick={() => { setSubscribed(true); setPaywall(false) }}
                        className="w-full bg-orange-400 hover:bg-orange-500 text-white
                                   font-bold py-3 rounded-xl transition-all text-sm mb-2">
                  {user.paywallOffer?.cta || "Subscribe Now"}
                </button>
                <button onClick={() => { setSubscribed(true); setPaywall(false) }}
                        className={`w-full text-sm py-2.5 rounded-xl border transition-colors
                          ${mode === 'myet'
                            ? 'border-white/20 text-blue-100 hover:bg-white/10'
                            : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
                  Try free for 7 days
                </button>
              </div>

              {/* Comparison strip */}
              {mode === 'myet' && (
                <div className="bg-black/30 px-6 py-3 grid grid-cols-2 gap-4 text-[10px]">
                  <div>
                    <div className="text-red-300 font-bold mb-0.5">Old ET paywall</div>
                    <div className="text-gray-400">"Read 3 articles" trigger<br/>Same for everyone</div>
                  </div>
                  <div>
                    <div className="text-green-300 font-bold mb-0.5">PeakMoment AI</div>
                    <div className="text-gray-400">Intent {intent}/100 · scroll {Math.round(depth*100)}%<br/>
                      Personalised threshold: {user.paywallThreshold}</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Full content after subscribe */}
        {subscribed && (
          <>
            <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-2 mb-4 text-sm text-green-700">
              ✓ ET Prime unlocked
            </div>
            {art.lockedContent.map((b,i) => <Block key={i} b={b} />)}
          </>
        )}
      </div>
    </div>
  )
}
