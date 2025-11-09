import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from './App'

describe('App Component', () => {
  const getSquares = () =>
    screen.getAllByRole('button').filter((btn) =>
      btn.getAttribute('aria-label')?.includes('square')
    )

  test('renders game title', () => {
    render(<App />)
    expect(screen.getByText('Tic Tac Toe')).toBeInTheDocument()
  })

  test('displays initial state correctly', () => {
    render(<App />)
    expect(screen.getByText('Current Player: X (0/3 tokens)')).toBeInTheDocument()
  })

  test('allows players to make moves', async () => {
    const user = userEvent.setup()
    render(<App />)

    let squares = getSquares()

    // X's turn
    await user.click(squares[0])
    squares = getSquares()
    expect(squares[0]).toHaveTextContent('X')

    // O's turn
    expect(screen.getByText(/Current Player: O/)).toBeInTheDocument()
    await user.click(squares[1])
    squares = getSquares()
    expect(squares[1]).toHaveTextContent('O')
  })

  test('detects X wins', async () => {
    const user = userEvent.setup()
    render(<App />)

    let squares = getSquares()

    // X wins with first row
    await user.click(squares[0]) // X
    await user.click(squares[3]) // O
    await user.click(squares[1]) // X
    await user.click(squares[4]) // O
    await user.click(squares[2]) // X wins!

    expect(screen.getByText('Player X Wins!')).toBeInTheDocument()
  })

  test('detects O wins', async () => {
    const user = userEvent.setup()
    render(<App />)

    let squares = getSquares()

    // O wins with first column
    await user.click(squares[1]) // X
    await user.click(squares[0]) // O
    await user.click(squares[2]) // X
    await user.click(squares[3]) // O
    await user.click(squares[5]) // X
    await user.click(squares[6]) // O wins!

    expect(screen.getByText('Player O Wins!')).toBeInTheDocument()
  })

  test('allows token relocation at any time to adjacent squares', async () => {
    const user = userEvent.setup()
    render(<App />)

    let squares = getSquares()

    // Place two tokens for X
    await user.click(squares[0]) // X (top-left)
    await user.click(squares[3]) // O
    await user.click(squares[2]) // X (top-right)

    squares = getSquares()

    // X can relocate a token even when under the limit
    await user.click(squares[0]) // Click X's token to relocate (index 0)
    squares = getSquares()
    expect(squares[0]).toHaveTextContent('')
    expect(
      screen.getByText('Player X is moving a token. Choose a new square.')
    ).toBeInTheDocument()

    // Place the token on an adjacent square (index 1 is adjacent to index 0)
    await user.click(squares[1])
    squares = getSquares()
    expect(squares[1]).toHaveTextContent('X')
    expect(screen.getByText(/Current Player: O/)).toBeInTheDocument()
  })

  test('enforces token limit for new placements', async () => {
    const user = userEvent.setup()
    render(<App />)

    let squares = getSquares()

    // Build up to three tokens per player
    await user.click(squares[0]) // X
    await user.click(squares[3]) // O
    await user.click(squares[2]) // X
    await user.click(squares[4]) // O
    await user.click(squares[7]) // X (X now has 3 tokens)
    await user.click(squares[5]) // O (O now has 3 tokens)

    squares = getSquares()

    // X cannot place new tokens when at limit
    expect(squares[6]).toBeDisabled()
    expect(
      screen.getByText('Player X has 3/3 tokens. Click a token to relocate it.')
    ).toBeInTheDocument()

    // X can still relocate existing tokens
    expect(squares[0]).toBeEnabled() // X's token is clickable
    await user.click(squares[0]) // Relocate X's token
    squares = getSquares()
    expect(squares[0]).toHaveTextContent('')
    expect(squares[6]).toBeEnabled() // Now can place on empty square
  })

  test('placing token in same location does not count as a turn and allows another move', async () => {
    const user = userEvent.setup()
    render(<App />)

    let squares = getSquares()

    // Place a token for X
    await user.click(squares[0]) // X
    await user.click(squares[3]) // O

    squares = getSquares()
    expect(screen.getByText(/Current Player: X/)).toBeInTheDocument()

    // X picks up their token
    await user.click(squares[0]) // Click X's token to relocate
    squares = getSquares()
    expect(squares[0]).toHaveTextContent('')
    expect(
      screen.getByText('Player X is moving a token. Choose a new square.')
    ).toBeInTheDocument()

    // X places it back in the same location (changes mind)
    await user.click(squares[0])
    squares = getSquares()
    expect(squares[0]).toHaveTextContent('X')
    // Turn should not have switched - still X's turn
    expect(screen.getByText(/Current Player: X/)).toBeInTheDocument()
    // Status should show it's X's turn, not relocation mode
    expect(
      screen.queryByText('Player X is moving a token. Choose a new square.')
    ).not.toBeInTheDocument()

    // X can make another move - place a new token
    await user.click(squares[1]) // Place new token
    squares = getSquares()
    expect(squares[1]).toHaveTextContent('X')
    // Now turn should switch to O
    expect(screen.getByText(/Current Player: O/)).toBeInTheDocument()
  })

  test('can pick up same token again after placing it back', async () => {
    const user = userEvent.setup()
    render(<App />)

    let squares = getSquares()

    // Place a token for X
    await user.click(squares[0]) // X
    await user.click(squares[3]) // O

    squares = getSquares()
    expect(screen.getByText(/Current Player: X/)).toBeInTheDocument()

    // X picks up their token
    await user.click(squares[0])
    squares = getSquares()
    expect(squares[0]).toHaveTextContent('')

    // X places it back (changes mind)
    await user.click(squares[0])
    squares = getSquares()
    expect(squares[0]).toHaveTextContent('X')
    expect(screen.getByText(/Current Player: X/)).toBeInTheDocument()

    // X can pick up the same token again
    await user.click(squares[0])
    squares = getSquares()
    expect(squares[0]).toHaveTextContent('')
    expect(
      screen.getByText('Player X is moving a token. Choose a new square.')
    ).toBeInTheDocument()

    // Now place it in a different adjacent location - this should complete the turn
    await user.click(squares[1]) // Place in adjacent location
    squares = getSquares()
    expect(squares[1]).toHaveTextContent('X')
    // Now turn should switch to O
    expect(screen.getByText(/Current Player: O/)).toBeInTheDocument()
  })

  test('prevents moving token to non-adjacent square', async () => {
    const user = userEvent.setup()
    render(<App />)

    let squares = getSquares()

    // Place a token for X at top-left (index 0)
    await user.click(squares[0]) // X
    await user.click(squares[3]) // O

    squares = getSquares()

    // X picks up their token
    await user.click(squares[0])
    squares = getSquares()
    expect(
      screen.getByText('Player X is moving a token. Choose a new square.')
    ).toBeInTheDocument()

    // Try to place in non-adjacent square (index 8 is bottom-right, not adjacent to 0)
    await user.click(squares[8])
    squares = getSquares()
    // Token should still be in relocation mode, not placed
    expect(squares[8]).toHaveTextContent('')
    expect(squares[0]).toHaveTextContent('')
    expect(
      screen.getByText('Player X is moving a token. Choose a new square.')
    ).toBeInTheDocument()

    // Place in adjacent square (index 1 is adjacent to 0)
    await user.click(squares[1])
    squares = getSquares()
    expect(squares[1]).toHaveTextContent('X')
    expect(screen.getByText(/Current Player: O/)).toBeInTheDocument()
  })

  test('disables tokens that cannot move', async () => {
    const user = userEvent.setup()
    render(<App />)

    let squares = getSquares()

    // Create a situation where a token is surrounded
    // X at center (4) surrounded by O tokens
    await user.click(squares[4]) // X at center
    await user.click(squares[1]) // O
    await user.click(squares[3]) // O
    await user.click(squares[5]) // O
    await user.click(squares[7]) // O

    squares = getSquares()

    // Token at index 4 (center) should be disabled - cannot move
    expect(squares[4]).toBeDisabled()
  })

  test('reset button clears the board', async () => {
    const user = userEvent.setup()
    render(<App />)

    let squares = getSquares()

    // Make a move
    await user.click(squares[0])
    squares = getSquares()
    expect(squares[0]).toHaveTextContent('X')

    // Reset
    const resetButton = screen.getByRole('button', { name: /start a new game/i })
    await user.click(resetButton)

    // Board should be cleared
    squares = getSquares()
    squares.forEach((square) => {
      expect(square).toHaveTextContent('')
    })
    expect(screen.getByText('Current Player: X (0/3 tokens)')).toBeInTheDocument()
  })

  test('prevents moves after game ends', async () => {
    const user = userEvent.setup()
    render(<App />)

    let squares = getSquares()

    // X wins
    await user.click(squares[0]) // X
    await user.click(squares[3]) // O
    await user.click(squares[1]) // X
    await user.click(squares[4]) // O
    await user.click(squares[2]) // X wins!

    // Try to click another square
    await user.click(squares[5])
    squares = getSquares()
    expect(squares[5]).toHaveTextContent('') // Should remain empty
  })

  test('prevents clicking occupied squares when under the token limit', async () => {
    const user = userEvent.setup()
    render(<App />)

    let squares = getSquares()

    await user.click(squares[0]) // X
    squares = getSquares()
    await user.click(squares[0]) // Try to click again
    squares = getSquares()

    expect(squares[0]).toHaveTextContent('X') // Should still be X
  })
})

