import { Token } from './tokens'

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
  const getSeriesInfo = () => {
    if (!gameMode || gameMode === 1) {
      return null
    }
    
    if (seriesWinner) {
      if (seriesWinner === 'X') {
        return (
          <span className="flex items-center justify-center gap-2">
            <span>Series Winner: Player</span>
            <Token value="X" size="small" />
            <span>wins {xWins}-{oWins}!</span>
          </span>
        )
      }
      if (seriesWinner === 'O') {
        return (
          <span className="flex items-center justify-center gap-2">
            <span>Series Winner: Player</span>
            <Token value="O" size="small" />
            <span>wins {oWins}-{xWins}!</span>
          </span>
        )
      }
      return `Series Draw: ${xWins}-${oWins}`
    }
    
    const modeText = gameMode === 3 ? 'Best of 3' : 'Best of 5'
    return (
      <span className="flex items-center justify-center gap-2">
        <span>{modeText} - Game {currentGame}:</span>
        <Token value="X" size="small" />
        <span>{xWins}</span>
        <span>|</span>
        <Token value="O" size="small" />
        <span>{oWins}</span>
      </span>
    )
  }

  const getStatusMessage = () => {
    if (seriesWinner) {
      if (seriesWinner === 'X') {
        return (
          <span className="flex items-center justify-center gap-2">
            <span>Player</span>
            <Token value="X" size="small" />
            <span>Wins the Series!</span>
          </span>
        )
      }
      if (seriesWinner === 'O') {
        return (
          <span className="flex items-center justify-center gap-2">
            <span>Player</span>
            <Token value="O" size="small" />
            <span>Wins the Series!</span>
          </span>
        )
      }
      return "Series Draw!"
    }
    
    if (gameOver && winner === 'X') {
      return (
        <span className="flex items-center justify-center gap-2">
          <span>Player</span>
          <Token value="X" size="small" />
          <span>Wins This Game!</span>
        </span>
      )
    }
    if (gameOver && winner === 'O') {
      return (
        <span className="flex items-center justify-center gap-2">
          <span>Player</span>
          <Token value="O" size="small" />
          <span>Wins This Game!</span>
        </span>
      )
    }
    if (gameOver && winner === 'draw') {
      return "It's a Draw!"
    }
    if (isComputerTurn) {
      if (isComputerThinking) {
        return 'Computer is thinking...'
      }
      return "Computer's turn..."
    }
    if (isRelocating) {
      return (
        <span className="flex items-center justify-center gap-2">
          <span>Player</span>
          <Token value={currentPlayer} size="small" />
          <span>is moving a token. Choose a new square.</span>
        </span>
      )
    }
    if (!canPlaceNewToken) {
      return (
        <span className="flex items-center justify-center gap-2">
          <span>Player</span>
          <Token value={currentPlayer} size="small" />
          <span>has {currentPlayerTokenCount}/{tokenLimit} tokens. Click a token to relocate it.</span>
        </span>
      )
    }
    return (
      <span className="flex items-center justify-center gap-2">
        <span>Current Player:</span>
        <Token value={currentPlayer} size="small" />
        <span>({currentPlayerTokenCount}/{tokenLimit} tokens)</span>
      </span>
    )
  }

  const seriesInfo = getSeriesInfo()

  return (
    <div className="mb-4 sm:mb-6">
      {seriesInfo && (
        <div
          className="text-base sm:text-lg font-semibold text-mystical-blue mb-2 text-center text-shadow-glow"
          role="status"
          aria-live="polite"
        >
          {seriesInfo}
        </div>
      )}
      <div
        className="text-lg sm:text-xl font-medium text-white text-center text-shadow"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        {getStatusMessage()}
      </div>
    </div>
  )
}

export default GameStatus

