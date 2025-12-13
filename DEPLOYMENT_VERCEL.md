# Deploying ShiftTacToe to Vercel

This guide explains how to deploy ShiftTacToe with the frontend on Vercel and the Socket.IO server on a service that supports persistent WebSocket connections.

## Why Two Services?

Vercel uses serverless functions which don't support persistent WebSocket connections required by Socket.IO. Therefore:
- **Frontend**: Deployed on Vercel (free, fast, easy)
- **Socket.IO Server**: Deployed on Railway or Render (free tier available, supports WebSockets)

## Step 1: Deploy Frontend to Vercel

### Option A: Using Vercel CLI

1. Install Vercel CLI (if not already installed):
   ```bash
   npm i -g vercel
   ```

2. Login to Vercel:
   ```bash
   vercel login
   ```

3. Deploy:
   ```bash
   vercel --prod
   ```

### Option B: Using GitHub Integration

1. Push your code to GitHub (if not already):
   ```bash
   git add .
   git commit -m "Prepare for Vercel deployment"
   git push origin main
   ```

2. Go to [vercel.com](https://vercel.com) and sign in with GitHub

3. Click "Add New Project"

4. Import your repository

5. Vercel will auto-detect Vite. Click "Deploy"

6. After deployment, note your Vercel URL (e.g., `https://shift-tac-toe.vercel.app`)

## Step 2: Deploy Socket.IO Server

Choose one of the following options:

### Option A: Railway (Recommended - Easiest)

1. Go to [railway.app](https://railway.app) and sign in with GitHub

2. Click "New Project" → "Deploy from GitHub repo"

3. Select your repository

4. **IMPORTANT**: Railway may auto-detect the root as a Vite project. You need to configure it to use the `server/` directory:
   - Click on the service that was created
   - Go to **Settings** tab
   - Scroll down to **Source** section
   - Set **Root Directory** to: `server`
   - Click **Save**

5. Add environment variables (in the **Variables** tab):
   - `CLIENT_URL`: Your Vercel URL (e.g., `https://ttt-41zqyqg7g-raghav-dharanis-projects.vercel.app`)
   - `PORT`: Railway will set this automatically (usually `$PORT`)

6. Railway will automatically redeploy after you change the root directory. Note the generated URL (e.g., `https://shifttactoe-server.up.railway.app`)

**Note**: If you see build errors about missing packages, make sure the Root Directory is set to `server` and not the root of the repository.

### Option B: Render

1. Go to [render.com](https://render.com) and sign in with GitHub

2. Click "New" → "Web Service"

3. Connect your repository

4. Configure:
   - **Name**: `shifttactoe-server`
   - **Root Directory**: `server`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`

5. Add environment variables:
   - `CLIENT_URL`: Your Vercel URL
   - `PORT`: `10000` (Render's default)

6. Click "Create Web Service"

7. Note the generated URL (e.g., `https://shifttactoe-server.onrender.com`)

## Step 3: Configure Frontend to Use Server URL

### Using Vercel Environment Variables

1. Go to your Vercel project dashboard

2. Navigate to Settings → Environment Variables

3. Add a new variable:
   - **Name**: `VITE_SOCKET_URL`
   - **Value**: Your server URL (from Railway or Render)
   - **Environment**: Production, Preview, Development (select all)

4. Redeploy your Vercel project:
   ```bash
   vercel --prod
   ```
   Or trigger a redeploy from the Vercel dashboard

### Alternative: Update vercel.json

You can also set the environment variable in `vercel.json` (already configured), but you'll need to use Vercel's secret management:

```bash
vercel env add VITE_SOCKET_URL production
# Enter your server URL when prompted
```

## Step 4: Test the Deployment

1. Visit your Vercel URL

2. Try creating an online game room

3. Open the game in two different browsers/incognito windows

4. One player creates a room, the other joins with the room ID

5. Verify that both players can see moves in real-time

## Troubleshooting

### CORS Errors

If you see CORS errors, make sure:
- The `CLIENT_URL` environment variable on your server includes your Vercel URL
- The server allows your Vercel domain in CORS settings

### Connection Issues

1. Check that the server is running (visit the server URL in a browser - you should see a connection or error message)

2. Verify the `VITE_SOCKET_URL` environment variable is set correctly in Vercel

3. Check browser console for connection errors

4. Ensure WebSocket connections are not blocked by firewall/proxy

### Server Not Starting

- Check server logs on Railway/Render dashboard
- Verify `server/package.json` has all dependencies
- Ensure `server/server.js` is the entry point

## Environment Variables Summary

### Frontend (Vercel)
- `VITE_SOCKET_URL`: URL of your Socket.IO server (e.g., `https://shifttactoe-server.up.railway.app`)

### Backend (Railway/Render)
- `CLIENT_URL`: URL of your Vercel frontend (e.g., `https://shift-tac-toe.vercel.app`)
- `PORT`: Port number (usually auto-set by hosting service)

## Cost

- **Vercel**: Free tier includes generous limits
- **Railway**: Free tier with $5 credit/month
- **Render**: Free tier available (may spin down after inactivity)

## Next Steps

- Set up a custom domain (optional)
- Configure monitoring/analytics
- Set up CI/CD for automatic deployments

