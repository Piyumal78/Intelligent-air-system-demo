# AirPurify - IoT Gas & Environmental Monitoring System

A comprehensive real-time air quality and gas monitoring system built with React, Firebase, and IoT sensors (ESP32).

## Features

- **Real-time Monitoring**: Live sensor data updates via Firebase Firestore
- **Multi-Gas Detection**: CO, LPG, H₂, NH₃ monitoring with threshold alerts
- **Environmental Tracking**: Temperature, humidity, and pressure monitoring
- **Role-Based Access**: Admin portal and user dashboards
- **Alert System**: Automatic threshold-based alert generation
- **Device Management**: Register and manage multiple IoT devices
- **Activity Logs**: Complete audit trail of system events

## Tech Stack

### Frontend
- React 18 with Vite
- Firebase Authentication & Firestore
- Tailwind CSS for styling
- React Router for navigation
- React Circular Progressbar for visualizations

### Backend (Optional)
- Node.js + Express
- Firebase Admin SDK
- REST API for device data ingestion

### Database
- Firebase Firestore (NoSQL real-time database)
- Collections: users, devices, sensorReadings, alerts, logs

## Getting Started

### Prerequisites
- Node.js 18+
- Firebase account
- npm or pnpm

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd AirPurify
```

2. **Install frontend dependencies**
```bash
cd smart-gas-monitoring
npm install
```

3. **Configure Firebase**
   
   Create `.env` file in `smart-gas-monitoring/`:
   ```env
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```

4. **Seed demo data**
```bash
cd scripts
node 002-seed-firestore-data.js
```

5. **Run the frontend**
```bash
cd smart-gas-monitoring
npm run dev
```

6. **Optional: Run the backend**
```bash
cd Backend
npm install
npm run dev
```

## Demo Credentials

- **Admin**: admin@airpurify.com / admin123
- **User**: user@airpurify.com / user123

## Firebase Setup

See [FIREBASE_SETUP.md](./FIREBASE_SETUP.md) for detailed Firebase configuration instructions including:
- Authentication setup
- Firestore security rules
- ESP32 integration guide
- Cloud Functions deployment

## Project Structure

```
AirPurify/
├── smart-gas-monitoring/     # React frontend
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   ├── context/          # React Context (Auth & System)
│   │   ├── pages/            # Route pages
│   │   └── firebase.js       # Firebase configuration
│   └── package.json
├── Backend/                  # Optional Node.js backend
│   ├── config/              # Firebase Admin config
│   ├── controllers/         # Business logic
│   ├── routes/              # API endpoints
│   └── server.js
├── scripts/                 # Database seeding scripts
└── FIREBASE_SETUP.md        # Detailed setup guide
```

## API Endpoints (Backend)

### Devices
- `GET /api/devices` - List all devices
- `POST /api/devices` - Register new device
- `POST /api/devices/:id/readings` - Submit sensor data
- `PATCH /api/devices/:id/status` - Update device status

### Authentication
- `POST /api/auth/register` - Create user (admin only)
- `GET /api/auth/users` - List users

## ESP32 Integration

The system supports ESP32 microcontrollers with MQ series gas sensors. Send data to Firebase using:

1. **Firestore REST API** (direct from ESP32)
2. **Backend API** (through Node.js server)

See FIREBASE_SETUP.md for complete ESP32 code examples.

## Security

- Firebase Authentication for user management
- Firestore Security Rules for data protection
- Role-based access control (admin/user)
- Environment variables for sensitive config

## Contributing

This is a final year thesis project. For academic collaboration, please contact the project authors.

## License

MIT License - See LICENSE file for details

## Authors

- Developed as part of IoT-Based Gas & Environmental Monitoring System thesis
- Firebase architecture following academic best practices

## Acknowledgments

- Firebase for real-time infrastructure
- React community for amazing tools
- Academic advisors for guidance
