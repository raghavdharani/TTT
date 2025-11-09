function Square({ value, onClick, disabled, index }) {
  const row = Math.floor(index / 3) + 1
  const col = (index % 3) + 1
  const ariaLabel = `${value || 'Empty'} square, row ${row}, column ${col}`

  const renderMarker = () => {
    if (value === 'X') {
      return (
        <svg
          className="animate-pulse w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24"
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          role="img"
          aria-label="X marker"
        >
          <line
            x1="20"
            y1="20"
            x2="80"
            y2="80"
            stroke="#3b82f6"
            strokeWidth="12"
            strokeLinecap="round"
            filter="drop-shadow(0 0 4px rgba(59, 130, 246, 0.8))"
          />
          <line
            x1="80"
            y1="20"
            x2="20"
            y2="80"
            stroke="#3b82f6"
            strokeWidth="12"
            strokeLinecap="round"
            filter="drop-shadow(0 0 4px rgba(59, 130, 246, 0.8))"
          />
        </svg>
      )
    }
    if (value === 'O') {
      return (
        <svg
          className="animate-spin w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24"
          style={{ animationDuration: '3s' }}
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          role="img"
          aria-label="O marker"
        >
          <circle
            cx="50"
            cy="50"
            r="35"
            stroke="#ef4444"
            strokeWidth="12"
            fill="none"
            filter="drop-shadow(0 0 4px rgba(239, 68, 68, 0.8))"
          />
        </svg>
      )
    }
    return null
  }

  return (
    <button
      className={`
        w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28
        border-2 border-gray-300
        bg-white
        hover:bg-gray-50
        disabled:opacity-60 disabled:cursor-not-allowed
        disabled:hover:bg-white
        flex items-center justify-center
        transition-colors duration-150
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
      `}
      disabled={disabled}
      onClick={onClick}
      aria-label={ariaLabel}
      aria-disabled={disabled}
    >
      {renderMarker()}
    </button>
  )
}

export default Square

