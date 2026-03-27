import { useState } from 'react'
import Header from './components/Header'
import ArticleCard from './components/ArticleCard'
import AAProfileSidebar from './components/AAProfileSidebar'
import ArticleReader from './components/ArticleReader'
import { USERS } from './data/users'
import { ARTICLES } from './data/articles'

export default function App() {
  const [mode,        setMode]        = useState('et')
  const [persona,     setPersona]     = useState('rahul')
  const [openArticle, setOpenArticle] = useState(null)
  const [catCount,    setCatCount]    = useState({})

  const user     = USERS[persona]
  const antici   = ARTICLES.anticipatory[user.stage] || []
  const feed     = mode === 'myet'
    ? [ARTICLES.regular[0], ...antici, ...ARTICLES.regular.slice(1)]
    : ARTICLES.regular

  const handleArticleClick = (article) => {
    if (!article.hasFullArticle) return
    const cat = article.category
    setCatCount(prev => ({ ...prev, [cat]: (prev[cat] || 0) + 1 }))
    setOpenArticle(article)
  }

  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      <Header mode={mode} onToggleMode={setMode} user={user} onPersonaChange={setPersona} />

      {mode === 'myet' && (
        <div className="bg-gradient-to-r from-[#003b7a] to-blue-700 text-white text-center py-2 text-sm">
          ✨ <strong>My ET</strong> — intelligence layer active ·
          {' '}{user.name} · Stage {user.stage}: {user.stageLabel} ·
          {' '}{Math.round(user.trajectory.prob * 100)}% → Stage {user.trajectory.nextStage} in {user.trajectory.days}d
        </div>
      )}

      <main className="max-w-[1200px] mx-auto px-4 py-4">
        <div className="grid grid-cols-[1fr_300px] gap-6">
          {/* Feed */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wide">
                {mode === 'myet' ? `For You, ${user.name}` : 'Top Stories'}
              </h2>
              {mode === 'et' && (
                <span className="text-xs text-gray-400">Click an article to see paywall demo</span>
              )}
            </div>

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
              {feed.map(article => (
                <ArticleCard
                  key={article.id}
                  article={article}
                  mode={mode}
                  userId={user.id}
                  onClick={() => handleArticleClick(article)}
                />
              ))}
            </div>

            <div className="mt-4 text-center">
              <a href="http://localhost:8501" target="_blank" rel="noreferrer"
                 className="text-xs text-gray-400 hover:text-gray-600 underline">
                ⚙️ Technical dashboard: Story Arc · Dark Subscribers · Paywall Intelligence
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

      {/* Article Reader */}
      {openArticle && (
        <ArticleReader
          articleId={openArticle.fullArticleId}
          user={user}
          mode={mode}
          onClose={() => setOpenArticle(null)}
          sameCategory={catCount[openArticle.category] || 1}
          isAnticipatory={!!openArticle.tag}
        />
      )}
    </div>
  )
}

function RegularSidebar() {
  return (
    <div className="space-y-4">
      <div className="bg-white rounded-xl border p-4">
        <h3 className="text-xs font-bold text-gray-500 uppercase mb-3">Markets</h3>
        {[["SENSEX","72,140","▼1.7%"],["NIFTY","21,840","▼1.4%"],["GOLD","₹71,200","▲0.3%"]].map(([n,v,c])=>(
          <div key={n} className="flex justify-between text-sm py-1.5 border-b last:border-0">
            <span className="text-gray-600">{n}</span>
            <span className={`text-xs ${c.startsWith('▼')?'text-red-500':'text-green-500'}`}>
              {v} {c}
            </span>
          </div>
        ))}
      </div>
      <div className="bg-gradient-to-br from-[#003b7a] to-[#001f4d] rounded-xl p-4 text-white">
        <div className="text-xs text-orange-300 font-bold uppercase mb-1">ET Prime</div>
        <div className="text-sm font-bold mb-2">Exclusive business intelligence</div>
        <div className="text-xs text-blue-200 mb-3">Subscribe to ET Prime for in-depth analysis</div>
        <button className="w-full bg-orange-400 text-white text-xs py-2 rounded-lg font-bold">
          Subscribe ₹2,549/yr
        </button>
      </div>
    </div>
  )
}
