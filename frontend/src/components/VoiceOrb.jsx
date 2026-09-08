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

// languageLabel is optional — see LANGUAGE_ATTRIBUTE_KEY in config.js.
// Until that's confirmed with the backend, this is always undefined and
// the orb still works fine on state alone.
function formatLabel(state, languageLabel) {
  if (state === 'speaking' && languageLabel) {
    return `Speaking in ${languageLabel}`
  }
  return STATE_LABELS[state] ?? ''
}

export default function VoiceOrb({ session, languageLabel }) {
  const agent = useAgent(session)

  return (
    <>
      <div className="orb-wrap" data-state={agent.state}>
        <div className="orb-glow" />
        <div className="orb-core">
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
