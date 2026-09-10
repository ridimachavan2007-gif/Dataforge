import { useMemo, useRef, useState } from 'react'
import { TokenSource, ConnectionState } from 'livekit-client'
import {
  useSession,
  useSessionMessages,
  RoomAudioRenderer,
} from '@livekit/components-react'

import { LIVEKIT_CONFIG, LANGUAGE_ATTRIBUTE_KEY } from './config'
import ConnectScreen from './components/ConnectScreen'
import VoiceOrb from './components/VoiceOrb'
import Transcript from './components/Transcript'
import ControlBar from "./components/ControlBar"


export default function App() {
  const [micEnabled, setMicEnabled] = useState(true)
  const [connecting, setConnecting] = useState(false)
  const [errorMessage, setErrorMessage] = useState(null)

  const roomNameRef = useRef(null)

  if (!roomNameRef.current) {
    roomNameRef.current = LIVEKIT_CONFIG.makeRoomName()
  }

  const configMissing =
    !LIVEKIT_CONFIG.developmentTokenServerId &&
    !LIVEKIT_CONFIG.endpointUrl

  const tokenSource = useMemo(() => {
    if (configMissing) {
      return TokenSource.literal({
        serverUrl: '',
        participantToken: '',
      })
    }

    return LIVEKIT_CONFIG.endpointUrl
      ? TokenSource.endpoint(LIVEKIT_CONFIG.endpointUrl)
      : TokenSource.developmentTokenServer(
          LIVEKIT_CONFIG.developmentTokenServerId
        )
  }, [configMissing])

  const session = useSession(tokenSource, {
    roomName: roomNameRef.current,
    agentName: LIVEKIT_CONFIG.agentName,
  })

  const { send: sendChatMessage } = useSessionMessages(session)

  const started =
    session.connectionState !== ConnectionState.Disconnected

  const handleStart = async () => {
    setErrorMessage(null)
    setConnecting(true)

    try {
      await session.start()
    } catch (err) {
      setErrorMessage(
        err?.message ||
          "Couldn't connect to Aura. Check your setup and try again."
      )
    } finally {
      setConnecting(false)
    }
  }

  const handleEnd = async () => {
    await session.end()
    roomNameRef.current = LIVEKIT_CONFIG.makeRoomName()
  }

  const handleToggleMic = () => {
    const next = !micEnabled

    setMicEnabled(next)

    session.room?.localParticipant?.setMicrophoneEnabled(next)
  }

  const handleSendText = async (text) => {
    const message = text.trim()

    if (!message) return

    await sendChatMessage(message)
  }

  const languageLabel = useMemo(() => {
    if (!LANGUAGE_ATTRIBUTE_KEY) return undefined

    return session.room?.remoteParticipants
      ? [...session.room.remoteParticipants.values()][0]?.attributes?.[
          LANGUAGE_ATTRIBUTE_KEY
        ]
      : undefined
  }, [session.room])

  return (
    <div className="app-shell">
    

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
          <VoiceOrb
            session={session}
            languageLabel={languageLabel}
          />

          <Transcript session={session} />

          <RoomAudioRenderer room={session.room} />
        </div>
      )}

      {started && (
        <ControlBar
          micEnabled={micEnabled}
          onToggleMic={handleToggleMic}
          onEnd={handleEnd}
          onSendText={handleSendText}
        />
      )}
    </div>
  )
}