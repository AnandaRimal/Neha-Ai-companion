# Neha – Your Personal AI Companion — Frontend 💬✨

Next.js frontend dedicated to **Neha – Your Personal AI Companion**.

## Features

- **Personal AI Companion**: Neha talks naturally like a friend in English and Nepali. When you feel alone or want someone to talk to, she is always here.
- **Brainstorming & Ideas**: Explore creative concepts, problem-solve, think out loud, and discover fresh ideas together.
- **Web Exploration & Research**: Real-time web search powered by Tavily for facts, research, and curiosities.
- **News Display**: Real-time news cards and panel dynamically triggered by Neha's `show_news` tool.
- **Smart Notepad & Data Collection**: Live-synced on-screen notepad updated in real time via Neha's `write_to_notepad` tool to save notes and collected data.
- **Real-Time Voice & WebRTC**: Built on `@livekit/components-react` with live audio visualization (Aura), live transcripts, and controls.

## Setup & Running

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Configure environment variables**:
   Create `.env.local`:
   ```bash
   cp .env.example .env.local
   ```
   Add your LiveKit server credentials:
   ```env
   LIVEKIT_URL=wss://your-project.livekit.cloud
   LIVEKIT_API_KEY=your_key
   LIVEKIT_API_SECRET=your_secret
   AGENT_NAME=livesearch-agent
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.
