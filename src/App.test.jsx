import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from './App'

describe('App Component', () => {
  const getSquares = () =>
    screen.getAllByRole('button').filter((btn) =>
      btn.getAttribute('aria-label')?.includes('square')
    )

  const startGame = async (user, playMode = '2player', gameMode = 1, startingPlayer = 'X', difficulty = null) => {
    // Select play mode
    const playModeButton = screen.getByText(playMode === '2player' ? '2 Player' : 'VS Computer')
    await user.click(playModeButton)

    // If computer mode, select difficulty
    if (playMode === 'computer' && difficulty) {
      const difficultyButton = screen.getByText(difficulty.charAt(0).toUpperCase() + difficulty.slice(1))
      await user.click(difficultyButton)
    }

    // Select game mode
    const modeText = gameMode === 1 ? '1 Game' : gameMode === 3 ? 'Best of 3' : 'Best of 5'
    const modeButton = screen.getByText(modeText)
    await user.click(modeButton)

    // Select starting player - look for SVG icons (X and O buttons)
    // The buttons contain SVG icons, so we need to find them differently
    const playerButtons = screen.getAllByRole('button').filter(btn => {
      const svg = btn.querySelector('svg')
      if (!svg) return false
      // X has two lines, O has a circle
      const hasLines = svg.querySelectorAll('line').length > 0
      const hasCircle = svg.querySelector('circle') !== null
      if (startingPlayer === 'X' && hasLines) return true
      if (startingPlayer === 'O' && hasCircle) return true
      return false
    })
    if (playerButtons.length > 0) {
      await user.click(playerButtons[0])
    }

    // Click Start Game
    const startButton = screen.getByRole('button', { name: /start game/i })
    await user.click(startButton)
  }

  test('renders game setup screen initially', () => {
    render(<App />)
    expect(screen.getByText('Tic Tac Toe with a Twist')).toBeInTheDocument()
    expect(screen.getByText('Select Play Mode:')).toBeInTheDocument()
    expect(screen.getByText('Select Game Mode:')).toBeInTheDocument()
    expect(screen.getByText('Who goes first?')).toBeInTheDocument()
  })

  test('renders game title after setup', async () => {
    const user = userEvent.setup()
    render(<App />)
    await startGame(user)
    expect(screen.getByText('Tic Tac Toe with a Twist')).toBeInTheDocument()
  })

  test('displays initial state correctly after setup', async () => {
    const user = userEvent.setup()
    render(<App />)
    await startGame(user)
    expect(screen.getByText('Current Player: X (0/3 tokens)')).toBeInTheDocument()
  })

  test('allows players to make moves', async () => {
    const user = userEvent.setup()
    render(<App />)
    await startGame(user)

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
    await startGame(user)

    let squares = getSquares()

    // X wins with first row
    await user.click(squares[0]) // X
    await user.click(squares[3]) // O
    await user.click(squares[1]) // X
    await user.click(squares[4]) // O
    await user.click(squares[2]) // X wins!

    expect(screen.getByText('Player X Wins This Game!')).toBeInTheDocument()
  })

  test('detects O wins', async () => {
    const user = userEvent.setup()
    render(<App />)
    await startGame(user)

    let squares = getSquares()

    // O wins with first column
    await user.click(squares[1]) // X
    await user.click(squares[0]) // O
    await user.click(squares[2]) // X
    await user.click(squares[3]) // O
    await user.click(squares[5]) // X
    await user.click(squares[6]) // O wins!

    expect(screen.getByText('Player O Wins This Game!')).toBeInTheDocument()
  })

  test('allows token relocation at any time to adjacent squares', async () => {
    const user = userEvent.setup()
    render(<App />)
    await startGame(user)

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
    await startGame(user)

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
    await startGame(user)

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
    await startGame(user)

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
    await startGame(user)

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
    await startGame(user)

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
    await startGame(user)

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
    await startGame(user)

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
    await startGame(user)

    let squares = getSquares()

    await user.click(squares[0]) // X
    squares = getSquares()
    await user.click(squares[0]) // Try to click again
    squares = getSquares()

    expect(squares[0]).toHaveTextContent('X') // Should still be X
  })

  test('tracks series wins for best of 3', async () => {
    const user = userEvent.setup()
    render(<App />)
    await startGame(user, 3, 'X')

    let squares = getSquares()

    // Game 1: X wins
    await user.click(squares[0]) // X
    await user.click(squares[3]) // O
    await user.click(squares[1]) // X
    await user.click(squares[4]) // O
    await user.click(squares[2]) // X wins!

    expect(screen.getByText(/Best of 3 - Game 1: X: 1 \| O: 0/)).toBeInTheDocument()
    expect(screen.getByText('Player X Wins This Game!')).toBeInTheDocument()

    // Click Next Game
    const nextGameButton = screen.getByRole('button', { name: /next game/i })
    await user.click(nextGameButton)

    // Game 2: O should start (alternating)
    squares = getSquares()
    expect(screen.getByText(/Best of 3 - Game 2: X: 1 \| O: 0/)).toBeInTheDocument()
    expect(screen.getByText(/Current Player: O/)).toBeInTheDocument()

    // O wins game 2
    await user.click(squares[0]) // O
    await user.click(squares[3]) // X
    await user.click(squares[1]) // O
    await user.click(squares[4]) // X
    await user.click(squares[2]) // O wins!

    expect(screen.getByText(/Best of 3 - Game 2: X: 1 \| O: 1/)).toBeInTheDocument()

    // Click Next Game
    await user.click(screen.getByRole('button', { name: /next game/i }))

    // Game 3: X should start again (alternating)
    expect(screen.getByText(/Best of 3 - Game 3: X: 1 \| O: 1/)).toBeInTheDocument()
    expect(screen.getByText(/Current Player: X/)).toBeInTheDocument()
  })

  test('determines series winner when player reaches needed wins', async () => {
    const user = userEvent.setup()
    render(<App />)
    await startGame(user, 3, 'X')

    let squares = getSquares()

    // Game 1: X wins
    await user.click(squares[0]) // X
    await user.click(squares[3]) // O
    await user.click(squares[1]) // X
    await user.click(squares[4]) // O
    await user.click(squares[2]) // X wins!

    // Click Next Game
    await user.click(screen.getByRole('button', { name: /next game/i }))

    // Game 2: X wins again (wins series)
    squares = getSquares()
    await user.click(squares[0]) // X
    await user.click(squares[3]) // O
    await user.click(squares[1]) // X
    await user.click(squares[4]) // O
    await user.click(squares[2]) // X wins series!

    expect(screen.getByText('Player X Wins the Series!')).toBeInTheDocument()
    expect(screen.getByText(/Series Winner: Player X wins 2-0!/)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /new series/i })).toBeInTheDocument()
  })

  test('alternates starting player between games', async () => {
    const user = userEvent.setup()
    render(<App />)
    await startGame(user, 3, 'X')

    let squares = getSquares()

    // Game 1: X starts
    expect(screen.getByText(/Current Player: X/)).toBeInTheDocument()
    await user.click(squares[0]) // X
    await user.click(squares[3]) // O
    await user.click(squares[1]) // X
    await user.click(squares[4]) // O
    await user.click(squares[2]) // X wins

    // Next game: O should start
    await user.click(screen.getByRole('button', { name: /next game/i }))
    expect(screen.getByText(/Current Player: O/)).toBeInTheDocument()

    squares = getSquares()
    await user.click(squares[0]) // O
    await user.click(squares[3]) // X
    await user.click(squares[1]) // O
    await user.click(squares[4]) // X
    await user.click(squares[2]) // O wins

    // Next game: X should start again
    await user.click(screen.getByRole('button', { name: /next game/i }))
    expect(screen.getByText(/Current Player: X/)).toBeInTheDocument()
  })

  test('returns to setup screen after single game ends', async () => {
    const user = userEvent.setup()
    render(<App />)
    await startGame(user, 1, 'X')

    let squares = getSquares()

    // X wins
    await user.click(squares[0]) // X
    await user.click(squares[3]) // O
    await user.click(squares[1]) // X
    await user.click(squares[4]) // O
    await user.click(squares[2]) // X wins!

    // Click New Game (should return to setup)
    await user.click(screen.getByRole('button', { name: /new game/i }))
    expect(screen.getByText('Game Setup')).toBeInTheDocument()
  })
})

