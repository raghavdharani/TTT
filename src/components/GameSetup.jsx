import { useState } from 'react'
import { Token } from './tokens'

function GameSetup({ onStart, onOnlineSelect }) {
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
    <div className="w-full max-w-2xl card-glass p-6 sm:p-8">
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-2 text-center text-shadow-glow">
        ShiftTacToe
      </h1>
      <p className="text-sm sm:text-base text-white/80 mb-6 text-center">
        Move tokens, play series, and outsmart your opponent!
      </p>

      {/* Play Mode Selection (2 Player vs VS Computer vs Online) */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-white/90 mb-3">
          Select Play Mode:
        </label>
        <div className="grid grid-cols-3 gap-3">
          <button
            onClick={() => {
              setPlayMode('2player')
              setDifficulty(null) // Reset difficulty when switching modes
            }}
            className={`px-4 py-3 rounded-lg glass transition-all duration-200 min-h-[44px] ${
              playMode === '2player'
                ? 'glass-strong glow-mystical scale-105 text-white'
                : 'text-white/80 hover:glass-strong hover:scale-[1.02]'
            }`}
          >
            2 Player
          </button>
          <button
            onClick={() => setPlayMode('computer')}
            className={`px-4 py-3 rounded-lg glass transition-all duration-200 min-h-[44px] ${
              playMode === 'computer'
                ? 'glass-strong glow-mystical scale-105 text-white'
                : 'text-white/80 hover:glass-strong hover:scale-[1.02]'
            }`}
          >
            VS Computer
          </button>
          <button
            onClick={() => {
              if (onOnlineSelect) {
                onOnlineSelect()
              } else {
                setPlayMode('online')
                setDifficulty(null) // Reset difficulty when switching modes
              }
            }}
            className={`px-4 py-3 rounded-lg glass transition-all duration-200 min-h-[44px] ${
              playMode === 'online'
                ? 'glass-strong glow-mystical scale-105 text-white'
                : 'text-white/80 hover:glass-strong hover:scale-[1.02]'
            }`}
          >
            Online
          </button>
        </div>
      </div>

      {/* Difficulty Selection (only shown for VS Computer) */}
      {playMode === 'computer' && (
        <div className="mb-6 animate-in fade-in duration-300">
          <label className="block text-sm font-medium text-white/90 mb-3">
            Select Difficulty:
          </label>
          <div className="space-y-2">
            <button
              onClick={() => setDifficulty('easy')}
              className={`w-full px-4 py-3 rounded-lg glass transition-all duration-200 min-h-[44px] ${
                difficulty === 'easy'
                  ? 'glass-strong glow-mystical scale-105 text-white'
                  : 'text-white/80 hover:glass-strong hover:scale-[1.02]'
              }`}
            >
              Easy
            </button>
            <button
              onClick={() => setDifficulty('hard')}
              className={`w-full px-4 py-3 rounded-lg glass transition-all duration-200 min-h-[44px] ${
                difficulty === 'hard'
                  ? 'glass-strong glow-mystical scale-105 text-white'
                  : 'text-white/80 hover:glass-strong hover:scale-[1.02]'
              }`}
            >
              Hard
            </button>
            <button
              onClick={() => setDifficulty('insane')}
              className={`w-full px-4 py-3 rounded-lg glass transition-all duration-200 min-h-[44px] ${
                difficulty === 'insane'
                  ? 'glass-strong glow-mystical scale-105 text-white'
                  : 'text-white/80 hover:glass-strong hover:scale-[1.02]'
              }`}
            >
              Insane
            </button>
          </div>
        </div>
      )}

      {/* Game Mode Selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-white/90 mb-3">
          Select Game Mode:
        </label>
        <div className="space-y-2">
          <button
            onClick={() => setGameMode(1)}
            className={`w-full px-4 py-3 rounded-lg glass transition-all duration-200 min-h-[44px] ${
              gameMode === 1
                ? 'glass-strong glow-mystical scale-105 text-white'
                : 'text-white/80 hover:glass-strong hover:scale-[1.02]'
            }`}
          >
            1 Game
          </button>
          <button
            onClick={() => setGameMode(3)}
            className={`w-full px-4 py-3 rounded-lg glass transition-all duration-200 min-h-[44px] ${
              gameMode === 3
                ? 'glass-strong glow-mystical scale-105 text-white'
                : 'text-white/80 hover:glass-strong hover:scale-[1.02]'
            }`}
          >
            Best of 3
          </button>
          <button
            onClick={() => setGameMode(5)}
            className={`w-full px-4 py-3 rounded-lg glass transition-all duration-200 min-h-[44px] ${
              gameMode === 5
                ? 'glass-strong glow-mystical scale-105 text-white'
                : 'text-white/80 hover:glass-strong hover:scale-[1.02]'
            }`}
          >
            Best of 5
          </button>
        </div>
      </div>

      {/* Starting Player Selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-white/90 mb-3">
          Who goes first?
        </label>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => setStartingPlayer('X')}
            className={`px-4 py-4 rounded-lg glass transition-all duration-200 flex items-center justify-center min-h-[44px] ${
              startingPlayer === 'X'
                ? 'glass-strong glow-red scale-105'
                : 'hover:glass-strong hover:scale-[1.02]'
            }`}
          >
            <Token value="X" size="small" />
          </button>
          <button
            onClick={() => setStartingPlayer('O')}
            className={`px-4 py-4 rounded-lg glass transition-all duration-200 flex items-center justify-center min-h-[44px] ${
              startingPlayer === 'O'
                ? 'glass-strong glow-blue scale-105'
                : 'hover:glass-strong hover:scale-[1.02]'
            }`}
          >
            <Token value="O" size="small" />
          </button>
        </div>
      </div>

      {/* Help Section - Always Visible and Prominent */}
      <div className="mb-6 border-t border-white/20 pt-6">
        <div className="glass rounded-lg p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <span className="text-2xl">📖</span>
              How This Game Works
            </h2>
            <button
              onClick={() => setShowHelp(!showHelp)}
              className="text-mystical-blue hover:text-mystical-purple font-semibold text-sm flex items-center gap-1 transition-colors duration-200"
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
            <p className="text-sm font-medium text-white/90 mb-2">
              <strong>Quick Start:</strong> Place tokens (max 3), move them to adjacent squares, and get three in a row to win!
            </p>
          </div>
          
          {showHelp && (
            <div className="mt-4 space-y-4 text-sm text-white/80 glass-strong p-4 rounded-lg animate-in fade-in duration-300">
              <section>
                <h3 className="font-bold text-white mb-2 text-base">🎯 Unique Features</h3>
                <ul className="space-y-2 list-disc list-inside text-white/80">
                  <li><strong>Token Limit:</strong> Maximum 3 tokens per player - relocate to place new ones</li>
                  <li><strong>Token Movement:</strong> Move tokens to adjacent squares (up, down, left, right only)</li>
                  <li><strong>Series Mode:</strong> Play best of 1, 3, or 5 games</li>
                  <li><strong>Alternating Start:</strong> Starting player alternates each game in a series</li>
                </ul>
              </section>
              
              <section>
                <h3 className="font-bold text-white mb-2 text-base">🎮 How to Play</h3>
                <ol className="space-y-2 list-decimal list-inside text-white/80">
                  <li>Place tokens on empty squares until you reach 3 tokens</li>
                  <li>Click your token to pick it up, then click an adjacent empty square to move it</li>
                  <li>If you place a token back in the same spot, your turn doesn't end</li>
                  <li>Win by getting three in a row (horizontal, vertical, or diagonal)</li>
                </ol>
              </section>

              <section>
                <h3 className="font-bold text-white mb-2 text-base">💡 Pro Tips</h3>
                <ul className="space-y-2 list-disc list-inside text-white/80">
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
        className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:glow-mystical min-h-[44px]"
      >
        Start Game
      </button>
    </div>
  )
}

export default GameSetup

