# Specification: Core Gameplay (MVP)

**Version**: 1.0  
**Date**: 2025-11-06  
**Status**: Ready for Development  
**Phase**: Phase 1 - Core Gameplay (MVP)

---

## Table of Contents

1. [Overview](#overview)
2. [Scope](#scope)
3. [Feature Specifications](#feature-specifications)
4. [Component Architecture](#component-architecture)
5. [State Management](#state-management)
6. [UI/UX Specifications](#uiux-specifications)
7. [Technical Implementation](#technical-implementation)
8. [Accessibility Requirements](#accessibility-requirements)
9. [Testing Requirements](#testing-requirements)
10. [Acceptance Criteria](#acceptance-criteria)
11. [Edge Cases](#edge-cases)
12. [Dependencies](#dependencies)

---

## Overview

### Purpose
This specification defines the core gameplay functionality for a React-based tic-tac-toe game MVP. The implementation will deliver a fully functional two-player game with win/draw detection, game reset, and basic accessibility features.

### Goals
- Deliver a playable tic-tac-toe game that works on desktop and mobile
- Implement clean, maintainable React component architecture
- Ensure accessibility compliance (WCAG 2.1 AA)
- Provide smooth, responsive user experience
- Demonstrate React best practices

### Out of Scope (Future Phases)
- AI opponent
- Online multiplayer
- Game history persistence
- Advanced animations
- Sound effects
- Theme customization
- Statistics tracking

---

## Scope

### In Scope
- ✅ 3x3 game board grid
- ✅ Turn-based gameplay (X and O players)
- ✅ Click/tap to place markers
- ✅ Win detection (all 8 winning combinations)
- ✅ Draw detection
- ✅ Game reset functionality
- ✅ Current player indicator
- ✅ Winner/draw announcement
- ✅ Basic keyboard navigation
- ✅ Screen reader support
- ✅ Responsive design (mobile & desktop)
- ✅ Visual feedback (hover states, disabled states)

### Out of Scope
- ❌ Game history/statistics (Phase 3)
- ❌ Advanced animations (Phase 2)
- ❌ AI opponent (Phase 5)
- ❌ Online multiplayer (Phase 5)
- ❌ Sound effects (Phase 5)
- ❌ Theme customization (Phase 5)

---

## Feature Specifications

### 1. Game Board

#### 1.1 Board Structure
- **Grid**: 3x3 grid of squares (9 total squares)
- **Layout**: Centered on page, responsive sizing
- **Visual**: Clean grid with visible borders/separators
- **Size**: 
  - Minimum: 240px width (mobile)
  - Maximum: 400px width (desktop)
  - Squares maintain 1:1 aspect ratio

#### 1.2 Square States
Each square can be in one of three states:
- **Empty**: No marker, clickable
- **X**: Contains X marker, not clickable
- **O**: Contains O marker, not clickable

#### 1.3 Square Interaction
- **Click/Tap**: Place current player's marker (if empty)
- **Hover**: Visual feedback on empty squares (desktop)
- **Active**: Visual feedback on touch (mobile)
- **Disabled**: No interaction after game ends

### 2. Gameplay Flow

#### 2.1 Game Initialization
- **First Player**: X always goes first
- **Initial State**: All squares empty, X's turn
- **Status Display**: "Current Player: X"

#### 2.2 Turn-Based Play
- Players alternate turns (X → O → X → O...)
- Current player clicks empty square to place marker
- Marker appears instantly (no animation delay)
- Status updates to next player after move
- Game checks for win/draw after each move

#### 2.3 Move Validation
- **Valid Move**: Click on empty square → marker placed
- **Invalid Move**: Click on occupied square → ignored (no error message)
- **Post-Game**: All squares disabled after win/draw

### 3. Win Detection

#### 3.1 Winning Combinations
Check all 8 possible winning combinations:
- **Rows**:
  - Row 1: squares[0], squares[1], squares[2]
  - Row 2: squares[3], squares[4], squares[5]
  - Row 3: squares[6], squares[7], squares[8]
- **Columns**:
  - Column 1: squares[0], squares[3], squares[6]
  - Column 2: squares[1], squares[4], squares[7]
  - Column 3: squares[2], squares[5], squares[8]
- **Diagonals**:
  - Diagonal 1: squares[0], squares[4], squares[8]
  - Diagonal 2: squares[2], squares[4], squares[6]

#### 3.2 Win Detection Logic
- Check after each move
- If three identical markers found in a line → that player wins
- Set `winner` state to 'X' or 'O'
- Set `gameOver` state to `true`
- Disable all squares
- Display winner message

### 4. Draw Detection

#### 4.1 Draw Condition
- All 9 squares are filled
- No winner detected
- Set `winner` state to 'draw'
- Set `gameOver` state to `true`
- Disable all squares
- Display draw message

### 5. Game Reset

#### 5.1 Reset Functionality
- **Button**: "New Game" button always visible below board
- **Action**: 
  - Clear all squares (set to `null`)
  - Reset `xIsNext` to `true` (X's turn)
  - Reset `winner` to `null`
  - Reset `gameOver` to `false`
  - Update status to "Current Player: X"
  - Re-enable all squares

#### 5.2 Reset Availability
- Available at any time (during gameplay or after game ends)
- Allows players to restart mid-game if desired

### 6. Status Display

#### 6.1 Status Messages
Display above the board:
- **During Game**: "Current Player: X" or "Current Player: O"
- **Win**: "Player X Wins!" or "Player O Wins!"
- **Draw**: "It's a Draw!"

#### 6.2 Status Updates
- Update immediately after each move
- Update when game ends (win/draw)
- Update when game resets

---

## Component Architecture

### Component Hierarchy

```
App (root)
├── GameStatus (displays current player/winner)
├── Board (3x3 grid container)
│   └── Square (x9) (individual square components)
└── NewGameButton (reset button)
```

### Component Specifications

#### App Component
**Purpose**: Root component managing game state and logic

**Responsibilities**:
- Manage game state (squares, xIsNext, winner, gameOver)
- Handle square click events
- Implement win/draw detection logic
- Handle game reset
- Render layout structure

**Props**: None (root component)

**State**:
```javascript
const [squares, setSquares] = useState(Array(9).fill(null));
const [xIsNext, setXIsNext] = useState(true);
const [winner, setWinner] = useState(null);
const [gameOver, setGameOver] = useState(false);
```

**Methods**:
- `handleSquareClick(index)` - Handle square click, update state, check win/draw
- `calculateWinner(squares)` - Check for winning combinations
- `checkDraw(squares)` - Check if board is full with no winner
- `handleReset()` - Reset game to initial state

#### Board Component
**Purpose**: Render 3x3 grid of squares

**Props**:
- `squares` (Array): Current board state (9 elements)
- `onSquareClick` (Function): Handler for square clicks
- `gameOver` (Boolean): Whether game has ended
- `winner` (String|null): Current winner ('X', 'O', 'draw', or null)

**Responsibilities**:
- Render grid layout
- Map squares array to Square components
- Pass props to each Square

**Rendering**:
- Use CSS Grid or Flexbox for 3x3 layout
- Render 9 Square components

#### Square Component
**Purpose**: Individual square that displays marker and handles clicks

**Props**:
- `value` (String|null): 'X', 'O', or null
- `onClick` (Function): Click handler
- `disabled` (Boolean): Whether square is disabled
- `index` (Number): Square index (0-8) for ARIA labels

**Responsibilities**:
- Display X, O, or empty state
- Handle click events (if not disabled)
- Provide keyboard accessibility
- Show hover/active states

**Implementation**:
- Use `<button>` element for accessibility
- Apply disabled attribute when game over or square occupied
- Include ARIA labels for screen readers

#### GameStatus Component
**Purpose**: Display current game status

**Props**:
- `currentPlayer` (String): 'X' or 'O'
- `winner` (String|null): 'X', 'O', 'draw', or null
- `gameOver` (Boolean): Whether game has ended

**Responsibilities**:
- Display appropriate status message
- Update based on game state
- Provide screen reader announcements

**Messages**:
- `winner === null && !gameOver`: "Current Player: {currentPlayer}"
- `winner === 'X'`: "Player X Wins!"
- `winner === 'O'`: "Player O Wins!"
- `winner === 'draw'`: "It's a Draw!"

#### NewGameButton Component
**Purpose**: Reset game button

**Props**:
- `onReset` (Function): Reset handler

**Responsibilities**:
- Display reset button
- Handle click to reset game
- Always visible and accessible

---

## State Management

### State Structure

```javascript
{
  squares: Array(9).fill(null),  // Board state: null, 'X', or 'O'
  xIsNext: true,                 // true = X's turn, false = O's turn
  winner: null,                  // 'X', 'O', 'draw', or null
  gameOver: false                // true when game ends
}
```

### State Updates

#### Square Click Handler
```javascript
function handleSquareClick(index) {
  // Prevent clicks if game over or square occupied
  if (gameOver || squares[index]) return;
  
  // Create new squares array with updated value
  const newSquares = [...squares];
  newSquares[index] = xIsNext ? 'X' : 'O';
  
  // Update squares state
  setSquares(newSquares);
  
  // Check for winner
  const winner = calculateWinner(newSquares);
  if (winner) {
    setWinner(winner);
    setGameOver(true);
    return;
  }
  
  // Check for draw
  if (checkDraw(newSquares)) {
    setWinner('draw');
    setGameOver(true);
    return;
  }
  
  // Toggle turn
  setXIsNext(!xIsNext);
}
```

#### Win Detection Function
```javascript
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2], // Row 1
    [3, 4, 5], // Row 2
    [6, 7, 8], // Row 3
    [0, 3, 6], // Column 1
    [1, 4, 7], // Column 2
    [2, 5, 8], // Column 3
    [0, 4, 8], // Diagonal 1
    [2, 4, 6], // Diagonal 2
  ];
  
  for (let line of lines) {
    const [a, b, c] = line;
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a]; // Returns 'X' or 'O'
    }
  }
  return null;
}
```

#### Draw Detection Function
```javascript
function checkDraw(squares) {
  return squares.every(square => square !== null) && !calculateWinner(squares);
}
```

#### Reset Handler
```javascript
function handleReset() {
  setSquares(Array(9).fill(null));
  setXIsNext(true);
  setWinner(null);
  setGameOver(false);
}
```

---

## UI/UX Specifications

### Layout Structure

```
┌─────────────────────────────┐
│      Game Title/Header       │
│   (optional, can be simple)  │
├─────────────────────────────┤
│                             │
│    GameStatus Component     │
│  "Current Player: X"        │
│                             │
├─────────────────────────────┤
│                             │
│      Board Component        │
│    ┌─────┬─────┬─────┐     │
│    │  X  │  O  │  X  │     │
│    ├─────┼─────┼─────┤     │
│    │  O  │  X  │  O  │     │
│    ├─────┼─────┼─────┤     │
│    │  X  │  O  │  X  │     │
│    └─────┴─────┴─────┘     │
│                             │
├─────────────────────────────┤
│                             │
│    NewGameButton            │
│   [   New Game   ]          │
│                             │
└─────────────────────────────┘
```

### Visual Design

#### Colors
- **X Marker**: Blue (#3B82F6 or Tailwind `blue-500`)
- **O Marker**: Red (#EF4444 or Tailwind `red-500`)
- **Board Background**: Light gray (#F3F4F6 or Tailwind `gray-100`)
- **Grid Lines**: Medium gray (#D1D5DB or Tailwind `gray-300`)
- **Square Background**: White (#FFFFFF)
- **Hover State**: Light blue tint (#EFF6FF or Tailwind `blue-50`)
- **Disabled State**: Reduced opacity (0.6) or gray tint

#### Typography
- **Status Text**: Medium weight, 18-20px
- **Square Markers**: Bold, 48-64px (responsive)
- **Button Text**: Medium weight, 16px

#### Spacing
- **Board Padding**: 16-24px (responsive)
- **Square Gap**: 4-8px (grid gap)
- **Status Margin**: 16-24px above board
- **Button Margin**: 24-32px below board

#### Square Design
- **Size**: Minimum 80px × 80px, scales responsively
- **Border**: 2px solid grid lines
- **Border Radius**: 4-8px (slightly rounded corners)
- **Hover Effect**: Background color change, cursor pointer
- **Active Effect**: Slight scale or shadow (mobile touch)

### Responsive Design

#### Mobile (< 640px)
- Board width: 240-280px
- Square size: 80-93px
- Status text: 16-18px
- Padding: 16px

#### Tablet (640px - 1024px)
- Board width: 320-360px
- Square size: 106-120px
- Status text: 18-20px
- Padding: 20px

#### Desktop (> 1024px)
- Board width: 360-400px
- Square size: 120-133px
- Status text: 20px
- Padding: 24px

### Interaction States

#### Square States
1. **Empty + Hover**: Light background tint, pointer cursor
2. **Empty + Active**: Slightly darker background (touch feedback)
3. **Occupied**: No hover effect, default cursor
4. **Disabled**: Reduced opacity, not-allowed cursor

#### Button States
1. **Default**: Primary color background, white text
2. **Hover**: Darker shade, pointer cursor
3. **Active**: Pressed appearance
4. **Focus**: Visible outline (accessibility)

---

## Technical Implementation

### Technology Stack
- **Framework**: React 18+
- **Build Tool**: Vite (recommended)
- **Styling**: Tailwind CSS
- **Language**: JavaScript (ES6+)

### File Structure
```
src/
├── App.jsx                 # Root component
├── components/
│   ├── Board.jsx           # Board component
│   ├── Square.jsx          # Square component
│   ├── GameStatus.jsx      # Status display
│   └── NewGameButton.jsx   # Reset button
├── utils/
│   └── gameLogic.js        # Win/draw detection functions
├── App.css                 # Global styles (if needed)
└── main.jsx                # Entry point
```

### Component Implementation Guidelines

#### App.jsx
```javascript
import { useState } from 'react';
import Board from './components/Board';
import GameStatus from './components/GameStatus';
import NewGameButton from './components/NewGameButton';
import { calculateWinner, checkDraw } from './utils/gameLogic';

function App() {
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const [winner, setWinner] = useState(null);
  const [gameOver, setGameOver] = useState(false);

  // Implementation details...
}
```

#### Component Best Practices
- Use functional components with hooks
- Keep components small and focused
- Extract game logic to utility functions
- Use meaningful prop names
- Add PropTypes for type checking (optional)
- Follow React best practices from standards

### Styling Approach

#### Tailwind CSS Classes
- Use utility classes for styling
- Create custom classes only when necessary
- Follow mobile-first responsive design
- Use Tailwind's color palette
- Maintain consistent spacing scale

#### Example Square Styling
```jsx
<button
  className={`
    w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28
    border-2 border-gray-300
    bg-white hover:bg-blue-50
    disabled:opacity-60 disabled:cursor-not-allowed
    disabled:hover:bg-white
    text-4xl sm:text-5xl md:text-6xl
    font-bold
    transition-colors duration-150
    focus:outline-none focus:ring-2 focus:ring-blue-500
  `}
  disabled={disabled}
  onClick={onClick}
>
  {value}
</button>
```

### Performance Considerations
- Use React.memo() for Square components (optional optimization)
- Keep state updates minimal
- Avoid unnecessary re-renders
- No external API calls (client-side only)

---

## Accessibility Requirements

### Keyboard Navigation

#### Square Navigation
- **Tab**: Navigate through squares in order (left-to-right, top-to-bottom)
- **Enter/Space**: Place marker on focused square
- **Tab**: Continue to "New Game" button after board

#### Button Navigation
- **Tab**: Focus "New Game" button
- **Enter/Space**: Activate reset

#### Focus Management
- Visible focus indicators on all interactive elements
- Focus ring: 2px solid blue outline
- Focus order: Logical (squares → button)

### ARIA Labels

#### Square Labels
```jsx
<button
  aria-label={`${value || 'Empty'} square, row ${row}, column ${col}`}
  aria-disabled={disabled}
>
```

#### Status Announcements
```jsx
<div role="status" aria-live="polite" aria-atomic="true">
  {statusMessage}
</div>
```

#### Button Label
```jsx
<button aria-label="Start a new game">
  New Game
</button>
```

### Screen Reader Support
- Announce current player after each move
- Announce winner immediately when detected
- Announce draw when detected
- Announce game reset
- Use `aria-live="polite"` for status updates

### Color Contrast
- **Text on Background**: Minimum 4.5:1 ratio (WCAG AA)
- **Interactive Elements**: Clear visual distinction
- **Status Messages**: High contrast for visibility
- **Markers**: High contrast against white background

### Touch Targets
- Minimum 44×44px touch targets (squares exceed this)
- Adequate spacing between interactive elements
- Visual feedback on touch (active state)

---

## Testing Requirements

### Unit Tests

#### Game Logic Tests
- `calculateWinner()` function:
  - Test all 8 winning combinations
  - Test no winner scenarios
  - Test with null values
  
- `checkDraw()` function:
  - Test draw condition (full board, no winner)
  - Test not draw (empty squares)
  - Test not draw (has winner)

#### Component Tests
- **App Component**:
  - Initial state correct
  - Square click updates state
  - Win detection works
  - Draw detection works
  - Reset functionality works

- **Board Component**:
  - Renders 9 squares
  - Passes correct props to squares
  - Handles click events

- **Square Component**:
  - Displays correct value (X, O, empty)
  - Handles click when enabled
  - Ignores click when disabled
  - Shows correct disabled state

- **GameStatus Component**:
  - Displays current player correctly
  - Displays winner message correctly
  - Displays draw message correctly

- **NewGameButton Component**:
  - Renders button
  - Calls reset handler on click

### Integration Tests
- Complete game flow (X wins)
- Complete game flow (O wins)
- Complete game flow (draw)
- Reset during gameplay
- Reset after game ends

### Accessibility Tests
- Keyboard navigation works
- Screen reader announcements work
- Focus indicators visible
- ARIA labels correct
- Color contrast meets WCAG AA

### Browser Tests
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- iOS Safari
- Chrome Mobile

### Responsive Tests
- Mobile (< 640px)
- Tablet (640px - 1024px)
- Desktop (> 1024px)
- Portrait and landscape orientations

---

## Acceptance Criteria

### Functional Requirements
- ✅ Two players can play a complete game
- ✅ X always goes first
- ✅ Players alternate turns correctly
- ✅ Markers appear instantly when square clicked
- ✅ Win conditions detected correctly (all 8 combinations)
- ✅ Draw condition detected correctly
- ✅ Game resets correctly
- ✅ Status updates correctly
- ✅ Occupied squares cannot be clicked
- ✅ Squares disabled after game ends

### UI/UX Requirements
- ✅ Clean, modern visual design
- ✅ Responsive layout (mobile & desktop)
- ✅ Hover states on empty squares
- ✅ Visual feedback on interactions
- ✅ Clear status messages
- ✅ Prominent reset button

### Accessibility Requirements
- ✅ Keyboard navigable
- ✅ Screen reader friendly
- ✅ ARIA labels present
- ✅ Focus indicators visible
- ✅ WCAG AA color contrast
- ✅ Touch targets adequate size

### Technical Requirements
- ✅ React 18+ components
- ✅ Clean component architecture
- ✅ Proper state management
- ✅ No console errors
- ✅ No accessibility violations
- ✅ Works in all target browsers
- ✅ Responsive design

### Performance Requirements
- ✅ Instant marker placement (< 100ms)
- ✅ Smooth interactions
- ✅ No lag or jank
- ✅ Fast page load

---

## Edge Cases

### 1. Click on Occupied Square
- **Behavior**: Ignore click silently
- **Visual**: No change
- **Implementation**: Early return in click handler

### 2. Click After Game Ends
- **Behavior**: All squares disabled
- **Visual**: Reduced opacity, not-allowed cursor
- **Implementation**: Check `gameOver` state

### 3. Rapid Clicks
- **Behavior**: Only first click processes
- **Implementation**: State updates are synchronous, React batches updates

### 4. Reset During Gameplay
- **Behavior**: Game resets immediately
- **State**: All state cleared, X's turn
- **Visual**: Board clears, status updates

### 5. Multiple Wins Detected
- **Scenario**: Should not occur (game ends on first win)
- **Implementation**: Check win immediately after move, disable board

### 6. Draw After Win Check
- **Scenario**: Should not occur (win checked first)
- **Implementation**: Check win before draw

### 7. Empty Board Win
- **Scenario**: Should not occur (need 3 markers)
- **Implementation**: Win function checks for non-null values

### 8. Browser Refresh
- **Behavior**: Game resets (no persistence in MVP)
- **Expected**: Normal React behavior

---

## Dependencies

### Production Dependencies
```json
{
  "react": "^18.2.0",
  "react-dom": "^18.2.0"
}
```

### Development Dependencies
```json
{
  "@testing-library/react": "^14.0.0",
  "@testing-library/jest-dom": "^6.0.0",
  "@testing-library/user-event": "^14.0.0",
  "eslint": "^8.0.0",
  "eslint-plugin-react": "^7.33.0",
  "eslint-plugin-react-hooks": "^4.6.0",
  "prettier": "^3.0.0",
  "jest": "^29.0.0",
  "jest-environment-jsdom": "^29.0.0",
  "vite": "^5.0.0",
  "@vitejs/plugin-react": "^4.0.0"
}
```

### Optional Dependencies
```json
{
  "tailwindcss": "^3.4.0",
  "autoprefixer": "^10.4.0",
  "postcss": "^8.4.0"
}
```

---

## Related Documents

- **Product Mission**: `agent-os/product/mission.md`
- **Product Roadmap**: `agent-os/product/roadmap.md`
- **Tech Stack**: `agent-os/product/tech-stack.md`
- **Requirements**: `requirements.md`
- **Coding Standards**: `agent-os/standards/global/coding-style.md`
- **Component Standards**: `agent-os/standards/frontend/components.md`
- **Accessibility Standards**: `agent-os/standards/frontend/accessibility.md`

---

## Notes

- This spec is for MVP only - additional features will be added in future phases
- Focus on clean, maintainable code following React best practices
- Prioritize user experience and accessibility
- Test thoroughly before considering complete
- Follow all coding standards and conventions

---

**End of Specification**

