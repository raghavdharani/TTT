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
        return 'Player X Wins the Series!'
      }
      if (seriesWinner === 'O') {
        return 'Player O Wins the Series!'
      }
      return "Series Draw!"
    }
    
    if (gameOver && winner === 'X') {
      return 'Player X Wins This Game!'
    }
    if (gameOver && winner === 'O') {
      return 'Player O Wins This Game!'
    }
    if (gameOver && winner === 'draw') {
      return "It's a Draw!"
    }
    if (isRelocating) {
      return `Player ${currentPlayer} is moving a token. Choose a new square.`
    }
    if (!canPlaceNewToken) {
      return `Player ${currentPlayer} has ${currentPlayerTokenCount}/${tokenLimit} tokens. Click a token to relocate it.`
    }
    return `Current Player: ${currentPlayer} (${currentPlayerTokenCount}/${tokenLimit} tokens)`
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

