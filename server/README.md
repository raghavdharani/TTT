# ShiftTacToe Server

Backend server for online multiplayer functionality using Socket.io.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Start the server:
```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

## Configuration

The server runs on port 3001 by default. You can change this by setting the `PORT` environment variable.

To configure the client URL for CORS, set the `CLIENT_URL` environment variable:
```bash
CLIENT_URL=http://localhost:5173 npm start
```

## How It Works

- Players can create or join rooms using a 6-character room ID
- Game state is synchronized in real-time between players
- Supports all game modes (1 game, best of 3, best of 5)
- Handles player disconnections gracefully

## API Events

### Client → Server

- `create-room`: Create a new game room
- `join-room`: Join an existing room by ID
- `player-ready`: Signal that player is ready to start
- `make-move`: Send a move to the server
- `start-new-game`: Start next game in series
- `reset-game`: Reset current game

### Server → Client

- `room-created`: Room was created successfully
- `player-joined`: A player joined the room
- `game-start`: Game is starting (both players ready)
- `game-state-updated`: Game state has changed
- `new-game-started`: New game in series started
- `game-reset`: Game was reset
- `player-left`: A player disconnected
- `error`: An error occurred
