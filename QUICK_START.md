# BioSentinel - Quick Start Guide

## 🚀 Getting Started

### Start the Development Server
```bash
npm run dev
```

The app will be available at: **http://localhost:8082/**

### Demo Login Credentials
- **Email**: `demo@biosentinel.co.za`
- **Password**: `demo123`

---

## 🎨 Microsoft Azure Design System

The app now uses **Microsoft Azure's design system**:

### Colors
- **Primary**: Azure Blue (#0078D4)
- **Success**: Green (#107C10)  
- **Warning**: Orange (#FFB900)
- **Error**: Red (#E81123)

### Typography
- **Font**: Segoe UI (Microsoft's system font)
- **Weights**: Normal (400), Semibold (600)
- **Base Size**: 14px

### Components
- **Border Radius**: 2px (subtle)
- **Shadows**: Azure elevation (4dp, 8dp)
- **Height**: 32px (buttons, inputs)
- **Padding**: 16px (cards, panels)

---

## 📂 Key Files

### Pages
- `/src/pages/Login.tsx` - Login page
- `/src/pages/Dashboard.tsx` - Main dashboard
- `/src/pages/FaceRecognition.tsx` - AI face detection
- `/src/pages/Drivers.tsx` - Driver management
- `/src/pages/Incidents.tsx` - Incident reports

### Components
- `/src/components/ui/button.tsx` - Azure buttons
- `/src/components/ui/badge.tsx` - Status badges
- `/src/components/ui/card.tsx` - Content cards
- `/src/components/StatCard.tsx` - Stat display
- `/src/components/LiveMap.tsx` - Real-time map

### Styling
- `/src/index.css` - Azure design tokens
- `/tailwind.config.ts` - Tailwind configuration

---

## 📖 Documentation

1. **`AZURE_DESIGN_SYSTEM.md`** - Complete design system guide
2. **`AZURE_IMPLEMENTATION_SUMMARY.md`** - Implementation details
3. **`MAP_OPTIMIZATION_GUIDE.md`** - Map performance guide
4. **`FACE_RECOGNITION_IMPROVEMENTS.md`** - AI improvements

---

## 🎯 Features

✅ **Microsoft Azure styling** - Professional enterprise design  
✅ **Real-time map** - Live driver tracking with trails  
✅ **Face recognition** - AI-powered facial detection  
✅ **Dashboard** - Stats, activities, incidents  
✅ **Responsive** - Works on desktop and mobile  

---

## 🛠️ Tech Stack

- **Framework**: React + TypeScript
- **Styling**: Tailwind CSS + Azure Design
- **UI Components**: Radix UI + shadcn/ui
- **Maps**: Leaflet.js
- **AI**: face-api.js (SSD MobileNet v1)
- **State**: React Hooks
- **Routing**: React Router
- **Build**: Vite

---

## 🎨 Using Azure Components

### Button
```tsx
<Button variant="default">Primary Action</Button>
<Button variant="outline">Secondary</Button>
```

### Badge
```tsx
<Badge variant="success">Active</Badge>
<Badge variant="warning">Pending</Badge>
```

### Card
```tsx
<Card className="azure-shadow">
  <CardHeader>
    <CardTitle>Title</CardTitle>
  </CardHeader>
  <CardContent>Content</CardContent>
</Card>
```

---

## 📞 Support

For issues or questions, check the documentation files listed above.

---

**Last Updated**: February 19, 2026  
**Version**: 2.0.0 (Azure Design)  
**Status**: Production Ready ✅
