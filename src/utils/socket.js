import { io } from 'socket.io-client';

// Normalize URL to ensure it has a protocol
const normalizeUrl = (url) => {
  if (!url || typeof url !== 'string') return url;
  url = url.trim();
  // If URL already has protocol, return as-is
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('ws://') || url.startsWith('wss://')) {
    return url;
  }
  // Determine protocol based on domain
  // Use https for production domains (railway.app, render.com, etc.) or if it looks like a domain
  // Use http for localhost or IP addresses
  if (url.includes('localhost') || url.match(/^\d+\.\d+\.\d+\.\d+/)) {
    return `http://${url}`;
  } else {
    // Default to https for production domains
    return `https://${url}`;
  }
};

// Allow runtime configuration via window or localStorage
const getSocketUrl = () => {
  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/013e71cf-e84f-4094-bd24-302b5aea0ae3',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'socket.js:23',message:'getSocketUrl entry',data:{hasWindow:typeof window!=='undefined',hasWindowVar:typeof window!=='undefined'&&!!window.__SOCKET_URL__,windowVar:typeof window!=='undefined'?window.__SOCKET_URL__:null,envVar:import.meta.env.VITE_SOCKET_URL},timestamp:Date.now(),sessionId:'debug-session',runId:'post-fix',hypothesisId:'A'})}).catch(()=>{});
  // #endregion
  let url = null;
  
  // Priority order (STRICT - no fallbacks that could cause regressions):
  // 1. Runtime override (window.__SOCKET_URL__) - highest priority
  // 2. Environment variable (VITE_SOCKET_URL) - for production, MUST be set
  // 3. LocalStorage (ONLY if env var not set - for development)
  // 4. Default localhost (ONLY if env var not set - for local development)
  
  if (typeof window !== 'undefined' && window.__SOCKET_URL__) {
    url = window.__SOCKET_URL__;
  } else if (import.meta.env.VITE_SOCKET_URL) {
    // CRITICAL: In production, env var MUST be used - never fall back to localStorage
    url = import.meta.env.VITE_SOCKET_URL;
    // Clear any localhost value from localStorage to prevent confusion
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('socket_server_url');
      if (stored && stored.includes('localhost')) {
        console.warn('[Socket] Clearing localhost from localStorage - using env var instead');
        localStorage.removeItem('socket_server_url');
      }
    }
  } else if (typeof window !== 'undefined') {
    // Only use localStorage if env var is NOT set (development mode)
    const stored = localStorage.getItem('socket_server_url');
    if (stored && !stored.includes('localhost')) {
      // Only use non-localhost values from localStorage
      url = stored;
    } else if (stored && stored.includes('localhost')) {
      // If localStorage has localhost, use it (for local dev)
      url = stored;
    }
  }
  
  // Only fall back to localhost if nothing else is set (local development)
  if (!url) {
    url = 'http://localhost:3001';
  }
  
  // Always normalize - ensure protocol is present
  // This handles cases where VITE_SOCKET_URL is set without https://
  url = normalizeUrl(url);
  
  // Debug logging (always log in browser for debugging)
  if (typeof window !== 'undefined') {
    const source = window.__SOCKET_URL__ ? 'window' : import.meta.env.VITE_SOCKET_URL ? 'env' : localStorage.getItem('socket_server_url') ? 'localStorage' : 'default';
    const envVar = import.meta.env.VITE_SOCKET_URL;
    const localStorageVal = localStorage.getItem('socket_server_url');
    console.log('[Socket] URL resolution:', {
      source,
      envVar: envVar || '(not set)',
      localStorage: localStorageVal || '(not set)',
      finalUrl: url,
      warning: envVar ? null : 'VITE_SOCKET_URL not set - using fallback'
    });
  }
  
  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/013e71cf-e84f-4094-bd24-302b5aea0ae3',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'socket.js:63',message:'getSocketUrl result',data:{originalUrl:import.meta.env.VITE_SOCKET_URL||localStorage.getItem('socket_server_url')||'default',normalizedUrl:url,hasProtocol:url.startsWith('http://')||url.startsWith('https://'),envVar:import.meta.env.VITE_SOCKET_URL,source:window.__SOCKET_URL__?'window':import.meta.env.VITE_SOCKET_URL?'env':localStorage.getItem('socket_server_url')?'localStorage':'default'},timestamp:Date.now(),sessionId:'debug-session',runId:'post-fix',hypothesisId:'A'})}).catch(()=>{});
  // #endregion
  return url;
};

let socket = null;

export const connectSocket = () => {
  const currentUrl = getSocketUrl();
  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/013e71cf-e84f-4094-bd24-302b5aea0ae3',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'socket.js:20',message:'connectSocket entry',data:{currentUrl,hasSocket:!!socket,socketConnected:socket?.connected},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
  // #endregion
  
  // If socket exists, check if URL changed
  if (socket) {
    const socketUrl = socket.io ? socket.io.uri : null;
    // Normalize URLs for comparison (remove protocol, trailing slashes)
    const normalizeUrl = (url) => {
      if (!url) return null;
      return url.replace(/^https?:\/\//, '').replace(/^wss?:\/\//, '').replace(/\/$/, '');
    };
    
    const currentNormalized = normalizeUrl(currentUrl);
    const socketNormalized = normalizeUrl(socketUrl);
    
    // If URL changed, disconnect and recreate
    if (socketNormalized && currentNormalized && socketNormalized !== currentNormalized) {
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/013e71cf-e84f-4094-bd24-302b5aea0ae3',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'socket.js:33',message:'URL changed, disconnecting',data:{currentNormalized,socketNormalized},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
      // #endregion
      socket.disconnect();
      socket = null;
    }
  }
  
  if (!socket) {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/013e71cf-e84f-4094-bd24-302b5aea0ae3',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'socket.js:40',message:'Creating new socket',data:{url:currentUrl,hasProtocol:currentUrl.startsWith('http://')||currentUrl.startsWith('https://')},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
    // #endregion
    socket = io(currentUrl, {
      transports: ['polling', 'websocket'], // Try polling first, then upgrade to websocket
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: Infinity, // Keep trying to reconnect
      timeout: 20000, // Increase timeout for Railway
      forceNew: true, // Force new connection when creating
      upgrade: true, // Allow upgrade from polling to websocket
      rememberUpgrade: false, // Don't remember failed upgrades
    });
    // #region agent log
    socket.on('connect', () => {
      fetch('http://127.0.0.1:7242/ingest/013e71cf-e84f-4094-bd24-302b5aea0ae3',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'socket.js:49',message:'Socket connected',data:{socketId:socket.id,transport:socket.io.engine.transport.name},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'E'})}).catch(()=>{});
    });
    socket.on('connect_error', (err) => {
      fetch('http://127.0.0.1:7242/ingest/013e71cf-e84f-4094-bd24-302b5aea0ae3',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'socket.js:52',message:'Socket connect_error',data:{error:err.message,type:err.type,description:err.description,url:currentUrl},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
    });
    socket.on('disconnect', (reason) => {
      fetch('http://127.0.0.1:7242/ingest/013e71cf-e84f-4094-bd24-302b5aea0ae3',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'socket.js:55',message:'Socket disconnected',data:{reason},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{});
    });
    // #endregion
  } else if (!socket.connected) {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/013e71cf-e84f-4094-bd24-302b5aea0ae3',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'socket.js:60',message:'Reconnecting existing socket',data:{url:currentUrl},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
    // #endregion
    socket.connect();
  }
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export const getSocket = () => {
  if (!socket) {
    return connectSocket();
  }
  return socket;
};


