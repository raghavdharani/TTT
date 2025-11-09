import { useState } from 'react'
import Board from './components/Board'
import GameStatus from './components/GameStatus'
import NewGameButton from './components/NewGameButton'
import Help from './components/Help'
import { calculateWinner, checkDraw } from './utils/gameLogic'

const TOKEN_LIMIT = 3

const countTokens = (squares, player) =>
  squares.reduce((count, square) => (square === player ? count + 1 : count), 0)

// Get adjacent square indices (up, down, left, right only - no diagonals)
const getAdjacentIndices = (index) => {
  const row = Math.floor(index / 3)
  const col = index % 3
  const adjacent = []

  // Top (row - 1)
  if (row > 0) adjacent.push((row - 1) * 3 + col)
  // Bottom (row + 1)
  if (row < 2) adjacent.push((row + 1) * 3 + col)
  // Left (col - 1)
  if (col > 0) adjacent.push(row * 3 + (col - 1))
  // Right (col + 1)
  if (col < 2) adjacent.push(row * 3 + (col + 1))

  return adjacent
}

// Check if a token at the given index can move (has at least one empty adjacent square)
const canTokenMove = (squares, index) => {
  const adjacentIndices = getAdjacentIndices(index)
  return adjacentIndices.some((adjIndex) => squares[adjIndex] === null)
}

// Check if target index is adjacent to source index
const isAdjacent = (sourceIndex, targetIndex) => {
  return getAdjacentIndices(sourceIndex).includes(targetIndex)
}

function App() {
  const [squares, setSquares] = useState(Array(9).fill(null))
  const [xIsNext, setXIsNext] = useState(true)
  const [winner, setWinner] = useState(null)
  const [gameOver, setGameOver] = useState(false)
  const [tokenToMoveIndex, setTokenToMoveIndex] = useState(null)
  const [showHelp, setShowHelp] = useState(false)

  const currentPlayer = xIsNext ? 'X' : 'O'
  const currentPlayerTokenCount = countTokens(squares, currentPlayer)
  const isRelocating = tokenToMoveIndex !== null
  const canPlaceNewToken = currentPlayerTokenCount < TOKEN_LIMIT

  const finalizeMove = (updatedSquares) => {
    setSquares(updatedSquares)

    const gameWinner = calculateWinner(updatedSquares)
    if (gameWinner) {
      setWinner(gameWinner)
      setGameOver(true)
      setTokenToMoveIndex(null)
      return
    }

    if (checkDraw(updatedSquares)) {
      setWinner('draw')
      setGameOver(true)
      setTokenToMoveIndex(null)
      return
    }

    setXIsNext((prev) => !prev)
    setTokenToMoveIndex(null)
  }

  const handleSquareClick = (index) => {
    if (gameOver) {
      return
    }

    const valueAtIndex = squares[index]
    const newSquares = [...squares]

    // If relocating, place token on empty adjacent square
    if (isRelocating) {
      if (valueAtIndex !== null) {
        return
      }

      // If placing token in the same location, cancel relocation without switching turns
      if (index === tokenToMoveIndex) {
        newSquares[index] = currentPlayer
        setSquares(newSquares)
        setTokenToMoveIndex(null)
        return
      }

      // Check if target square is adjacent to the source
      if (!isAdjacent(tokenToMoveIndex, index)) {
        return
      }

      newSquares[index] = currentPlayer
      finalizeMove(newSquares)
      return
    }

    // Allow clicking on your own tokens at any time to relocate them (if they can move)
    if (valueAtIndex === currentPlayer) {
      // Check if this token can move before allowing relocation
      if (!canTokenMove(squares, index)) {
        return
      }

      newSquares[index] = null
      setSquares(newSquares)
      setTokenToMoveIndex(index)
      return
    }

    // Can only place new tokens if under the limit
    if (valueAtIndex !== null) {
      return
    }

    if (!canPlaceNewToken) {
      return
    }

    newSquares[index] = currentPlayer
    finalizeMove(newSquares)
  }

  const handleReset = () => {
    setSquares(Array(9).fill(null))
    setXIsNext(true)
    setWinner(null)
    setGameOver(false)
    setTokenToMoveIndex(null)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md flex flex-col items-center">
        <div className="flex items-center justify-between w-full mb-6 sm:mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
            Tic Tac Toe
          </h1>
          <button
            onClick={() => setShowHelp(true)}
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold text-xl sm:text-2xl flex items-center justify-center transition-colors duration-150"
            aria-label="Show help and rules"
          >
            ?
          </button>
        </div>
        <GameStatus
          currentPlayer={currentPlayer}
          winner={winner}
          gameOver={gameOver}
          isRelocating={isRelocating}
          canPlaceNewToken={canPlaceNewToken}
          currentPlayerTokenCount={currentPlayerTokenCount}
          tokenLimit={TOKEN_LIMIT}
        />
        <Board
          squares={squares}
          onSquareClick={handleSquareClick}
          gameOver={gameOver}
          currentPlayer={currentPlayer}
          currentPlayerTokenCount={currentPlayerTokenCount}
          tokenToMoveIndex={tokenToMoveIndex}
          tokenLimit={TOKEN_LIMIT}
          canTokenMove={canTokenMove}
          isAdjacent={isAdjacent}
        />
        <NewGameButton onReset={handleReset} />
      </div>
      <Help isOpen={showHelp} onClose={() => setShowHelp(false)} />
    </div>
  )
}

export default App
