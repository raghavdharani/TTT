import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, Info, Play, User, Monitor, Trophy } from 'lucide-react';
import GlassCard from './ui/GlassCard';
import MysticalButton from './ui/MysticalButton';
import Token from './ui/Token';

function GameSetup({ onStart }) {
  const [playMode, setPlayMode] = useState(null);
  const [difficulty, setDifficulty] = useState(null);
  const [gameMode, setGameMode] = useState(null);
  const [startingPlayer, setStartingPlayer] = useState(null);
  const [showHelp, setShowHelp] = useState(false);

  const handleStart = () => {
    if (playMode === 'online') {
      onStart('online');
      return;
    }
    if (playMode && gameMode && startingPlayer) {
      if (playMode === 'computer' && !difficulty) return;
      onStart(playMode, gameMode, startingPlayer, difficulty);
    }
  };

  const isOnline = playMode === 'online';

  return (
    <GlassCard className="w-full max-w-md p-6 sm:p-8 flex flex-col gap-6">
      <div className="text-center space-y-2">
        <h1 className="text-4xl sm:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-300 via-purple-300 to-white drop-shadow-glow">
          ShiftTacToe
        </h1>
        <p className="text-blue-200/80 font-light tracking-wide">
          A strategic twist on a classic
        </p>
      </div>

      <div className="space-y-6">
        {/* Play Mode */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-blue-200 uppercase tracking-widest opacity-80 pl-1">
            Opponent
          </label>
          <div className="grid grid-cols-3 gap-3">
            <MysticalButton
              variant={playMode === '2player' ? 'primary' : 'secondary'}
              onClick={() => { setPlayMode('2player'); setDifficulty(null); }}
              className="py-4 flex-col gap-1 text-xs sm:text-sm"
            >
              <User size={18} />
              <span>Human</span>
            </MysticalButton>
            <MysticalButton
              variant={playMode === 'computer' ? 'primary' : 'secondary'}
              onClick={() => setPlayMode('computer')}
              className="py-4 flex-col gap-1 text-xs sm:text-sm"
            >
              <Monitor size={18} />
              <span>Computer</span>
            </MysticalButton>
            <MysticalButton
              variant={playMode === 'online' ? 'primary' : 'secondary'}
              onClick={() => { setPlayMode('online'); setDifficulty(null); }}
              className="py-4 flex-col gap-1 text-xs sm:text-sm"
            >
              <Trophy size={18} />
              <span>Online</span>
            </MysticalButton>
          </div>
        </div>

        {/* Local Game Settings (Hidden for Online) */}
        <AnimatePresence>
          {!isOnline && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="space-y-6 overflow-hidden"
            >
              {/* Difficulty (Conditional) */}
              {playMode === 'computer' && (
                <div className="space-y-3">
                  <label className="text-sm font-medium text-blue-200 uppercase tracking-widest opacity-80 pl-1">
                    Difficulty
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {['easy', 'hard', 'insane'].map((level) => (
                      <MysticalButton
                        key={level}
                        variant={difficulty === level ? 'primary' : 'secondary'}
                        onClick={() => setDifficulty(level)}
                        className="capitalize py-3 text-sm"
                      >
                        {level}
                      </MysticalButton>
                    ))}
                  </div>
                </div>
              )}

              {/* Game Mode */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-blue-200 uppercase tracking-widest opacity-80 pl-1">
                  Series Length
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[1, 3, 5].map((mode) => (
                    <MysticalButton
                      key={mode}
                      variant={gameMode === mode ? 'primary' : 'secondary'}
                      onClick={() => setGameMode(mode)}
                      className="py-3 text-sm flex-col gap-0 leading-tight"
                    >
                      <span className="font-bold text-lg">{mode}</span>
                      <span className="opacity-80 text-xs">{mode === 1 ? 'Game' : 'Best of'}</span>
                    </MysticalButton>
                  ))}
                </div>
              </div>

              {/* Starting Player */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-blue-200 uppercase tracking-widest opacity-80 pl-1">
                  First Move
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => setStartingPlayer('X')}
                    className={`relative h-20 rounded-xl border transition-all flex items-center justify-center overflow-hidden group ${startingPlayer === 'X'
                      ? 'bg-navy-700/80 border-primary-glow/50 shadow-glow-sm'
                      : 'bg-navy-800/40 border-white/5 hover:bg-navy-700/40'
                      }`}
                  >
                    <Token type="X" size="md" />
                    {startingPlayer === 'X' && <div className="absolute inset-0 bg-primary-glow/10 animate-pulse" />}
                  </button>
                  <button
                    onClick={() => setStartingPlayer('O')}
                    className={`relative h-20 rounded-xl border transition-all flex items-center justify-center overflow-hidden group ${startingPlayer === 'O'
                      ? 'bg-navy-700/80 border-primary-glow/50 shadow-glow-sm'
                      : 'bg-navy-800/40 border-white/5 hover:bg-navy-700/40'
                      }`}
                  >
                    <Token type="O" size="md" />
                    {startingPlayer === 'O' && <div className="absolute inset-0 bg-blue-500/10 animate-pulse" />}
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Rules Toggle */}
        <div className="pt-2">
          <button
            onClick={() => setShowHelp(!showHelp)}
            className="w-full flex items-center justify-between text-blue-300/60 hover:text-blue-200 text-sm transition-colors py-2"
          >
            <span className="flex items-center gap-2">
              <Info size={16} /> How to play
            </span>
            <span className="text-lg">{showHelp ? '−' : '+'}</span>
          </button>

          <AnimatePresence>
            {showHelp && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="mt-2 p-4 rounded-lg bg-navy-900/50 border border-white/5 text-sm text-blue-100/70 space-y-2">
                  <p>• <strong>Limit:</strong> Only 3 tokens per player.</p>
                  <p>• <strong>Move:</strong> Relocate tokens to adjacent spots once you place all 3.</p>
                  <p>• <strong>Win:</strong> Get 3 in a row.</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Start Action */}
        <MysticalButton
          variant="primary"
          onClick={handleStart}
          disabled={!playMode || (!isOnline && (!gameMode || !startingPlayer)) || (playMode === 'computer' && !difficulty)}
          className="w-full py-4 text-lg font-bold shadow-glow-md disabled:opacity-50 disabled:shadow-none"
        >
          {isOnline ? 'Go to Online Setup' : 'Start Game'}
        </MysticalButton>
      </div>
    </GlassCard>
  );
}

export default GameSetup;
