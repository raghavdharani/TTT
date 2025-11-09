import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Board from './Board'

describe('Board Component', () => {
  const tokenLimit = 3

  // Helper function to get adjacent indices
  const getAdjacentIndices = (index) => {
    const row = Math.floor(index / 3)
    const col = index % 3
    const adjacent = []
    if (row > 0) adjacent.push((row - 1) * 3 + col)
    if (row < 2) adjacent.push((row + 1) * 3 + col)
    if (col > 0) adjacent.push(row * 3 + (col - 1))
    if (col < 2) adjacent.push(row * 3 + (col + 1))
    return adjacent
  }

  const canTokenMove = (squares, index) => {
    const adjacentIndices = getAdjacentIndices(index)
    return adjacentIndices.some((adjIndex) => squares[adjIndex] === null)
  }

  const isAdjacent = (sourceIndex, targetIndex) => {
    return getAdjacentIndices(sourceIndex).includes(targetIndex)
  }

  const renderBoard = (override = {}) => {
    const props = {
      squares: Array(9).fill(null),
      onSquareClick: () => {},
      gameOver: false,
      currentPlayer: 'X',
      currentPlayerTokenCount: 0,
      tokenToMoveIndex: null,
      tokenLimit,
      canTokenMove,
      isAdjacent,
      ...override,
    }

    return render(<Board {...props} />)
  }

  test('renders 9 squares', () => {
    renderBoard()
    const buttons = screen.getAllByRole('button')
    expect(buttons).toHaveLength(9)
  })

  test('passes correct values to squares', () => {
    const squares = ['X', 'O', null, null, 'X', null, null, null, 'O']
    renderBoard({ squares })

    const buttons = screen.getAllByRole('button')
    expect(buttons[0]).toHaveTextContent('X')
    expect(buttons[1]).toHaveTextContent('O')
    expect(buttons[2]).toHaveTextContent('')
  })

  test('calls onSquareClick when an enabled square is clicked', async () => {
    const user = userEvent.setup()
    const handleSquareClick = jest.fn()
    renderBoard({ onSquareClick: handleSquareClick })

    const buttons = screen.getAllByRole('button')
    await user.click(buttons[0])

    expect(handleSquareClick).toHaveBeenCalledWith(0)
  })

  test('enables player tokens only if they can move', () => {
    const squares = ['X', 'X', null, null, null, null, null, null, null]
    renderBoard({
      squares,
      currentPlayerTokenCount: 2,
    })

    const buttons = screen.getAllByRole('button')
    // Own tokens should be enabled if they have adjacent empty squares
    expect(buttons[0]).toBeEnabled() // Has adjacent empty square at index 3
    expect(buttons[1]).toBeEnabled() // Has adjacent empty squares
    // Empty squares should be enabled when under token limit
    expect(buttons[2]).toBeEnabled()
  })

  test('disables player tokens that cannot move', () => {
    // Token at index 4 (center) surrounded by tokens - cannot move
    const squares = ['X', 'O', 'X', 'O', 'X', 'O', null, null, null]
    renderBoard({
      squares,
      currentPlayerTokenCount: 3,
    })

    const buttons = screen.getAllByRole('button')
    // Token at index 4 is surrounded, cannot move
    expect(buttons[4]).toBeDisabled()
    // Other tokens can move
    expect(buttons[0]).toBeEnabled() // Has adjacent empty square
  })

  test('disables empty squares when player is at token limit', () => {
    const squares = ['X', 'X', 'X', null, null, null, null, null, null]
    renderBoard({
      squares,
      currentPlayerTokenCount: 3,
    })

    const buttons = screen.getAllByRole('button')
    // Own tokens should be enabled for relocation
    expect(buttons[0]).toBeEnabled()
    expect(buttons[1]).toBeEnabled()
    expect(buttons[2]).toBeEnabled()
    // Empty squares should be disabled when at token limit
    expect(buttons[3]).toBeDisabled()
  })

  test('only adjacent empty squares are enabled while relocating a token', () => {
    const squares = [null, 'X', 'X', 'O', null, null, null, null, null]
    renderBoard({
      squares,
      currentPlayerTokenCount: 2,
      tokenToMoveIndex: 1, // Token at index 1 (top middle)
    })

    const buttons = screen.getAllByRole('button')
    // Adjacent empty squares to index 1 are: 0 (left), 4 (bottom)
    expect(buttons[0]).toBeEnabled() // adjacent empty square
    expect(buttons[4]).toBeEnabled() // adjacent empty square
    expect(buttons[2]).toBeDisabled() // not adjacent (right, but occupied)
    expect(buttons[3]).toBeDisabled() // not adjacent (bottom-left)
    expect(buttons[5]).toBeDisabled() // not adjacent
  })

  test('disables all squares when game is over', () => {
    renderBoard({ gameOver: true })

    const buttons = screen.getAllByRole('button')
    buttons.forEach((button) => {
      expect(button).toBeDisabled()
    })
  })
})

