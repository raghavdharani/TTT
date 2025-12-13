/**
 * Centralized Token Components Export
 * Reusable token components for consistent UI throughout the game
 */

import XToken from './XToken'
import OToken from './OToken'

// Re-export for direct imports
export { XToken, OToken }

/**
 * Token component factory
 * Returns the appropriate token component based on value
 * All tokens are animated by default (X pulses, O rotates slowly)
 * @param {string} value - 'X' or 'O'
 * @param {string} size - 'small', 'default', or 'large'
 * @param {string} className - Additional CSS classes
 * @param {boolean} animated - Whether to apply animations (pulse for X, spin for O, default: true)
 * @param {number} spinDuration - Animation duration for O token in seconds (default: 3 for slow rotation)
 */
export const Token = ({ value, size = 'default', className = '', animated = true, spinDuration = 3 }) => {
  if (value === 'X') {
    return <XToken size={size} className={className} animated={animated} />
  }
  if (value === 'O') {
    return <OToken size={size} className={className} animated={animated} spinDuration={spinDuration} />
  }
  return null
}

