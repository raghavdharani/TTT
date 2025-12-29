import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Users, Share2, AlertCircle, RefreshCw } from 'lucide-react';
import { getSocket, disconnectSocket } from '../utils/socket';
import GlassCard from './ui/GlassCard';
import MysticalButton from './ui/MysticalButton';
import Token from './ui/Token';

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
  const [connectionStatus, setConnectionStatus] = useState(false);

  // Hide server config in production (when VITE_SOCKET_URL is set)
  const isProduction = !!import.meta.env.VITE_SOCKET_URL;
  const [showServerConfig, setShowServerConfig] = useState(false);
  const [serverUrl, setServerUrl] = useState(() => {
    return import.meta.env.VITE_SOCKET_URL || localStorage.getItem('socket_server_url') || 'http://localhost:3001';
  });

  // Use refs to access latest state values in event handlers
  const roomIdRef = useRef('');
  const playerSymbolRef = useRef(null);
  const roomCreatedRef = useRef(false);
  const waitingForPlayerRef = useRef(false);

  // Keep refs in sync with state
  useEffect(() => { roomIdRef.current = roomId; }, [roomId]);
  useEffect(() => { playerSymbolRef.current = playerSymbol; }, [playerSymbol]);
  useEffect(() => { roomCreatedRef.current = roomCreated; }, [roomCreated]);
  useEffect(() => { waitingForPlayerRef.current = waitingForPlayer; }, [waitingForPlayer]);

  useEffect(() => {
    const sock = getSocket();
    setSocket(sock);

    if (!sock.connected) {
      sock.connect();
    }

    const updateConnectionStatus = () => {
      setError((prev) => prev && prev.includes('Failed to connect') && sock.connected ? null : prev);
    };

    const handleConnect = () => {
      setError(null);
      updateConnectionStatus();
    };

    const handleDisconnect = () => {
      setError('Connection lost. Please check if the server is running.');
      setIsConnecting(false);
      setWaitingForPlayer(false);
    };

    const handleConnectError = (err) => {
      const socketUrl = sock.io?.uri || 'unknown';
      let errorMsg = 'Failed to connect to server.';
      if (socketUrl.includes('localhost')) {
        errorMsg += ' Check if server is running on port 3001.';
      } else {
        errorMsg += ' Check your internet connection.';
      }
      setError(errorMsg);
      setIsConnecting(false);
      setTimeout(() => {
        if (!sock.connected) sock.connect();
      }, 2000);
    };

    sock.on('connect', handleConnect);
    sock.on('disconnect', handleDisconnect);
    sock.on('connect_error', handleConnectError);

    const handleRoomCreated = ({ roomId: createdRoomId, playerSymbol: symbol }) => {
      setRoomId(createdRoomId);
      setPlayerSymbol(symbol);
      setRoomCreated(true);
      setWaitingForPlayer(true);
      setIsConnecting(false);
      setError(null);
    };

    const handlePlayerJoined = ({ players: roomPlayers, gameState }) => {
      const myPlayer = roomPlayers.find((p) => p.id === sock.id);
      if (myPlayer) {
        setPlayerSymbol(myPlayer.symbol);
      }
      setWaitingForPlayer(false);
      setIsConnecting(false);
      if (roomPlayers.length === 2) {
        sock.emit('player-ready');
      }
    };

    const handleError = ({ message }) => {
      setError(message);
      setIsConnecting(false);
      setWaitingForPlayer(false);
    };

    sock.on('room-created', handleRoomCreated);
    sock.on('player-joined', handlePlayerJoined);
    sock.on('error', handleError);

    const handleGameStart = ({ roomId: eventRoomId, gameState, players: roomPlayers, gameMode: roomGameMode, startingPlayer: roomStartingPlayer }) => {
      try {
        const finalGameMode = roomGameMode || gameMode || 1;
        const finalStartingPlayer = roomStartingPlayer || startingPlayer || 'X';
        const myPlayer = roomPlayers?.find((p) => p.id === sock.id);
        const finalPlayerSymbol = myPlayer?.symbol || playerSymbolRef.current;
        const finalRoomId = eventRoomId || roomIdRef.current;

        if (!finalRoomId || !finalPlayerSymbol || !sock || !sock.connected) {
          setError('Error starting game. Please try again.');
          return;
        }

        onStart('online', finalGameMode, finalStartingPlayer, null, finalRoomId, sock, finalPlayerSymbol);
      } catch (error) {
        setError(`Error starting game: ${error.message}`);
      }
    };

    sock.on('game-start', handleGameStart);

    return () => {
      sock.off('connect', handleConnect);
      sock.off('disconnect', handleDisconnect);
      sock.off('connect_error', handleConnectError);
      sock.off('room-created', handleRoomCreated);
      sock.off('player-joined', handlePlayerJoined);
      sock.off('error', handleError);
      sock.off('game-start', handleGameStart);
    };
  }, []);

  const handleCreateRoom = () => {
    if (!gameMode || !startingPlayer) {
      setError('Please select game mode and starting player');
      return;
    }

    const currentSocket = socket || getSocket();
    if (!currentSocket || !currentSocket.connected) {
      currentSocket?.connect();
      setError('Connecting to server...');
      return;
    }

    setIsConnecting(true);
    setError(null);
    setWaitingForPlayer(false);
    setRoomCreated(false);

    currentSocket.emit('create-room', { gameMode, startingPlayer });

    setTimeout(() => {
      if (!roomCreatedRef.current && !waitingForPlayerRef.current) {
        setError('Failed to create room. Timeout.');
        setIsConnecting(false);
      }
    }, 5000);
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

  const currentSocket = socket || getSocket();
  useEffect(() => {
    if (!currentSocket) {
      setConnectionStatus(false);
      return;
    }
    const updateStatus = () => setConnectionStatus(currentSocket.connected);
    updateStatus();
    currentSocket.on('connect', updateStatus);
    currentSocket.on('disconnect', updateStatus);
    return () => {
      currentSocket.off('connect', updateStatus);
      currentSocket.off('disconnect', updateStatus);
    };
  }, [currentSocket]);

  const isConnected = connectionStatus;

  // Waiting View
  if (waitingForPlayer && roomCreated) {
    return (
      <GlassCard className="w-full max-w-md p-8 flex flex-col items-center gap-6">
        <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-white drop-shadow-glow">
          Waiting for Player...
        </h2>

        <div className="relative">
          <div className="absolute inset-0 bg-blue-500/20 blur-xl animate-pulse rounded-full" />
          <div className="w-20 h-20 rounded-full border-2 border-blue-400/30 border-t-blue-400 animate-spin" />
        </div>

        <div className="text-center space-y-2">
          <p className="text-blue-200/60 uppercase text-xs tracking-widest">Room Code</p>
          <div className="text-5xl font-mono font-bold text-white tracking-widest drop-shadow-lg p-4 rounded-xl bg-navy-900/50 border border-white/10">
            {roomId}
          </div>
          <p className="text-sm text-blue-200/80 pt-2">
            Share this code with your opponent
          </p>
        </div>

        <div className="flex items-center gap-2 text-sm text-blue-200/60 bg-navy-900/30 px-3 py-1 rounded-full border border-white/5">
          <span>Your Token:</span>
          <Token type={playerSymbol} size="sm" />
        </div>

        <MysticalButton variant="secondary" onClick={onCancel} className="w-full mt-2">
          Cancel
        </MysticalButton>
      </GlassCard>
    );
  }

  // Setup View
  return (
    <GlassCard className="w-full max-w-md p-6 sm:p-8 flex flex-col gap-6">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-white drop-shadow-glow flex items-center justify-center gap-3">
          <Trophy className="text-yellow-400" size={28} />
          Online Play
        </h2>
      </div>

      {/* Server Config (Dev Only) */}
      {!isProduction && (
        <div className="flex justify-center">
          <button
            onClick={() => setShowServerConfig(!showServerConfig)}
            className="text-xs text-blue-400/50 hover:text-blue-300 flex items-center gap-1 transition-colors"
          >
            <RefreshCw size={10} /> {showServerConfig ? 'Hide' : 'Configure'} Server
          </button>
        </div>
      )}

      {showServerConfig && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="bg-navy-900/50 p-3 rounded-lg border border-white/5 text-xs">
          <input
            type="text"
            value={serverUrl}
            onChange={(e) => {
              const newUrl = e.target.value;
              setServerUrl(newUrl);
              localStorage.setItem('socket_server_url', newUrl);
              disconnectSocket();
            }}
            className="w-full bg-transparent border-b border-white/10 focus:border-blue-400 outline-none p-1 text-white"
            placeholder="Server URL"
          />
        </motion.div>
      )}

      {/* Connection Status */}
      <div className={`p-3 rounded-lg text-xs text-center border transition-colors ${isConnected
          ? 'bg-green-500/10 border-green-500/30 text-green-300'
          : 'bg-red-500/10 border-red-500/30 text-red-300'
        }`}>
        {isConnected ? '● Connected to Server' : '○ Disconnected (Check Server)'}
      </div>

      {/* Main Options */}
      {!mode && (
        <div className="grid grid-cols-2 gap-4">
          <MysticalButton
            variant="primary"
            onClick={() => setMode('create')}
            className="flex-col py-8 gap-2"
          >
            <Users size={24} />
            <span>Create Room</span>
          </MysticalButton>
          <MysticalButton
            variant="secondary"
            onClick={() => setMode('join')}
            className="flex-col py-8 gap-2"
          >
            <Share2 size={24} />
            <span>Join Room</span>
          </MysticalButton>
        </div>
      )}

      {/* Create Room Flow */}
      {mode === 'create' && (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
          <div className="space-y-3">
            <label className="text-sm font-medium text-blue-200 uppercase tracking-widest opacity-80 pl-1">Length</label>
            <div className="grid grid-cols-3 gap-2">
              {[1, 3, 5].map(m => (
                <MysticalButton
                  key={m}
                  variant={gameMode === m ? 'primary' : 'secondary'}
                  onClick={() => setGameMode(m)}
                  className="py-2 text-sm"
                >
                  {m === 1 ? '1 Game' : `Best of ${m}`}
                </MysticalButton>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-medium text-blue-200 uppercase tracking-widest opacity-80 pl-1">First Move</label>
            <div className="grid grid-cols-2 gap-4">
              <button onClick={() => setStartingPlayer('X')} className={`p-4 rounded-xl border transition-all ${startingPlayer === 'X' ? 'bg-navy-700/80 border-blue-400/50 shadow-glow-sm' : 'bg-navy-800/40 border-white/5'}`}>
                <div className="flex justify-center"><Token type="X" size="sm" /></div>
              </button>
              <button onClick={() => setStartingPlayer('O')} className={`p-4 rounded-xl border transition-all ${startingPlayer === 'O' ? 'bg-navy-700/80 border-blue-400/50 shadow-glow-sm' : 'bg-navy-800/40 border-white/5'}`}>
                <div className="flex justify-center"><Token type="O" size="sm" /></div>
              </button>
            </div>
          </div>

          <MysticalButton
            variant="primary"
            onClick={handleCreateRoom}
            disabled={!gameMode || !startingPlayer || isConnecting}
            className="w-full py-4"
          >
            {isConnecting ? 'Creating...' : 'Generate Room Code'}
          </MysticalButton>
        </motion.div>
      )}

      {/* Join Room Flow */}
      {mode === 'join' && (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
          <div className="space-y-3">
            <label className="text-sm font-medium text-blue-200 uppercase tracking-widest opacity-80 pl-1">Room Code</label>
            <input
              type="text"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value.toUpperCase())}
              placeholder="ABC123"
              maxLength={6}
              className="w-full bg-navy-900/50 border-2 border-white/10 rounded-xl p-4 text-center text-3xl font-mono tracking-widest text-white focus:border-blue-400/50 focus:shadow-glow-sm outline-none transition-all"
            />
          </div>
          <MysticalButton
            variant="primary"
            onClick={handleJoinRoom}
            disabled={!roomId.trim() || isConnecting}
            className="w-full py-4"
          >
            {isConnecting ? 'Joining...' : 'Join Game'}
          </MysticalButton>
        </motion.div>
      )}

      {error && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-2 text-red-200 text-sm">
          <AlertCircle size={16} />
          {error}
        </motion.div>
      )}

      {(mode || error) && (
        <button onClick={() => { setMode(null); setError(null); if (mode === null) onCancel(); }} className="text-blue-300/50 hover:text-white text-sm transition-colors w-full text-center">
          Back
        </button>
      )}
      {!mode && (
        <button onClick={onCancel} className="text-blue-300/50 hover:text-white text-sm transition-colors w-full text-center">
          Cancel
        </button>
      )}

    </GlassCard>
  );
}

export default OnlineGameSetup;
