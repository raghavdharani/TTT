# Troubleshooting Online Multiplayer

## Issue: Can't see room ID or play online

### Step 1: Check if Server is Running

The online multiplayer feature requires a backend server. Make sure it's running:

```bash
# In a terminal, navigate to the server directory
cd server

# Install dependencies (if not done already)
npm install

# Start the server
npm start
```

You should see:
```
Server running on port 3001
CORS enabled for: http://localhost:5173
```

### Step 2: Check Frontend Connection

1. Open your browser's Developer Console (F12 or Right-click → Inspect)
2. Look for connection errors in the console
3. The online setup screen should show "✓ Connected to server" in green

### Step 3: Verify Ports

- **Backend Server**: Should run on `http://localhost:3001`
- **Frontend**: Should run on `http://localhost:5173` (or whatever port Vite uses)

### Step 4: Common Issues

#### "Not connected to server" message
- **Solution**: Start the server (see Step 1)
- Check that port 3001 is not already in use
- Verify firewall isn't blocking the connection

#### Room ID not showing after creating room
- Check browser console for errors
- Verify server is running and connected
- Try refreshing the page

#### Can't join a room
- Make sure you're using the exact Room ID (case-sensitive)
- Verify the room creator is still connected
- Check that the server is running

#### Moves not syncing
- Check browser console for errors
- Verify both players are connected
- Make sure both are in the same room

### Step 5: Test Connection

Open browser console and type:
```javascript
// Check if socket is connected
// This should show connection status
```

### Still Having Issues?

1. Check server logs for errors
2. Check browser console for JavaScript errors
3. Verify all dependencies are installed:
   ```bash
   # Frontend
   npm install
   
   # Backend
   cd server
   npm install
   ```

4. Try restarting both server and frontend






