# Aura — frontend

Voice-native, bilingual (English/Hindi) assistant frontend, built for the
DataForge 2026 hackathon (Rime Track). Talks to a LiveKit Agents backend
named `switchvoice`.

This was built **before backend integration was finished**, based on:
- A demo video of the agent working in LiveKit's Agent Console
- The backend dev's notes on `agent.py` (`agent_name="switchvoice"`,
  explicit dispatch)
- LiveKit's current, verified SDK docs (checked against the actual
  installed package versions — not guessed)

It hasn't been run against the real backend yet. Expect to spend time on
the "Known open items" list below once you merge — that's expected, not
a sign something's wrong with either side.

## Setup

```bash
npm install
cp .env.example .env.local
```

Then fill in **one** of these in `.env.local`, whichever your backend dev
has ready:

- `VITE_LIVEKIT_TOKEN_SERVER_ID` — LiveKit Cloud's token server (Project
  Settings → "Token server" toggle → copy the ID). Confirm with her this
  still works on your project — see the note below.
- `VITE_LIVEKIT_TOKEN_ENDPOINT` — her real backend's token URL, once she's
  deployed one. Must follow LiveKit's standard endpoint contract: POST
  with optional `room_name`/`participant_identity`/`room_config`, response
  `{ server_url, participant_token }`.

You do not need to touch any other file to switch between these two — see
`src/config.js`.

```bash
npm run dev
```

Open on **localhost** or **HTTPS** — mic access silently fails otherwise.

## About the "sandbox shut down" report

LiveKit's docs currently describe the **Sandbox** feature (full hosted
prototype apps, e.g. `lk sandbox`) as deprecated. The **token server**
this project uses (`TokenSource.developmentTokenServer`) is documented
separately as still supported, as a standalone Project Settings toggle.
It's possible what your backend dev hit was the old Sandbox flow, or a
real outage on LiveKit's side, or the token server toggle really has been
pulled from your project — worth a two-minute check together rather than
assuming. Either way, this frontend doesn't hard-depend on it: flip to
`VITE_LIVEKIT_TOKEN_ENDPOINT` the moment she has a real backend URL.

## Known open items (expect to resolve these together after merging)

- **Agent dispatch name** — hardcoded as `"switchvoice"` in `src/config.js`
  from her `agent.py`. If she renames the agent, update it there.
- **Room naming** — currently one random room per browser tab
  (`aura-<uuid>`). Not discussed as a team; change in `config.js` if you
  want a different scheme (e.g. per logged-in user).
- **Language-based orb tinting** — `LANGUAGE_ATTRIBUTE_KEY` in
  `config.js` is `null` until you confirm whether/how the agent exposes
  detected language as a participant attribute. The orb works fine
  without it (state-based color only); this is a nice-to-have layered on
  top.
- **Transcript source** — assumes the agent sends live transcription via
  LiveKit's standard transcription messages (`userTranscript` /
  `agentTranscript`). If her agent pipeline doesn't have transcription
  forwarding enabled, the orb/audio will work but the transcript panel
  will stay empty — ask her to confirm this is turned on.
- **Token endpoint contract**, once she builds a real one — must return
  `server_url` + `participant_token` (snake_case, per LiveKit's
  standard). If her endpoint returns different field names, only
  `src/config.js`'s `TokenSource.endpoint(...)` call needs to change.
- **This has never been run against a live agent.** First integration
  test will surface real bugs — that's expected, not a sign the code is
  wrong.

## What's NOT built (removed on purpose, replaced by LiveKit)

The previous version of this frontend used `MediaRecorder` +
browser `SpeechSynthesis` + REST calls (`api.js`, `useVoiceRecorder.js`,
`useSpeak.js`). All of that is gone — LiveKit's SDK handles mic
publishing, live audio playback, and (if enabled on the agent side)
transcription natively. Don't re-add those files.

## Project structure

```
src/
  config.js              — the ONE file to edit as backend details change
  App.jsx                — session lifecycle (connect/start/end/mic toggle)
  components/
    ConnectScreen.jsx     — pre-call screen
    VoiceOrb.jsx           — breathing state visualizer
    Transcript.jsx        — live captions
    ControlBar.jsx        — mic mute / end call
  styles/index.css        — design system (see comments for the palette)
```
