import { calculateWinner, checkDraw } from './gameLogic'

describe('calculateWinner', () => {
  test('returns null for empty board', () => {
    const squares = Array(9).fill(null)
    expect(calculateWinner(squares)).toBe(null)
  })

  test('returns null when no winner', () => {
    const squares = ['X', 'O', 'X', 'O', 'X', 'O', 'O', 'X', 'O']
    expect(calculateWinner(squares)).toBe(null)
  })

  describe('row wins', () => {
    test('detects win in first row', () => {
      const squares = ['X', 'X', 'X', null, null, null, null, null, null]
      expect(calculateWinner(squares)).toBe('X')
    })

    test('detects win in second row', () => {
      const squares = [null, null, null, 'O', 'O', 'O', null, null, null]
      expect(calculateWinner(squares)).toBe('O')
    })

    test('detects win in third row', () => {
      const squares = [null, null, null, null, null, null, 'X', 'X', 'X']
      expect(calculateWinner(squares)).toBe('X')
    })
  })

  describe('column wins', () => {
    test('detects win in first column', () => {
      const squares = ['O', null, null, 'O', null, null, 'O', null, null]
      expect(calculateWinner(squares)).toBe('O')
    })

    test('detects win in second column', () => {
      const squares = [null, 'X', null, null, 'X', null, null, 'X', null]
      expect(calculateWinner(squares)).toBe('X')
    })

    test('detects win in third column', () => {
      const squares = [null, null, 'O', null, null, 'O', null, null, 'O']
      expect(calculateWinner(squares)).toBe('O')
    })
  })

  describe('diagonal wins', () => {
    test('detects win in first diagonal', () => {
      const squares = ['X', null, null, null, 'X', null, null, null, 'X']
      expect(calculateWinner(squares)).toBe('X')
    })

    test('detects win in second diagonal', () => {
      const squares = [null, null, 'O', null, 'O', null, 'O', null, null]
      expect(calculateWinner(squares)).toBe('O')
    })
  })
})

describe('checkDraw', () => {
  test('returns false for empty board', () => {
    const squares = Array(9).fill(null)
    expect(checkDraw(squares)).toBe(false)
  })

  test('returns false when board has empty squares', () => {
    const squares = ['X', 'O', 'X', 'O', 'X', 'O', null, null, null]
    expect(checkDraw(squares)).toBe(false)
  })

  test('returns false when there is a winner', () => {
    const squares = ['X', 'X', 'X', 'O', 'O', null, null, null, null]
    expect(checkDraw(squares)).toBe(false)
  })

  test('returns true when board is full and no winner', () => {
    const squares = ['X', 'O', 'X', 'O', 'X', 'O', 'O', 'X', 'O']
    expect(checkDraw(squares)).toBe(true)
  })
})

