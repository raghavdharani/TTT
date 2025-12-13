/**
 * Reusable X Token Component
 * Sharp, slim red cross token
 */

function XToken({ size = 'default', className = '' }) {
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
      <line
        x1="22"
        y1="22"
        x2="78"
        y2="78"
        stroke="#dc2626"
        strokeWidth="10"
        strokeLinecap="round"
        strokeLinejoin="miter"
        vectorEffect="non-scaling-stroke"
        filter="url(#x-glow)"
      />
      <line
        x1="78"
        y1="22"
        x2="22"
        y2="78"
        stroke="#dc2626"
        strokeWidth="10"
        strokeLinecap="round"
        strokeLinejoin="miter"
        vectorEffect="non-scaling-stroke"
        filter="url(#x-glow)"
      />
    </svg>
  )
}

export default XToken

