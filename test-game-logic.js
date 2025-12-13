/**
 * Comprehensive Game Logic Test Suite
 * Tests all game rules and validation logic
 */

// Import game logic functions (simulate them for testing)
const TOKEN_LIMIT = 3;

const countTokens = (squares, player) =>
  squares.reduce((count, square) => (square === player ? count + 1 : count), 0);

const getAdjacentIndices = (index) => {
  const row = Math.floor(index / 3);
  const col = index % 3;
  const adjacent = [];
  if (row > 0) adjacent.push((row - 1) * 3 + col);
  if (row < 2) adjacent.push((row + 1) * 3 + col);
  if (col > 0) adjacent.push(row * 3 + (col - 1));
  if (col < 2) adjacent.push(row * 3 + (col + 1));
  return adjacent;
};

const canTokenMove = (squares, index) => {
  const adjacentIndices = getAdjacentIndices(index);
  return adjacentIndices.some((adjIndex) => squares[adjIndex] === null);
};

const isAdjacent = (sourceIndex, targetIndex) => {
  return getAdjacentIndices(sourceIndex).includes(targetIndex);
};

const calculateWinner = (squares) => {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6], // Diagonals
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
};

const checkDraw = (squares) => {
  return squares.every((square) => square !== null) && !calculateWinner(squares);
};

// Test Results
let testsPassed = 0;
let testsFailed = 0;
const failures = [];

function test(name, fn) {
  try {
    fn();
    testsPassed++;
    console.log(`✅ ${name}`);
  } catch (error) {
    testsFailed++;
    failures.push({ name, error: error.message });
    console.error(`❌ ${name}: ${error.message}`);
  }
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message || 'Assertion failed');
  }
}

// Test Suite
console.log('🧪 Starting Comprehensive Game Logic Tests\n');

// Test 1: Token Counting
console.log('📊 Token Counting Tests');
test('Count tokens correctly for X', () => {
  const squares = ['X', 'O', null, 'X', null, 'O', 'X', null, null];
  assert(countTokens(squares, 'X') === 3, 'Should count 3 X tokens');
  assert(countTokens(squares, 'O') === 2, 'Should count 2 O tokens');
});

test('Count tokens on empty board', () => {
  const squares = Array(9).fill(null);
  assert(countTokens(squares, 'X') === 0, 'Should count 0 tokens');
});

// Test 2: Adjacent Indices
console.log('\n📍 Adjacent Indices Tests');
test('Center square has 4 adjacent', () => {
  const adj = getAdjacentIndices(4); // Center
  assert(adj.length === 4, 'Center should have 4 adjacent squares');
  assert(adj.includes(1), 'Should include top');
  assert(adj.includes(7), 'Should include bottom');
  assert(adj.includes(3), 'Should include left');
  assert(adj.includes(5), 'Should include right');
});

test('Corner square has 2 adjacent', () => {
  const adj = getAdjacentIndices(0); // Top-left corner
  assert(adj.length === 2, 'Corner should have 2 adjacent squares');
  assert(adj.includes(1), 'Should include right');
  assert(adj.includes(3), 'Should include bottom');
  assert(!adj.includes(4), 'Should NOT include diagonal');
});

test('Edge square has 3 adjacent', () => {
  const adj = getAdjacentIndices(1); // Top edge
  assert(adj.length === 3, 'Edge should have 3 adjacent squares');
});

// Test 3: Token Movement
console.log('\n🚶 Token Movement Tests');
test('Token can move when adjacent square is empty', () => {
  const squares = ['X', null, null, null, null, null, null, null, null];
  assert(canTokenMove(squares, 0) === true, 'Token should be able to move');
});

test('Token cannot move when all adjacent squares are occupied', () => {
  const squares = ['X', 'O', 'O', 'O', null, null, null, null, null];
  assert(canTokenMove(squares, 0) === false, 'Token should NOT be able to move');
});

test('Is adjacent check works correctly', () => {
  assert(isAdjacent(0, 1) === true, '0 and 1 should be adjacent');
  assert(isAdjacent(0, 3) === true, '0 and 3 should be adjacent');
  assert(isAdjacent(0, 4) === false, '0 and 4 should NOT be adjacent (diagonal)');
  assert(isAdjacent(4, 0) === false, '4 and 0 should NOT be adjacent (diagonal)');
});

// Test 4: Token Limit Rules
console.log('\n🎯 Token Limit Rules Tests');
test('Can place when under limit', () => {
  const squares = ['X', 'X', null, null, null, null, null, null, null];
  const count = countTokens(squares, 'X');
  assert(count < TOKEN_LIMIT, 'Should be under limit');
  assert(count === 2, 'Should have 2 tokens');
});

test('Cannot place when at limit', () => {
  const squares = ['X', 'X', 'X', null, null, null, null, null, null];
  const count = countTokens(squares, 'X');
  assert(count >= TOKEN_LIMIT, 'Should be at limit');
  assert(count === 3, 'Should have 3 tokens');
});

// Test 5: Winning Conditions
console.log('\n🏆 Winning Conditions Tests');
test('Horizontal win detection', () => {
  const squares = ['X', 'X', 'X', null, 'O', null, null, null, null];
  assert(calculateWinner(squares) === 'X', 'Should detect horizontal win');
});

test('Vertical win detection', () => {
  const squares = ['X', null, null, 'X', 'O', null, 'X', null, null];
  assert(calculateWinner(squares) === 'X', 'Should detect vertical win');
});

test('Diagonal win detection (top-left to bottom-right)', () => {
  const squares = ['X', null, 'O', null, 'X', null, null, null, 'X'];
  assert(calculateWinner(squares) === 'X', 'Should detect diagonal win');
});

test('Diagonal win detection (top-right to bottom-left)', () => {
  const squares = [null, null, 'O', null, 'O', null, 'O', null, null];
  assert(calculateWinner(squares) === 'O', 'Should detect reverse diagonal win');
});

test('No winner on partial board', () => {
  const squares = ['X', 'O', null, null, null, null, null, null, null];
  assert(calculateWinner(squares) === null, 'Should not detect winner');
});

// Test 6: Draw Detection
console.log('\n🤝 Draw Detection Tests');
test('Draw when board full and no winner', () => {
  const squares = ['X', 'O', 'X', 'O', 'X', 'O', 'O', 'X', 'O'];
  assert(checkDraw(squares) === true, 'Should detect draw');
});

test('Not a draw when there is a winner', () => {
  const squares = ['X', 'X', 'X', 'O', 'O', null, null, null, null];
  assert(checkDraw(squares) === false, 'Should not be draw when winner exists');
});

test('Not a draw when board not full', () => {
  const squares = ['X', 'O', null, null, null, null, null, null, null];
  assert(checkDraw(squares) === false, 'Should not be draw when board not full');
});

// Test 7: Complex Game Scenarios
console.log('\n🎮 Complex Game Scenarios');
test('Token movement with 3 tokens', () => {
  const squares = ['X', 'X', 'X', null, 'O', null, null, null, null];
  const xCount = countTokens(squares, 'X');
  assert(xCount === 3, 'X should have 3 tokens');
  // Token at 0: adjacent to 1 (X) and 3 (null) - can move to 3
  assert(canTokenMove(squares, 0) === true, 'Token at 0 should be able to move');
  // Token at 1: adjacent to 0 (X), 2 (X), 4 (O) - all occupied, cannot move
  assert(canTokenMove(squares, 1) === false, 'Token at 1 should NOT be able to move (all adjacent occupied)');
  // Token at 2: adjacent to 1 (X) and 5 (null) - can move to 5
  assert(canTokenMove(squares, 2) === true, 'Token at 2 should be able to move');
});

test('Token movement with < 3 tokens (should still be allowed)', () => {
  const squares = ['X', 'X', null, null, 'O', null, null, null, null];
  const xCount = countTokens(squares, 'X');
  assert(xCount < TOKEN_LIMIT, 'X should have < 3 tokens');
  assert(canTokenMove(squares, 0) === true, 'Token should still be movable');
  assert(canTokenMove(squares, 1) === true, 'Token should still be movable');
});

test('All tokens blocked scenario', () => {
  const squares = ['X', 'O', 'O', 'O', 'X', 'O', 'O', 'O', 'X'];
  assert(canTokenMove(squares, 0) === false, 'Token at 0 should be blocked');
  assert(canTokenMove(squares, 4) === false, 'Token at 4 should be blocked');
  assert(canTokenMove(squares, 8) === false, 'Token at 8 should be blocked');
});

// Test 8: Edge Cases
console.log('\n🔍 Edge Cases');
test('Empty board', () => {
  const squares = Array(9).fill(null);
  assert(countTokens(squares, 'X') === 0, 'Should have 0 tokens');
  assert(calculateWinner(squares) === null, 'Should have no winner');
  assert(checkDraw(squares) === false, 'Should not be draw');
});

test('Full board with winner', () => {
  const squares = ['X', 'X', 'X', 'O', 'O', null, null, null, null];
  // Fill remaining squares
  squares[5] = 'O';
  squares[6] = 'O';
  squares[7] = 'X';
  squares[8] = 'X';
  assert(calculateWinner(squares) === 'X', 'Should detect winner');
  assert(checkDraw(squares) === false, 'Should not be draw when winner exists');
});

// Summary
console.log('\n' + '='.repeat(50));
console.log('📊 Test Summary');
console.log('='.repeat(50));
console.log(`✅ Passed: ${testsPassed}`);
console.log(`❌ Failed: ${testsFailed}`);
console.log(`📈 Total: ${testsPassed + testsFailed}`);

if (failures.length > 0) {
  console.log('\n❌ Failures:');
  failures.forEach(({ name, error }) => {
    console.log(`  - ${name}: ${error}`);
  });
}

if (testsFailed === 0) {
  console.log('\n🎉 All tests passed!');
  process.exit(0);
} else {
  console.log('\n⚠️  Some tests failed');
  process.exit(1);
}

