const TAG_COLORS = {
  blue:   "bg-blue-50 text-blue-700 border-blue-200",
  purple: "bg-purple-50 text-purple-700 border-purple-200",
  orange: "bg-orange-50 text-orange-700 border-orange-200",
}

export default function ArticleCard({ article, mode, userId, onClick }) {
  const portfolioTag = article.portfolioTags?.[userId]
  const isAnticipatory = !!article.tag

  return (
    <div onClick={onClick}
         className={`flex gap-3 p-4 border-b border-gray-100 hover:bg-gray-50
                     cursor-pointer transition-colors group
                     ${isAnticipatory && mode === 'myet'
                       ? 'border-l-4 border-l-blue-400 bg-blue-50/30'
                       : ''}`}>
      <img src={article.img} alt="" className="w-20 h-16 object-cover rounded flex-shrink-0" />

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[10px] font-bold text-[#e2231a] uppercase tracking-wide">
            {article.category}
          </span>
          <span className="text-[10px] text-gray-400">{article.time}</span>
          {article.hasFullArticle && (
            <span className="text-[10px] text-blue-500 font-medium">Read full article →</span>
          )}
        </div>

        <h3 className="text-sm font-bold text-[#1a1a1a] leading-snug mb-1
                       group-hover:text-[#003b7a] transition-colors">
          {article.title}
        </h3>

        <p className="text-xs text-gray-500 leading-relaxed line-clamp-2 mb-1">
          {article.summary}
        </p>

        {/* My ET additions */}
        {mode === 'myet' && (
          <div className="flex flex-wrap gap-1.5 mt-1">
            {article.tag && (
              <span className={`text-[10px] px-2 py-0.5 rounded-full border font-medium
                               ${TAG_COLORS[article.tagColor] || TAG_COLORS.blue}`}>
                🔮 {article.tag}
              </span>
            )}
            {portfolioTag && (
              <span className="text-[10px] px-2 py-0.5 rounded-full border
                               bg-orange-50 text-orange-700 border-orange-200 font-medium">
                💼 {portfolioTag}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
