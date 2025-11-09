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
    expect(screen.getByText('Player X Wins This Game!')).toBeInTheDocument()
  })

  test('displays O winner message', () => {
    render(
      <GameStatus {...defaultProps} currentPlayer="O" winner="O" gameOver={true} />
    )
    expect(screen.getByText('Player O Wins This Game!')).toBeInTheDocument()
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

  test('displays series info for best of 3', () => {
    render(
      <GameStatus
        {...defaultProps}
        gameMode={3}
        currentGame={1}
        xWins={1}
        oWins={0}
      />
    )
    expect(screen.getByText(/Best of 3 - Game 1: X: 1 \| O: 0/)).toBeInTheDocument()
  })

  test('displays series info for best of 5', () => {
    render(
      <GameStatus
        {...defaultProps}
        gameMode={5}
        currentGame={2}
        xWins={1}
        oWins={1}
      />
    )
    expect(screen.getByText(/Best of 5 - Game 2: X: 1 \| O: 1/)).toBeInTheDocument()
  })

  test('displays series winner message', () => {
    render(
      <GameStatus
        {...defaultProps}
        gameMode={3}
        currentGame={2}
        xWins={2}
        oWins={0}
        seriesWinner="X"
        winner="X"
        gameOver={true}
      />
    )
    expect(screen.getByText('Player X Wins the Series!')).toBeInTheDocument()
    expect(screen.getByText(/Series Winner: Player X wins 2-0!/)).toBeInTheDocument()
  })

  test('does not display series info for single game', () => {
    render(
      <GameStatus
        {...defaultProps}
        gameMode={1}
        currentGame={1}
        xWins={0}
        oWins={0}
      />
    )
    expect(screen.queryByText(/Best of/)).not.toBeInTheDocument()
  })
})

