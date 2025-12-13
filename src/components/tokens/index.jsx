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
 */
export const Token = ({ value, size = 'default', className = '' }) => {
  if (value === 'X') {
    return <XToken size={size} className={className} />
  }
  if (value === 'O') {
    return <OToken size={size} className={className} />
  }
  return null
}

