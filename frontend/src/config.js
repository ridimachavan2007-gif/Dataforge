// ── Everything about how the frontend reaches the backend lives here. ──
//
// RIGHT NOW (backend not deployed yet):
// Your backend developer suggested LiveKit's hosted development token
// server, which needs zero backend code from her side to get you testing
// today. To use it:
//
//   1. Open your LiveKit Cloud project → Settings
//   2. Find the "Token server" toggle, switch it on
//   3. Copy the "sandbox ID" shown underneath it
//   4. Put it in a .env.local file (see .env.example) as:
//        VITE_LIVEKIT_TOKEN_SERVER_ID=your-id-here
//
// LATER (once she deploys a real backend):
// She'll give you a URL implementing LiveKit's standard token-endpoint
// contract (POST room_name/participant_identity → { server_url,
// participant_token }). When you have it, put it in .env.local as:
//        VITE_LIVEKIT_TOKEN_ENDPOINT=https://her-backend.com/api/livekit-token
//
// You do NOT need to change any other file for that switch — see
// App.jsx, which picks whichever of the two is set.

export const LIVEKIT_CONFIG = {
  developmentTokenServerId: import.meta.env.VITE_LIVEKIT_TOKEN_SERVER_ID || '',
  endpointUrl: import.meta.env.VITE_LIVEKIT_TOKEN_ENDPOINT || '',

  // Confirmed from the backend's agent.py: @server.rtc_session(agent_name="switchvoice")
  // Because this uses EXPLICIT dispatch, this name must be sent with every
  // token request or the agent will never join the room.
  agentName: 'switchvoice',

  // Not fixed by the backend yet — one room per browser tab/session is the
  // simplest correct default for a 1:1 voice assistant. Change here only.
  makeRoomName: () => `aura-${crypto.randomUUID()}`
}

// If your teammate confirms the agent publishes its detected language as a
// participant attribute (e.g. attributes.language === "hi" | "en"), put the
// exact key name here and VoiceOrb will tint itself by language on top of
// its state-based color. Leave as null until confirmed — nothing breaks
// either way, the orb just won't language-tint yet.
export const LANGUAGE_ATTRIBUTE_KEY = null
