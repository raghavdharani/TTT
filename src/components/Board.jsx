import Square from './Square'

function Board({
  squares,
  onSquareClick,
  gameOver,
  currentPlayer,
  currentPlayerTokenCount,
  tokenToMoveIndex,
  tokenLimit,
  canTokenMove,
  isAdjacent,
}) {
  const isRelocating = tokenToMoveIndex !== null

  const isSquareEnabled = (value, index) => {
    if (gameOver) {
      return false
    }

    // When relocating, only empty adjacent squares are enabled (including the original location)
    if (isRelocating) {
      if (value !== null) {
        return false
      }
      // Enable if the square is adjacent to the token being moved OR it's the original location
      return isAdjacent(tokenToMoveIndex, index) || index === tokenToMoveIndex
    }

    // Empty squares are enabled if player can place new tokens
    if (value === null) {
      return currentPlayerTokenCount < tokenLimit
    }

    // Player's own tokens are enabled only if they can move
    if (value === currentPlayer) {
      return canTokenMove(squares, index)
    }

    // Opponent's tokens are never enabled
    return false
  }

  return (
    <div
      className="grid grid-cols-3 gap-2 w-full max-w-xs sm:max-w-sm md:max-w-md"
      role="grid"
      aria-label="Tic-tac-toe game board"
    >
      {squares.map((value, index) => {
        const enabled = isSquareEnabled(value, index)
        return (
          <Square
            key={index}
            value={value}
            onClick={() => enabled && onSquareClick(index)}
            disabled={!enabled}
            index={index}
          />
        )
      })}
    </div>
  )
}

export default Board

