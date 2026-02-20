# RFord Biometrics - Ride Security Assistance Platform

## Overview

**RFord Biometrics** is a professional security command center application designed for ride-sharing and delivery fleet management in South Africa. The application features real-time driver tracking, AI-powered facial recognition, incident management, and comprehensive monitoring dashboards.

## 🎨 Design System

Built with **Microsoft Azure's design system**:
- **Color Scheme**: Azure Blue (#0078D4)
- **Typography**: Segoe UI (Microsoft's system font)
- **Components**: Professional enterprise-grade UI
- **Styling**: Subtle 2px borders, Azure shadows

## 🗺️ Mapping Technology

**Google Maps Platform Integration**:
- Custom API Key configured
- Real-time driver tracking with custom markers
- Movement trails for active drivers
- Professional, accurate map data
- Optimized for performance

## ✨ Features

### 1. Real-Time Dashboard
- Live driver tracking on Google Maps
- Performance statistics and metrics
- Activity feed with real-time updates
- Recent incident reports

### 2. AI-Powered Face Recognition
- SSD MobileNet v1 detection model
- 68-point facial landmark analysis
- Face quality assessment (Excellent/Good/Fair/Poor)
- Face matching system with confidence scores
- IndexedDB-based face database
- Auto-capture of high-quality faces

### 3. Driver Management
- Comprehensive driver profiles
- Status tracking (Active/Idle/Offline)
- Performance metrics
- Zone assignments

### 4. Incident Management
- Detailed incident reports
- Face detection data
- Status tracking (Open/Investigating/Resolved)
- Location-based filtering

### 5. Map View
- Google Maps with custom markers
- Movement trails
- Status-based color coding
- Zoom and pan controls

## 📚 Documentation

- **`QUICK_START.md`** - Quick reference guide
- **`AZURE_DESIGN_SYSTEM.md`** - Complete design system documentation
- **`AZURE_IMPLEMENTATION_SUMMARY.md`** - Azure styling implementation
- **`GOOGLE_MAPS_INTEGRATION.md`** - Google Maps setup and usage
- **`GOOGLE_MAPS_SUMMARY.md`** - Google Maps migration summary
- **`MAP_OPTIMIZATION_GUIDE.md`** - Map performance optimizations
- **`FACE_RECOGNITION_GUIDE.md`** - AI face detection guide
- **`FACE_RECOGNITION_IMPROVEMENTS.md`** - Face recognition refinements

## 🚀 Getting Started

### Prerequisites
- Node.js & npm installed ([install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating))
- Google Maps API key (already configured)

### Installation

```sh
# Clone the repository
git clone <YOUR_GIT_URL>

# Navigate to project directory
cd ride-secure-assist-main

# Install dependencies
npm install

# Start development server
npm run dev
```

### Demo Credentials
- **Email**: demo@rfordbiometrics.co.za
- **Password**: demo123

## 🔧 Tech Stack

- **Framework**: React 18 + TypeScript
- **Styling**: Tailwind CSS + Azure Design System
- **UI Components**: Radix UI + shadcn/ui
- **Maps**: Google Maps Platform (@vis.gl/react-google-maps)
- **AI**: face-api.js (SSD MobileNet v1)
- **Database**: IndexedDB (local storage)
- **State Management**: React Hooks
- **Routing**: React Router
- **Build Tool**: Vite
- **Animations**: Framer Motion

## 📁 Project Structure

```
src/
├── components/          # Reusable components
│   ├── ui/             # shadcn/ui components (Azure styled)
│   ├── LiveMap.tsx     # Google Maps integration
│   ├── AppSidebar.tsx  # Navigation sidebar
│   └── StatCard.tsx    # Dashboard statistics
├── pages/              # Application pages
│   ├── Dashboard.tsx   # Main dashboard
│   ├── FaceRecognition.tsx  # AI face detection
│   ├── Drivers.tsx     # Driver management
│   ├── Incidents.tsx   # Incident reports
│   └── Login.tsx       # Authentication
├── lib/                # Utilities and data
│   ├── face-database.ts  # IndexedDB face storage
│   ├── mock-data.ts    # Demo data (Johannesburg GPS)
│   └── utils.ts        # Helper functions
└── hooks/              # Custom React hooks
    └── useDriverSimulation.ts  # Real-time driver updates
```

## 🎯 Key Features Breakdown

### Google Maps Integration
- **Provider**: Google Maps Platform
- **API Key**: Set via `VITE_GOOGLE_MAPS_API_KEY` in `.env` (see `.env.example`)
- **Features**:
  - Custom AdvancedMarker components
  - Real-time position updates
  - Movement trail polylines
  - Status-based color coding
  - Performance optimized (3-second update interval)

### Face Recognition System
- **Model**: SSD MobileNet v1
- **Accuracy**: 50% minimum, 85% for auto-capture
- **Features**:
  - Real-time face detection (5 FPS)
  - 68-point landmark detection
  - Face quality assessment
  - Face matching with Euclidean distance
  - Match confidence scoring
  - Duplicate alert prevention

### Azure Design System
- **Primary Color**: Azure Blue (#0078D4)
- **Typography**: Segoe UI, 400/600 weights
- **Components**: 32px height standard
- **Shadows**: 4dp and 8dp elevation
- **Border Radius**: 2px (subtle)

## 🌐 Environment

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)
