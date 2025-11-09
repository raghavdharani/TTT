function GameStatus({
  currentPlayer,
  winner,
  gameOver,
  isRelocating,
  canPlaceNewToken,
  currentPlayerTokenCount,
  tokenLimit,
}) {
  const getStatusMessage = () => {
    if (gameOver && winner === 'X') {
      return 'Player X Wins!'
    }
    if (gameOver && winner === 'O') {
      return 'Player O Wins!'
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

  return (
    <div
      className="text-lg sm:text-xl font-medium text-gray-800 mb-4 sm:mb-6 text-center"
      role="status"
      aria-live="polite"
      aria-atomic="true"
    >
      {getStatusMessage()}
    </div>
  )
}

export default GameStatus

