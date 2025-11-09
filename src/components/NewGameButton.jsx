function NewGameButton({ onReset }) {
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
      onClick={onReset}
      aria-label="Start a new game"
    >
      New Game
    </button>
  )
}

export default NewGameButton

