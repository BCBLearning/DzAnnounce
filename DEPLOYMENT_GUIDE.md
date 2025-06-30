# DzAnnounce Deployment Guide

## 🚀 Quick Fix for Build Error

The npm install error has been fixed by removing the non-existent `@radix-ui/react-sheet` dependency. The Sheet component uses `@radix-ui/react-dialog` instead.

## 📋 Prerequisites

- Node.js 18+
- Git
- Netlify account
- Supabase account
- Storyblok account (optional)

## 🗄️ Supabase Setup

### 1. Create Project
```bash
# Visit https://supabase.com/dashboard
# Create new project
# Note your project URL and anon key
```

### 2. Database Schema
```sql
-- Enable RLS
ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;

-- Create profiles table
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  role TEXT DEFAULT 'user',
  created_at TIMESTAMP DEFAULT NOW(),
  PRIMARY KEY (id)
);

-- Create announcements table
CREATE TABLE announcements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  location TEXT,
  price DECIMAL,
  contact_info TEXT,
  images TEXT[],
  user_id UUID REFERENCES auth.users(id),
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP DEFAULT NOW()
);

-- RLS Policies
CREATE POLICY "Users can view all announcements" ON announcements FOR SELECT USING (true);
CREATE POLICY "Users can insert own announcements" ON announcements FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own announcements" ON announcements FOR UPDATE USING (auth.uid() = user_id);
```

### 3. Environment Variables
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 🌐 Netlify Deployment

### 1. Build Settings
```bash
# Build command
npm run build

# Publish directory
dist

# Environment variables (in Netlify dashboard)
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 2. Redirects (_redirects file)
```
/*    /index.html   200
```

## 📝 Storyblok Integration (Optional)

### 1. Install Storyblok
```bash
npm install @storyblok/react
```

### 2. Environment Variables
```env
VITE_STORYBLOK_ACCESS_TOKEN=your_storyblok_token
```

### 3. Basic Integration
```typescript
// src/lib/storyblok.ts
import { storyblokInit, apiPlugin } from '@storyblok/react';

storyblokInit({
  accessToken: import.meta.env.VITE_STORYBLOK_ACCESS_TOKEN,
  use: [apiPlugin],
});
```

## 🔥 Firebase Alternative

### 1. Install Firebase
```bash
npm install firebase
npm uninstall @supabase/supabase-js
```

### 2. Firebase Config
```typescript
// src/lib/firebase.ts
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
```

### 3. Replace Backend Service
```typescript
// Replace src/components/BackendService.tsx with Firebase methods
import { auth, db } from '@/lib/firebase';
import { collection, addDoc, getDocs, query, where } from 'firebase/firestore';
```

## 🚀 Deployment Steps

1. **Fix Dependencies**
   ```bash
   npm install
   ```

2. **Test Locally**
   ```bash
   npm run dev
   ```

3. **Build**
   ```bash
   npm run build
   ```

4. **Deploy to Netlify**
   - Connect GitHub repo
   - Set build command: `npm run build`
   - Set publish directory: `dist`
   - Add environment variables

5. **Configure Domain**
   - Add custom domain in Netlify
   - Update CORS settings in Supabase

## 🔧 Troubleshooting

- **Build fails**: Check all imports exist
- **Auth issues**: Verify Supabase URL/key
- **CORS errors**: Add domain to Supabase settings
- **404 on refresh**: Ensure _redirects file exists

## 📱 Features Included

✅ User authentication
✅ Announcement CRUD
✅ Admin panel
✅ Responsive design
✅ Search & filters
✅ Image upload
✅ Real-time updates

Your DzAnnounce app is now ready for production! 🎉