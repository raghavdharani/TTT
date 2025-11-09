function NewGameButton({ onReset, onNextGame, gameOver, seriesWinner, gameMode }) {
  const handleClick = () => {
    if (seriesWinner) {
      // Series is over, go back to setup
      if (onNextGame) {
        onNextGame()
      }
    } else if (gameOver && onNextGame && gameMode && gameMode > 1) {
      // Game over in a series, continue to next game
      onNextGame()
    } else if (gameOver && gameMode === 1) {
      // Single game over, go back to setup
      if (onNextGame) {
        onNextGame()
      }
    } else if (onReset) {
      // Reset current game
      onReset()
    }
  }

  const getButtonText = () => {
    if (seriesWinner) {
      return 'New Series'
    }
    if (gameOver && gameMode && gameMode > 1) {
      return 'Next Game'
    }
    if (gameOver && gameMode === 1) {
      return 'New Game'
    }
    return 'New Game'
  }

  return (
    <button
      className="
        mt-6 sm:mt-8
        px-6 sm:px-8 py-3 sm:py-4
        bg-blue-500 hover:bg-blue-600 active:bg-blue-700
        text-white font-medium text-base
        rounded-lg
        transition-colors duration-150
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
      "
      onClick={handleClick}
      aria-label={getButtonText()}
    >
      {getButtonText()}
    </button>
  )
}

export default NewGameButton

