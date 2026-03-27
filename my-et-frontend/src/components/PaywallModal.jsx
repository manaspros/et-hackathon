export default function PaywallModal({ mode, user, onClose }) {
  const isPersonalized = mode === 'myet'

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">

        {/* Header */}
        <div className={`p-6 text-white ${
          isPersonalized
            ? 'bg-gradient-to-r from-[#003b7a] to-blue-600'
            : 'bg-[#1a1a1a]'
        }`}>
          {isPersonalized ? (
            <>
              <div className="text-xs text-blue-200 mb-1 uppercase tracking-wide">
                Personalised for {user.name}
              </div>
              <h2 className="text-lg font-bold">
                You're clearly researching HDFC Bank.
              </h2>
              <p className="text-sm text-blue-100 mt-1">
                ET Prime has 3 exclusive analyst reports — exactly what
                a {user.stageLabel} needs right now.
              </p>
            </>
          ) : (
            <>
              <h2 className="text-lg font-bold">Subscribe to ET Prime</h2>
              <p className="text-sm text-gray-300 mt-1">
                To continue reading, please subscribe.
              </p>
            </>
          )}
        </div>

        {/* Body */}
        <div className="p-6">
          {isPersonalized && (
            <div className="bg-blue-50 rounded-lg p-3 mb-4 text-sm text-blue-800">
              <div className="font-medium mb-1">Why now?</div>
              <div className="text-xs">
                You've read 4 articles about HDFC Bank in the last 30 minutes.
                {" "}Our system detected investment research intent.
              </div>
            </div>
          )}

          <div className="space-y-3 mb-5">
            {["Exclusive analyst research","Zero ads","Expert commentary",
              "Deep-dive long reads"].map(f => (
              <div key={f} className="flex items-center gap-2 text-sm text-gray-700">
                <span className="text-green-500">✓</span> {f}
              </div>
            ))}
          </div>

          <div className="text-center mb-4">
            <div className="text-3xl font-bold text-[#003b7a]">₹2,549</div>
            <div className="text-sm text-gray-500">per year · cancel anytime</div>
          </div>

          <button className="w-full bg-[#e2231a] hover:bg-red-700 text-white
                             font-bold py-3 rounded-lg transition-colors mb-3">
            {isPersonalized ? "Read the full analysis →" : "Subscribe Now"}
          </button>

          {isPersonalized && (
            <button className="w-full border border-gray-200 text-gray-600
                               text-sm py-2 rounded-lg hover:bg-gray-50">
              Try 7 days free
            </button>
          )}

          <button onClick={onClose}
                  className="w-full text-xs text-gray-400 mt-2 hover:text-gray-600">
            Not now
          </button>
        </div>

        {isPersonalized && (
          <div className="bg-gray-50 border-t px-6 py-3 text-[10px] text-gray-400 text-center">
            PeakMoment AI™ detected investment research intent ·
            {" "}FT benchmark: +92% conversion with AI paywall
          </div>
        )}
      </div>
    </div>
  )
}
