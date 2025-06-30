# Firebase Setup Guide for IB Prep Hub

## 🔥 Setting Up Firebase

### 1. Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or "Add project"
3. Enter a project name (e.g., "ib-prep-hub")
4. Choose whether to enable Google Analytics (optional)
5. Click "Create project"

### 2. Enable Services
1. **Firestore Database**: 
   - Go to Firestore Database in the sidebar
   - Click "Create database"
   - Choose "Start in test mode" (for development)
   - Select a location close to your users

2. **Storage**:
   - Go to Storage in the sidebar
   - Click "Get started"
   - Choose "Start in test mode" (for development)
   - Select the same location as Firestore

### 3. Get Configuration
1. Go to Project Settings (gear icon)
2. Scroll down to "Your apps"
3. Click the web icon (</>)
4. Register your app with a nickname (e.g., "IB Prep Hub Web")
5. Copy the configuration object

### 4. Environment Variables
Create a `.env.local` file in your project root with:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### 5. Security Rules (Optional)
For production, update the security rules in Firebase Console:

**Firestore Rules:**
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true; // For development
    }
  }
}
```

**Storage Rules:**
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write: if true; // For development
    }
  }
}
```

## 🚀 Benefits of Firebase Integration

- **5GB free storage** (vs 5MB localStorage)
- **50MB file size limit** (vs 5MB localStorage)
- **Real-time updates** across devices
- **Professional cloud storage**
- **Automatic backups**
- **Scalable infrastructure**

## 📁 File Storage Structure

Files are stored in Firebase Storage under:
```
resources/
├── 1234567890_abc123.pdf
├── 1234567891_def456.xlsx
└── 1234567892_ghi789.pptx
```

Resource metadata is stored in Firestore under:
```
resources/
├── document_id_1
│   ├── title: "DCF Model"
│   ├── type: "Document"
│   ├── url: "https://firebasestorage.googleapis.com/..."
│   └── createdAt: "2024-01-01T00:00:00.000Z"
└── document_id_2
    └── ...
```

## 🔧 Troubleshooting

### Common Issues:
1. **"Firebase not initialized"**: Check your environment variables
2. **"Permission denied"**: Update security rules in Firebase Console
3. **"File too large"**: Check file size limits (50MB max)
4. **"Storage quota exceeded"**: Upgrade Firebase plan or delete old files

### Support:
- [Firebase Documentation](https://firebase.google.com/docs)
- [Firebase Console](https://console.firebase.google.com/)
- [Firebase Pricing](https://firebase.google.com/pricing) 