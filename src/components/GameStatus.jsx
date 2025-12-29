import GlassCard from './ui/GlassCard';

function GameStatus({
  currentPlayer,
  winner,
  gameOver,
  isRelocating,
  canPlaceNewToken,
  currentPlayerTokenCount,
  tokenLimit,
  gameMode,
  currentGame,
  xWins,
  oWins,
  seriesWinner,
  isComputerTurn,
  isComputerThinking,
}) {
  const getStatusContent = () => {
    if (seriesWinner) {
      return {
        title: seriesWinner === 'draw' ? 'Series Draw!' : `Player ${seriesWinner} Wins Series!`,
        subtitle: `Final Score: X ${xWins} - ${oWins} O`,
        color: 'text-primary-glow'
      };
    }

    if (gameOver) {
      if (winner === 'draw') return { title: "It's a Draw!", subtitle: "No moves left", color: 'text-white/80' };
      return {
        title: `Player ${winner} Wins!`,
        subtitle: "Click New Game to play again",
        color: winner === 'X' ? 'text-token-x' : 'text-token-o'
      };
    }

    if (isComputerTurn) {
      return {
        title: "Computer's Turn",
        subtitle: isComputerThinking ? "Thinking strategy..." : "Acting...",
        color: "text-blue-300"
      };
    }

    if (isRelocating) {
      return {
        title: "Relocation Phase",
        subtitle: "Select a new square for your token",
        color: "text-primary-accent"
      };
    }

    if (!canPlaceNewToken) {
      return {
        title: "Token Limit Reached",
        subtitle: "Select one of your tokens to move it",
        color: "text-status-attention"
      };
    }

    return {
      title: `Player ${currentPlayer}'s Turn`,
      subtitle: `Place token (${currentPlayerTokenCount + 1}/${tokenLimit})`,
      color: currentPlayer === 'X' ? 'text-token-x' : 'text-token-o'
    };
  };

  const content = getStatusContent();

  return (
    <GlassCard className="mb-6 px-6 py-4 w-full text-center flex flex-col items-center justify-center min-h-[100px]">

      {/* Series Score (Small Top) */}
      {gameMode > 1 && (
        <div className="text-xs uppercase tracking-widest text-blue-200/50 mb-1">
          {seriesWinner ? 'Series Completed' : `Game ${currentGame} of ${gameMode} • Score: ${xWins}-${oWins}`}
        </div>
      )}

      {/* Main Status */}
      <div className={`text-2xl sm:text-3xl font-bold mb-1 transition-colors duration-300 drop-shadow-sm ${content.color}`}>
        {content.title}
      </div>

      {/* Subtitle / Instruction */}
      <div className="text-sm text-blue-100/70 font-light">
        {content.subtitle}
      </div>
    </GlassCard>
  );
}

export default GameStatus;
