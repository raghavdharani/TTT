import { render, screen } from '@testing-library/react'
import GameStatus from './GameStatus'

describe('GameStatus Component', () => {
  const defaultProps = {
    currentPlayer: 'X',
    winner: null,
    gameOver: false,
    isRelocating: false,
    canPlaceNewToken: true,
    currentPlayerTokenCount: 0,
    tokenLimit: 3,
  }

  test('displays current player during game with token count', () => {
    render(<GameStatus {...defaultProps} currentPlayerTokenCount={1} />)
    expect(screen.getByText('Current Player: X (1/3 tokens)')).toBeInTheDocument()
  })

  test('displays relocation message', () => {
    render(<GameStatus {...defaultProps} isRelocating={true} />)
    expect(
      screen.getByText('Player X is moving a token. Choose a new square.')
    ).toBeInTheDocument()
  })

  test('displays message when at token limit', () => {
    render(
      <GameStatus
        {...defaultProps}
        canPlaceNewToken={false}
        currentPlayerTokenCount={3}
      />
    )
    expect(
      screen.getByText('Player X has 3/3 tokens. Click a token to relocate it.')
    ).toBeInTheDocument()
  })

  test('displays X winner message', () => {
    render(<GameStatus {...defaultProps} winner="X" gameOver={true} />)
    expect(screen.getByText('Player X Wins!')).toBeInTheDocument()
  })

  test('displays O winner message', () => {
    render(
      <GameStatus {...defaultProps} currentPlayer="O" winner="O" gameOver={true} />
    )
    expect(screen.getByText('Player O Wins!')).toBeInTheDocument()
  })

  test('displays draw message', () => {
    render(<GameStatus {...defaultProps} winner="draw" gameOver={true} />)
    expect(screen.getByText("It's a Draw!")).toBeInTheDocument()
  })

  test('has correct ARIA attributes', () => {
    render(<GameStatus {...defaultProps} />)
    const status = screen.getByRole('status')
    expect(status).toHaveAttribute('aria-live', 'polite')
    expect(status).toHaveAttribute('aria-atomic', 'true')
  })
})

