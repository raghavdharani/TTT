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
  isComputerTurn,
}) {
  const isRelocating = tokenToMoveIndex !== null

  const isSquareEnabled = (value, index) => {
    if (gameOver || isComputerTurn) {
      return false
    }

    // When relocating, allow placing on empty adjacent squares OR switching to another token
    if (isRelocating) {
      // Allow switching to a different token of the same player (if it can move)
      // Players can move tokens at any time, not just when at token limit
      if (value === currentPlayer) {
        return canTokenMove(squares, index)
      }
      // Enable empty squares if adjacent to the token being moved OR it's the original location
      if (value === null) {
        return isAdjacent(tokenToMoveIndex, index) || index === tokenToMoveIndex
      }
      return false
    }

    // Empty squares are enabled if player can place new tokens
    if (value === null) {
      return currentPlayerTokenCount < tokenLimit
    }

    // Player's own tokens are enabled if they can move (at any time)
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
      aria-label="ShiftTacToe game board"
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

