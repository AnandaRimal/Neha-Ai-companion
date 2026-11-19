# Neha – Your Personal AI Companion — Backend 🎙️✨

Dedicated LiveKit Voice AI Agent backend running **Neha – Your Personal AI Companion**.

## Overview

Neha is a warm AI friend and intellectual partner powered by **LiveKit Agents** and **Google Gemini Realtime**. She can:
- Talk like a genuine friend in Nepali and English whenever you feel alone or want someone to talk to
- Brainstorm creative ideas, solve problems, and explore new concepts together
- Search the web for verified facts and real-time information via Tavily
- Fetch and display news cards
- Collect data and write notes directly onto the user's on-screen smart notepad
- Speak with natural, low-latency conversational voice responses

## Setup Instructions

1. **Create and activate a virtual environment (recommended)**:
   ```bash
   # Windows (PowerShell)
   python -m venv .venv
   .venv\Scripts\activate

   # macOS / Linux
   python3 -m venv .venv
   source .venv/bin/activate
   ```

2. **Install Python dependencies**:
   ```bash
   pip install --upgrade pip
   pip install -r requirements.txt
   ```

3. **Configure environment variables**:
   Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```
   Provide your:
   - `LIVEKIT_URL`
   - `LIVEKIT_API_KEY`
   - `LIVEKIT_API_SECRET`
   - `TAVILY_API_KEY`
   - `GOOGLE_API_KEY`

4. **Run the agent in development mode**:
   ```bash
   python livesearch.py dev
   ```
