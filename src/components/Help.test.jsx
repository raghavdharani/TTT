import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Help from './Help'

describe('Help Component', () => {
  test('does not render when closed', () => {
    render(<Help isOpen={false} onClose={() => {}} />)
    expect(screen.queryByText('Game Rules & Restrictions')).not.toBeInTheDocument()
  })

  test('renders when open', () => {
    render(<Help isOpen={true} onClose={() => {}} />)
    expect(screen.getByText('Game Rules & Restrictions')).toBeInTheDocument()
  })

  test('displays all rule sections', () => {
    render(<Help isOpen={true} onClose={() => {}} />)
    expect(screen.getByText('Basic Rules')).toBeInTheDocument()
    expect(screen.getByText('Token Limit')).toBeInTheDocument()
    expect(screen.getByText('Movement Restrictions')).toBeInTheDocument()
    expect(screen.getByText('How to Play')).toBeInTheDocument()
    expect(screen.getByText('Tips')).toBeInTheDocument()
  })

  test('calls onClose when close button is clicked', async () => {
    const user = userEvent.setup()
    const handleClose = jest.fn()
    render(<Help isOpen={true} onClose={handleClose} />)
    
    const closeButton = screen.getByLabelText('Close help')
    await user.click(closeButton)
    
    expect(handleClose).toHaveBeenCalledTimes(1)
  })

  test('calls onClose when "Got it!" button is clicked', async () => {
    const user = userEvent.setup()
    const handleClose = jest.fn()
    render(<Help isOpen={true} onClose={handleClose} />)
    
    const gotItButton = screen.getByText('Got it!')
    await user.click(gotItButton)
    
    expect(handleClose).toHaveBeenCalledTimes(1)
  })

  test('calls onClose when clicking outside modal', async () => {
    const user = userEvent.setup()
    const handleClose = jest.fn()
    render(<Help isOpen={true} onClose={handleClose} />)
    
    const backdrop = screen.getByRole('dialog').parentElement
    await user.click(backdrop)
    
    expect(handleClose).toHaveBeenCalledTimes(1)
  })

  test('does not close when clicking inside modal', async () => {
    const user = userEvent.setup()
    const handleClose = jest.fn()
    render(<Help isOpen={true} onClose={handleClose} />)
    
    const modalContent = screen.getByText('Game Rules & Restrictions').closest('div')
    await user.click(modalContent)
    
    expect(handleClose).not.toHaveBeenCalled()
  })

  test('has correct ARIA attributes', () => {
    render(<Help isOpen={true} onClose={() => {}} />)
    const dialog = screen.getByRole('dialog')
    expect(dialog).toHaveAttribute('aria-modal', 'true')
    expect(dialog).toHaveAttribute('aria-labelledby', 'help-title')
  })
})

