# Online Multiplayer Setup Guide

This guide will help you set up and run the online multiplayer feature for ShiftTacToe.

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn

## Quick Start

### 1. Install Dependencies

**Frontend:**
```bash
npm install
```

**Backend Server:**
```bash
cd server
npm install
cd ..
```

### 2. Start the Backend Server

In one terminal:
```bash
cd server
npm start
```

The server will start on `http://localhost:3001`

### 3. Start the Frontend

In another terminal (from the project root):
```bash
npm run dev
```

The frontend will start on `http://localhost:5173`

### 4. Play Online!

1. Open `http://localhost:5173` in your browser
2. Select "Online" as the play mode
3. **To create a room:**
   - Click "Create Room"
   - Select game mode (1 game, best of 3, or best of 5)
   - Choose who goes first
   - Click "Create Room"
   - Share the Room ID with your friend
4. **To join a room:**
   - Click "Join Room"
   - Enter the Room ID your friend shared
   - Click "Join Room"

## How It Works

- **Room System**: Each game creates a unique 6-character room ID
- **Real-time Sync**: All moves are synchronized instantly between players
- **Disconnection Handling**: If a player disconnects, the other player is notified
- **All Game Modes**: Supports single games, best of 3, and best of 5 series

## Configuration

### Environment Variables

**Frontend** (optional - defaults provided):
- `VITE_SOCKET_URL`: Socket.io server URL (default: `http://localhost:3001`)

**Backend** (optional - defaults provided):
- `PORT`: Server port (default: `3001`)
- `CLIENT_URL`: CORS allowed origin (default: `http://localhost:5173`)

Create a `.env` file in the `server` directory if you need custom configuration:
```
PORT=3001
CLIENT_URL=http://localhost:5173
```

## Troubleshooting

### Server won't start
- Make sure port 3001 is not already in use
- Check that all dependencies are installed (`cd server && npm install`)

### Can't connect to server
- Verify the server is running (`npm start` in the server directory)
- Check that the `VITE_SOCKET_URL` matches your server URL
- Make sure CORS is configured correctly

### Players can't see each other's moves
- Check browser console for errors
- Verify both players are in the same room (same Room ID)
- Ensure WebSocket connections are not blocked by firewall/proxy

## Deployment

For production deployment:

1. Set environment variables appropriately
2. Build the frontend: `npm run build`
3. Serve the backend with a process manager like PM2
4. Configure your reverse proxy (nginx, etc.) to handle both HTTP and WebSocket connections

## Features

✅ Real-time multiplayer gameplay
✅ Room-based matchmaking
✅ Support for all game modes
✅ Series play (best of 3, best of 5)
✅ Graceful disconnection handling
✅ Cross-platform compatible
