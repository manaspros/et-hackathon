export default function ArticleCard({ article, mode, showImpact }) {
  const tagColors = {
    blue:   "bg-blue-100 text-blue-700 border-blue-200",
    purple: "bg-purple-100 text-purple-700 border-purple-200",
    orange: "bg-orange-100 text-orange-700 border-orange-200",
    green:  "bg-green-100 text-green-700 border-green-200",
  }

  return (
    <div className={`flex gap-3 p-3 border-b border-gray-100 hover:bg-gray-50
                     cursor-pointer transition-colors group
                     ${article.tag ? 'border-l-4 border-l-blue-400 pl-3' : ''}`}>
      <img src={article.img} alt=""
           className="w-20 h-16 object-cover rounded flex-shrink-0" />

      <div className="flex-1 min-w-0">
        {/* Category + time */}
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[10px] font-bold text-[#e2231a] uppercase tracking-wide">
            {article.category}
          </span>
          <span className="text-[10px] text-gray-400">{article.time}</span>
        </div>

        {/* Headline */}
        <h3 className="text-sm font-bold text-[#1a1a1a] leading-snug mb-1
                       group-hover:text-[#003b7a] transition-colors font-serif">
          {article.title}
        </h3>

        {/* My ET additions */}
        {mode === 'myet' && (
          <>
            {/* Anticipatory tag */}
            {article.tag && (
              <span className={`inline-block text-[10px] px-2 py-0.5 rounded-full
                               border font-medium mt-1
                               ${tagColors[article.tagColor] || tagColors.blue}`}>
                🔮 {article.tag}
              </span>
            )}

            {/* Portfolio impact */}
            {article.portfolioTag && showImpact && (
              <div className="mt-1 text-[11px] text-orange-700 bg-orange-50
                              px-2 py-1 rounded border border-orange-200">
                💼 {article.portfolioTag}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
