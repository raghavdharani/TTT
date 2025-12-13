/**
 * Reusable X Token Component
 * Solid filled red cross token with subtle pulse animation
 * @param {string} size - 'small', 'default', or 'large'
 * @param {string} className - Additional CSS classes
 * @param {boolean} animated - Whether to apply pulse animation (default: true)
 */

function XToken({ size = 'default', className = '', animated = true }) {
  // Size classes: 'small', 'default', 'large'
  const sizeClasses = {
    small: 'w-12 h-12 sm:w-14 sm:h-14',
    default: 'w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24',
    large: 'w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28',
  }

  const sizeClass = sizeClasses[size] || sizeClasses.default
  const animationClass = animated ? 'animate-pulse' : ''

  return (
    <svg
      className={`${sizeClass} ${animationClass} ${className}`}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="X token"
      shapeRendering="geometricPrecision"
      style={{ 
        imageRendering: 'crisp-edges',
        WebkitImageRendering: 'crisp-edges',
      }}
    >
      <defs>
        <filter id="x-glow">
          <feGaussianBlur stdDeviation="1.5" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      {/* Solid filled X - using two rotated rectangles */}
      <g transform="rotate(45 50 50)">
        <rect x="35" y="10" width="30" height="80" rx="5" fill="#dc2626" filter="url(#x-glow)" />
      </g>
      <g transform="rotate(-45 50 50)">
        <rect x="35" y="10" width="30" height="80" rx="5" fill="#dc2626" filter="url(#x-glow)" />
      </g>
    </svg>
  )
}

export default XToken

