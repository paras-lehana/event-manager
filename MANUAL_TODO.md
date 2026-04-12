# MANUAL_TODO — Setup Instructions

This file documents all the manual configuration steps required to fully deploy StadiumFlow with live services. The application is designed to work in **demo mode** without any API keys (using mock data and local AI fallback), but you'll need these for production.

---

## 1. Google Cloud Platform Setup

### Enable APIs
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the following APIs:
   - **Maps JavaScript API** — For venue/indoor map rendering
   - **Places API** — For POI search
   - **Directions API** — For wayfinding routes
   - **Vertex AI API** — For Gemini AI integration (alternatively use Google AI Studio)

### API Key Restriction
1. Go to **APIs & Services → Credentials**
2. Create an API key
3. Under **Application restrictions**, select **HTTP referrers**
4. Add your deployment domain (e.g., `https://yourdomain.com/*`)
5. Under **API restrictions**, limit to Maps JavaScript, Places, and Directions APIs

---

## 2. Firebase Project Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project (or link to your GCP project)
3. **Enable Authentication**:
   - Go to **Authentication → Sign-in method**
   - Enable **Anonymous** sign-in
   - (Optional) Enable **Google** sign-in for persistent accounts
4. **Initialize Firestore**:
   - Go to **Firestore Database → Create database**
   - Select a regional location (e.g., `us-west1` for SoFi Stadium)
   - Start in **test mode** for development
5. **Initialize Realtime Database**:
   - Go to **Realtime Database → Create Database**
   - Same region recommendation
6. **Copy Firebase config** to your `.env` file:
   ```
   NEXT_PUBLIC_FIREBASE_API_KEY="your-api-key"
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="your-project.firebaseapp.com"
   NEXT_PUBLIC_FIREBASE_DATABASE_URL="https://your-project.firebaseio.com"
   NEXT_PUBLIC_FIREBASE_PROJECT_ID="your-project"
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="your-project.appspot.com"
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="your-sender-id"
   NEXT_PUBLIC_FIREBASE_APP_ID="your-app-id"
   ```

### Firebase Security Rules (Firestore)
```json
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /orders/{orderId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null;
    }
    match /venues/{venueId} {
      allow read: if true;
    }
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

### Realtime Database Rules
```json
{
  "rules": {
    "telemetry": {
      ".read": true,
      ".write": "auth != null"
    },
    "presence": {
      "crews": {
        "$crewId": {
          "$uid": {
            ".read": true,
            ".write": "auth != null && auth.uid == $uid"
          }
        }
      }
    }
  }
}
```

---

## 3. Gemini AI Configuration

### Option A: Google AI Studio (Simpler)
1. Go to [Google AI Studio](https://aistudio.google.com/)
2. Click **Get API Key**
3. Copy the key to `.env`:
   ```
   GEMINI_API_KEY="your-gemini-api-key"
   ```

### Option B: Vertex AI (Production)
1. Enable Vertex AI API in GCP
2. Set up service account credentials
3. Configure the endpoint URL in `src/lib/gemini.ts`

### System Prompt Configuration
The AI system prompt is defined in `src/lib/gemini.ts`. Customize the venue name, available functions, and personality to match your deployment venue.

---

## 4. Indoor Maps

To enable Google Indoor Maps:
1. Register as a content partner at [Google Indoor Maps Portal](https://www.google.com/maps/about/partners/indoormaps/)
2. Upload your venue's floor plan JSON
3. Once approved, the indoor map ID is automatically available via the Maps JS API

---

## 5. Environment Variables Summary

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_FIREBASE_API_KEY` | For live data | Firebase web API key |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | For live data | Firebase auth domain |
| `NEXT_PUBLIC_FIREBASE_DATABASE_URL` | For live data | Firebase RTDB URL |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | For live data | Firebase project ID |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | For live data | Firebase storage |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | For live data | Firebase messaging |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | For live data | Firebase app ID |
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | For real maps | Google Maps JS API key |
| `GEMINI_API_KEY` | For live AI | Gemini API key |

> **Note**: The app works in full demo mode without any keys configured. Mock data, simulated queues, and a local AI fallback are built in.
