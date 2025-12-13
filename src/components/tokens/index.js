/**
 * Centralized Token Components Export
 * Reusable token components for consistent UI throughout the game
 */

export { default as XToken } from './XToken'
export { default as OToken } from './OToken'

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

