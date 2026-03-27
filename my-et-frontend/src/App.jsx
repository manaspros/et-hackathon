import { useState } from 'react'
import Header from './components/Header'
import ArticleCard from './components/ArticleCard'
import AAProfileSidebar from './components/AAProfileSidebar'
import PaywallModal from './components/PaywallModal'
import { USERS } from './data/users'
import { ARTICLES } from './data/articles'

export default function App() {
  const [mode,        setMode]        = useState('et')       // 'et' | 'myet'
  const [persona,     setPersona]     = useState('rahul')
  const [showPaywall, setShowPaywall] = useState(false)
  const [articlesRead,setArticlesRead]= useState(0)

  const user     = USERS[persona]
  const regular  = ARTICLES.regular
  const antici   = ARTICLES.anticipatory[user.stage] || []

  // Mix anticipatory articles into feed for My ET mode
  const myetFeed = [
    regular[0],        // top story
    ...antici,         // 2 anticipatory articles
    ...regular.slice(1) // rest of regular
  ]

  const handleArticleClick = () => {
    const newCount = articlesRead + 1
    setArticlesRead(newCount)
    if (newCount >= 4 && mode === 'et')    setShowPaywall(true)
    if (newCount >= 4 && mode === 'myet')  setTimeout(() => setShowPaywall(true), 800)
  }

  return (
    <div className="min-h-screen bg-[#f5f5f5] font-sans">
      <Header mode={mode} onToggleMode={setMode} user={user} />

      {/* Mode banner */}
      {mode === 'myet' && (
        <div className="bg-gradient-to-r from-[#003b7a] to-blue-700 text-white
                        text-center py-2 text-sm">
          ✨ <strong>My ET</strong> — powered by your financial journey ·
          {" "}{user.name} · Stage {user.stage}: {user.stageLabel}
        </div>
      )}

      <main className="max-w-[1200px] mx-auto px-4 py-4">
        {/* Persona selector (small, top) */}
        <div className="flex gap-2 mb-4">
          {Object.entries(USERS).map(([key, u]) => (
            <button key={key} onClick={() => { setPersona(key); setArticlesRead(0) }}
                    className={`text-xs px-3 py-1 rounded-full border transition-colors
                      ${persona === key
                        ? 'bg-[#003b7a] text-white border-[#003b7a]'
                        : 'bg-white text-gray-600 border-gray-300 hover:border-[#003b7a]'
                      }`}>
              {u.name} · Stage {u.stage}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-[1fr_300px] gap-6">
          {/* Feed */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wide">
                {mode === 'myet' ? `For You, ${user.name}` : 'Top Stories'}
              </h2>
              <span className="text-xs text-gray-400">
                {articlesRead} articles read {articlesRead >= 3 ? '· Paywall soon' : ''}
              </span>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 shadow-sm divide-y">
              {(mode === 'myet' ? myetFeed : regular).map(article => (
                <div key={article.id} onClick={handleArticleClick}>
                  <ArticleCard
                    article={article}
                    mode={mode}
                    showImpact={mode === 'myet'}
                  />
                </div>
              ))}
            </div>

            {/* Admin link */}
            <div className="mt-6 text-center">
              <a href="http://localhost:8501" target="_blank" rel="noreferrer"
                 className="text-xs text-gray-400 hover:text-gray-600 underline">
                ⚙️ View technical dashboard (Story Arc · Dark Subs · Paywall Intelligence)
              </a>
            </div>
          </div>

          {/* Sidebar */}
          <div>
            {mode === 'myet'
              ? <AAProfileSidebar user={user} />
              : <RegularSidebar />
            }
          </div>
        </div>
      </main>

      {showPaywall && (
        <PaywallModal
          mode={mode}
          user={user}
          onClose={() => { setShowPaywall(false); setArticlesRead(0) }}
        />
      )}
    </div>
  )
}

function RegularSidebar() {
  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg border p-4">
        <h3 className="text-xs font-bold text-gray-500 uppercase mb-3">Markets</h3>
        {[["SENSEX","72,140","▼1.7%"],["NIFTY","21,840","▼1.4%"],
          ["BANK NIFTY","46,200","▼0.9%"]].map(([n,v,c]) => (
          <div key={n} className="flex justify-between text-sm py-1.5 border-b last:border-0">
            <span className="text-gray-600">{n}</span>
            <span>{v} <span className="text-red-500 text-xs">{c}</span></span>
          </div>
        ))}
      </div>
      <div className="bg-gradient-to-br from-[#003b7a] to-[#001f4d] rounded-lg p-4 text-white">
        <div className="text-xs text-orange-300 font-bold uppercase mb-1">ET Prime</div>
        <div className="text-sm font-bold mb-2">Exclusive business intelligence</div>
        <button className="w-full bg-orange-400 text-white text-xs py-2 rounded font-bold">
          Subscribe ₹2,549/yr
        </button>
      </div>
    </div>
  )
}
