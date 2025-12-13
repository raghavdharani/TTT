/**
 * Reusable O Token Component
 * Sharp, slim blue circle token
 */

function OToken({ size = 'default', className = '' }) {
  // Size classes: 'small', 'default', 'large'
  const sizeClasses = {
    small: 'w-12 h-12 sm:w-14 sm:h-14',
    default: 'w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24',
    large: 'w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28',
  }

  const sizeClass = sizeClasses[size] || sizeClasses.default

  return (
    <svg
      className={`${sizeClass} ${className}`}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="O token"
      shapeRendering="geometricPrecision"
      style={{ 
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

