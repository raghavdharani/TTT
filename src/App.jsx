import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Board from './components/Board'
import GameStatus from './components/GameStatus'
import NewGameButton from './components/NewGameButton'
import Help from './components/Help'
import GameSetup from './components/GameSetup'
import OnlineGameSetup from './components/OnlineGameSetup'
import { calculateWinner, checkDraw } from './utils/gameLogic'
import { getComputerMove } from './utils/ai'

const TOKEN_LIMIT = 3

const countTokens = (squares, player) =>
  squares.reduce((count, square) => (square === player ? count + 1 : count), 0)

const getAdjacentIndices = (index) => {
  const row = Math.floor(index / 3)
  const col = index % 3
  const adjacent = []
  if (row > 0) adjacent.push((row - 1) * 3 + col)
  if (row < 2) adjacent.push((row + 1) * 3 + col)
  if (col > 0) adjacent.push(row * 3 + (col - 1))
  if (col < 2) adjacent.push(row * 3 + (col + 1))
  return adjacent
}

const canTokenMove = (squares, index) => {
  const adjacentIndices = getAdjacentIndices(index)
  return adjacentIndices.some((adjIndex) => squares[adjIndex] === null)
}

const isAdjacent = (sourceIndex, targetIndex) => {
  return getAdjacentIndices(sourceIndex).includes(targetIndex)
}

function App() {
  // Game setup state
  const [showSetup, setShowSetup] = useState(true)
  const [playMode, setPlayMode] = useState(null)
  const [difficulty, setDifficulty] = useState(null)
  const [gameMode, setGameMode] = useState(null)
  const [seriesStartingPlayer, setSeriesStartingPlayer] = useState(null)

  // Online State
  const [socket, setSocket] = useState(null)
  const [onlinePlayerSymbol, setOnlinePlayerSymbol] = useState(null)
  const [roomId, setRoomId] = useState(null)

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

  const isComputerTurn = playMode === 'computer' && currentPlayer === 'O' && !gameOver
  const isOnlineTurn = playMode === 'online' && currentPlayer === onlinePlayerSymbol && !gameOver

  // Online Game Listeners
  useEffect(() => {
    if (playMode !== 'online' || !socket) return

    const handleGameStateUpdated = ({ gameState }) => {
      setSquares(gameState.squares)
      setXIsNext(gameState.xIsNext)
      setWinner(gameState.winner)
      setGameOver(gameState.gameOver)
      setTokenToMoveIndex(gameState.tokenToMoveIndex)
      setXWins(gameState.xWins)
      setOWins(gameState.oWins)
      setSeriesWinner(gameState.seriesWinner)
      setCurrentGame(gameState.currentGame)
    }

    const handleNewGameStarted = ({ gameState }) => {
      setSquares(gameState.squares)
      setXIsNext(gameState.xIsNext)
      setWinner(gameState.winner)
      setGameOver(gameState.gameOver)
      setTokenToMoveIndex(gameState.tokenToMoveIndex)
      // Keep wins/series info
    }

    const handleGameReset = ({ gameState }) => {
      setSquares(gameState.squares)
      setXIsNext(gameState.xIsNext)
      setWinner(gameState.winner)
      setGameOver(gameState.gameOver)
      setTokenToMoveIndex(gameState.tokenToMoveIndex)
    }

    const handlePlayerLeft = () => {
      alert('Opponent disconnected')
      handleBackToSetup()
    }

    socket.on('game-state-updated', handleGameStateUpdated)
    socket.on('new-game-started', handleNewGameStarted)
    socket.on('game-reset', handleGameReset)
    socket.on('player-left', handlePlayerLeft)

    return () => {
      socket.off('game-state-updated', handleGameStateUpdated)
      socket.off('new-game-started', handleNewGameStarted)
      socket.off('game-reset', handleGameReset)
      socket.off('player-left', handlePlayerLeft)
    }
  }, [playMode, socket])

  const checkSeriesWinner = (xWins, oWins, gameMode, totalGamesPlayed) => {
    if (gameMode === 1) return null
    const neededWins = Math.ceil(gameMode / 2)
    if (xWins >= neededWins) return 'X'
    if (oWins >= neededWins) return 'O'
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
      if (gameWinner === 'X') {
        const newXWins = xWins + 1
        setXWins(newXWins)
        const seriesWin = checkSeriesWinner(newXWins, oWins, gameMode, newXWins + oWins)
        if (seriesWin) setSeriesWinner(seriesWin)
      } else if (gameWinner === 'O') {
        const newOWins = oWins + 1
        setOWins(newOWins)
        const seriesWin = checkSeriesWinner(xWins, newOWins, gameMode, xWins + newOWins)
        if (seriesWin) setSeriesWinner(seriesWin)
      }
      return
    }
    if (checkDraw(updatedSquares)) {
      setWinner('draw')
      setGameOver(true)
      setTokenToMoveIndex(null)
      const seriesWin = checkSeriesWinner(xWins, oWins, gameMode, xWins + oWins + 1)
      if (seriesWin) setSeriesWinner(seriesWin)
      return
    }
    setXIsNext((prev) => !prev)
    setTokenToMoveIndex(null)
  }

  // Computer AI Logic
  useEffect(() => {
    if (!isComputerTurn || isComputerThinking || isRelocating || gameOver || !difficulty) return
    setIsComputerThinking(true)
    const timer = setTimeout(() => {
      const currentSquares = squares
      const move = getComputerMove(currentSquares, 'O', difficulty)
      if (move) {
        if (move.type === 'place') {
          const newSquares = [...currentSquares]
          newSquares[move.to] = 'O'
          finalizeMove(newSquares)
        } else {
          setTokenToMoveIndex(move.from)
          const newSquares = [...currentSquares]
          newSquares[move.from] = null
          setSquares(newSquares)
          setTimeout(() => {
            const finalSquares = [...newSquares]
            finalSquares[move.to] = 'O'
            finalizeMove(finalSquares)
          }, 300)
        }
      } else {
        setIsComputerThinking(false)
      }
    }, 500)
    return () => clearTimeout(timer)
  }, [isComputerTurn, isComputerThinking, isRelocating, gameOver, difficulty])

  const handleSquareClick = (index) => {
    if (gameOver || isComputerTurn) return

    // Online Check: Must be your turn
    if (playMode === 'online' && currentPlayer !== onlinePlayerSymbol) return

    const valueAtIndex = squares[index]
    const newSquares = [...squares]

    // Online Emission Helper
    const emitMove = (type, from, to) => {
      if (playMode === 'online' && socket) {
        socket.emit('make-move', { moveType: type, fromIndex: from, toIndex: to })
      }
    }

    if (isRelocating) {
      if (valueAtIndex !== null) return

      // Cancel Selection (Same Token Clicked)
      if (index === tokenToMoveIndex) {
        if (playMode === 'online') {
          emitMove('cancel-relocate', index, null) // Optimistic update handled by server response
        } else {
          newSquares[index] = currentPlayer
          setSquares(newSquares)
          setTokenToMoveIndex(null)
        }
        return
      }

      if (!isAdjacent(tokenToMoveIndex, index)) return

      if (playMode === 'online') {
        emitMove('relocate', tokenToMoveIndex, index)
      } else {
        newSquares[index] = currentPlayer
        finalizeMove(newSquares)
      }
      return
    }

    // Pick up token to relocate
    if (valueAtIndex === currentPlayer) {
      if (!canTokenMove(squares, index)) return

      if (playMode === 'online') {
        emitMove('pickup', index, null)
      } else {
        newSquares[index] = null
        setSquares(newSquares)
        setTokenToMoveIndex(index)
      }
      return
    }

    // Place new token
    if (valueAtIndex !== null || !canPlaceNewToken) return

    if (playMode === 'online') {
      emitMove('place', null, index)
    } else {
      newSquares[index] = currentPlayer
      finalizeMove(newSquares)
    }
  }

  const handleGameStart = (newPlayMode, mode, startingPlayer, newDifficulty, newRoomId, newSocket, symbol) => {
    setPlayMode(newPlayMode)
    setDifficulty(newDifficulty)
    setGameMode(mode)
    setSeriesStartingPlayer(startingPlayer)
    setShowSetup(false)
    setCurrentGame(1)
    setXWins(0)
    setOWins(0)
    setSeriesWinner(null)

    // Online specific setup
    if (newPlayMode === 'online') {
      setRoomId(newRoomId)
      setSocket(newSocket)
      setOnlinePlayerSymbol(symbol)
      // Game state will be synced via socket events
    } else {
      startNewGame(startingPlayer)
    }
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
      handleBackToSetup()
    } else {
      if (playMode === 'online') {
        socket.emit('start-new-game')
      } else {
        const nextGameNumber = currentGame + 1
        const shouldStartWithOriginal = nextGameNumber % 2 === 1
        const nextStartingPlayer = shouldStartWithOriginal
          ? seriesStartingPlayer
          : (seriesStartingPlayer === 'X' ? 'O' : 'X')
        setCurrentGame(nextGameNumber)
        startNewGame(nextStartingPlayer)
      }
    }
  }

  const handleReset = () => {
    if (playMode === 'online') {
      socket.emit('reset-game')
    } else {
      startNewGame(xIsNext ? 'X' : 'O')
    }
  }

  const handleBackToSetup = () => {
    setShowSetup(true)
    setPlayMode(null)
    setDifficulty(null)
    setGameMode(null)
    setSeriesStartingPlayer(null)
    setCurrentGame(1)
    setXWins(0)
    setOWins(0)
    setSeriesWinner(null)
    setRoomId(null)
    setSocket(null)
    setOnlinePlayerSymbol(null)
    setSquares(Array(9).fill(null))
    setWinner(null)
    setGameOver(false)
    setTokenToMoveIndex(null)
  }

  return (
    <div className="min-h-screen bg-navy-900 text-white flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background Ambient Effects */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary-glow/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-[100px]" />
      </div>

      <AnimatePresence mode="wait">
        {showSetup ? (
          <motion.div
            key="setup"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="z-10 w-full flex justify-center"
          >
            {/* If playMode is online, show Online Setup, else show Main Setup */}
            {playMode === 'online' ? (
              <OnlineGameSetup onStart={handleGameStart} onCancel={() => setPlayMode(null)} />
            ) : (
              <GameSetup onStart={(...args) => {
                // Intercept 'online' selection to trigger OnlineGameSetup view next
                if (args[0] === 'online') {
                  setPlayMode('online')
                } else {
                  handleGameStart(...args)
                }
              }} />
            )}
          </motion.div>
        ) : (
          <motion.div
            key="game"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="w-full max-w-md flex flex-col items-center z-10"
          >
            {/* Header / Title */}
            <div className="mb-6 text-center">
              <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-purple-300 drop-shadow-sm">
                ShiftTacToe
              </h1>
              {playMode === 'online' && (
                <div className="text-xs text-blue-300/60 mt-1 flex items-center justify-center gap-2">
                  <span>Room: {roomId}</span>
                  <span className="w-1 h-1 bg-white/20 rounded-full" />
                  <span>You: {onlinePlayerSymbol}</span>
                </div>
              )}
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
              playMode={playMode}
              onlinePlayerSymbol={onlinePlayerSymbol}
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
              // Online props
              playMode={playMode}
              isOnlineTurn={isOnlineTurn}
              onlinePlayerSymbol={onlinePlayerSymbol}
            />

            <NewGameButton
              onReset={handleReset}
              onNextGame={handleNextGame}
              // Add explicit Back handler for Online mode or general exit
              onBack={handleBackToSetup}
              gameOver={gameOver}
              seriesWinner={seriesWinner}
              gameMode={gameMode}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default App
