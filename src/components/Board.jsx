import Square from './Square';

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
  const isRelocating = tokenToMoveIndex !== null;

  // New Helper to determine exact state of each square
  const getSquareState = (value, index) => {
    // 1. Game Over or Computer Turn -> All disabled
    if (gameOver || isComputerTurn) {
      return { disabled: true, isSelected: false, isValidDestination: false };
    }

    // 2. Reloaction Phase
    if (isRelocating) {
      // If this is the token being moved
      if (index === tokenToMoveIndex) {
        return { disabled: false, isSelected: true, isValidDestination: false }; // Can click to cancel
      }

      // If this is an empty square, check if it's a valid move target (adjacent)
      if (value === null) {
        const isTarget = isAdjacent(tokenToMoveIndex, index);
        return {
          disabled: !isTarget,
          isSelected: false,
          isValidDestination: isTarget
        };
      }

      // Other tokens cannot be interacted with during relocation
      return { disabled: true, isSelected: false, isValidDestination: false };
    }

    // 3. Normal Placement Phase (Pre-limit)
    if (value === null) {
      const canPlace = currentPlayerTokenCount < tokenLimit;
      return { disabled: !canPlace, isSelected: false, isValidDestination: false };
    }

    // 4. Selection Phase (for Relocation)
    if (value === currentPlayer) {
      const canMove = canTokenMove(squares, index);
      return { disabled: !canMove, isSelected: false, isValidDestination: false };
    }

    // Opponent tokens
    return { disabled: true, isSelected: false, isValidDestination: false };
  };

  return (
    <div
      className="grid grid-cols-3 gap-3 p-4 bg-navy-900/50 rounded-2xl border border-white/5 shadow-2xl backdrop-blur-sm"
      role="grid"
      aria-label="Tic-tac-toe game board"
    >
      {squares.map((value, index) => {
        const { disabled, isSelected, isValidDestination } = getSquareState(value, index);

        return (
          <Square
            key={index}
            value={value}
            onClick={() => !disabled && onSquareClick(index)}
            disabled={disabled}
            index={index}
            isRelocating={isRelocating}
            isSelected={isSelected}
            isValidDestination={isValidDestination}
          />
        );
      })}
    </div>
  );
}

export default Board;
