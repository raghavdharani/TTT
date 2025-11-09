import { useState } from 'react'

function GameSetup({ onStart }) {
  const [gameMode, setGameMode] = useState(null)
  const [startingPlayer, setStartingPlayer] = useState(null)

  const handleStart = () => {
    if (gameMode && startingPlayer) {
      onStart(gameMode, startingPlayer)
    }
  }

  return (
    <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-6 sm:p-8">
      <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 text-center">
        Game Setup
      </h2>

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
            className={`px-4 py-3 rounded-lg border-2 transition-colors ${
              startingPlayer === 'X'
                ? 'border-blue-500 bg-blue-50 text-blue-700 font-bold'
                : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
            }`}
          >
            X (Cross)
          </button>
          <button
            onClick={() => setStartingPlayer('O')}
            className={`px-4 py-3 rounded-lg border-2 transition-colors ${
              startingPlayer === 'O'
                ? 'border-blue-500 bg-blue-50 text-blue-700 font-bold'
                : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
            }`}
          >
            O (Circle)
          </button>
        </div>
      </div>

      {/* Start Button */}
      <button
        onClick={handleStart}
        disabled={!gameMode || !startingPlayer}
        className="w-full px-6 py-3 bg-blue-500 hover:bg-blue-600 active:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors duration-150"
      >
        Start Game
      </button>
    </div>
  )
}

export default GameSetup

