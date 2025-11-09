import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import NewGameButton from './NewGameButton'

describe('NewGameButton Component', () => {
  test('renders button with correct text', () => {
    render(<NewGameButton onReset={() => {}} />)
    const button = screen.getByRole('button', { name: /start a new game/i })
    expect(button).toBeInTheDocument()
    expect(button).toHaveTextContent('New Game')
  })

  test('calls onReset when clicked', async () => {
    const user = userEvent.setup()
    const handleReset = jest.fn()
    render(<NewGameButton onReset={handleReset} />)
    
    const button = screen.getByRole('button')
    await user.click(button)
    
    expect(handleReset).toHaveBeenCalledTimes(1)
  })

  test('has correct ARIA label', () => {
    render(<NewGameButton onReset={() => {}} />)
    const button = screen.getByRole('button', { name: /start a new game/i })
    expect(button).toHaveAttribute('aria-label', 'Start a new game')
  })
})

