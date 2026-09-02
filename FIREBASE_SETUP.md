# Firebase Setup Guide for AirPurify System

## Overview
This document explains how to properly connect the backend and frontend with Firebase for the IoT-Based Gas & Environmental Monitoring System.

## Architecture

```
ESP32 Sensors → Firebase Firestore ← React Web App
                      ↓
              Cloud Functions (Alerts)
                      ↓
              Firebase Auth (Users)
```

## Firebase Services Used

### 1. Firebase Authentication
- **Purpose**: Secure user login and identity management
- **Method**: Email and Password authentication
- **Collections**: Users with roles (admin/user)

### 2. Firebase Firestore
- **Purpose**: Real-time database for sensor data, alerts, and system logs
- **Collections**:
  - `users` - User profiles and device assignments
  - `devices` - IoT device registry
  - `sensorReadings` - Time-series sensor data
  - `alerts` - Gas threshold alerts
  - `logs` - System activity logs

### 3. Firebase Cloud Functions (Optional)
- **Purpose**: Automated alert generation and processing
- **Triggers**: On new sensor reading write

## Setup Instructions

### Step 1: Firebase Project Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Your project is already created: `intelligent-air-system`
3. Enable Authentication:
   - Go to Authentication → Sign-in method
   - Enable "Email/Password"

### Step 2: Firestore Database Setup

1. Go to Firestore Database
2. Create database in production mode
3. Set up Security Rules (see below)

### Step 3: Configure Environment Variables

Create a `.env` file in `smart-gas-monitoring/` directory:

```env
VITE_FIREBASE_API_KEY=AIzaSyCmolbgW0nqvzYlp7CyFVYlj9YNAsqapC0
VITE_FIREBASE_AUTH_DOMAIN=intelligent-air-system.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=intelligent-air-system
VITE_FIREBASE_STORAGE_BUCKET=intelligent-air-system.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=215914184089
VITE_FIREBASE_APP_ID=1:215914184089:web:3d70c51d010eb0d03ce708
VITE_FIREBASE_MEASUREMENT_ID=G-17BESYD9N9
```

### Step 4: Seed Initial Data

Run the seeding script to create demo users and devices:

```bash
cd scripts
node 002-seed-firestore-data.js
```

This creates:
- Admin user: admin@airpurify.com / admin123
- Regular user: user@airpurify.com / user123
- 3 demo devices (DEVICE001, DEVICE002, DEVICE003)
- Sample sensor readings

## Firestore Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Users collection - users can read their own data, admins can read all
    match /users/{userId} {
      allow read: if request.auth != null && 
                     (request.auth.uid == userId || 
                      get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin');
      allow write: if request.auth != null && 
                      get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Devices collection - authenticated users can read, admins can write
    match /devices/{deviceId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
                      get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Sensor readings - authenticated users can read, IoT devices and admins can write
    match /sensorReadings/{readingId} {
      allow read: if request.auth != null;
      allow create: if true; // Allow ESP32 to write (consider using API key validation)
      allow update, delete: if request.auth != null && 
                               get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Alerts - authenticated users can read, system can create
    match /alerts/{alertId} {
      allow read: if request.auth != null;
      allow create: if true; // System-generated
      allow update: if request.auth != null; // For dismissing alerts
      allow delete: if request.auth != null && 
                       get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Logs - authenticated users can read, system can write
    match /logs/{logId} {
      allow read: if request.auth != null && 
                     get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
      allow create: if request.auth != null;
      allow update, delete: if false; // Immutable logs
    }
  }
}
```

## ESP32 Integration

To send sensor data from ESP32 to Firestore:

### Option 1: Using Firestore REST API

```cpp
#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>

const char* FIREBASE_PROJECT_ID = "intelligent-air-system";
const char* FIREBASE_API_KEY = "AIzaSyCmolbgW0nqvzYlp7CyFVYlj9YNAsqapC0";

void sendSensorData(String deviceId, float temp, float hum, int co, int lpg, int h2, int nh3) {
  HTTPClient http;
  
  String url = "https://firestore.googleapis.com/v1/projects/" + 
               String(FIREBASE_PROJECT_ID) + "/databases/(default)/documents/sensorReadings?key=" + 
               String(FIREBASE_API_KEY);
  
  http.begin(url);
  http.addHeader("Content-Type", "application/json");
  
  StaticJsonDocument<512> doc;
  doc["fields"]["deviceId"]["stringValue"] = deviceId;
  doc["fields"]["temperature"]["doubleValue"] = temp;
  doc["fields"]["humidity"]["doubleValue"] = hum;
  doc["fields"]["CO"]["integerValue"] = co;
  doc["fields"]["LPG"]["integerValue"] = lpg;
  doc["fields"]["H2"]["integerValue"] = h2;
  doc["fields"]["NH3"]["integerValue"] = nh3;
  doc["fields"]["timestamp"]["timestampValue"] = getISOTimestamp();
  
  String jsonData;
  serializeJson(doc, jsonData);
  
  int httpResponseCode = http.POST(jsonData);
  
  if (httpResponseCode > 0) {
    Serial.println("Data sent successfully");
  } else {
    Serial.println("Error sending data: " + String(httpResponseCode));
  }
  
  http.end();
}
```

### Option 2: Using MQTT Bridge (Recommended)

Use a Cloud Function or Node.js backend as an MQTT broker that writes to Firestore.

## Testing the Connection

### Frontend Test
1. Start the React app: `cd smart-gas-monitoring && npm run dev`
2. Login with demo credentials
3. Check browser console for `[v0]` debug logs
4. Verify Firestore listeners are active

### Backend Test
1. Go to Firebase Console → Firestore
2. Manually add a sensor reading
3. Watch the frontend update in real-time

## Troubleshooting

### Authentication Issues
- Check Firebase console: Authentication → Users
- Verify email/password is enabled
- Check browser console for auth errors

### Firestore Connection Issues
- Verify security rules are set correctly
- Check network tab for Firestore API calls
- Ensure API key is correct

### Real-time Updates Not Working
- Check Firestore listeners in SystemContext
- Verify user has read permissions
- Check browser console for listener errors

## Production Considerations

1. **Security**: Use Firebase App Check to prevent API abuse
2. **Indexes**: Create composite indexes for complex queries
3. **Rate Limiting**: Implement rate limiting for ESP32 writes
4. **Data Retention**: Set up automatic data cleanup for old readings
5. **Monitoring**: Enable Firebase Analytics and Performance Monitoring

## References

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firestore Security Rules](https://firebase.google.com/docs/firestore/security/get-started)
- [Firebase Authentication](https://firebase.google.com/docs/auth)
```

```json file="" isHidden
