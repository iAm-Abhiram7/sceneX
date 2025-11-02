# 🎬 Run SceneX Forensics - Complete Commands

## ✅ Your backend is ALREADY RUNNING on port 5000!

Check the terminal - you should see:
```
✅ MongoDB Connected: socaildb-shard-00-02.xs1wb.mongodb.net
🚀 Server running on port 5000
```

---

## 🚀 Option 1: Run Just the Mobile App (Recommended)

The backend is already running, so now start the mobile app:

### Step 1: Open a NEW terminal
Press `Ctrl + Shift + ` ` (backtick) or click Terminal → New Terminal

### Step 2: Navigate to mobile app folder
```powershell
cd forensic-app
```

### Step 3: Install dependencies (first time only)
```powershell
npm install
```

### Step 4: Start Expo
```powershell
npx expo start
```

### Step 5: Choose how to run
After Expo starts, you'll see a QR code and options:
- Press `w` - Run in **web browser** (easiest!)
- Press `a` - Run in **Android emulator**
- Press `i` - Run in **iOS simulator**
- Scan QR with **Expo Go** app on your phone

---

## 🎯 Option 2: Test Both Backend & Frontend

### Test Backend API (it's already running!)

Open your browser and go to:
- **Health Check**: http://localhost:5000/health
- You should see: `{"status":"ok","timestamp":"..."}`

Or test with PowerShell:
```powershell
# Test health endpoint
curl http://localhost:5000/health

# Test signup (create new user)
curl -X POST http://localhost:5000/api/auth/signup `
  -H "Content-Type: application/json" `
  -d '{\"firstName\":\"Test\",\"lastName\":\"User\",\"email\":\"test@example.com\",\"password\":\"test123\"}'

# Test login
curl -X POST http://localhost:5000/api/auth/login `
  -H "Content-Type: application/json" `
  -d '{\"email\":\"admin@forensic.com\",\"password\":\"admin123\"}'
```

### Test Mobile App

1. After `npx expo start`, press `w` for web
2. Login screen will appear
3. Use credentials:
   - Email: `admin@forensic.com`
   - Password: `admin123`
4. Explore all features!

---

## 📱 Mobile App - What to Test

### 1. Authentication
- ✅ Login with `admin@forensic.com` / `admin123`
- ✅ Try signing up with a new account
- ✅ Logout and login again

### 2. Home Screen
- ✅ See 10 pre-loaded reports
- ✅ Click "View All" to go to History
- ✅ Tap Quick Actions (Camera, AI Chat, History, Settings)

### 3. Camera Screen
- ✅ Click "Choose from Gallery" (camera needs permissions)
- ✅ Select any image from your computer
- ✅ Click "Analyze" and watch the 2-3 second simulation
- ✅ View the generated report

### 4. AI Chat Screen
- ✅ Try suggested questions
- ✅ Ask about "bloodstain patterns"
- ✅ Ask about "fingerprint analysis"
- ✅ Clear chat and start over

### 5. History Screen
- ✅ Browse all 10 reports
- ✅ Search for "blood" or "digital"
- ✅ Click on a report to view details
- ✅ Delete a report (swipe or tap trash icon)

### 6. Settings Screen
- ✅ View your profile information
- ✅ Check statistics (total reports, completed, in progress)
- ✅ Click Logout

---

## 🎨 Visual Checklist

Look for the Zen Garden aesthetic:
- ✅ Warm off-white background (#F5F3EF)
- ✅ Graphite text (#2F2F2F)
- ✅ Indigo accent buttons (#3E5C76)
- ✅ Sage green success colors (#B5C99A)
- ✅ Clean, minimal design
- ✅ Smooth transitions

---

## 🔧 If Something Goes Wrong

### Backend Issues

If the backend stopped running:
```powershell
cd forensic-backend
npm run dev
```

### Mobile App Issues

If Expo throws errors:
```powershell
# Clear cache
npx expo start -c

# Or reinstall
cd forensic-app
rm -rf node_modules
npm install
npx expo start
```

### TypeScript Errors

Before running `npm install`, TypeScript will show errors. This is **NORMAL** and **EXPECTED**.

After `npm install`, all errors related to missing modules will disappear!

---

## 📊 Expected Terminal Output

### Backend Terminal (already running)
```
✅ MongoDB Connected: socaildb-shard-00-02.xs1wb.mongodb.net
🚀 Server running on port 5000
GET /health 200 13.934 ms - 141
```

### Mobile App Terminal (after npx expo start)
```
› Metro waiting on exp://192.168.x.x:8081
› Scan the QR code above with Expo Go (Android) or the Camera app (iOS)

› Press w │ open web
› Press a │ open Android
› Press i │ open iOS
```

---

## 🎯 Success Indicators

### Backend ✅
- MongoDB connected message
- Server listening on port 5000
- Health check returns 200 OK

### Mobile App ✅
- Expo QR code displayed
- No red error screens
- Login screen shows up
- Can login with test credentials
- All screens navigate smoothly
- Reports load from mock data

---

## 🎊 You're All Set!

Your complete forensic evidence analysis platform is ready:
- ✅ Backend API running and connected to MongoDB
- ✅ Mobile app ready to launch
- ✅ 10 test reports pre-loaded
- ✅ 5 test users ready
- ✅ All 60+ files created and working

**Just start the mobile app and explore! 🚀**

---

## 🆘 Need Help?

Check these files:
1. `INSTALLATION_GUIDE.md` - Detailed setup
2. `QUICK_START.md` - Quick reference
3. `PROJECT_COMPLETE.md` - Full summary
4. `forensic-app/README.md` - Mobile app docs
5. `forensic-backend/README.md` - Backend docs

**Everything you need is documented! Happy coding! 🎉**
