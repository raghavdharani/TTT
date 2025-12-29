function Help({ isOpen, onClose }) {
  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-500"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="help-title"
    >
      <div
        className="glass-strong rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-in zoom-in duration-500"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 sm:p-8">
          <div className="flex justify-between items-center mb-6">
            <h2
              id="help-title"
              className="text-2xl sm:text-3xl font-bold text-white text-shadow-glow"
            >
              Game Rules & Restrictions
            </h2>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white text-2xl font-bold w-10 h-10 flex items-center justify-center rounded-full glass hover:glass-strong transition-all duration-300 ease-in-out hover:scale-110"
              aria-label="Close help"
            >
              ×
            </button>
          </div>

          <div className="space-y-6 text-white/90">
            <section>
              <h3 className="text-xl font-semibold text-white mb-3">
                Basic Rules
              </h3>
              <ul className="space-y-2 list-disc list-inside text-white/80">
                <li>Player X always goes first</li>
                <li>Click on an empty square to place your marker</li>
                <li>Players alternate turns</li>
                <li>Win by getting three markers in a row (horizontal, vertical, or diagonal)</li>
              </ul>
            </section>

            <section>
              <h3 className="text-xl font-semibold text-white/900 mb-3">
                Token Limit
              </h3>
              <ul className="space-y-2 list-disc list-inside text-white/700">
                <li>Each player may have a maximum of <strong>three tokens</strong> on the board at any time</li>
                <li>When you have 3 tokens, you must relocate an existing token (you cannot place new tokens)</li>
                <li>You can relocate your tokens at any time, even when under the limit</li>
              </ul>
            </section>

            <section>
              <h3 className="text-xl font-semibold text-white/900 mb-3">
                Movement Restrictions
              </h3>
              <ul className="space-y-2 list-disc list-inside text-white/700">
                <li>Tokens can only move to <strong>adjacent squares</strong> (up, down, left, or right - <strong>not diagonally</strong>)</li>
                <li>If all adjacent squares are blocked by other tokens, that token cannot be moved (it will be disabled)</li>
                <li><strong>Changing your mind:</strong> If you pick up a token and place it back in the same location, your turn does not end - you can still make another move</li>
                <li>You must place the token in a different adjacent location for the turn to be complete and switch to your opponent</li>
              </ul>
            </section>

            <section>
              <h3 className="text-xl font-semibold text-white/900 mb-3">
                How to Play
              </h3>
              <ol className="space-y-2 list-decimal list-inside text-white/700">
                <li>Click on an empty square to place your first token</li>
                <li>Continue placing tokens until you reach the 3-token limit</li>
                <li>To relocate a token: Click on one of your tokens, then click an adjacent empty square</li>
                <li>Strategically move your tokens to form three in a row while blocking your opponent</li>
                <li>Click "New Game" to reset and play again</li>
              </ol>
            </section>

            <section>
              <h3 className="text-xl font-semibold text-white/900 mb-3">
                Tips
              </h3>
              <ul className="space-y-2 list-disc list-inside text-white/700">
                <li>Plan your moves carefully - once you have 3 tokens, you must move strategically</li>
                <li>Watch for opportunities to block your opponent while setting up your own win</li>
                <li>Be aware of which tokens can move - blocked tokens are disabled</li>
                <li>Use token relocation to create multiple winning opportunities</li>
              </ul>
            </section>
          </div>

          <button
            onClick={onClose}
            className="mt-6 w-full py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition-colors"
          >
            Got it!
          </button>
        </div>
      </div>
    </div>
  )
}

export default Help

