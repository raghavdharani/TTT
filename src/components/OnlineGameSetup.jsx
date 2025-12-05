import { useState, useEffect } from 'react';
import { getSocket, disconnectSocket } from '../utils/socket';

function OnlineGameSetup({ onStart, onCancel }) {
  const [mode, setMode] = useState(null); // 'create' or 'join'
  const [roomId, setRoomId] = useState('');
  const [gameMode, setGameMode] = useState(null); // 1, 3, or 5
  const [startingPlayer, setStartingPlayer] = useState(null); // 'X' or 'O' (only for create)
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState(null);
  const [socket, setSocket] = useState(null);
  const [playerSymbol, setPlayerSymbol] = useState(null);
  const [waitingForPlayer, setWaitingForPlayer] = useState(false);
  const [roomCreated, setRoomCreated] = useState(false);

  useEffect(() => {
    const sock = getSocket();
    setSocket(sock);

    sock.on('room-created', ({ roomId: createdRoomId, playerSymbol: symbol }) => {
      setRoomId(createdRoomId);
      setPlayerSymbol(symbol);
      setRoomCreated(true);
      setWaitingForPlayer(true);
      setIsConnecting(false);
      setError(null);
    });

    sock.on('player-joined', ({ players: roomPlayers, gameState }) => {
      const myPlayer = roomPlayers.find((p) => p.id === sock.id);
      if (myPlayer) {
        setPlayerSymbol(myPlayer.symbol);
      }
      setWaitingForPlayer(false);
      setIsConnecting(false);
      // Game will start when both players are ready
    });

    sock.on('error', ({ message }) => {
      setError(message);
      setIsConnecting(false);
      setWaitingForPlayer(false);
    });

    sock.on('game-start', ({ gameState, players: roomPlayers, gameMode: roomGameMode, startingPlayer: roomStartingPlayer }) => {
      // Game is starting - use room settings
      const finalGameMode = roomGameMode || gameMode || 1;
      const finalStartingPlayer = roomStartingPlayer || startingPlayer || 'X';
      onStart('online', finalGameMode, finalStartingPlayer, null, roomId, sock, playerSymbol);
    });

    return () => {
      // Cleanup on unmount
      if (socket && !waitingForPlayer && !roomCreated) {
        disconnectSocket();
      }
    };
  }, []);

  const handleCreateRoom = () => {
    if (!gameMode || !startingPlayer) {
      setError('Please select game mode and starting player');
      return;
    }

    setIsConnecting(true);
    setError(null);
    socket.emit('create-room', { gameMode, startingPlayer });
  };

  const handleJoinRoom = () => {
    if (!roomId.trim()) {
      setError('Please enter a room ID');
      return;
    }

    setIsConnecting(true);
    setError(null);
    socket.emit('join-room', { roomId: roomId.trim().toUpperCase() });
  };

  const handleReady = () => {
    socket.emit('player-ready');
  };

  if (waitingForPlayer && roomCreated) {
    return (
      <div className="w-full max-w-2xl bg-white rounded-lg shadow-lg p-6 sm:p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">
          Waiting for Player...
        </h2>
        <div className="text-center mb-6">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
          <p className="text-lg font-semibold text-gray-700 mb-2">Room ID:</p>
          <p className="text-3xl font-bold text-blue-600 mb-4 font-mono">{roomId}</p>
          <p className="text-sm text-gray-600">
            Share this room ID with your friend to play together!
          </p>
        </div>
        <button
          onClick={onCancel}
          className="w-full px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white font-medium rounded-lg transition-colors"
        >
          Cancel
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl bg-white rounded-lg shadow-lg p-6 sm:p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
        Online Multiplayer
      </h2>

      {/* Mode Selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Create or Join Room:
        </label>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => {
              setMode('create');
              setRoomId('');
              setError(null);
            }}
            className={`px-4 py-3 rounded-lg border-2 transition-colors ${
              mode === 'create'
                ? 'border-blue-500 bg-blue-50 text-blue-700'
                : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
            }`}
          >
            Create Room
          </button>
          <button
            onClick={() => {
              setMode('join');
              setError(null);
            }}
            className={`px-4 py-3 rounded-lg border-2 transition-colors ${
              mode === 'join'
                ? 'border-blue-500 bg-blue-50 text-blue-700'
                : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
            }`}
          >
            Join Room
          </button>
        </div>
      </div>

      {/* Game Mode Selection (for create) */}
      {mode === 'create' && (
        <>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Select Game Mode:
            </label>
            <div className="space-y-2">
              <button
                onClick={() => setGameMode(1)}
                className={`w-full px-4 py-3 rounded-lg border-2 transition-colors ${
                  gameMode === 1
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                }`}
              >
                1 Game
              </button>
              <button
                onClick={() => setGameMode(3)}
                className={`w-full px-4 py-3 rounded-lg border-2 transition-colors ${
                  gameMode === 3
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                }`}
              >
                Best of 3
              </button>
              <button
                onClick={() => setGameMode(5)}
                className={`w-full px-4 py-3 rounded-lg border-2 transition-colors ${
                  gameMode === 5
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                }`}
              >
                Best of 5
              </button>
            </div>
          </div>

          {/* Starting Player Selection (for create) */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Who goes first?
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setStartingPlayer('X')}
                className={`px-4 py-4 rounded-lg border-2 transition-all flex items-center justify-center ${
                  startingPlayer === 'X'
                    ? 'border-blue-500 bg-blue-50 shadow-md scale-105'
                    : 'border-gray-300 bg-white hover:border-blue-300 hover:bg-blue-50'
                }`}
              >
                <span className="text-2xl font-bold text-blue-600">X</span>
              </button>
              <button
                onClick={() => setStartingPlayer('O')}
                className={`px-4 py-4 rounded-lg border-2 transition-all flex items-center justify-center ${
                  startingPlayer === 'O'
                    ? 'border-red-500 bg-red-50 shadow-md scale-105'
                    : 'border-gray-300 bg-white hover:border-red-300 hover:bg-red-50'
                }`}
              >
                <span className="text-2xl font-bold text-red-600">O</span>
              </button>
            </div>
          </div>
        </>
      )}

      {/* Room ID Input (for join) */}
      {mode === 'join' && (
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Enter Room ID:
          </label>
          <input
            type="text"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value.toUpperCase())}
            placeholder="ABC123"
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-center text-2xl font-mono uppercase focus:border-blue-500 focus:outline-none"
            maxLength={6}
          />
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3">
        <button
          onClick={onCancel}
          className="flex-1 px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white font-medium rounded-lg transition-colors"
        >
          Cancel
        </button>
        {mode === 'create' && (
          <button
            onClick={handleCreateRoom}
            disabled={!gameMode || !startingPlayer || isConnecting}
            className="flex-1 px-6 py-3 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
          >
            {isConnecting ? 'Creating...' : 'Create Room'}
          </button>
        )}
        {mode === 'join' && (
          <button
            onClick={handleJoinRoom}
            disabled={!roomId.trim() || isConnecting}
            className="flex-1 px-6 py-3 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
          >
            {isConnecting ? 'Joining...' : 'Join Room'}
          </button>
        )}
      </div>
    </div>
  );
}

export default OnlineGameSetup;
