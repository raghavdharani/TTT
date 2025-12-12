import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

const app = express();
const httpServer = createServer(app);

// Allow CORS from any origin for development (restrict in production)
// In production, set CLIENT_URL to your Vercel frontend URL
const allowedOrigins = process.env.CLIENT_URL 
  ? process.env.CLIENT_URL.split(',').map(url => url.trim())
  : ['*']; // Allow all origins if CLIENT_URL not set (for easier deployment)

if (process.env.NODE_ENV === 'production' && !process.env.CLIENT_URL) {
  console.warn('⚠️  WARNING: CLIENT_URL not set in production. Allowing all origins. Set CLIENT_URL for security.');
}

const io = new Server(httpServer, {
  cors: {
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin || allowedOrigins.includes('*') || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes('*') || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));
app.use(express.json());

// In-memory game rooms storage
const rooms = new Map();
const players = new Map(); // socketId -> { roomId, playerId }

// Generate unique room ID
const generateRoomId = () => {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
};

// Clean up empty rooms
const cleanupRoom = (roomId) => {
  const room = rooms.get(roomId);
  if (room && room.players.length === 0) {
    rooms.delete(roomId);
  }
};

io.on('connection', (socket) => {
  console.log(`Player connected: ${socket.id}`);

  // Create a new room
  socket.on('create-room', ({ gameMode, startingPlayer }) => {
    const roomId = generateRoomId();
    const room = {
      id: roomId,
      gameMode: gameMode || 1,
      startingPlayer: startingPlayer || 'X',
      players: [
        {
          id: socket.id,
          symbol: 'X',
          ready: false,
        },
      ],
      gameState: {
        squares: Array(9).fill(null),
        xIsNext: startingPlayer === 'X',
        winner: null,
        gameOver: false,
        tokenToMoveIndex: null,
        currentGame: 1,
        xWins: 0,
        oWins: 0,
        seriesWinner: null,
      },
      createdAt: Date.now(),
    };

    rooms.set(roomId, room);
    players.set(socket.id, { roomId, playerId: socket.id });

    socket.join(roomId);
    socket.emit('room-created', { roomId, playerSymbol: 'X' });
    console.log(`Room created: ${roomId} by ${socket.id}`);
  });

  // Join an existing room
  socket.on('join-room', ({ roomId }) => {
    const room = rooms.get(roomId);

    if (!room) {
      socket.emit('error', { message: 'Room not found' });
      return;
    }

    if (room.players.length >= 2) {
      socket.emit('error', { message: 'Room is full' });
      return;
    }

    // Add second player as 'O'
    room.players.push({
      id: socket.id,
      symbol: 'O',
      ready: false,
    });

    players.set(socket.id, { roomId, playerId: socket.id });
    socket.join(roomId);

    // Notify both players
    io.to(roomId).emit('player-joined', {
      roomId,
      players: room.players.map((p) => ({ id: p.id, symbol: p.symbol })),
      gameState: room.gameState,
    });

    console.log(`Player ${socket.id} joined room ${roomId}`);
    
    // If both players are already in the room, they can start playing
    // The game will start when both players are ready
  });

  // Player ready
  socket.on('player-ready', () => {
    const playerInfo = players.get(socket.id);
    if (!playerInfo) return;

    const room = rooms.get(playerInfo.roomId);
    if (!room) return;

    const player = room.players.find((p) => p.id === socket.id);
    if (player) {
      player.ready = true;
    }

    // If both players are in the room and ready, start the game
    const allReady = room.players.length === 2 && room.players.every((p) => p.ready);
    if (allReady) {
      // Reset ready states for next game
      room.players.forEach((p) => { p.ready = false; });
      
      io.to(room.id).emit('game-start', {
        roomId: room.id,
        gameState: room.gameState,
        players: room.players.map((p) => ({ id: p.id, symbol: p.symbol })),
        gameMode: room.gameMode,
        startingPlayer: room.startingPlayer,
      });
    }
  });

  // Make a move
  socket.on('make-move', ({ moveType, fromIndex, toIndex }) => {
    const playerInfo = players.get(socket.id);
    if (!playerInfo) {
      socket.emit('error', { message: 'Not in a room' });
      return;
    }

    const room = rooms.get(playerInfo.roomId);
    if (!room) {
      socket.emit('error', { message: 'Room not found' });
      return;
    }

    const player = room.players.find((p) => p.id === socket.id);
    if (!player) {
      socket.emit('error', { message: 'Player not found in room' });
      return;
    }

    const currentPlayer = room.gameState.xIsNext ? 'X' : 'O';
    if (player.symbol !== currentPlayer) {
      socket.emit('error', { message: 'Not your turn' });
      return;
    }

    if (room.gameState.gameOver) {
      socket.emit('error', { message: 'Game is over' });
      return;
    }

    // Apply move to game state
    const newSquares = [...room.gameState.squares];

    if (moveType === 'place') {
      newSquares[toIndex] = currentPlayer;
      room.gameState.tokenToMoveIndex = null;
    } else if (moveType === 'pickup') {
      room.gameState.tokenToMoveIndex = fromIndex;
      newSquares[fromIndex] = null;
    } else if (moveType === 'relocate') {
      newSquares[toIndex] = currentPlayer;
      room.gameState.tokenToMoveIndex = null;
    } else if (moveType === 'cancel-relocate') {
      newSquares[fromIndex] = currentPlayer;
      room.gameState.tokenToMoveIndex = null;
    }

    room.gameState.squares = newSquares;

    // Check for winner or draw (simplified - you'll need to import the actual logic)
    const winner = calculateWinner(newSquares);
    const isDraw = checkDraw(newSquares);

    if (winner) {
      room.gameState.winner = winner;
      room.gameState.gameOver = true;
      if (winner === 'X') {
        room.gameState.xWins++;
      } else {
        room.gameState.oWins++;
      }
    } else if (isDraw) {
      room.gameState.winner = 'draw';
      room.gameState.gameOver = true;
    } else {
      room.gameState.xIsNext = !room.gameState.xIsNext;
    }

    // Broadcast updated game state to all players in room
    io.to(room.id).emit('game-state-updated', {
      gameState: room.gameState,
    });
  });

  // Start new game in series
  socket.on('start-new-game', () => {
    const playerInfo = players.get(socket.id);
    if (!playerInfo) return;

    const room = rooms.get(playerInfo.roomId);
    if (!room) return;

    // Alternate starting player
    const nextGameNumber = room.gameState.currentGame + 1;
    const shouldStartWithOriginal = nextGameNumber % 2 === 1;
    const nextStartingPlayer = shouldStartWithOriginal
      ? room.startingPlayer
      : room.startingPlayer === 'X' ? 'O' : 'X';

    room.gameState = {
      squares: Array(9).fill(null),
      xIsNext: nextStartingPlayer === 'X',
      winner: null,
      gameOver: false,
      tokenToMoveIndex: null,
      currentGame: nextGameNumber,
      xWins: room.gameState.xWins,
      oWins: room.gameState.oWins,
      seriesWinner: null,
    };

    io.to(room.id).emit('new-game-started', {
      gameState: room.gameState,
    });
  });

  // Reset current game
  socket.on('reset-game', () => {
    const playerInfo = players.get(socket.id);
    if (!playerInfo) return;

    const room = rooms.get(playerInfo.roomId);
    if (!room) return;

    const currentPlayer = room.gameState.xIsNext ? 'X' : 'O';
    room.gameState = {
      ...room.gameState,
      squares: Array(9).fill(null),
      xIsNext: currentPlayer === 'X',
      winner: null,
      gameOver: false,
      tokenToMoveIndex: null,
    };

    io.to(room.id).emit('game-reset', {
      gameState: room.gameState,
    });
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    const playerInfo = players.get(socket.id);
    if (playerInfo) {
      const room = rooms.get(playerInfo.roomId);
      if (room) {
        room.players = room.players.filter((p) => p.id !== socket.id);
        io.to(room.id).emit('player-left', {
          playerId: socket.id,
          remainingPlayers: room.players.length,
        });
        cleanupRoom(playerInfo.roomId);
      }
      players.delete(socket.id);
    }
    console.log(`Player disconnected: ${socket.id}`);
  });
});

// Game logic functions (simplified versions - should match frontend logic)
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

function checkDraw(squares) {
  return squares.every((square) => square !== null) && !calculateWinner(squares);
}

const PORT = process.env.PORT || 3001;

httpServer.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Server accessible at: http://localhost:${PORT}`);
  console.log(`CORS enabled for: ${process.env.CLIENT_URL || 'all origins (*)'}`);
  console.log(`\nTo allow remote connections:`);
  console.log(`1. Find your local IP: ifconfig (Mac/Linux) or ipconfig (Windows)`);
  console.log(`2. Other players should use: http://YOUR_IP:${PORT}`);
});