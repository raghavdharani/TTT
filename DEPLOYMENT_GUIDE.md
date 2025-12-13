# Deployment Guide for ShiftTacToe Multiplayer

This guide covers deploying the multiplayer server to various cloud platforms so you can play without sharing your IP address.

## Quick Comparison

| Platform | Free Tier | Setup Time | Permanent URL | Best For |
|----------|-----------|------------|---------------|----------|
| **ngrok** | ✅ Yes | 2 min | ❌ No (changes each restart) | Quick testing |
| **Railway** | ✅ Yes ($5 credit/month) | 5 min | ✅ Yes | Production-ready |
| **Render** | ✅ Yes | 5 min | ✅ Yes | Simple deployment |
| **Fly.io** | ✅ Yes | 10 min | ✅ Yes | Global distribution |

---

## Option 1: ngrok (Quick Testing)

Perfect for quick games with friends. URL changes each time you restart.

### Setup:

1. **Install ngrok:**
   ```bash
   # Mac
   brew install ngrok/ngrok/ngrok
   
   # Or download from https://ngrok.com/download
   ```

2. **Sign up** at [ngrok.com](https://ngrok.com) (free account)

3. **Get your auth token** from: https://dashboard.ngrok.com/get-started/your-authtoken

4. **Configure:**
   ```bash
   ngrok config add-authtoken YOUR_TOKEN
   ```

5. **Start server with tunnel:**
   ```bash
   cd server
   ./start-with-tunnel.sh
   ```

6. **Share the URL** shown in the terminal (e.g., `https://abc123.ngrok.io`)

**Limitations:**
- Free tier: URL changes on each restart
- Free tier: Limited connections per minute
- Requires ngrok to be running

---

## Option 2: Railway (Recommended)

Railway offers a generous free tier and is very easy to use.

### Setup:

1. **Sign up** at [railway.app](https://railway.app) (GitHub login)

2. **Create New Project** → "Deploy from GitHub repo"

3. **Select your repository**

4. **Configure the service:**
   - **Root Directory**: `server`
   - **Start Command**: `npm start`
   - **Environment Variables**:
     ```
     PORT=3001
     CLIENT_URL=*
     ```

5. **Deploy** - Railway will automatically:
   - Install dependencies (`npm install`)
   - Start your server
   - Provide a public URL

6. **Get your URL:**
   - Railway provides: `your-app.railway.app`
   - Or set a custom domain in settings

7. **Share the URL** with friends!

**Cost:** Free tier includes $5 credit/month (enough for small apps)

**Permanent URL:** ✅ Yes (unless you delete the service)

---

## Option 3: Render

Simple deployment with a free tier.

### Setup:

1. **Sign up** at [render.com](https://render.com)

2. **Create New Web Service**

3. **Connect GitHub** and select your repository

4. **Configure:**
   - **Name**: `shifttactoe-server` (or any name)
   - **Root Directory**: `server`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free

5. **Environment Variables:**
   ```
   PORT=3001
   CLIENT_URL=*
   ```

6. **Deploy** and wait for "Live" status

7. **Get your URL:** `your-app.onrender.com`

**Cost:** Free tier available (spins down after 15 min inactivity, but wakes up on request)

**Permanent URL:** ✅ Yes

---

## Option 4: Fly.io

Global edge deployment with free tier.

### Setup:

1. **Install Fly CLI:**
   ```bash
   curl -L https://fly.io/install.sh | sh
   ```

2. **Login:**
   ```bash
   fly auth login
   ```

3. **Navigate to server directory:**
   ```bash
   cd server
   ```

4. **Launch:**
   ```bash
   fly launch
   ```
   
   Follow prompts:
   - App name: `shifttactoe-server` (or auto-generated)
   - Region: Choose closest to you
   - PostgreSQL: No
   - Redis: No
   - Deploy now: Yes

5. **Set environment variables:**
   ```bash
   fly secrets set PORT=3001 CLIENT_URL=*
   ```

6. **Get your URL:** `your-app.fly.dev`

**Cost:** Free tier includes 3 shared VMs

**Permanent URL:** ✅ Yes

---

## After Deployment

### Update Frontend Configuration

Once your server is deployed, update your frontend to use the cloud URL:

**Option A: Environment Variable (Recommended)**
```bash
# Create .env file in project root
VITE_SOCKET_URL=https://your-app.railway.app
```

**Option B: UI Configuration**
- Players can manually enter the URL in the "Configure Server URL" field
- The URL is saved in localStorage

### Test Connection

1. Open your game
2. Click "Online Multiplayer"
3. Click "Configure Server URL"
4. Enter your deployed URL
5. Should see "✓ Connected to server" in green

---

## Troubleshooting

### Server won't start on cloud platform

- **Check logs** in the platform's dashboard
- **Verify PORT** environment variable is set
- **Check** that `package.json` has correct start script
- **Ensure** all dependencies are in `package.json` (not just devDependencies)

### CORS errors

- Set `CLIENT_URL=*` for development
- For production, set `CLIENT_URL=https://your-frontend-domain.com`

### Connection timeout

- Check that the platform allows WebSocket connections
- Verify firewall/security settings
- Some platforms require specific configuration for Socket.io

### Free tier limitations

- **Render**: Spins down after 15 min inactivity (takes ~30s to wake up)
- **Railway**: $5 credit/month (check usage dashboard)
- **Fly.io**: 3 shared VMs limit
- **ngrok**: URL changes on restart, connection limits

---

## Production Recommendations

For a production deployment:

1. **Use a custom domain** (e.g., `game.yourdomain.com`)
2. **Set up SSL/HTTPS** (most platforms do this automatically)
3. **Restrict CORS** to your frontend domain only
4. **Monitor usage** and upgrade plan if needed
5. **Set up logging** for debugging
6. **Configure auto-scaling** if expecting many concurrent games

---

## Quick Reference

### Environment Variables

```bash
PORT=3001                    # Server port
CLIENT_URL=*                 # CORS origins (* = all, or comma-separated list)
```

### Server Start Command

```bash
npm start                    # Uses: node server.js
```

### Required Files

- `server/package.json` - Dependencies and scripts
- `server/server.js` - Main server file
- `.gitignore` - Should include `node_modules/`

---

## Need Help?

- Check platform-specific documentation
- Review server logs in platform dashboard
- Test locally first: `cd server && npm start`
- Verify Socket.io version compatibility





