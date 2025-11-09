function Square({ value, onClick, disabled, index }) {
  const row = Math.floor(index / 3) + 1
  const col = (index % 3) + 1
  const ariaLabel = `${value || 'Empty'} square, row ${row}, column ${col}`

  const getMarkerColor = () => {
    if (value === 'X') return 'text-blue-500'
    if (value === 'O') return 'text-red-500'
    return ''
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
        text-4xl sm:text-5xl md:text-6xl
        font-bold
        transition-colors duration-150
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
        ${getMarkerColor()}
      `}
      disabled={disabled}
      onClick={onClick}
      aria-label={ariaLabel}
      aria-disabled={disabled}
    >
      {value}
    </button>
  )
}

export default Square

