import { useState, useEffect, useRef } from 'react';
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
  const [connectionStatus, setConnectionStatus] = useState(false);
  // Hide server config in production (when VITE_SOCKET_URL is set)
  const isProduction = !!import.meta.env.VITE_SOCKET_URL;
  const [showServerConfig, setShowServerConfig] = useState(false);
  const [serverUrl, setServerUrl] = useState(() => {
    // Prioritize env var over localStorage
    return import.meta.env.VITE_SOCKET_URL || localStorage.getItem('socket_server_url') || 'http://localhost:3001';
  });
  // #region agent log
  useEffect(() => {
    fetch('http://127.0.0.1:7242/ingest/013e71cf-e84f-4094-bd24-302b5aea0ae3',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'OnlineGameSetup.jsx:20',message:'Server URL state initialized',data:{serverUrl,fromLocalStorage:localStorage.getItem('socket_server_url'),fromEnv:import.meta.env.VITE_SOCKET_URL,hasProtocol:serverUrl.startsWith('http://')||serverUrl.startsWith('https://')},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
  }, []);
  // #endregion
  
  // Use refs to access latest state values in event handlers
  const roomIdRef = useRef('');
  const playerSymbolRef = useRef(null);
  const roomCreatedRef = useRef(false);
  const waitingForPlayerRef = useRef(false);
  
  // Keep refs in sync with state
  useEffect(() => {
    roomIdRef.current = roomId;
  }, [roomId]);
  
  useEffect(() => {
    playerSymbolRef.current = playerSymbol;
  }, [playerSymbol]);
  
  useEffect(() => {
    roomCreatedRef.current = roomCreated;
  }, [roomCreated]);
  
  useEffect(() => {
    waitingForPlayerRef.current = waitingForPlayer;
  }, [waitingForPlayer]);

  useEffect(() => {
    const sock = getSocket();
    setSocket(sock);
    
    // Log connection details for debugging
    const socketUrl = sock.io?.uri || 'unknown';
    console.log('[OnlineGameSetup] Initializing socket:', {
      url: socketUrl,
      connected: sock.connected,
      envVar: import.meta.env.VITE_SOCKET_URL,
      localStorage: localStorage.getItem('socket_server_url'),
      isProduction: isProduction
    });

    // Check connection status and connect if not connected
    if (!sock.connected) {
      console.log('[OnlineGameSetup] Socket not connected, attempting to connect...');
      sock.connect();
    }

    // Update connection status immediately
    const updateConnectionStatus = () => {
      // Force a re-render by updating state
      setError((prev) => prev === 'Failed to connect to server. Make sure the server is running on port 3001.' && sock.connected ? null : prev);
    };

    const handleConnect = () => {
      const socketUrl = sock.io?.uri || 'unknown';
      console.log('[Socket] Connected to:', socketUrl);
      setError(null);
      updateConnectionStatus();
    };

    const handleDisconnect = () => {
      console.log('[Socket] Disconnected');
      setError('Connection lost. Please check if the server is running.');
      setIsConnecting(false);
      setWaitingForPlayer(false);
    };

    const handleConnectError = (err) => {
      const socketUrl = sock.io?.uri || 'unknown';
      console.error('[Socket] Connection error:', {
        message: err.message,
        type: err.type,
        description: err.description,
        url: socketUrl,
        envVar: import.meta.env.VITE_SOCKET_URL,
        localStorage: localStorage.getItem('socket_server_url')
      });
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/013e71cf-e84f-4094-bd24-302b5aea0ae3',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'OnlineGameSetup.jsx:80',message:'handleConnectError',data:{errorMessage:err.message,errorType:err.type,errorDescription:err.description,errorData:err.data,socketId:sock.id,connected:sock.connected,url:socketUrl,envVar:import.meta.env.VITE_SOCKET_URL},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
      // #endregion
      
      // More specific error message based on URL
      let errorMsg = 'Failed to connect to server.';
      if (socketUrl.includes('localhost')) {
        errorMsg += ' Make sure the server is running on port 3001.';
      } else if (socketUrl.includes('railway') || socketUrl.includes('up.railway.app')) {
        errorMsg += ' Check Railway server status and CORS settings.';
      } else {
        errorMsg += ` Server URL: ${socketUrl}`;
      }
      
      setError(errorMsg);
      setIsConnecting(false);
      // Retry connection after a delay
      setTimeout(() => {
        if (!sock.connected) {
          sock.connect();
        }
      }, 2000);
    };

    sock.on('connect', handleConnect);
    sock.on('disconnect', handleDisconnect);
    sock.on('connect_error', handleConnectError);

    const handleRoomCreated = ({ roomId: createdRoomId, playerSymbol: symbol }) => {
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/013e71cf-e84f-4094-bd24-302b5aea0ae3',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'OnlineGameSetup.jsx:86',message:'Room created event received',data:{roomId:createdRoomId,playerSymbol:symbol},timestamp:Date.now(),sessionId:'debug-session',runId:'post-fix',hypothesisId:'F'})}).catch(()=>{});
      // #endregion
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
      // Auto-ready both players to start the game
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
        // Game is starting - use room settings
        const finalGameMode = roomGameMode || gameMode || 1;
        const finalStartingPlayer = roomStartingPlayer || startingPlayer || 'X';
        
        // Get player symbol from event data or ref
        const myPlayer = roomPlayers?.find((p) => p.id === sock.id);
        const finalPlayerSymbol = myPlayer?.symbol || playerSymbolRef.current;
        
        // Get roomId from event data (most reliable) or ref as fallback
        const finalRoomId = eventRoomId || roomIdRef.current;
        
        console.log('[OnlineGameSetup] Game starting:', { finalRoomId, finalPlayerSymbol, finalGameMode, finalStartingPlayer, socketConnected: sock.connected });
        
        if (!finalRoomId) {
          console.error('[OnlineGameSetup] Room ID is missing when starting game');
          setError('Room ID is missing. Please try creating a new room.');
          return;
        }
        
        if (!finalPlayerSymbol) {
          console.error('[OnlineGameSetup] Player symbol is missing when starting game');
          setError('Player symbol is missing. Please try creating a new room.');
          return;
        }
        
        if (!sock || !sock.connected) {
          console.error('[OnlineGameSetup] Socket not connected when starting game');
          setError('Socket connection lost. Please reconnect and try again.');
          return;
        }
        
        onStart('online', finalGameMode, finalStartingPlayer, null, finalRoomId, sock, finalPlayerSymbol);
      } catch (error) {
        console.error('[OnlineGameSetup] Error in handleGameStart:', error);
        setError(`Error starting game: ${error.message}`);
      }
    };

    sock.on('game-start', handleGameStart);

    return () => {
      // Cleanup event listeners with named handlers
      sock.off('connect', handleConnect);
      sock.off('disconnect', handleDisconnect);
      sock.off('connect_error', handleConnectError);
      sock.off('room-created', handleRoomCreated);
      sock.off('player-joined', handlePlayerJoined);
      sock.off('error', handleError);
      sock.off('game-start', handleGameStart);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on mount

  const handleCreateRoom = () => {
    try {
      if (!gameMode || !startingPlayer) {
        setError('Please select game mode and starting player');
        return;
      }

      const currentSocket = socket || getSocket();
      
      if (!currentSocket) {
        setError('Socket not initialized. Please refresh the page.');
        return;
      }

      if (!currentSocket.connected) {
        console.log('[OnlineGameSetup] Socket not connected, attempting to connect...');
        currentSocket.connect();
        setError('Connecting to server... Please wait and try again.');
        return;
      }

      setIsConnecting(true);
      setError(null);
      setWaitingForPlayer(false);
      setRoomCreated(false);
      
      console.log('[OnlineGameSetup] Creating room:', { gameMode, startingPlayer, socketConnected: currentSocket.connected, socketId: currentSocket.id });
      
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/013e71cf-e84f-4094-bd24-302b5aea0ae3',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'OnlineGameSetup.jsx:209',message:'Creating room',data:{gameMode,startingPlayer,socketConnected:currentSocket.connected,socketId:currentSocket.id},timestamp:Date.now(),sessionId:'debug-session',runId:'post-fix',hypothesisId:'F'})}).catch(()=>{});
      // #endregion
      
      currentSocket.emit('create-room', { gameMode, startingPlayer });
      
      // Set a timeout to show error if room creation doesn't respond
      setTimeout(() => {
        if (!roomCreatedRef.current && !waitingForPlayerRef.current) {
          console.error('[OnlineGameSetup] Room creation timeout');
          setError('Failed to create room. Please check your connection and try again.');
          setIsConnecting(false);
        }
      }, 5000);
    } catch (error) {
      console.error('[OnlineGameSetup] Error in handleCreateRoom:', error);
      setError(`Error creating room: ${error.message}`);
      setIsConnecting(false);
    }
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

  const currentSocket = socket || getSocket();
  
  // Update connection status when socket state changes
  // CRITICAL: This hook MUST be called before any conditional returns
  useEffect(() => {
    if (!currentSocket) {
      setConnectionStatus(false);
      return;
    }
    
    const updateStatus = () => {
      setConnectionStatus(currentSocket.connected);
    };
    
    const handleConnectError = () => {
      setConnectionStatus(false);
    };
    
    // Initial check
    updateStatus();
    
    currentSocket.on('connect', updateStatus);
    currentSocket.on('disconnect', updateStatus);
    currentSocket.on('connect_error', handleConnectError);
    
    return () => {
      currentSocket.off('connect', updateStatus);
      currentSocket.off('disconnect', updateStatus);
      currentSocket.off('connect_error', handleConnectError);
    };
  }, [currentSocket]);
  
  const isConnected = connectionStatus;

  // Conditional return AFTER all hooks have been called
  if (waitingForPlayer && roomCreated) {
    return (
      <div className="w-full max-w-2xl card-glass p-6 sm:p-8">
        <h2 className="text-2xl font-bold text-white mb-4 text-center text-shadow-glow">
          Waiting for Player...
        </h2>
        <div className="text-center mb-6">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-mystical-blue mb-4 glow-mystical"></div>
          <p className="text-lg font-semibold text-white/90 mb-2">Room ID:</p>
          <div className="glass-strong rounded-lg p-4 mb-4 glow-mystical">
            <p className="text-4xl font-bold text-mystical-blue font-mono tracking-wider">{roomId}</p>
          </div>
          <p className="text-sm text-white/80 mb-2">
            Share this room ID with your friend to play together!
          </p>
          <p className="text-xs text-white/70">
            Your symbol: <span className="font-bold text-lg text-white">{playerSymbol}</span>
          </p>
        </div>
        <button
          onClick={onCancel}
          className="w-full btn-mystical min-h-[44px]"
        >
          Cancel
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl card-glass p-6 sm:p-8">
      <h2 className="text-2xl font-bold text-white mb-6 text-center text-shadow-glow">
        Online Multiplayer
      </h2>

      {/* Server Configuration - Only show in development */}
      {!isProduction && (
        <div className="mb-4">
          <button
            onClick={() => setShowServerConfig(!showServerConfig)}
            className="text-sm text-mystical-blue hover:text-mystical-purple underline"
          >
            {showServerConfig ? 'Hide' : 'Configure'} Server URL
          </button>
        {showServerConfig && (
          <div className="mt-2 p-3 glass rounded-lg">
            <label className="block text-sm font-medium text-white/90 mb-2">
              Server URL:
            </label>
            <input
              type="text"
              value={serverUrl}
              onChange={(e) => {
                const newUrl = e.target.value.trim();
                setServerUrl(newUrl);
                // Store the raw URL (user might be typing)
                localStorage.setItem('socket_server_url', newUrl);
              }}
              onBlur={() => {
                // Normalize URL when user finishes editing (ensure protocol is present)
                const normalizeUrl = (url) => {
                  if (!url || typeof url !== 'string') return url;
                  url = url.trim();
                  if (url.startsWith('http://') || url.startsWith('https://')) return url;
                  if (url.includes('localhost') || url.match(/^\d+\.\d+\.\d+\.\d+/)) {
                    return `http://${url}`;
                  } else {
                    return `https://${url}`;
                  }
                };
                const normalizedUrl = normalizeUrl(serverUrl);
                if (normalizedUrl !== serverUrl) {
                  setServerUrl(normalizedUrl);
                  localStorage.setItem('socket_server_url', normalizedUrl);
                }
                // #region agent log
                fetch('http://127.0.0.1:7242/ingest/013e71cf-e84f-4094-bd24-302b5aea0ae3',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'OnlineGameSetup.jsx:277',message:'Server URL changed onBlur',data:{originalUrl:serverUrl,normalizedUrl,hasProtocol:normalizedUrl.startsWith('http://')||normalizedUrl.startsWith('https://')},timestamp:Date.now(),sessionId:'debug-session',runId:'post-fix',hypothesisId:'A'})}).catch(()=>{});
                // #endregion
                // Disconnect and reconnect with new URL when user finishes editing
                disconnectSocket();
                // Clear the window variable to force fresh lookup
                delete window.__SOCKET_URL__;
                // Force a new socket connection with the updated URL
                setTimeout(() => {
                  const sock = getSocket();
                  setSocket(sock);
                  if (!sock.connected) {
                    sock.connect();
                  }
                }, 100);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.target.blur();
                }
              }}
              placeholder="http://localhost:3001"
              className="input-glass w-full text-sm"
            />
            <p className="text-xs text-white/70 mt-2">
              For remote play, use the host's IP address (e.g., http://192.168.1.100:3001)
            </p>
          </div>
        )}
        </div>
      )}

      {/* Connection Status */}
      <div className={`mb-4 p-3 rounded-lg text-sm text-center glass ${
        isConnected 
          ? 'glow-mystical text-white' 
          : 'text-white/80'
      }`}>
        {isConnected ? (
          <span>✓ Connected to server</span>
        ) : (
          <div>
            <p className="mb-2">✗ Not connected to server</p>
            <p className="text-xs mb-2">Start the server: <code className="bg-red-100 px-2 py-1 rounded text-xs">cd server && npm start</code></p>
            <p className="text-xs mb-3">Server should run on: <code className="bg-red-100 px-2 py-1 rounded text-xs">http://localhost:3001</code></p>
            <button
              onClick={() => {
                if (currentSocket) {
                  currentSocket.connect();
                  setError(null);
                }
              }}
              className="mt-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-medium rounded transition-colors"
            >
              Retry Connection
            </button>
          </div>
        )}
      </div>

      {/* Mode Selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-white/90 mb-3">
          Create or Join Room:
        </label>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => {
              setMode('create');
              setRoomId('');
              setError(null);
            }}
            className={`px-4 py-3 rounded-lg glass transition-all duration-200 min-h-[44px] ${
              mode === 'create'
                ? 'glass-strong glow-mystical scale-105 text-white'
                : 'text-white/80 hover:glass-strong hover:scale-[1.02]'
            }`}
          >
            Create Room
          </button>
          <button
            onClick={() => {
              setMode('join');
              setError(null);
            }}
            className={`px-4 py-3 rounded-lg glass transition-all duration-200 min-h-[44px] ${
              mode === 'join'
                ? 'glass-strong glow-mystical scale-105 text-white'
                : 'text-white/80 hover:glass-strong hover:scale-[1.02]'
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
            <label className="block text-sm font-medium text-white/90 mb-3">
              Select Game Mode:
            </label>
            <div className="space-y-2">
              <button
                onClick={() => setGameMode(1)}
                className={`w-full px-4 py-3 rounded-lg glass transition-all duration-200 min-h-[44px] ${
                  gameMode === 1
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                }`}
              >
                1 Game
              </button>
              <button
                onClick={() => setGameMode(3)}
                className={`w-full px-4 py-3 rounded-lg glass transition-all duration-200 min-h-[44px] ${
                  gameMode === 3
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                }`}
              >
                Best of 3
              </button>
              <button
                onClick={() => setGameMode(5)}
                className={`w-full px-4 py-3 rounded-lg glass transition-all duration-200 min-h-[44px] ${
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
            <label className="block text-sm font-medium text-white/90 mb-3">
              Who goes first?
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setStartingPlayer('X')}
                className={`px-4 py-4 rounded-lg glass transition-all duration-200 flex items-center justify-center min-h-[44px] ${
                  startingPlayer === 'X'
                ? 'glass-strong glow-blue scale-105'
                : 'hover:glass-strong hover:scale-[1.02]'
                }`}
              >
                <span className="text-2xl font-bold text-blue-600">X</span>
              </button>
              <button
                onClick={() => setStartingPlayer('O')}
                className={`px-4 py-4 rounded-lg glass transition-all duration-200 flex items-center justify-center min-h-[44px] ${
                  startingPlayer === 'O'
                ? 'glass-strong glow-red scale-105'
                : 'hover:glass-strong hover:scale-[1.02]'
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
          <label className="block text-sm font-medium text-white/90 mb-3">
            Enter Room ID:
          </label>
          <input
            type="text"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value.toUpperCase())}
            placeholder="ABC123"
            className="input-glass w-full text-center text-2xl font-mono uppercase"
            maxLength={6}
          />
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-3 glass rounded-lg text-white/90 text-sm">
          {error}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3">
        <button
          onClick={onCancel}
          className="flex-1 btn-mystical min-h-[44px]"
        >
          Cancel
        </button>
        {mode === 'create' && (
          <button
            onClick={handleCreateRoom}
            disabled={!gameMode || !startingPlayer || isConnecting}
            className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:glow-mystical min-h-[44px]"
          >
            {isConnecting ? 'Creating...' : 'Create Room'}
          </button>
        )}
        {mode === 'join' && (
          <button
            onClick={handleJoinRoom}
            disabled={!roomId.trim() || isConnecting}
            className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:glow-mystical min-h-[44px]"
          >
            {isConnecting ? 'Joining...' : 'Join Room'}
          </button>
        )}
      </div>
    </div>
  );
}

export default OnlineGameSetup;

