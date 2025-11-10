import { calculateWinner } from './gameLogic'

const TOKEN_LIMIT = 3

/**
 * Count tokens for a player
 */
const countTokens = (squares, player) =>
  squares.reduce((count, square) => (square === player ? count + 1 : count), 0)

/**
 * Get adjacent square indices (up, down, left, right only - no diagonals)
 */
const getAdjacentIndices = (index) => {
  const row = Math.floor(index / 3)
  const col = index % 3
  const adjacent = []

  if (row > 0) adjacent.push((row - 1) * 3 + col) // Top
  if (row < 2) adjacent.push((row + 1) * 3 + col) // Bottom
  if (col > 0) adjacent.push(row * 3 + (col - 1)) // Left
  if (col < 2) adjacent.push(row * 3 + (col + 1)) // Right

  return adjacent
}

/**
 * Check if a token at the given index can move
 */
const canTokenMove = (squares, index) => {
  const adjacentIndices = getAdjacentIndices(index)
  return adjacentIndices.some((adjIndex) => squares[adjIndex] === null)
}

/**
 * Check if target index is adjacent to source index
 */
const isAdjacent = (sourceIndex, targetIndex) => {
  return getAdjacentIndices(sourceIndex).includes(targetIndex)
}

/**
 * Get all valid moves for a player
 * Returns array of { type: 'place'|'move', from: index|null, to: index }
 */
export const getValidMoves = (squares, player) => {
  const moves = []
  const playerTokenCount = countTokens(squares, player)
  const canPlaceNew = playerTokenCount < TOKEN_LIMIT

  // Get all empty squares for placing new tokens
  if (canPlaceNew) {
    squares.forEach((square, index) => {
      if (square === null) {
        moves.push({ type: 'place', from: null, to: index })
      }
    })
  }

  // Get all valid token movements
  squares.forEach((square, index) => {
    if (square === player && canTokenMove(squares, index)) {
      const adjacentIndices = getAdjacentIndices(index)
      adjacentIndices.forEach((adjIndex) => {
        if (squares[adjIndex] === null) {
          moves.push({ type: 'move', from: index, to: adjIndex })
        }
      })
    }
  })

  return moves
}

/**
 * Check if a move would create a winning line
 */
const wouldWin = (squares, player, move) => {
  const newSquares = [...squares]
  if (move.type === 'place') {
    newSquares[move.to] = player
  } else {
    newSquares[move.from] = null
    newSquares[move.to] = player
  }
  return calculateWinner(newSquares) === player
}

/**
 * Check if a move would block opponent's winning move
 */
const wouldBlock = (squares, player, opponent, move) => {
  // Check if opponent would win on this square if we don't block
  const opponentMoves = getValidMoves(squares, opponent)
  const wouldOpponentWin = opponentMoves.some((oppMove) => {
    if (oppMove.to === move.to) {
      return wouldWin(squares, opponent, oppMove)
    }
    return false
  })
  return wouldOpponentWin
}

/**
 * Evaluate board position for a player (higher is better)
 * Used for minimax-like evaluation
 */
const evaluatePosition = (squares, player, opponent) => {
  const winner = calculateWinner(squares)
  if (winner === player) return 100
  if (winner === opponent) return -100

  let score = 0
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6], // Diagonals
  ]

  lines.forEach((line) => {
    const [a, b, c] = line
    const playerCount = [squares[a], squares[b], squares[c]].filter((s) => s === player).length
    const opponentCount = [squares[a], squares[b], squares[c]].filter((s) => s === opponent).length

    if (playerCount === 2 && opponentCount === 0) score += 10 // Two in a row
    if (playerCount === 1 && opponentCount === 0) score += 1 // One in a row
    if (opponentCount === 2 && playerCount === 0) score -= 10 // Block opponent's two
    if (opponentCount === 1 && playerCount === 0) score -= 1 // Block opponent's one
  })

  return score
}

/**
 * Minimax algorithm for optimal play (Insane difficulty)
 */
const minimax = (squares, player, opponent, depth, isMaximizing, alpha, beta) => {
  const winner = calculateWinner(squares)
  if (winner === player) return 100 - depth
  if (winner === opponent) return -100 + depth
  if (squares.every((s) => s !== null)) return 0

  // Limit depth for performance
  if (depth > 6) {
    return evaluatePosition(squares, player, opponent)
  }

  const moves = getValidMoves(squares, isMaximizing ? player : opponent)

  if (isMaximizing) {
    let maxEval = -Infinity
    for (const move of moves) {
      const newSquares = [...squares]
      if (move.type === 'place') {
        newSquares[move.to] = player
      } else {
        newSquares[move.from] = null
        newSquares[move.to] = player
      }
      const evaluation = minimax(newSquares, player, opponent, depth + 1, false, alpha, beta)
      maxEval = Math.max(maxEval, evaluation)
      alpha = Math.max(alpha, evaluation)
      if (beta <= alpha) break // Alpha-beta pruning
    }
    return maxEval
  } else {
    let minEval = Infinity
    for (const move of moves) {
      const newSquares = [...squares]
      if (move.type === 'place') {
        newSquares[move.to] = opponent
      } else {
        newSquares[move.from] = null
        newSquares[move.to] = opponent
      }
      const evaluation = minimax(newSquares, player, opponent, depth + 1, true, alpha, beta)
      minEval = Math.min(minEval, evaluation)
      beta = Math.min(beta, evaluation)
      if (beta <= alpha) break // Alpha-beta pruning
    }
    return minEval
  }
}

/**
 * Get best move using minimax (for Insane difficulty)
 */
const getBestMove = (squares, player, opponent) => {
  const moves = getValidMoves(squares, player)
  if (moves.length === 0) return null

  let bestMove = null
  let bestEval = -Infinity

  for (const move of moves) {
    const newSquares = [...squares]
    if (move.type === 'place') {
      newSquares[move.to] = player
    } else {
      newSquares[move.from] = null
      newSquares[move.to] = player
    }
    const evaluation = minimax(newSquares, player, opponent, 0, false, -Infinity, Infinity)
    if (evaluation > bestEval) {
      bestEval = evaluation
      bestMove = move
    }
  }

  return bestMove
}

/**
 * Get strategic move (for Hard difficulty - 30% more difficult than Easy)
 * Makes good moves 70% of the time, random 30%
 */
const getStrategicMove = (squares, player, opponent) => {
  const moves = getValidMoves(squares, player)
  if (moves.length === 0) return null

  // 70% chance to make a strategic move
  if (Math.random() < 0.7) {
    // Try to win
    const winningMove = moves.find((move) => wouldWin(squares, player, move))
    if (winningMove) return winningMove

    // Try to block
    const blockingMove = moves.find((move) => wouldBlock(squares, player, opponent, move))
    if (blockingMove) return blockingMove

    // Make a move that improves position
    let bestMove = null
    let bestScore = -Infinity

    moves.forEach((move) => {
      const newSquares = [...squares]
      if (move.type === 'place') {
        newSquares[move.to] = player
      } else {
        newSquares[move.from] = null
        newSquares[move.to] = player
      }
      const score = evaluatePosition(newSquares, player, opponent)
      if (score > bestScore) {
        bestScore = score
        bestMove = move
      }
    })

    return bestMove || moves[Math.floor(Math.random() * moves.length)]
  }

  // 30% random move
  return moves[Math.floor(Math.random() * moves.length)]
}

/**
 * Get easy move (random with occasional good plays)
 * Makes good moves 30% of the time, random 70%
 */
const getEasyMove = (squares, player, opponent) => {
  const moves = getValidMoves(squares, player)
  if (moves.length === 0) return null

  // 30% chance to make a good move
  if (Math.random() < 0.3) {
    // Try to win
    const winningMove = moves.find((move) => wouldWin(squares, player, move))
    if (winningMove) return winningMove

    // Try to block
    const blockingMove = moves.find((move) => wouldBlock(squares, player, opponent, move))
    if (blockingMove) return blockingMove
  }

  // 70% random move
  return moves[Math.floor(Math.random() * moves.length)]
}

/**
 * Get computer move based on difficulty
 * @param {Array} squares - Current board state
 * @param {string} computerPlayer - 'X' or 'O' (the computer's symbol)
 * @param {string} difficulty - 'easy', 'hard', or 'insane'
 * @returns {Object|null} - Move object { type, from, to } or null if no moves
 */
export const getComputerMove = (squares, computerPlayer, difficulty) => {
  const humanPlayer = computerPlayer === 'X' ? 'O' : 'X'

  switch (difficulty) {
    case 'easy':
      return getEasyMove(squares, computerPlayer, humanPlayer)
    case 'hard':
      return getStrategicMove(squares, computerPlayer, humanPlayer)
    case 'insane':
      return getBestMove(squares, computerPlayer, humanPlayer)
    default:
      return getEasyMove(squares, computerPlayer, humanPlayer)
  }
}

