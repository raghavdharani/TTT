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

## Play Without Sharing Your IP Address

There are two ways to play remotely without sharing your IP address:

### Option 1: Use ngrok (Quick & Easy) ⚡

**ngrok** creates a secure tunnel to your local server, giving you a public URL that anyone can use.

#### Setup:

1. **Install ngrok:**
   - **Mac**: `brew install ngrok/ngrok/ngrok`
   - **Windows/Linux**: Download from [ngrok.com/download](https://ngrok.com/download)
   - **Sign up** for a free account at [ngrok.com](https://ngrok.com) to get your auth token

2. **Configure ngrok:**
   ```bash
   ngrok config add-authtoken YOUR_AUTH_TOKEN
   ```
   (Get your token from: https://dashboard.ngrok.com/get-started/your-authtoken)

3. **Start the server with tunnel:**
   ```bash
   cd server
   ./start-with-tunnel.sh
   ```
   
   Or manually:
   ```bash
   # Terminal 1: Start server
   cd server
   npm start
   
   # Terminal 2: Start ngrok
   ngrok http 3001
   ```

4. **Share the ngrok URL:**
   - The script will display a URL like: `https://abc123.ngrok.io`
   - Share this URL with your friend (not your IP address!)

5. **Your friend connects:**
   - They click "Configure Server URL" in the game
   - Enter the ngrok URL (e.g., `https://abc123.ngrok.io`)
   - Press Enter

**Note**: Free ngrok URLs change each time you restart. For a permanent URL, upgrade to ngrok Pro or use Option 2 below.

### Option 2: Deploy to Cloud (Permanent Solution) ☁️

Deploy your server to a free hosting service for a permanent, always-on solution:

#### Deploy to Railway (Recommended - Free Tier Available)

1. **Sign up** at [railway.app](https://railway.app)
2. **Create a new project** → "Deploy from GitHub repo"
3. **Select your repository**
4. **Configure:**
   - **Root Directory**: `server`
   - **Start Command**: `npm start`
   - **Port**: Railway auto-detects, but set `PORT` env var to `3001`
5. **Get your URL**: Railway provides a URL like `your-app.railway.app`
6. **Set environment variable** (if needed):
   - `PORT=3001`
   - `CLIENT_URL=*` (or your frontend URL)

#### Deploy to Render (Alternative - Free Tier Available)

1. **Sign up** at [render.com](https://render.com)
2. **Create a new Web Service**
3. **Connect your GitHub repository**
4. **Configure:**
   - **Root Directory**: `server`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Environment**: Node
5. **Set environment variables:**
   - `PORT=3001`
   - `CLIENT_URL=*`
6. **Deploy** and get your URL (e.g., `your-app.onrender.com`)

#### Deploy to Fly.io (Alternative)

1. **Install Fly CLI**: `curl -L https://fly.io/install.sh | sh`
2. **Login**: `fly auth login`
3. **In the `server` directory**, run: `fly launch`
4. Follow prompts to deploy
5. Get your URL: `your-app.fly.dev`

**After deployment**, share your cloud URL with friends - it's permanent and doesn't require your IP!

## Remote Multiplayer Setup (Using IP Address)

To play with someone on a different computer using your local IP:

### On the Host Computer (Server):

1. **Find your local IP address:**
   - **Mac/Linux**: Run `ifconfig` and look for your IP (usually starts with `192.168.x.x` or `10.x.x.x`)
   - **Windows**: Run `ipconfig` and look for IPv4 Address
   - Example: `192.168.1.100`

2. **Start the server:**
   ```bash
   cd server
   npm start
   ```
   The server will listen on `0.0.0.0:3001`, making it accessible from other devices on your network.

3. **Configure firewall** (if needed):
   - Allow incoming connections on port 3001
   - On Mac: System Preferences → Security & Privacy → Firewall → Firewall Options
   - On Windows: Windows Defender Firewall → Allow an app

### On Both Computers (Host and Remote Player):

1. **Host player**: Use `http://localhost:3001` (or keep default)
2. **Remote player**: 
   - Click "Configure Server URL" in the Online Multiplayer screen
   - Enter: `http://HOST_IP:3001` (replace HOST_IP with the actual IP from step 1)
   - Example: `http://192.168.1.100:3001`
   - Press Enter or click outside the input field

3. **Verify connection**: Both players should see "✓ Connected to server" in green

4. **Create/Join Room**: One player creates a room and shares the Room ID, the other joins using that ID

## Configuration

### Environment Variables

**Frontend** (optional - defaults provided):
- `VITE_SOCKET_URL`: Socket.io server URL (default: `http://localhost:3001`)
- You can also configure this in the UI using "Configure Server URL"

**Backend** (optional - defaults provided):
- `PORT`: Server port (default: `3001`)
- `CLIENT_URL`: CORS allowed origin (default: allows all origins for development)

Create a `.env` file in the `server` directory if you need custom configuration:
```
PORT=3001
CLIENT_URL=http://localhost:5173,http://192.168.1.100:5173
```

**Note**: The server now allows CORS from all origins by default for easier remote play. Restrict this in production.

For detailed deployment instructions to avoid sharing your IP, see [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)

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
