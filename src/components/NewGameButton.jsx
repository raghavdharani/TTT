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
      className="btn-primary mt-6 sm:mt-8"
      onClick={handleClick}
      aria-label={getButtonText()}
    >
      {getButtonText()}
    </button>
  )
}

export default NewGameButton

