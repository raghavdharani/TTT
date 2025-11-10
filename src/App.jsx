import { useState, useEffect } from 'react'
import Board from './components/Board'
import GameStatus from './components/GameStatus'
import NewGameButton from './components/NewGameButton'
import Help from './components/Help'
import GameSetup from './components/GameSetup'
import { calculateWinner, checkDraw } from './utils/gameLogic'
import { getComputerMove } from './utils/ai'

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
  // Game setup state
  const [showSetup, setShowSetup] = useState(true)
  const [playMode, setPlayMode] = useState(null) // '2player' or 'computer'
  const [difficulty, setDifficulty] = useState(null) // 'easy', 'hard', 'insane'
  const [gameMode, setGameMode] = useState(null) // 1, 3, or 5
  const [seriesStartingPlayer, setSeriesStartingPlayer] = useState(null) // 'X' or 'O'
  
  // Series state
  const [currentGame, setCurrentGame] = useState(1)
  const [xWins, setXWins] = useState(0)
  const [oWins, setOWins] = useState(0)
  const [seriesWinner, setSeriesWinner] = useState(null)
  
  // Game state
  const [squares, setSquares] = useState(Array(9).fill(null))
  const [xIsNext, setXIsNext] = useState(true)
  const [winner, setWinner] = useState(null)
  const [gameOver, setGameOver] = useState(false)
  const [tokenToMoveIndex, setTokenToMoveIndex] = useState(null)
  const [showHelp, setShowHelp] = useState(false)
  const [isComputerThinking, setIsComputerThinking] = useState(false)

  const currentPlayer = xIsNext ? 'X' : 'O'
  const currentPlayerTokenCount = countTokens(squares, currentPlayer)
  const isRelocating = tokenToMoveIndex !== null
  const canPlaceNewToken = currentPlayerTokenCount < TOKEN_LIMIT
  
  // Determine if current player is computer
  // In computer mode, the computer always plays as 'O'
  const isComputerTurn = playMode === 'computer' && currentPlayer === 'O' && !gameOver

  const checkSeriesWinner = (xWins, oWins, gameMode, totalGamesPlayed) => {
    if (gameMode === 1) {
      // Single game - winner is determined by the game itself
      return null
    }
    
    const neededWins = Math.ceil(gameMode / 2) // 2 for best of 3, 3 for best of 5
    if (xWins >= neededWins) {
      return 'X'
    }
    if (oWins >= neededWins) {
      return 'O'
    }
    
    // Check if series is over (all games played)
    if (totalGamesPlayed >= gameMode) {
      if (xWins > oWins) return 'X'
      if (oWins > xWins) return 'O'
      return 'draw'
    }
    return null
  }

  const finalizeMove = (updatedSquares) => {
    setSquares(updatedSquares)

    const gameWinner = calculateWinner(updatedSquares)
    if (gameWinner) {
      setWinner(gameWinner)
      setGameOver(true)
      setTokenToMoveIndex(null)
      
      // Update series wins
      if (gameWinner === 'X') {
        const newXWins = xWins + 1
        setXWins(newXWins)
        const totalGames = newXWins + oWins
        const seriesWin = checkSeriesWinner(newXWins, oWins, gameMode, totalGames)
        if (seriesWin) {
          setSeriesWinner(seriesWin)
        }
      } else if (gameWinner === 'O') {
        const newOWins = oWins + 1
        setOWins(newOWins)
        const totalGames = xWins + newOWins
        const seriesWin = checkSeriesWinner(xWins, newOWins, gameMode, totalGames)
        if (seriesWin) {
          setSeriesWinner(seriesWin)
        }
      }
      return
    }

    if (checkDraw(updatedSquares)) {
      setWinner('draw')
      setGameOver(true)
      setTokenToMoveIndex(null)
      
      // Check if series is over after draw
      const totalGames = xWins + oWins + 1
      const seriesWin = checkSeriesWinner(xWins, oWins, gameMode, totalGames)
      if (seriesWin) {
        setSeriesWinner(seriesWin)
      }
      return
    }

    setXIsNext((prev) => !prev)
    setTokenToMoveIndex(null)
  }

  // Handle computer moves
  useEffect(() => {
    // Only run if it's computer's turn, not already thinking, not relocating, and game not over
    if (!isComputerTurn || isComputerThinking || isRelocating || gameOver) {
      return
    }
    
    setIsComputerThinking(true)
    
    // Add a small delay to make the computer move feel more natural
    const timer = setTimeout(() => {
      const move = getComputerMove(squares, 'O', difficulty)
      
      if (move) {
        if (move.type === 'place') {
          // Place a new token
          const newSquares = [...squares]
          newSquares[move.to] = 'O'
          finalizeMove(newSquares)
        } else {
          // Computer is moving a token - first pick it up
          setTokenToMoveIndex(move.from)
          const newSquares = [...squares]
          newSquares[move.from] = null
          setSquares(newSquares)
          
          // Then place it after a short delay
          setTimeout(() => {
            const finalSquares = [...newSquares]
            finalSquares[move.to] = 'O'
            finalizeMove(finalSquares)
          }, 300)
        }
      }
      
      setIsComputerThinking(false)
    }, 500) // 500ms delay for better UX
    
    return () => clearTimeout(timer)
  }, [isComputerTurn, squares, difficulty, gameOver])

  const handleSquareClick = (index) => {
    if (gameOver || isComputerTurn) {
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

  const handleGameStart = (newPlayMode, mode, startingPlayer, newDifficulty) => {
    setPlayMode(newPlayMode)
    setDifficulty(newDifficulty)
    setGameMode(mode)
    setSeriesStartingPlayer(startingPlayer)
    setShowSetup(false)
    setCurrentGame(1)
    setXWins(0)
    setOWins(0)
    setSeriesWinner(null)
    startNewGame(startingPlayer)
  }

  const startNewGame = (startingPlayer) => {
    setSquares(Array(9).fill(null))
    setXIsNext(startingPlayer === 'X')
    setWinner(null)
    setGameOver(false)
    setTokenToMoveIndex(null)
  }

  const handleNextGame = () => {
    if (seriesWinner || (gameMode === 1 && gameOver)) {
      // Series is over, or single game is over - go back to setup
      setShowSetup(true)
      setPlayMode(null)
      setDifficulty(null)
      setGameMode(null)
      setSeriesStartingPlayer(null)
      setCurrentGame(1)
      setXWins(0)
      setOWins(0)
      setSeriesWinner(null)
    } else {
      // Continue series - alternate starting player
      // After game 1 (odd): next game should start with opposite
      // After game 2 (even): next game should start with original
      // So: if currentGame is odd, next uses opposite; if even, next uses original
      const nextGameNumber = currentGame + 1
      const shouldStartWithOriginal = nextGameNumber % 2 === 1
      const nextStartingPlayer = shouldStartWithOriginal 
        ? seriesStartingPlayer 
        : (seriesStartingPlayer === 'X' ? 'O' : 'X')
      
      setCurrentGame(nextGameNumber)
      startNewGame(nextStartingPlayer)
    }
  }

  const handleReset = () => {
    // Reset current game only
    startNewGame(xIsNext ? 'X' : 'O')
  }

  if (showSetup) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <GameSetup onStart={handleGameStart} />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md flex flex-col items-center">
        <div className="flex items-center justify-between w-full mb-6 sm:mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
            Tic Tac Toe with a Twist
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
          gameMode={gameMode}
          currentGame={currentGame}
          xWins={xWins}
          oWins={oWins}
          seriesWinner={seriesWinner}
          isComputerTurn={isComputerTurn}
          isComputerThinking={isComputerThinking}
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
          isComputerTurn={isComputerTurn}
        />
        <NewGameButton
          onReset={handleReset}
          onNextGame={handleNextGame}
          gameOver={gameOver}
          seriesWinner={seriesWinner}
          gameMode={gameMode}
        />
      </div>
      <Help isOpen={showHelp} onClose={() => setShowHelp(false)} />
    </div>
  )
}

export default App
