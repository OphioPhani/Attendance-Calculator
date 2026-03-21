# Deployment Guide: Vercel + Render

Complete step-by-step guide to deploy Attendance Calculator with Vercel (frontend) and Render (backend).

---

## **STEP 1: Setup MongoDB Atlas (Database)**

### Create MongoDB Account
1. Go to https://cloud.mongodb.com
2. Click "Sign up" and create account
3. Verify email

### Create a Database Cluster
1. Click "Create Deployment"
2. Select **M0 (Free tier)** - includes 512MB storage
3. Choose **AWS** region closest to you
4. Click "Create Deployment"
5. Wait 2-3 minutes for cluster to initialize

### Create Database User
1. In MongoDB Atlas, go to "Security" → "Database Access"
2. Click "Add New Database User"
3. Set:
   - **Username**: `attendance_user` (or any name)
   - **Password**: Generate strong password (or create your own)
   - **Role**: `readWriteAnyDatabase`
4. Click "Create User"
5. **SAVE this username and password** - you'll need it

### Get Connection String
1. Go to "Databases" → Click your cluster
2. Click "Connect"
3. Select "Drivers"
4. Copy connection string (looks like):
   ```
   mongodb+srv://attendance_user:PASSWORD@cluster.mongodb.net/?appName=Cluster0
   ```
5. Replace `PASSWORD` with your actual password
6. **Save this for Render setup**

---

## **STEP 2: Prepare Your GitHub Repository**

### Initialize Git & Push to GitHub
```bash
cd /home/phani-chandra/Desktop/Projects/Attendance\ Calculator

# Initialize git if not already done
git init

# Create .gitignore
cat > .gitignore << EOF
node_modules/
.env
.env.local
dist/
build/
.DS_Store
*.log
.vercel
.env*.local
EOF

# Add all files
git add .

# Commit
git commit -m "Initial commit: Attendance Calculator app ready for deployment"

# Add GitHub remote (replace YOUR_USERNAME and REPO_NAME)
git remote add origin https://github.com/YOUR_USERNAME/attendance-calculator.git

# Push to GitHub
git branch -M main
git push -u origin main
```

---

## **STEP 3: Deploy Backend on Render**

### Create Render Account
1. Go to https://render.com
2. Click "Sign up"
3. Use GitHub to sign up (easier)
4. Authorize Render to access your GitHub

### Deploy Backend Service
1. In Render dashboard, click **"New +"**
2. Select **"Web Service"**
3. Choose your `attendance-calculator` repository
4. Configure settings:
   - **Name**: `attendance-calculator-api` (or your choice)
   - **Environment**: Node
   - **Region**: Choose closest to you
   - **Branch**: `main`
   - **Build Command**: `npm --prefix server install`
   - **Start Command**: `node server/server.js`
5. Click "Create Web Service"
6. Wait for initial deployment (1-2 minutes)

### Add Environment Variables
1. In Render dashboard, click your service
2. Go to "Environment"
3. Click "Add Environment Variable" and add:

   ```
   MONGODB_URI = mongodb+srv://attendance_user:YOUR_PASSWORD@cluster.mongodb.net/?appName=Cluster0
   JWT_SECRET = generate-a-strong-random-key-here
   NODE_ENV = production
   CORS_ORIGIN = https://your-vercel-frontend.vercel.app
   ```

   For JWT_SECRET, generate a random string using:
   ```bash
   # Run this locally to generate a strong secret
   openssl rand -base64 32
   ```
   Or use an online tool: https://randomkeygen.com

4. After adding each variable, click outside to save

### Copy Your Backend URL
1. At top of Render service page, copy URL (e.g., `https://attendance-calculator-api.onrender.com`)
2. Save it - you'll need it for Vercel setup
3. **Note**: First deployment may take a few minutes. Wait until you see a green "Live" status

---

## **STEP 4: Deploy Frontend on Vercel**

### Create Vercel Account
1. Go to https://vercel.com
2. Click "Sign up"
3. Use GitHub to sign up (select your repo when asked)

### Import Project
1. In Vercel dashboard, click **"Add New..."**
2. Select **"Project"**
3. **Import Git Repository**
4. Search for and select `attendance-calculator`
5. Click "Import"

### Configure Project
1. **Project Name**: `attendance-calculator` (or your choice)
2. **Framework Preset**: Select `Vite` (if not auto-detected)
3. **Root Directory**: Select `client` using the dropdown
4. **Build Command**: `npm run build` (should be auto-filled)
5. **Output Directory**: `dist` (should be auto-filled)
6. **Install Command**: `npm install` (should be auto-filled)

### Add Environment Variables
1. Scroll down to "Environment Variables"
2. Add one variable:
   - **Name**: `VITE_API_URL`
   - **Value**: `https://attendance-calculator-api.onrender.com` (replace with your actual Render URL)
3. Click "Save"

### Deploy
1. Click the **"Deploy"** button
2. Wait for deployment to complete (3-5 minutes)
3. You'll see a success message with your live URL
4. **Your frontend is now live!** 🎉

---

## **STEP 5: Update CORS Settings**

Your backend needs to allow requests from your Vercel frontend:

### Update CORS on Render
1. Go back to Render dashboard
2. Click on `attendance-calculator-api` service
3. Go to "Environment"
4. Update `CORS_ORIGIN`:
   - Change from: `https://your-vercel-frontend.vercel.app`
   - To: Your actual Vercel URL (e.g., `https://attendance-calculator-five.vercel.app`)
5. Save by clicking outside

---

## **STEP 6: Verify Deployment**

### Check Backend Health
1. Visit: `https://your-render-url.onrender.com/api/health`
2. Should see:
   ```json
   {
     "success": true,
     "message": "Server is running",
     "timestamp": "2024-03-22T...",
     "environment": "production"
   }
   ```

### Check Frontend
1. Visit your Vercel URL (shown in Vercel dashboard)
2. Should see login page load successfully
3. Try signing up/logging in
4. Should be able to access dashboard

---

## **Troubleshooting**

### Backend Deployment Issues

**Error: "Build failed"**
- Check Render logs: Click "Logs" tab
- Common causes: Node version mismatch, missing dependencies
- Solution: Ensure `server/package.json` has all dependencies

**Error: "Service failed to start"**
- Check environment variables are set correctly
- Ensure `MONGODB_URI` is valid and reachable
- Try restarting: Dashboard → "Manual Deploy" → "Latest"

**Database Connection Timeout**
- Your IP may be blocked by MongoDB Atlas
- Go to MongoDB Atlas → "Security" → "Network Access"
- Add Render deployment IP to whitelist (click "Add Current IP")
- Or add `0.0.0.0` to allow all (less secure)

### Frontend Deployment Issues

**Error: "Cannot find module"**
- Ensure root directory is set to `client`
- Check package.json exists in `client` folder

**Error: "API calls failing (CORS error)"**
- Ensure `VITE_API_URL` in Vercel environment variables is correct
- Ensure backend `CORS_ORIGIN` includes your Vercel URL
- Check that Render backend responds to `/api/health`

**Page shows blank/white screen**
- Check browser console (F12) for errors
- Wait 30 seconds - sometimes Render cold starts take time
- Try redeploying on Vercel: Dashboard → Select project → "Redeploy"

---

## **Keeping Things Updated**

### Make Code Changes
```bash
# Make your changes locally
git add .
git commit -m "Update: Your change description"
git push origin main
```

### Auto-Redeploy
- **Vercel**: Auto-redeploys on every push to main
- **Render**: Auto-redeploys on every push to main

### Manual Variables Update
If you need to change environment variables:

**On Render**:
1. Dashboard → Click service
2. Environment → Update variable
3. Save → Auto-redeploys

**On Vercel**:
1. Dashboard → Settings → Environment Variables
2. Update variable
3. Save → Auto-redeploys

---

## **Important Notes**

### Cold Starts (Render)
- Free tier services sleep after 15 minutes of inactivity
- First request after sleep takes 30-60 seconds to respond
- Pro tip: Add a monitoring service to ping `/api/health` every 5 minutes to keep it awake
- Upgrade to paid plan to avoid cold starts

### Database Backups
- MongoDB Atlas free tier: Automatic backups every 6 hours
- Manual backups available in "Backup" section

### Scaling
- Both services have generous free tiers
- Render: 0.5 CPU, 512MB RAM
- Vercel: Automatic scaling

---

## **Summary of URLs**

After deployment, you'll have:

```
Frontend URL (Vercel):  https://your-project.vercel.app
Backend URL (Render):   https://your-api.onrender.com
Database (MongoDB):     Managed by MongoDB Atlas

API Health Check:       https://your-api.onrender.com/api/health
Login:                  https://your-project.vercel.app/login
Dashboard:              https://your-project.vercel.app/dashboard
```

---

## **Getting Help**

- **Render Support**: https://render.com/docs
- **Vercel Documentation**: https://vercel.com/docs
- **MongoDB Help**: https://docs.mongodb.com
- **Check Logs**:
  - Render: Service → Logs tab
  - Vercel: Deployments → Click deployment → Logs tab

---

**You're all set! Your app is now live on the internet! 🚀**
