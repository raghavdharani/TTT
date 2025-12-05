import { useState } from 'react'

function GameSetup({ onStart }) {
  const [playMode, setPlayMode] = useState(null) // '2player' or 'computer'
  const [difficulty, setDifficulty] = useState(null) // 'easy', 'hard', 'insane' (only for computer mode)
  const [gameMode, setGameMode] = useState(null) // 1, 3, or 5
  const [startingPlayer, setStartingPlayer] = useState(null) // 'X' or 'O'
  const [showHelp, setShowHelp] = useState(false)

  const handleStart = () => {
    if (playMode && gameMode && startingPlayer) {
      if (playMode === 'computer' && !difficulty) {
        return // Can't start without difficulty for computer mode
      }
      onStart(playMode, gameMode, startingPlayer, difficulty)
    }
  }

  return (
    <div className="w-full max-w-2xl bg-white rounded-lg shadow-lg p-6 sm:p-8">
      <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2 text-center">
        ShiftTacToe
      </h1>
      <p className="text-sm sm:text-base text-gray-600 mb-6 text-center">
        Move tokens, play series, and outsmart your opponent!
      </p>

      {/* Play Mode Selection (2 Player vs VS Computer vs Online) */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Select Play Mode:
        </label>
        <div className="grid grid-cols-3 gap-3">
          <button
            onClick={() => {
              setPlayMode('2player')
              setDifficulty(null) // Reset difficulty when switching modes
            }}
            className={`px-4 py-3 rounded-lg border-2 transition-colors ${
              playMode === '2player'
                ? 'border-blue-500 bg-blue-50 text-blue-700'
                : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
            }`}
          >
            2 Player
          </button>
          <button
            onClick={() => setPlayMode('computer')}
            className={`px-4 py-3 rounded-lg border-2 transition-colors ${
              playMode === 'computer'
                ? 'border-blue-500 bg-blue-50 text-blue-700'
                : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
            }`}
          >
            VS Computer
          </button>
          <button
            onClick={() => {
              setPlayMode('online')
              setDifficulty(null) // Reset difficulty when switching modes
            }}
            className={`px-4 py-3 rounded-lg border-2 transition-colors ${
              playMode === 'online'
                ? 'border-blue-500 bg-blue-50 text-blue-700'
                : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
            }`}
          >
            Online
          </button>
        </div>
      </div>

      {/* Difficulty Selection (only shown for VS Computer) */}
      {playMode === 'computer' && (
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Select Difficulty:
          </label>
          <div className="space-y-2">
            <button
              onClick={() => setDifficulty('easy')}
              className={`w-full px-4 py-3 rounded-lg border-2 transition-colors ${
                difficulty === 'easy'
                  ? 'border-green-500 bg-green-50 text-green-700'
                  : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
              }`}
            >
              Easy
            </button>
            <button
              onClick={() => setDifficulty('hard')}
              className={`w-full px-4 py-3 rounded-lg border-2 transition-colors ${
                difficulty === 'hard'
                  ? 'border-yellow-500 bg-yellow-50 text-yellow-700'
                  : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
              }`}
            >
              Hard
            </button>
            <button
              onClick={() => setDifficulty('insane')}
              className={`w-full px-4 py-3 rounded-lg border-2 transition-colors ${
                difficulty === 'insane'
                  ? 'border-red-500 bg-red-50 text-red-700'
                  : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
              }`}
            >
              Insane
            </button>
          </div>
        </div>
      )}

      {/* Game Mode Selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Select Game Mode:
        </label>
        <div className="space-y-2">
          <button
            onClick={() => setGameMode(1)}
            className={`w-full px-4 py-3 rounded-lg border-2 transition-colors ${
              gameMode === 1
                ? 'border-blue-500 bg-blue-50 text-blue-700'
                : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
            }`}
          >
            1 Game
          </button>
          <button
            onClick={() => setGameMode(3)}
            className={`w-full px-4 py-3 rounded-lg border-2 transition-colors ${
              gameMode === 3
                ? 'border-blue-500 bg-blue-50 text-blue-700'
                : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
            }`}
          >
            Best of 3
          </button>
          <button
            onClick={() => setGameMode(5)}
            className={`w-full px-4 py-3 rounded-lg border-2 transition-colors ${
              gameMode === 5
                ? 'border-blue-500 bg-blue-50 text-blue-700'
                : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
            }`}
          >
            Best of 5
          </button>
        </div>
      </div>

      {/* Starting Player Selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Who goes first?
        </label>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => setStartingPlayer('X')}
            className={`px-4 py-4 rounded-lg border-2 transition-all flex items-center justify-center ${
              startingPlayer === 'X'
                ? 'border-blue-500 bg-blue-50 shadow-md scale-105'
                : 'border-gray-300 bg-white hover:border-blue-300 hover:bg-blue-50'
            }`}
          >
            <svg
              className="animate-pulse w-12 h-12"
              viewBox="0 0 100 100"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <line
                x1="20"
                y1="20"
                x2="80"
                y2="80"
                stroke="#3b82f6"
                strokeWidth="12"
                strokeLinecap="round"
                filter="drop-shadow(0 0 4px rgba(59, 130, 246, 0.8))"
              />
              <line
                x1="80"
                y1="20"
                x2="20"
                y2="80"
                stroke="#3b82f6"
                strokeWidth="12"
                strokeLinecap="round"
                filter="drop-shadow(0 0 4px rgba(59, 130, 246, 0.8))"
              />
            </svg>
          </button>
          <button
            onClick={() => setStartingPlayer('O')}
            className={`px-4 py-4 rounded-lg border-2 transition-all flex items-center justify-center ${
              startingPlayer === 'O'
                ? 'border-red-500 bg-red-50 shadow-md scale-105'
                : 'border-gray-300 bg-white hover:border-red-300 hover:bg-red-50'
            }`}
          >
            <svg
              className="animate-spin w-12 h-12"
              style={{ animationDuration: '2s' }}
              viewBox="0 0 100 100"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                cx="50"
                cy="50"
                r="35"
                stroke="#ef4444"
                strokeWidth="12"
                fill="none"
                filter="drop-shadow(0 0 4px rgba(239, 68, 68, 0.8))"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Help Section - Always Visible and Prominent */}
      <div className="mb-6 border-t-2 border-blue-200 pt-6">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-lg p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <span className="text-2xl">📖</span>
              How This Game Works
            </h2>
            <button
              onClick={() => setShowHelp(!showHelp)}
              className="text-blue-600 hover:text-blue-700 font-semibold text-sm flex items-center gap-1"
            >
              {showHelp ? (
                <>
                  <span>Show Less</span>
                  <span className="text-lg">−</span>
                </>
              ) : (
                <>
                  <span>Show More</span>
                  <span className="text-lg">+</span>
                </>
              )}
            </button>
          </div>
          
          {/* Always visible summary */}
          <div className="mb-3">
            <p className="text-sm font-medium text-gray-800 mb-2">
              <strong>Quick Start:</strong> Place tokens (max 3), move them to adjacent squares, and get three in a row to win!
            </p>
          </div>
          
          {showHelp && (
            <div className="mt-4 space-y-4 text-sm text-gray-700 bg-white p-4 rounded-lg border border-blue-100">
              <section>
                <h3 className="font-bold text-gray-900 mb-2 text-base">🎯 Unique Features</h3>
                <ul className="space-y-2 list-disc list-inside text-gray-700">
                  <li><strong>Token Limit:</strong> Maximum 3 tokens per player - relocate to place new ones</li>
                  <li><strong>Token Movement:</strong> Move tokens to adjacent squares (up, down, left, right only)</li>
                  <li><strong>Series Mode:</strong> Play best of 1, 3, or 5 games</li>
                  <li><strong>Alternating Start:</strong> Starting player alternates each game in a series</li>
                </ul>
              </section>
              
              <section>
                <h3 className="font-bold text-gray-900 mb-2 text-base">🎮 How to Play</h3>
                <ol className="space-y-2 list-decimal list-inside text-gray-700">
                  <li>Place tokens on empty squares until you reach 3 tokens</li>
                  <li>Click your token to pick it up, then click an adjacent empty square to move it</li>
                  <li>If you place a token back in the same spot, your turn doesn't end</li>
                  <li>Win by getting three in a row (horizontal, vertical, or diagonal)</li>
                </ol>
              </section>

              <section>
                <h3 className="font-bold text-gray-900 mb-2 text-base">💡 Pro Tips</h3>
                <ul className="space-y-2 list-disc list-inside text-gray-700">
                  <li>Plan ahead - blocked tokens can't move</li>
                  <li>Use relocation to create multiple winning opportunities</li>
                  <li>Block your opponent while setting up your own win</li>
                </ul>
              </section>
            </div>
          )}
        </div>
      </div>

      {/* Start Button */}
      <button
        onClick={handleStart}
        disabled={!playMode || !gameMode || !startingPlayer || (playMode === 'computer' && !difficulty)}
        className="w-full px-6 py-3 bg-blue-500 hover:bg-blue-600 active:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors duration-150"
      >
        Start Game
      </button>
    </div>
  )
}

export default GameSetup

