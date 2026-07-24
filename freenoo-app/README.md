# FreeNoo Mobile App

Production-grade React Native Expo app for FreeNoo PDF tools platform.

## Architecture

```
src/
├── api/
│   ├── client/       # Axios client with interceptors
│   ├── endpoints/    # All API endpoint constants
│   ├── hooks/        # React Query hooks (future)
│   └── services/     # Upload & job services
├── components/
│   ├── common/       # Toast, ProcessingOverlay, SkeletonLoader
│   ├── layout/       # Header
│   └── tool/         # ToolCard, ResultCard
├── constants/        # Tools list, categories
├── navigation/       # Stack + Tab navigation
├── screens/
│   ├── Home/         # Dashboard
│   ├── Files/        # Recent & cloud files
│   ├── Tools/        # All tools with search & filter
│   ├── Scanner/      # Camera scan to PDF
│   ├── Settings/     # App settings
│   └── Tool/         # Universal tool processor
├── store/            # Zustand global state
├── theme/            # Design tokens
└── types/            # TypeScript interfaces
```

## Setup

```bash
cd freenoo-app
npm install --legacy-peer-deps
```

## Run

```bash
npx expo start
```

## Build APK

```bash
eas login
eas build --platform android --profile preview
```

## API

All tools connect to `https://api.freenoo.com/api/v1`

## Features

- ✅ 16 PDF tools
- ✅ Universal tool processor screen
- ✅ Upload progress tracking
- ✅ Job polling with progress
- ✅ Toast notifications
- ✅ Processing overlay with animation
- ✅ Result download & share
- ✅ Recent files history
- ✅ Scanner (camera to PDF)
- ✅ Dark theme (#0B0B0F)
- ✅ Animated bottom tabs
- ✅ Zustand state management
- ✅ Axios with retry interceptor
- ✅ TypeScript throughout

```
- cd android && ./gradlew assembleDebug
- cd android && ./gradlew assembleRelease
```