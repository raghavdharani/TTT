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
        return `Series Winner: Player X wins ${xWins}-${oWins}!`
      }
      if (seriesWinner === 'O') {
        return `Series Winner: Player O wins ${oWins}-${xWins}!`
      }
      return `Series Draw: ${xWins}-${oWins}`
    }
    
    const modeText = gameMode === 3 ? 'Best of 3' : 'Best of 5'
    return `${modeText} - Game ${currentGame}: X: ${xWins} | O: ${oWins}`
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
          className="text-base sm:text-lg font-semibold text-blue-600 mb-2 text-center"
          role="status"
          aria-live="polite"
        >
          {seriesInfo}
        </div>
      )}
      <div
        className="text-lg sm:text-xl font-medium text-gray-800 text-center"
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

