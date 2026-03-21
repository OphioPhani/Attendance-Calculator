# Deployment Checklist - Quick Reference

Use this checklist while deploying your Attendance Calculator app.

---

## ✅ PRE-DEPLOYMENT (Local Setup)

- [ ] Code is working locally: `npm run dev`
- [ ] No console errors in browser
- [ ] Backend API responds to `/api/health`
- [ ] Can login/signup and access dashboard
- [ ] Update `.env.example` files (remove actual secrets)
- [ ] Push code to GitHub

```bash
# Quick commands to verify
git status
git log --oneline -5
npm run build  # Should succeed
```

---

## ✅ STEP 1: MONGODB ATLAS SETUP

- [ ] Create MongoDB Atlas account: https://cloud.mongodb.com
- [ ] Create free cluster (M0 tier)
- [ ] Create database user (copy username & password)
- [ ] Get connection string with username:password
- [ ] Test connection string locally
- [ ] Add Render IP to network whitelist (or `0.0.0.0`)

**Connection String Format**:
```
mongodb+srv://USERNAME:PASSWORD@cluster.mongodb.net/?appName=Cluster0
```

---

## ✅ STEP 2: GITHUB SETUP

- [ ] Initialize git in project root: `git init`
- [ ] Create `.gitignore` with `node_modules/`, `.env`, `dist/`
- [ ] First commit: `git add . && git commit -m "Initial commit"`
- [ ] Create repository on GitHub
- [ ] Push to GitHub: `git remote add origin ... && git push -u origin main`
- [ ] Verify files are on GitHub

---

## ✅ STEP 3: RENDER BACKEND DEPLOYMENT

1. Create Render account: https://render.com
2. Connect GitHub account
3. New Web Service → Select attendance-calculator repo
4. Configure:
   - [ ] Name: `attendance-calculator-api`
   - [ ] Environment: `Node`
   - [ ] Build Command: `npm --prefix server install`
   - [ ] Start Command: `node server/server.js`
5. Create Web Service
6. **Wait for deployment to complete (green "Live" status)**
7. Add Environment Variables:
   - [ ] `MONGODB_URI` = Your MongoDB connection string
   - [ ] `JWT_SECRET` = Strong random key (use openssl rand -base64 32)
   - [ ] `NODE_ENV` = `production`
   - [ ] `CORS_ORIGIN` = (Will update after Vercel deployment)
8. Copy Render URL: `https://your-api-name.onrender.com`
9. Test health endpoint: `https://your-api-name.onrender.com/api/health`

---

## ✅ STEP 4: VERCEL FRONTEND DEPLOYMENT

1. Create Vercel account: https://vercel.com (sign up with GitHub)
2. New Project → Import repository
3. Select `attendance-calculator` repo
4. Configure:
   - [ ] Framework: `Vite`
   - [ ] Root Directory: `client`
   - [ ] Build Command: `npm run build`
   - [ ] Output Directory: `dist`
5. Add Environment Variables:
   - [ ] `VITE_API_URL` = Your Render backend URL (from Step 3)
6. Click Deploy
7. **Wait for deployment (3-5 minutes)**
8. Copy Vercel URL: `https://your-project.vercel.app`
9. Test login page loads

---

## ✅ STEP 5: UPDATE CORS (BACK TO RENDER)

1. Go back to Render dashboard
2. Click `attendance-calculator-api` service
3. Environment Variables
4. Update `CORS_ORIGIN`:
   - [ ] New value: Your Vercel URL from Step 4
   - [ ] Save (auto-redeploys)

---

## ✅ STEP 6: VERIFICATION

### Test Backend:
- [ ] Visit: `https://your-render-api.onrender.com/api/health`
- [ ] Should return JSON with `"success": true`

### Test Frontend:
- [ ] Visit: `https://your-vercel-frontend.vercel.app`
- [ ] Login page loads
- [ ] Can sign up with email
- [ ] Can log in
- [ ] Dashboard loads with data
- [ ] No CORS errors in console

### Test End-to-End:
- [ ] Create new account
- [ ] Mark attendance
- [ ] Add holidays
- [ ] View statistics
- [ ] Check that data persists after refresh

---

## 🎉 DEPLOYMENT COMPLETE

Your app is now live!

**Links**:
- 🌐 Frontend: `https://your-project.vercel.app`
- ⚙️ Backend: `https://your-api.onrender.com`
- 🗄️ Database: MongoDB Atlas

---

## 🔧 TROUBLESHOOTING QUICK FIXES

| Problem | Solution |
|---------|----------|
| **Backend won't start** | Check Render Logs → Fix error → Manual redeploy |
| **CORS error on frontend** | Update `CORS_ORIGIN` in Render env vars with correct Vercel URL |
| **Can't connect to MongoDB** | Ensure Render IP is in MongoDB whitelist (Security → Network Access) |
| **Frontend shows blank** | Check browser console F12 → Verify `VITE_API_URL` env var → Redeploy Vercel |
| **Database timeout** | Increase network timeout in MongoDB → Security → Network Access → Add `0.0.0.0` |

---

## 📝 FOR FUTURE UPDATES

Every time you push code to GitHub:
```bash
git add .
git commit -m "Your change description"
git push origin main
```

- **Vercel**: Auto-redeploys on every push
- **Render**: Auto-redeploys on every push

---

## 💾 IMPORTANT: SAVE THESE VALUES

Keep these somewhere safe:

```
MongoDB Connection String: ____________________________________
MongoDB Username: ____________________________________
MongoDB Password: ____________________________________
JWT Secret: ____________________________________
Render Backend URL: ____________________________________
Vercel Frontend URL: ____________________________________
Vercel Project ID: ____________________________________
Render Service ID: ____________________________________
```

---

**Need help?** See the full [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)
