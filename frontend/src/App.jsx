import { useMemo, useRef, useState } from 'react'
import { TokenSource, ConnectionState } from 'livekit-client'
import { useSession, RoomAudioRenderer } from '@livekit/components-react'
import { LIVEKIT_CONFIG, LANGUAGE_ATTRIBUTE_KEY } from './config'
import ConnectScreen from './components/ConnectScreen'
import VoiceOrb from './components/VoiceOrb'
import Transcript from './components/Transcript'
import ControlBar from './components/ControlBar'

export default function App() {
  const [micEnabled, setMicEnabled] = useState(true)
  const [connecting, setConnecting] = useState(false)
  const [errorMessage, setErrorMessage] = useState(null)

  const roomNameRef = useRef(null)
  if (!roomNameRef.current) {
    roomNameRef.current = LIVEKIT_CONFIG.makeRoomName()
  }

  const configMissing =
    !LIVEKIT_CONFIG.developmentTokenServerId && !LIVEKIT_CONFIG.endpointUrl

  // Stable for the lifetime of the app — created once, not per render.
  // (Falls back to a harmless placeholder if env vars aren't set yet, so
  // the hook always has something valid to hold — the Start button stays
  // disabled in that case, see configMissing below.)
  const tokenSource = useMemo(() => {
    if (configMissing) return TokenSource.literal({ serverUrl: '', participantToken: '' })
    return LIVEKIT_CONFIG.endpointUrl
      ? TokenSource.endpoint(LIVEKIT_CONFIG.endpointUrl)
      : TokenSource.developmentTokenServer(LIVEKIT_CONFIG.developmentTokenServerId)
  }, [configMissing])

  const session = useSession(tokenSource, {
    roomName: roomNameRef.current,
    agentName: LIVEKIT_CONFIG.agentName,
    tracks: { microphone: { enabled: true } }
  })

  const started = session.connectionState !== ConnectionState.Disconnected

  const handleStart = async () => {
    setErrorMessage(null)
    setConnecting(true)
    try {
      await session.start()
    } catch (err) {
      setErrorMessage(err?.message || "Couldn't connect to Aura. Check your setup and try again.")
    } finally {
      setConnecting(false)
    }
  }

  const handleEnd = async () => {
    await session.end()
    roomNameRef.current = LIVEKIT_CONFIG.makeRoomName() // fresh room for next session
  }

  const handleToggleMic = () => {
    const next = !micEnabled
    setMicEnabled(next)
    session.room?.localParticipant?.setMicrophoneEnabled(next)
  }

  const languageLabel = useMemo(() => {
    if (!LANGUAGE_ATTRIBUTE_KEY) return undefined
    return session.room?.remoteParticipants
      ? [...session.room.remoteParticipants.values()][0]?.attributes?.[LANGUAGE_ATTRIBUTE_KEY]
      : undefined
  }, [session.room])

  return (
    <div className="app-shell">
      <div className="wordmark">Aura</div>

      {!started ? (
        <ConnectScreen
          onStart={handleStart}
          connecting={connecting}
          error={errorMessage}
          disabled={configMissing}
          disabledReason={
            configMissing
              ? 'Set VITE_LIVEKIT_TOKEN_SERVER_ID (or VITE_LIVEKIT_TOKEN_ENDPOINT) in .env.local — see .env.example.'
              : null
          }
        />
      ) : (
        <div className="stage">
          <VoiceOrb session={session} languageLabel={languageLabel} />
          <Transcript session={session} />
          <RoomAudioRenderer room={session.room} />
        </div>
      )}

      {started && (
        <ControlBar micEnabled={micEnabled} onToggleMic={handleToggleMic} onEnd={handleEnd} />
      )}
    </div>
  )
}
