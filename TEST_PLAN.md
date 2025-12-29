# ShiftTacToe - Comprehensive End-to-End Test Plan

## Test Environment
- Frontend: http://localhost:5173
- Backend: Railway (production) or local server
- Browser: Chrome/Firefox

## Test Modes

### 1. Single Player vs Computer Mode
- [ ] Easy Difficulty
- [ ] Hard Difficulty  
- [ ] Insane Difficulty

### 2. Two Player Offline Mode
- [ ] Single Game
- [ ] Best of 3
- [ ] Best of 5

### 3. Two Player Online Mode
- [ ] Room Creation
- [ ] Room Joining
- [ ] Game Synchronization
- [ ] Disconnection Handling

## Test Categories

### A. UI Components Testing
1. **Game Setup Screen**
   - [ ] Mode selection buttons work
   - [ ] Difficulty selection (for computer mode)
   - [ ] Game mode selection (1, 3, 5 games)
   - [ ] Starting player selection
   - [ ] Online mode button

2. **Game Board**
   - [ ] 3x3 grid renders correctly
   - [ ] Squares are clickable when enabled
   - [ ] Squares are disabled when not player's turn
   - [ ] Visual feedback for enabled/disabled squares
   - [ ] Token display (X and O)

3. **Game Status**
   - [ ] Current player display
   - [ ] Token count display
   - [ ] Winner announcement
   - [ ] Draw announcement
   - [ ] Series score display

4. **Controls**
   - [ ] Help button
   - [ ] New Game button
   - [ ] Next Game button (in series)
   - [ ] Return to menu

### B. Game Rules Testing

#### Token Placement Rules
- [ ] Can place token when < 3 tokens
- [ ] Cannot place token when = 3 tokens
- [ ] Cannot place on occupied square
- [ ] Cannot place while relocating

#### Token Movement Rules
- [ ] Can move token at any time (even with < 3 tokens)
- [ ] Can only move to adjacent squares (not diagonal)
- [ ] Cannot move to occupied square
- [ ] Can switch between tokens when relocating
- [ ] Can cancel relocation by placing back in same spot
- [ ] Cannot move token with no adjacent empty squares

#### Token Limit Rules
- [ ] Maximum 3 tokens per player
- [ ] When at 3 tokens, must move (cannot place)
- [ ] Token count updates correctly

#### Turn Management
- [ ] Players alternate turns correctly
- [ ] Computer takes turn automatically
- [ ] Cannot make move when not your turn
- [ ] Turn switches after valid move

#### Winning Conditions
- [ ] Horizontal win (rows 0, 1, 2)
- [ ] Vertical win (columns 0, 1, 2)
- [ ] Diagonal win (0-4-8, 2-4-6)
- [ ] Draw detection (full board, no winner)
- [ ] Game ends on win/draw

#### Series Games
- [ ] Score tracking (X wins, O wins)
- [ ] Series winner determination
- [ ] Starting player alternation
- [ ] Next game button appears correctly

### C. Computer AI Testing

#### Easy Difficulty
- [ ] Makes valid moves
- [ ] Doesn't always block/win
- [ ] Plays randomly sometimes

#### Hard Difficulty
- [ ] Blocks winning moves
- [ ] Takes winning moves
- [ ] Makes strategic moves

#### Insane Difficulty
- [ ] Uses minimax algorithm
- [ ] Always blocks/winning when possible
- [ ] Optimal play

### D. Online Multiplayer Testing

#### Connection
- [ ] Socket connection establishes
- [ ] Room creation works
- [ ] Room joining works
- [ ] Connection errors handled

#### Room Management
- [ ] Room ID generation
- [ ] Room ID display
- [ ] Player symbol assignment (X/O)
- [ ] Both players can join
- [ ] Room full detection

#### Game Synchronization
- [ ] Moves sync between players
- [ ] Game state syncs correctly
- [ ] Turn management works
- [ ] Token counts sync
- [ ] Winner detection syncs

#### Error Handling
- [ ] "Not in a room" error handling
- [ ] Connection loss handling
- [ ] Invalid move rejection
- [ ] Turn validation

### E. Edge Cases

1. **Token Movement Edge Cases**
   - [ ] Token in corner with limited moves
   - [ ] Token in center with all moves
   - [ ] Token surrounded by opponent
   - [ ] All tokens blocked (should be rare)

2. **Game State Edge Cases**
   - [ ] Win on last possible move
   - [ ] Draw with all tokens placed
   - [ ] Multiple winning lines (first wins)

3. **Online Edge Cases**
   - [ ] Player disconnects mid-game
   - [ ] Both players try to move simultaneously
   - [ ] Network delay handling
   - [ ] Reconnection after disconnect

## Test Execution Log

### Test Date: [Date]
### Tester: [Name]
### Environment: [Local/Production]

---

## Results

### Mode 1: Single Player vs Computer
**Status:** [ ] PASS [ ] FAIL [ ] PARTIAL

**Issues Found:**
- 

### Mode 2: Two Player Offline
**Status:** [ ] PASS [ ] FAIL [ ] PARTIAL

**Issues Found:**
- 

### Mode 3: Two Player Online
**Status:** [ ] PASS [ ] FAIL [ ] PARTIAL

**Issues Found:**
- 

## Summary
**Total Tests:** 
**Passed:** 
**Failed:** 
**Issues:** 


