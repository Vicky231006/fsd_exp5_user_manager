# Hosting Guide - User Manager Full Stack Application

This guide helps you deploy your User Manager application to Render.com for both frontend and backend.

---

## 📋 Prerequisites

- Render.com account (free tier available)
- MongoDB Atlas account (free cloud database)
- GitHub account (to connect repositories)
- Git installed locally

---

## 🗄️ Step 1: Set Up MongoDB Atlas Database

### Create MongoDB Database:
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up or log in
3. Create a new project
4. Click "Create a Deployment" → Select **Free Tier** (M0)
5. Choose region closest to you
6. Create a database user:
   - Click "Database Access"
   - Click "Add New Database User"
   - Set username (e.g., `admin`)
   - Set password and save it
7. Whitelist IP address:
   - Click "Network Access"
   - Click "Add IP Address"
   - Select "Allow Access from Anywhere" (0.0.0.0/0) for testing
8. Get connection string:
   - Click "Databases" → "Connect"
   - Select "Connect your application"
   - Copy the connection string (looks like: `mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority`)

---

## 📁 Step 2: Configure Backend Server

### Create `.env` file in `/server`:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/user_manager?retryWrites=true&w=majority
PORT=5000
NODE_ENV=production
```

**Replace:**
- `username` with your MongoDB user
- `password` with your MongoDB password
- `cluster` with your Atlas cluster name

### Update `server.js` to use environment variables:

```javascript
require('dotenv').config();
const MONGODB_URI = process.env.MONGODB_URI;
const PORT = process.env.PORT || 5000;

mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log('MongoDB connection error:', err));
```

### Push to GitHub:

```bash
cd /server
git init
git add .
git commit -m "Initial server setup"
git branch -M main
git remote add origin https://github.com/yourusername/user-manager-server.git
git push -u origin main
```

---

## 🚀 Step 3: Deploy Backend on Render

1. Go to [Render.com](https://render.com)
2. Sign up with GitHub
3. Click "New +" → "Web Service"
4. Connect your server repository
5. Fill in deployment settings:
   - **Name**: `user-manager-server`
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
   - **Branch**: main
6. Add Environment Variables:
   - Click "Environment"
   - Add variables from your `.env` file
7. Click "Deploy Web Service"
8. Wait for deployment to complete
9. Copy your backend URL (e.g., `https://user-manager-server.onrender.com`)

---

## 🎨 Step 4: Configure Frontend React App

### Create `.env` file in `/client`:

```env
REACT_APP_API_URL=https://user-manager-server.onrender.com/api/users
```

**For local development:**
```env
REACT_APP_API_URL=http://localhost:5000/api/users
```

### Update `client/vite.config.js`:

Ensure your Vite config is correctly set up for production builds:

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '/api')
      }
    }
  }
})
```

### Push to GitHub:

```bash
cd /client
git init
git add .
git commit -m "Initial client setup"
git branch -M main
git remote add origin https://github.com/yourusername/user-manager-client.git
git push -u origin main
```

---

## 🎯 Step 5: Deploy Frontend on Render

1. Go to Render dashboard
2. Click "New +" → "Static Site"
3. Connect your client repository
4. Fill in deployment settings:
   - **Name**: `user-manager-client`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`
   - **Branch**: main
5. Add Environment Variables:
   - `REACT_APP_API_URL=https://user-manager-server.onrender.com/api/users`
6. Click "Create Static Site"
7. Wait for deployment to complete
8. Your site URL will be displayed (e.g., `https://user-manager-client.onrender.com`)

---

## ⚙️ Step 6: Configure CORS on Backend

Update your `server.js` to allow requests from your frontend:

```javascript
const cors = require('cors');

const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  'https://user-manager-client.onrender.com'
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));
```

---

## 🧪 Step 7: Testing

### Local Testing:
```bash
# Terminal 1: Start backend
cd server
npm install
npm start

# Terminal 2: Start frontend
cd client
npm install
npm run dev
```

Navigate to `http://localhost:5173` and test:
- Add a user
- Click on a card to view details
- Edit user
- Delete user

### Production Testing:
1. Visit your frontend URL: `https://user-manager-client.onrender.com`
2. Test all CRUD operations
3. Check browser console for errors

---

## 🔧 Troubleshooting

### Frontend Can't Connect to Backend:
- Check `REACT_APP_API_URL` in `.env`
- Ensure backend is deployed and running
- Check CORS settings in backend
- Open DevTools → Network tab → check API calls

### Database Connection Error:
- Verify MongoDB URI in backend `.env`
- Check IP whitelist in MongoDB Atlas (should be 0.0.0.0/0)
- Verify username/password are correct
- Check database name in URI

### Build Failing on Render:
- Check build logs in Render dashboard
- Ensure `npm install` has no errors locally
- Check `package.json` has all dependencies
- Verify Node version compatibility

---

## 📊 Environment Variables Summary

### Backend (Server):
```
MONGODB_URI=mongodb+srv://[user]:[password]@[cluster].mongodb.net/[db]
PORT=5000
NODE_ENV=production
```

### Frontend (Client):
```
REACT_APP_API_URL=https://user-manager-server.onrender.com/api/users
```

---

## 🌐 Accessing Your Application

- **Frontend**: `https://user-manager-client.onrender.com`
- **Backend API**: `https://user-manager-server.onrender.com/api/users`

---

## ⭐ Tips for Success

1. **Always test locally first** before deploying
2. **Keep `.env` files in `.gitignore`** (never commit secrets!)
3. **Monitor Render logs** for errors during deployment
4. **Use free tier cautiously** - Render spins down idle services after 15 min
5. **Check MongoDB Atlas quotas** - free tier has 512MB storage limit
6. **Add error handling** in your app for network failures

---

## 🆘 Need Help?

- Render Docs: https://render.com/docs
- MongoDB Atlas: https://docs.atlas.mongodb.com
- React Vite: https://vitejs.dev
- MongoDB Node Driver: https://www.mongodb.com/docs/drivers/node/