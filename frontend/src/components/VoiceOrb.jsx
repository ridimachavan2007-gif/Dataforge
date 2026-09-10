
import { BarVisualizer, useAgent } from '@livekit/components-react'

const STATE_LABELS = {
  connecting: 'Connecting…',
  'pre-connect-buffering': 'Connecting…',
  initializing: 'Getting ready…',
  idle: 'Ready when you are',
  listening: 'Listening',
  thinking: 'Thinking',
  speaking: 'Speaking',
  failed: "Couldn't reach Aura — try again",
  disconnected: 'Ended'
}
function formatLabel(state, languageLabel) {
  if (languageLabel) {
    if (state === 'speaking') return `Speaking in ${languageLabel}`
    if (state === 'listening') return `Listening in ${languageLabel}`
  }

  return STATE_LABELS[state] ?? ''
}

export default function VoiceOrb({ session, languageLabel }) {
  const agent = useAgent(session)

  return (
    <>
      <div className="voice-orb" data-state={agent.state}>
        <div className="voice-orb__ring" />
       
      <div className="voice-orb__mark" aria-label="Aura logo">
  <svg viewBox="0 0 200 200">
    <g
      fill="none"
      stroke="#9bb4d3"
      strokeWidth="7"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M48 145 C65 122 70 75 100 48 C130 75 135 122 152 145" />
      <path d="M32 112 C62 135 82 100 105 92 C128 84 145 104 168 112" />
      <path d="M45 145 C62 151 75 136 84 121" />
      <path d="M116 93 C125 108 135 128 153 145" />
      <circle cx="100" cy="93" r="11" />
      <circle cx="100" cy="93" r="4" fill="#d8e8fa" stroke="none" />
    </g>
  </svg>
</div>
        <div className="voice-orb__bars">
          <BarVisualizer
            state={agent.state}
            track={agent.microphoneTrack}
            barCount={5}
            className="orb-bars"
          />
        </div>
      </div>
      <p className="state-label">{formatLabel(agent.state, languageLabel)}</p>
    </>
  )
}