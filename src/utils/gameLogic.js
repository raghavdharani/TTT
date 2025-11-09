/**
 * Calculate the winner of the tic-tac-toe game
 * @param {Array<string|null>} squares - Array of 9 squares representing the board
 * @returns {string|null} - Returns 'X', 'O', or null if no winner
 */
export function calculateWinner(squares) {
  const lines = [
    [0, 1, 2], // Row 1
    [3, 4, 5], // Row 2
    [6, 7, 8], // Row 3
    [0, 3, 6], // Column 1
    [1, 4, 7], // Column 2
    [2, 5, 8], // Column 3
    [0, 4, 8], // Diagonal 1
    [2, 4, 6], // Diagonal 2
  ]

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i]
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a] // Returns 'X' or 'O'
    }
  }
  return null
}

/**
 * Check if the game is a draw
 * @param {Array<string|null>} squares - Array of 9 squares representing the board
 * @returns {boolean} - Returns true if board is full and no winner, false otherwise
 */
export function checkDraw(squares) {
  return squares.every((square) => square !== null) && !calculateWinner(squares)
}

