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

// CORS handler function
const corsHandler = (origin, callback) => {
  // Allow requests with no origin (like mobile apps, curl, or same-origin requests)
  if (!origin) {
    callback(null, true);
    return;
  }
  
  // If '*' is in allowedOrigins, allow all
  if (allowedOrigins.includes('*')) {
    callback(null, true);
    return;
  }
  
  // Check if origin matches any allowed origin (exact match or subdomain)
  const isAllowed = allowedOrigins.some(allowed => {
    if (allowed === origin) return true;
    // Allow subdomains (e.g., *.vercel.app matches ttt-seven-taupe.vercel.app)
    if (allowed.startsWith('*.')) {
      const domain = allowed.substring(2);
      return origin.endsWith('.' + domain) || origin === domain;
    }
    return false;
  });
  
  if (isAllowed) {
    callback(null, true);
  } else {
    console.warn(`CORS blocked origin: ${origin}. Allowed: ${allowedOrigins.join(', ')}`);
    callback(new Error('Not allowed by CORS'));
  }
};

const io = new Server(httpServer, {
  cors: {
    origin: corsHandler,
    methods: ['GET', 'POST', 'OPTIONS'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
  },
  transports: ['websocket', 'polling'], // Explicitly allow both transports
  allowEIO3: true, // Allow Engine.IO v3 clients
});

app.use(cors({
  origin: corsHandler,
  credentials: true,
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());

// Health check endpoint for Railway
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: 'ShiftTacToe Server', 
    status: 'running',
    socketIo: true 
  });
});

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
  console.log(`Connection from origin: ${socket.handshake.headers.origin || 'no origin'}`);
  
  socket.on('disconnect', (reason) => {
    console.log(`Player disconnected: ${socket.id}, reason: ${reason}`);
  });
  
  socket.on('error', (error) => {
    console.error(`Socket error for ${socket.id}:`, error);
  });

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

  // Helper function to count tokens
  const countTokens = (squares, player) => {
    return squares.reduce((count, square) => (square === player ? count + 1 : count), 0);
  };

  // Helper function to get adjacent indices
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

  // Helper function to check if token can move
  const canTokenMove = (squares, index) => {
    const adjacentIndices = getAdjacentIndices(index);
    return adjacentIndices.some((adjIndex) => squares[adjIndex] === null);
  };

  // Helper function to check if indices are adjacent
  const isAdjacent = (sourceIndex, targetIndex) => {
    return getAdjacentIndices(sourceIndex).includes(targetIndex);
  };

  // Make a move
  socket.on('make-move', ({ moveType, fromIndex, toIndex }) => {
    const playerInfo = players.get(socket.id);
    if (!playerInfo) {
      console.error(`[make-move] Player ${socket.id} not found in players map. Current players:`, Array.from(players.keys()));
      socket.emit('error', { message: 'Not in a room' });
      return;
    }

    const room = rooms.get(playerInfo.roomId);
    if (!room) {
      console.error(`[make-move] Room ${playerInfo.roomId} not found for player ${socket.id}. Available rooms:`, Array.from(rooms.keys()));
      socket.emit('error', { message: 'Room not found' });
      return;
    }

    let player = room.players.find((p) => p.id === socket.id);
    if (!player) {
      console.error(`[make-move] Player ${socket.id} not found in room ${playerInfo.roomId}. Room players:`, room.players.map(p => p.id));
      // Don't try to auto-rejoin - this indicates a serious state issue
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

    const TOKEN_LIMIT = 3;
    const squares = room.gameState.squares;
    const currentPlayerTokenCount = countTokens(squares, currentPlayer);

    // Apply move to game state
    const newSquares = [...squares];

    if (moveType === 'place') {
      // Validate: Can only place if under token limit
      if (currentPlayerTokenCount >= TOKEN_LIMIT) {
        socket.emit('error', { message: 'Cannot place more tokens. You have reached the limit of 3 tokens. Move an existing token instead.' });
        return;
      }
      // Validate: Target must be empty
      if (newSquares[toIndex] !== null) {
        socket.emit('error', { message: 'Cannot place token on occupied square' });
        return;
      }
      // Validate: Must not be relocating (tokenToMoveIndex should be null)
      if (room.gameState.tokenToMoveIndex !== null) {
        socket.emit('error', { message: 'Cannot place new token while relocating. Complete or cancel the relocation first.' });
        return;
      }
      newSquares[toIndex] = currentPlayer;
      room.gameState.tokenToMoveIndex = null;
    } else if (moveType === 'pickup') {
      // Validate: Must be picking up own token
      if (squares[fromIndex] !== currentPlayer) {
        socket.emit('error', { message: 'Can only pick up your own tokens' });
        return;
      }
      // Validate: Token must be able to move
      if (!canTokenMove(squares, fromIndex)) {
        socket.emit('error', { message: 'This token cannot move (no adjacent empty squares)' });
        return;
      }
      // Note: Players can move tokens at any time, not just when at token limit
      // The restriction is only on placing new tokens when at limit
      room.gameState.tokenToMoveIndex = fromIndex;
      newSquares[fromIndex] = null;
    } else if (moveType === 'relocate') {
      // Validate: Must be relocating (tokenToMoveIndex must be set)
      if (room.gameState.tokenToMoveIndex === null || room.gameState.tokenToMoveIndex !== fromIndex) {
        socket.emit('error', { message: 'Invalid relocation. Pick up a token first.' });
        return;
      }
      // Validate: Target must be empty
      if (newSquares[toIndex] !== null) {
        socket.emit('error', { message: 'Cannot relocate to occupied square' });
        return;
      }
      // Validate: Target must be adjacent to source
      if (!isAdjacent(fromIndex, toIndex)) {
        socket.emit('error', { message: 'Can only move tokens to adjacent squares' });
        return;
      }
      newSquares[toIndex] = currentPlayer;
      room.gameState.tokenToMoveIndex = null;
    } else if (moveType === 'cancel-relocate') {
      // Validate: Must be relocating
      if (room.gameState.tokenToMoveIndex === null || room.gameState.tokenToMoveIndex !== fromIndex) {
        socket.emit('error', { message: 'Invalid cancel. No token being relocated.' });
        return;
      }
      newSquares[fromIndex] = currentPlayer;
      room.gameState.tokenToMoveIndex = null;
    } else {
      socket.emit('error', { message: 'Invalid move type' });
      return;
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
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`✅ Server accessible at: http://localhost:${PORT}`);
  console.log(`✅ CORS enabled for: ${process.env.CLIENT_URL || 'all origins (*)'}`);
  console.log(`✅ Socket.IO server ready for connections`);
  console.log(`✅ Environment: ${process.env.NODE_ENV || 'development'}`);
  if (process.env.RAILWAY_PUBLIC_DOMAIN) {
    console.log(`✅ Railway domain: ${process.env.RAILWAY_PUBLIC_DOMAIN}`);
  }
});