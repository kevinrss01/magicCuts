# MagicCuts 🎬✂️

MagicCuts is a powerful application that transforms long videos into viral short-form content. The platform uses AI to analyze video transcriptions, identify the most engaging moments, and automatically cut them into vertical short format videos optimized for social media platforms.

## 🚀 Project Overview

This project was created during a 12-hour YouTube challenge to build a tool that could help content creators repurpose their long-form content (like YouTube videos and livestreams) into viral shorts without manual editing.

MagicCuts:
1. Analyzes video transcriptions to find the most engaging segments
2. Automatically cuts these segments into vertical short-format videos
3. Provides an intuitive dashboard to review and manage your viral clips

## 🏗️ Project Structure

The project consists of two main components:

### Frontend (Remix.js + React)
- Modern UI built with Remix, React, and TailwindCSS
- User authentication and project management
- Video preview and management dashboard

### Backend (Node.js + Hono)
- RESTful API built with Hono
- Video processing and transcription with Deepgram
- AI analysis with OpenAI
- Video transformation with FFMPEG
- Storage with AWS S3
- Database management with Supabase

## 🛠️ Technologies Used

### Frontend
- **Remix.js**: React framework for building modern web applications
- **React**: UI library
- **TailwindCSS**: Utility-first CSS framework
- **HeroUI**: UI component library
- **TypeScript**: Type-safe JavaScript
- **Zustand**: State management
- **Remotion**: JavaScript library for creating videos programmatically
- **Framer Motion**: Animation library

### Backend
- **Node.js**: JavaScript runtime
- **Hono**: Lightweight, fast web framework
- **TypeScript**: Type-safe JavaScript
- **Deepgram**: Audio transcription service
- **OpenAI**: AI for content analysis
- **FFMPEG**: Video processing tool
- **AWS S3**: Cloud storage
- **Supabase**: Backend-as-a-Service with PostgreSQL database
- **Docker**: Containerization

## 🚀 Deployment

- **Frontend**: Deployed on Vercel
- **Backend**: Deployed on Railway

## 🏁 Getting Started

### Prerequisites
- Node.js (v20+)
- PNPM package manager
- FFMPEG installed on your system
- AWS, Supabase, Deepgram, and OpenAI accounts

### Environment Setup

#### Frontend
1. Navigate to the frontend directory and copy the example environment file:
```bash
cd frontend
cp .env.example .env
```

2. Update the `.env` file with your API keys and endpoints.

#### Backend
1. Navigate to the server directory and copy the example environment file:
```bash
cd server
cp .env.exemple .env
```

2. Update the `.env` file with your API keys and service credentials.

### Installation

#### Frontend
```bash
cd frontend
pnpm install
pnpm run dev
```

#### Backend
```bash
cd server
pnpm install
pnpm run dev
```

Alternatively, you can use Docker for the backend:
```bash
cd server
docker compose up -d --build
docker compose logs -f
```

## 🔍 How It Works

1. **Upload**: Users upload their long-form video content
2. **Transcription**: The system transcribes the video using Deepgram
3. **Analysis**: AI analyzes the transcription to identify viral-worthy moments
4. **Processing**: The system cuts the video into short segments
5. **Delivery**: Users can preview and download the generated short videos

## 💡 Features

- AI-powered identification of viral-worthy moments
- Automatic video cutting and formatting
- User-friendly dashboard
- Video preview
- Transcription review
- Cloud storage integration
- Customizable output format

## 🤝 Contributing

Contributions are welcome! This project was built during a 12-hour challenge but is open to improvements and new features.

## 📄 License

This project is licensed under the MIT License.