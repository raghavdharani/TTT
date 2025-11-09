# Tic Tac Toe Game

A modern, responsive tic-tac-toe game built with React and Tailwind CSS.

## Features

- ✅ Two-player turn-based gameplay
- ✅ Win detection (all 8 winning combinations)
- ✅ Draw detection
- ✅ Game reset functionality
- ✅ Responsive design (mobile & desktop)
- ✅ Keyboard navigation
- ✅ Screen reader support
- ✅ Accessible UI (WCAG AA compliant)

## Tech Stack

- **React 18+** - UI framework
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Jest** - Testing framework
- **React Testing Library** - Component testing

## Getting Started

### Prerequisites

- Node.js 18+ (LTS recommended)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and navigate to the URL shown in the terminal (typically `http://localhost:5173`)

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

### Preview Production Build

```bash
npm run preview
```

## Deployment

### Deploy to Vercel

This project is configured for easy deployment to Vercel.

1. **Install Vercel CLI** (if not already installed):
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy to production**:
   ```bash
   npm run deploy
   ```
   
   Or use the Vercel CLI directly:
   ```bash
   vercel --prod
   ```

4. **First-time deployment**: Follow the prompts to:
   - Link your project to Vercel
   - Configure project settings (Vercel will auto-detect Vite)
   - Your game will be live at a URL like `your-game.vercel.app`

**Alternative: Deploy via Vercel Dashboard**
- Push your code to GitHub
- Import your repository in the [Vercel Dashboard](https://vercel.com/dashboard)
- Vercel will automatically detect the Vite configuration and deploy

The `vercel.json` configuration file is already set up for optimal Vite deployment.

## Testing

Run tests:
```bash
npm test
```

Run tests in watch mode:
```bash
npm run test:watch
```

## Code Quality

Lint code:
```bash
npm run lint
```

Format code:
```bash
npm run format
```

## Project Structure

```
src/
├── components/
│   ├── Board.jsx           # Game board component
│   ├── Square.jsx          # Individual square component
│   ├── GameStatus.jsx      # Status display component
│   └── NewGameButton.jsx   # Reset button component
├── utils/
│   └── gameLogic.js        # Game logic utilities
├── App.jsx                 # Root component
├── main.jsx                # Entry point
└── index.css               # Global styles
```

## How to Play

1. Player X always goes first
2. Click on an empty square to place your marker
3. Players alternate turns
4. Each player may have a maximum of **three tokens** on the board at any time
5. **You can relocate your tokens at any time**: Click on one of your tokens to pick it up, then click an **adjacent** empty square (up, down, left, or right - **not diagonally**) to place it
6. **Movement restrictions**:
   - Tokens can only move to adjacent squares (horizontally or vertically adjacent)
   - If all adjacent squares are blocked by other tokens, that token cannot be moved (it will be disabled)
   - Placing a token back in the same location does not count as a turn
7. When you have 3 tokens, you must relocate an existing token (you cannot place new tokens)
8. Win by getting three markers in a row (horizontal, vertical, or diagonal)
9. If no player forms a line, continue relocating tokens strategically until someone wins
10. Click "New Game" to reset and play again

## Keyboard Navigation

- **Tab**: Navigate through squares and buttons
- **Enter/Space**: Place marker or activate button
- All interactive elements are fully keyboard accessible

## Accessibility

This game is built with accessibility in mind:
- Full keyboard navigation support
- ARIA labels for screen readers
- WCAG AA color contrast compliance
- Semantic HTML structure
- Screen reader announcements for game status

## License

MIT

