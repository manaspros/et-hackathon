import { useState, useRef } from 'react'
import useReadingBehavior from '../hooks/useReadingBehavior'
import IntentGraph from './IntentGraph'
import { ARTICLE_CONTENT } from '../data/articleContent'

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
    <div data-type="databox" className="bg-[#f0f4f8] border border-[#d0dce8] rounded-lg p-4 my-5">
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
  const artRef    = useRef(null)
  const scrollRef = useRef(null)
  const [isSubscribed, setIsSubscribed] = useState(false)

  const {
    probability, shouldFire, fireReason, trend, pHistory,
    signals, scrollDepth, reset
  } = useReadingBehavior({
    userId: user.id,
    articleId,
    articleRef: artRef,
    scrollContainerRef: scrollRef,
    hookDepth: 0.62
  })

  if (!art) return (
    <div className="fixed inset-0 bg-white z-50 flex items-center justify-center">
      <p className="text-gray-500">Article not found</p>
      <button onClick={onClose} className="ml-4 text-blue-500 underline">Close</button>
    </div>
  )

  const isPortfolioRelevant = art.affectedAssets?.some(a =>
    user.aa.stocks?.some(s => s.symbol === a) ||
    (user.aa.fds?.length > 0 && ['FD','repo rate'].includes(a))
  )

  return (
    <div ref={scrollRef} className="fixed inset-0 bg-[#f5f5f5] z-50 overflow-y-auto">
      {/* Sticky header */}
      <div className="sticky top-0 bg-white border-b border-gray-200 z-10 shadow-sm">
        <div className="max-w-[1100px] mx-auto px-4 h-11 flex items-center justify-between">
          <button onClick={onClose} className="text-sm text-[#003b7a] hover:underline">← Back</button>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-20 h-1.5 bg-gray-200 rounded-full">
                <div className="h-full bg-[#003b7a] rounded-full transition-all"
                     style={{ width: `${Math.round(scrollDepth*100)}%` }} />
              </div>
              <span className="text-xs text-gray-500">{Math.round(scrollDepth*100)}%</span>
            </div>
            {mode === 'myet' && !shouldFire && !isSubscribed && (
              <div className={`text-[11px] font-bold px-2 py-0.5 rounded-full transition-colors
                ${probability >= 0.5 ? 'bg-red-100 text-red-700' :
                  probability >= 0.3 ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-500'}`}>
                P(subscribe): {Math.round(probability*100)}%
              </div>
            )}
            <span className="text-xs text-gray-400">{art.readTime}</span>
          </div>
        </div>
        <div className="h-0.5 bg-gray-100">
          <div className="h-full bg-[#e2231a] transition-all" style={{ width: `${Math.round(scrollDepth*100)}%` }} />
        </div>
      </div>

      {/* Two-column layout: article + intent graph */}
      <div className="max-w-[1100px] mx-auto px-4 py-8 grid grid-cols-[1fr_280px] gap-6">
        {/* Article column */}
        <div ref={artRef}>
          <span className="text-xs font-bold text-[#e2231a] uppercase tracking-widest">{art.category}</span>
          <h1 className="text-3xl font-bold font-serif text-[#1a1a1a] leading-tight mt-2 mb-4">{art.title}</h1>

          <div className="flex items-center gap-3 pb-4 mb-6 border-b border-gray-200">
            <div className="w-9 h-9 rounded-full bg-[#003b7a] text-white flex items-center justify-center text-sm font-bold">
              {art.author.split(' ').map(n=>n[0]).join('')}
            </div>
            <div>
              <div className="text-sm font-medium">{art.author}</div>
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

          {art.freeContent.map((b, i) => <Block key={i} b={b} />)}
          <Block b={art.hookParagraph} />

          {/* Paywall zone */}
          {shouldFire && !isSubscribed && (
            <div className="relative mt-2">
              <div className="relative overflow-hidden rounded-lg">
                <div className="blur-sm pointer-events-none select-none opacity-50 p-1">
                  {art.lockedContent.slice(0,2).map((b,i) => <Block key={i} b={b} />)}
                  <p className="text-base font-serif text-gray-400">
                    Full analysis continues with specific recommendations, analyst price targets,
                    and a decision framework for your exact portfolio...
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
                          {fireReason && (
                            <div className="text-[10px] bg-green-500/20 text-green-300 px-2 py-0.5
                                             rounded-full mb-2 inline-block font-medium">
                              ⚡ {fireReason}
                            </div>
                          )}
                          <h3 className="text-lg font-bold text-white">{user.paywallOffer?.headline}</h3>
                        </div>
                        <div className="ml-4 text-right flex-shrink-0">
                          <div className="text-[10px] text-blue-300">P(subscribe)</div>
                          <div className="text-2xl font-bold text-orange-400">{Math.round(probability*100)}%</div>
                        </div>
                      </div>
                      {isPortfolioRelevant && (
                        <div className="bg-white/10 rounded-lg p-3 mb-4 text-sm text-white">
                          💼 This article directly affects your portfolio
                        </div>
                      )}
                      <p className="text-sm text-blue-100 mb-5">{user.paywallOffer?.sub}</p>
                    </>
                  ) : (
                    <div className="mb-4">
                      <h3 className="text-lg font-bold text-[#1a1a1a] mb-1">You've reached your article limit</h3>
                      <p className="text-sm text-gray-600">Subscribe for unlimited access.</p>
                    </div>
                  )}

                  <div className={`text-center mb-4 ${mode === 'myet' ? 'text-white' : 'text-[#1a1a1a]'}`}>
                    <span className="text-3xl font-bold">₹2,549</span>
                    <span className={`text-sm ml-1 ${mode === 'myet' ? 'text-blue-200' : 'text-gray-500'}`}>/year</span>
                  </div>

                  <button onClick={() => setIsSubscribed(true)}
                          className="w-full bg-orange-400 hover:bg-orange-500 text-white font-bold py-3 rounded-xl text-sm mb-2">
                    {user.paywallOffer?.cta || 'Subscribe Now'}
                  </button>
                  <button onClick={() => setIsSubscribed(true)}
                          className={`w-full text-sm py-2.5 rounded-xl border transition-colors
                            ${mode === 'myet' ? 'border-white/20 text-blue-100 hover:bg-white/10' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
                    Try free for 7 days
                  </button>

                  {mode === 'myet' && (
                    <div className="mt-4 pt-3 border-t border-white/10 grid grid-cols-2 gap-4 text-[10px]">
                      <div>
                        <div className="text-red-300 font-bold mb-0.5">❌ Generic ET paywall</div>
                        <div className="text-gray-400">"Read 3 articles" counter<br/>Same for everyone</div>
                      </div>
                      <div>
                        <div className="text-green-300 font-bold mb-0.5">✅ PeakMoment AI</div>
                        <div className="text-gray-400">P(subscribe) {Math.round(probability*100)}%<br/>Optimal stopping theory</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {isSubscribed && (
            <>
              <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-2 mb-4 text-sm text-green-700">
                ✓ ET Prime unlocked
              </div>
              {art.lockedContent.map((b,i) => <Block key={i} b={b} />)}
            </>
          )}
        </div>

        {/* Intent graph column */}
        <div className="sticky top-16 h-fit">
          <IntentGraph
            pHistory={pHistory}
            probability={probability}
            trend={trend}
            shouldFire={shouldFire}
            fireReason={fireReason}
            signals={{ ...signals, article_count: sameCategory }}
            userId={user.id}
            mode={mode}
          />

          {mode === 'myet' && (
            <div className="mt-3 bg-white rounded-xl border border-gray-200 p-3">
              <div className="text-xs font-bold text-gray-600 mb-2">How PeakMoment AI works</div>
              <div className="space-y-1.5 text-[11px] text-gray-500">
                <div className="flex gap-2"><span className="text-blue-500 font-bold">1.</span>Collects 8 behavioral signals every 200ms</div>
                <div className="flex gap-2"><span className="text-blue-500 font-bold">2.</span>ML model scores P(subscribe | signals)</div>
                <div className="flex gap-2"><span className="text-blue-500 font-bold">3.</span>Optimal stopping detects probability peak</div>
                <div className="flex gap-2"><span className="text-green-500 font-bold">4.</span>Fires at peak — not before, not after</div>
              </div>
              <div className="mt-2 text-[10px] text-gray-400 border-t pt-2">
                Trained on 10,000 synthetic sessions · Optimal stopping theory · AUC: ~1.00
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
