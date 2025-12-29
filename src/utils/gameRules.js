/**
 * Centralized Game Rules Module
 * This module contains all game rules and validation logic.
 * Used by both client and server to ensure consistency.
 */

export const TOKEN_LIMIT = 3;

/**
 * Count tokens for a player on the board
 */
export const countTokens = (squares, player) => {
  return squares.reduce((count, square) => (square === player ? count + 1 : count), 0);
};

/**
 * Get adjacent square indices (up, down, left, right only - no diagonals)
 */
export const getAdjacentIndices = (index) => {
  const row = Math.floor(index / 3);
  const col = index % 3;
  const adjacent = [];

  // Top (row - 1)
  if (row > 0) adjacent.push((row - 1) * 3 + col);
  // Bottom (row + 1)
  if (row < 2) adjacent.push((row + 1) * 3 + col);
  // Left (col - 1)
  if (col > 0) adjacent.push(row * 3 + (col - 1));
  // Right (col + 1)
  if (col < 2) adjacent.push(row * 3 + (col + 1));

  return adjacent;
};

/**
 * Check if a token at the given index can move (has at least one empty adjacent square)
 */
export const canTokenMove = (squares, index) => {
  const adjacentIndices = getAdjacentIndices(index);
  return adjacentIndices.some((adjIndex) => squares[adjIndex] === null);
};

/**
 * Check if target index is adjacent to source index
 */
export const isAdjacent = (sourceIndex, targetIndex) => {
  return getAdjacentIndices(sourceIndex).includes(targetIndex);
};

/**
 * Validate if a player can place a new token
 * @param {Array} squares - Current board state
 * @param {string} player - Player symbol ('X' or 'O')
 * @param {number|null} tokenToMoveIndex - Index of token being moved (null if not relocating)
 * @returns {{valid: boolean, error?: string}}
 */
export const canPlaceNewToken = (squares, player, tokenToMoveIndex = null) => {
  // Rule: Cannot place while relocating
  if (tokenToMoveIndex !== null) {
    return { valid: false, error: 'Cannot place new token while relocating. Complete or cancel the relocation first.' };
  }

  // Rule: Check token limit
  const tokenCount = countTokens(squares, player);
  if (tokenCount >= TOKEN_LIMIT) {
    return { valid: false, error: `Cannot place more tokens. You have reached the limit of ${TOKEN_LIMIT} tokens. Move an existing token instead.` };
  }

  return { valid: true };
};

/**
 * Validate if a player can pick up a token
 * @param {Array} squares - Current board state
 * @param {string} player - Player symbol ('X' or 'O')
 * @param {number} fromIndex - Index of token to pick up
 * @returns {{valid: boolean, error?: string}}
 */
export const canPickupToken = (squares, player, fromIndex) => {
  // Rule: Must be picking up own token
  if (squares[fromIndex] !== player) {
    return { valid: false, error: 'Can only pick up your own tokens' };
  }

  // Rule: Token must be able to move
  if (!canTokenMove(squares, fromIndex)) {
    return { valid: false, error: 'This token cannot move (no adjacent empty squares)' };
  }

  return { valid: true };
};

/**
 * Validate if a player can relocate a token
 * @param {Array} squares - Current board state
 * @param {string} player - Player symbol ('X' or 'O')
 * @param {number} fromIndex - Source index
 * @param {number} toIndex - Target index
 * @param {number|null} tokenToMoveIndex - Index of token being moved (must match fromIndex)
 * @returns {{valid: boolean, error?: string}}
 */
export const canRelocateToken = (squares, player, fromIndex, toIndex, tokenToMoveIndex) => {
  // Rule: Must be relocating (tokenToMoveIndex must be set and match fromIndex)
  if (tokenToMoveIndex === null || tokenToMoveIndex !== fromIndex) {
    return { valid: false, error: 'Invalid relocation. Pick up a token first.' };
  }

  // Rule: Target must be empty
  if (squares[toIndex] !== null) {
    return { valid: false, error: 'Cannot relocate to occupied square' };
  }

  // Rule: Target must be adjacent to source
  if (!isAdjacent(fromIndex, toIndex)) {
    return { valid: false, error: 'Can only move tokens to adjacent squares' };
  }

  return { valid: true };
};

/**
 * Validate if a player can cancel relocation
 * @param {number|null} tokenToMoveIndex - Index of token being moved
 * @param {number} fromIndex - Index to cancel from
 * @returns {{valid: boolean, error?: string}}
 */
export const canCancelRelocate = (tokenToMoveIndex, fromIndex) => {
  if (tokenToMoveIndex === null || tokenToMoveIndex !== fromIndex) {
    return { valid: false, error: 'Invalid cancel. No token being relocated.' };
  }
  return { valid: true };
};

/**
 * Apply a move to the board state
 * @param {Array} squares - Current board state
 * @param {string} moveType - 'place', 'pickup', 'relocate', or 'cancel-relocate'
 * @param {string} player - Player symbol ('X' or 'O')
 * @param {number|null} fromIndex - Source index
 * @param {number|null} toIndex - Target index
 * @param {number|null} currentTokenToMoveIndex - Current token being moved
 * @returns {{squares: Array, tokenToMoveIndex: number|null, shouldSwitchTurn: boolean}}
 */
export const applyMove = (squares, moveType, player, fromIndex, toIndex, currentTokenToMoveIndex = null) => {
  const newSquares = [...squares];
  let newTokenToMoveIndex = currentTokenToMoveIndex;
  let shouldSwitchTurn = false;

  switch (moveType) {
    case 'place':
      newSquares[toIndex] = player;
      newTokenToMoveIndex = null;
      shouldSwitchTurn = true; // Placing a token completes the turn
      break;

    case 'pickup':
      newSquares[fromIndex] = null;
      newTokenToMoveIndex = fromIndex;
      shouldSwitchTurn = false; // Picking up doesn't complete the turn
      break;

    case 'relocate':
      newSquares[toIndex] = player;
      newTokenToMoveIndex = null;
      shouldSwitchTurn = true; // Relocating completes the turn
      break;

    case 'cancel-relocate':
      newSquares[fromIndex] = player;
      newTokenToMoveIndex = null;
      shouldSwitchTurn = false; // Canceling doesn't complete the turn
      break;

    default:
      throw new Error(`Invalid move type: ${moveType}`);
  }

  return {
    squares: newSquares,
    tokenToMoveIndex: newTokenToMoveIndex,
    shouldSwitchTurn,
  };
};

/**
 * Validate and apply a move
 * @param {Array} squares - Current board state
 * @param {string} moveType - 'place', 'pickup', 'relocate', or 'cancel-relocate'
 * @param {string} player - Player symbol ('X' or 'O')
 * @param {number|null} fromIndex - Source index
 * @param {number|null} toIndex - Target index
 * @param {number|null} currentTokenToMoveIndex - Current token being moved
 * @returns {{valid: boolean, error?: string, squares?: Array, tokenToMoveIndex?: number|null, shouldSwitchTurn?: boolean}}
 */
export const validateAndApplyMove = (squares, moveType, player, fromIndex, toIndex, currentTokenToMoveIndex = null) => {
  let validation;

  switch (moveType) {
    case 'place':
      validation = canPlaceNewToken(squares, player, currentTokenToMoveIndex);
      if (!validation.valid) return validation;
      if (squares[toIndex] !== null) {
        return { valid: false, error: 'Cannot place token on occupied square' };
      }
      break;

    case 'pickup':
      validation = canPickupToken(squares, player, fromIndex);
      if (!validation.valid) return validation;
      break;

    case 'relocate':
      validation = canRelocateToken(squares, player, fromIndex, toIndex, currentTokenToMoveIndex);
      if (!validation.valid) return validation;
      break;

    case 'cancel-relocate':
      validation = canCancelRelocate(currentTokenToMoveIndex, fromIndex);
      if (!validation.valid) return validation;
      break;

    default:
      return { valid: false, error: 'Invalid move type' };
  }

  const result = applyMove(squares, moveType, player, fromIndex, toIndex, currentTokenToMoveIndex);
  return {
    valid: true,
    ...result,
  };
};


