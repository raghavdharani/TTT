/**
 * Reusable O Token Component
 * Sharp, slim blue circle token
 * @param {string} size - 'small', 'default', or 'large'
 * @param {string} className - Additional CSS classes
 * @param {boolean} animated - Whether to apply spin animation
 * @param {number} spinDuration - Animation duration in seconds (default: 2)
 */

function OToken({ size = 'default', className = '', animated = false, spinDuration = 2 }) {
  // Size classes: 'small', 'default', 'large'
  const sizeClasses = {
    small: 'w-12 h-12 sm:w-14 sm:h-14',
    default: 'w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24',
    large: 'w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28',
  }

  const sizeClass = sizeClasses[size] || sizeClasses.default
  const animationClass = animated ? 'animate-spin' : ''
  const animationStyle = animated ? { animationDuration: `${spinDuration}s` } : {}

  return (
    <svg
      className={`${sizeClass} ${animationClass} ${className}`}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="O token"
      shapeRendering="geometricPrecision"
      style={{
        ...animationStyle,
        imageRendering: 'crisp-edges',
        WebkitImageRendering: 'crisp-edges',
      }}
    >
      <defs>
        <filter id="o-glow">
          <feGaussianBlur stdDeviation="1.5" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      <circle
        cx="50"
        cy="50"
        r="36"
        stroke="#2563eb"
        strokeWidth="10"
        fill="none"
        vectorEffect="non-scaling-stroke"
        filter="url(#o-glow)"
      />
    </svg>
  )
}

export default OToken

