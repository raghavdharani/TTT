import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import GameSetup from './GameSetup'

describe('GameSetup Component', () => {
  test('renders game setup screen', () => {
    render(<GameSetup onStart={() => {}} />)
    expect(screen.getByText('Game Setup')).toBeInTheDocument()
    expect(screen.getByText('Select Game Mode:')).toBeInTheDocument()
    expect(screen.getByText('Who goes first?')).toBeInTheDocument()
  })

  test('displays all game mode options', () => {
    render(<GameSetup onStart={() => {}} />)
    expect(screen.getByText('1 Game')).toBeInTheDocument()
    expect(screen.getByText('Best of 3')).toBeInTheDocument()
    expect(screen.getByText('Best of 5')).toBeInTheDocument()
  })

  test('displays starting player options', () => {
    render(<GameSetup onStart={() => {}} />)
    expect(screen.getByText('X (Cross)')).toBeInTheDocument()
    expect(screen.getByText('O (Circle)')).toBeInTheDocument()
  })

  test('start button is disabled until selections are made', () => {
    render(<GameSetup onStart={() => {}} />)
    const startButton = screen.getByRole('button', { name: /start game/i })
    expect(startButton).toBeDisabled()
  })

  test('allows selecting game mode', async () => {
    const user = userEvent.setup()
    render(<GameSetup onStart={() => {}} />)
    
    const modeButton = screen.getByText('Best of 3')
    await user.click(modeButton)
    
    expect(modeButton).toHaveClass('border-blue-500')
  })

  test('allows selecting starting player', async () => {
    const user = userEvent.setup()
    render(<GameSetup onStart={() => {}} />)
    
    const playerButton = screen.getByText('X (Cross)')
    await user.click(playerButton)
    
    expect(playerButton).toHaveClass('border-blue-500')
  })

  test('enables start button when both selections are made', async () => {
    const user = userEvent.setup()
    render(<GameSetup onStart={() => {}} />)
    
    await user.click(screen.getByText('1 Game'))
    await user.click(screen.getByText('X (Cross)'))
    
    const startButton = screen.getByRole('button', { name: /start game/i })
    expect(startButton).not.toBeDisabled()
  })

  test('calls onStart with correct parameters', async () => {
    const user = userEvent.setup()
    const handleStart = jest.fn()
    render(<GameSetup onStart={handleStart} />)
    
    await user.click(screen.getByText('Best of 3'))
    await user.click(screen.getByText('O (Circle)'))
    await user.click(screen.getByRole('button', { name: /start game/i }))
    
    expect(handleStart).toHaveBeenCalledTimes(1)
    expect(handleStart).toHaveBeenCalledWith(3, 'O')
  })
})

