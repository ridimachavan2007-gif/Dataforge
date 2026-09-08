# Aura — Frontend

The frontend for **Aura (SwitchVoice)**, a voice-native English/Hindi AI assistant developed for the **DataForge 2026 — Rime Track**.

The frontend provides the browser interface for connecting to the LiveKit voice agent, using the microphone, receiving AI voice responses, viewing conversation information, and controlling the voice session.

## Features

- React + Vite frontend
- LiveKit voice session
- Browser microphone input
- Real-time AI voice response
- English/Hindi conversation support
- Voice activity visualization
- Conversation transcript interface
- Microphone mute/unmute control
- End-call control
- Aura voice-assistant interface

## Technology

- React
- Vite
- JavaScript
- LiveKit Client
- LiveKit React Components
- CSS

## Project Structure

```text
frontend/
│
├── src/
│   ├── components/
│   │   ├── ConnectScreen.jsx
│   │   ├── VoiceOrb.jsx
│   │   ├── Transcript.jsx
│   │   └── ControlBar.jsx
│   │
│   ├── App.jsx
│   ├── config.js
│   ├── main.jsx
│   └── styles/
│       └── index.css
│
├── public/
├── .env.example
├── .gitignore
├── index.html
├── package.json
├── package-lock.json
└── vite.config.js
