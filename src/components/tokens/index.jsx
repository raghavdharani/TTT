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
 * @param {string} value - 'X' or 'O'
 * @param {string} size - 'small', 'default', or 'large'
 * @param {string} className - Additional CSS classes
 * @param {boolean} animated - Whether to apply animations (pulse for X, spin for O)
 * @param {number} spinDuration - Animation duration for O token in seconds (default: 2)
 */
export const Token = ({ value, size = 'default', className = '', animated = false, spinDuration = 2 }) => {
  if (value === 'X') {
    return <XToken size={size} className={className} animated={animated} />
  }
  if (value === 'O') {
    return <OToken size={size} className={className} animated={animated} spinDuration={spinDuration} />
  }
  return null
}

