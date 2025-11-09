import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import NewGameButton from './NewGameButton'

describe('NewGameButton Component', () => {
  test('renders button with correct text for new game', () => {
    render(<NewGameButton onReset={() => {}} />)
    const button = screen.getByRole('button', { name: /new game/i })
    expect(button).toBeInTheDocument()
    expect(button).toHaveTextContent('New Game')
  })

  test('calls onReset when clicked during game', async () => {
    const user = userEvent.setup()
    const handleReset = jest.fn()
    render(<NewGameButton onReset={handleReset} gameOver={false} />)
    
    const button = screen.getByRole('button')
    await user.click(button)
    
    expect(handleReset).toHaveBeenCalledTimes(1)
  })

  test('displays "Next Game" when game is over in a series', () => {
    render(
      <NewGameButton
        onReset={() => {}}
        onNextGame={() => {}}
        gameOver={true}
        gameMode={3}
      />
    )
    const button = screen.getByRole('button', { name: /next game/i })
    expect(button).toBeInTheDocument()
    expect(button).toHaveTextContent('Next Game')
  })

  test('calls onNextGame when clicked after game ends in series', async () => {
    const user = userEvent.setup()
    const handleNextGame = jest.fn()
    render(
      <NewGameButton
        onReset={() => {}}
        onNextGame={handleNextGame}
        gameOver={true}
        gameMode={3}
      />
    )
    
    const button = screen.getByRole('button', { name: /next game/i })
    await user.click(button)
    
    expect(handleNextGame).toHaveBeenCalledTimes(1)
  })

  test('displays "New Series" when series is won', () => {
    render(
      <NewGameButton
        onReset={() => {}}
        onNextGame={() => {}}
        gameOver={true}
        seriesWinner="X"
      />
    )
    const button = screen.getByRole('button', { name: /new series/i })
    expect(button).toBeInTheDocument()
    expect(button).toHaveTextContent('New Series')
  })

  test('calls onNextGame when series is won', async () => {
    const user = userEvent.setup()
    const handleNextGame = jest.fn()
    render(
      <NewGameButton
        onReset={() => {}}
        onNextGame={handleNextGame}
        gameOver={true}
        seriesWinner="X"
      />
    )
    
    const button = screen.getByRole('button', { name: /new series/i })
    await user.click(button)
    
    expect(handleNextGame).toHaveBeenCalledTimes(1)
  })

  test('displays "New Game" for single game mode after game ends', () => {
    render(
      <NewGameButton
        onReset={() => {}}
        onNextGame={() => {}}
        gameOver={true}
        gameMode={1}
      />
    )
    const button = screen.getByRole('button', { name: /new game/i })
    expect(button).toBeInTheDocument()
    expect(button).toHaveTextContent('New Game')
  })
})

