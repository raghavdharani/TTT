import { Token } from './tokens'

function Square({ value, onClick, disabled, index }) {
  const row = Math.floor(index / 3) + 1
  const col = (index % 3) + 1
  const ariaLabel = `${value || 'Empty'} square, row ${row}, column ${col}`

  return (
    <button
      className={`
        w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28
        glass rounded-xl
        flex items-center justify-center
        transition-all duration-200
        disabled:opacity-40 disabled:cursor-not-allowed
        disabled:hover:scale-100 disabled:hover:glass
        ${!disabled ? 'hover:glass-strong hover:scale-105 cursor-pointer' : ''}
        focus:outline-none focus:ring-2 focus:ring-mystical-blue focus:ring-offset-2
      `}
      disabled={disabled}
      onClick={onClick}
      aria-label={ariaLabel}
      aria-disabled={disabled}
    >
      <Token value={value} size="default" />
    </button>
  )
}

export default Square

