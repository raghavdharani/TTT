import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Square from './Square'

describe('Square Component', () => {
  test('renders empty square', () => {
    render(<Square value={null} onClick={() => {}} disabled={false} index={0} />)
    const button = screen.getByRole('button', { name: /empty square, row 1, column 1/i })
    expect(button).toBeInTheDocument()
    expect(button.textContent).toBe('')
  })

  test('renders X marker', () => {
    render(<Square value="X" onClick={() => {}} disabled={false} index={0} />)
    const button = screen.getByRole('button', { name: /x square, row 1, column 1/i })
    expect(button).toBeInTheDocument()
    expect(button.textContent).toBe('X')
  })

  test('renders O marker', () => {
    render(<Square value="O" onClick={() => {}} disabled={false} index={4} />)
    const button = screen.getByRole('button', { name: /o square, row 2, column 2/i })
    expect(button).toBeInTheDocument()
    expect(button.textContent).toBe('O')
  })

  test('calls onClick when clicked and not disabled', async () => {
    const user = userEvent.setup()
    const handleClick = jest.fn()
    render(<Square value={null} onClick={handleClick} disabled={false} index={0} />)
    
    const button = screen.getByRole('button')
    await user.click(button)
    
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  test('does not call onClick when disabled', async () => {
    const user = userEvent.setup()
    const handleClick = jest.fn()
    render(<Square value={null} onClick={handleClick} disabled={true} index={0} />)
    
    const button = screen.getByRole('button')
    await user.click(button)
    
    expect(handleClick).not.toHaveBeenCalled()
    expect(button).toBeDisabled()
  })

  test('does not call onClick when occupied', async () => {
    const user = userEvent.setup()
    const handleClick = jest.fn()
    render(<Square value="X" onClick={handleClick} disabled={false} index={0} />)
    
    const button = screen.getByRole('button')
    await user.click(button)
    
    expect(handleClick).not.toHaveBeenCalled()
  })

  test('has correct ARIA attributes', () => {
    render(<Square value="X" onClick={() => {}} disabled={true} index={5} />)
    const button = screen.getByRole('button')
    
    expect(button).toHaveAttribute('aria-label', 'X square, row 2, column 3')
    expect(button).toHaveAttribute('aria-disabled', 'true')
  })
})

