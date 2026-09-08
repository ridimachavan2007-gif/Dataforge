import { useEffect, useRef } from 'react'
import { useSessionMessages } from '@livekit/components-react'

export default function Transcript({ session }) {
  const { messages } = useSessionMessages(session)
  const endRef = useRef(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [messages.length])

  if (!messages.length) {
    return <p className="transcript-empty">Your conversation will appear here as you talk.</p>
  }

  return (
    <div className="transcript">
      {messages.map((msg) => {
        const isAgent = msg.from?.isAgent ?? msg.type === 'agentTranscript'
        const text = msg.message ?? ''
        if (!text) return null

        return (
          <p
            key={msg.id}
            className={`transcript-line ${isAgent ? 'transcript-line--agent' : 'transcript-line--user'}`}
          >
            <span className="speaker">{isAgent ? 'Aura' : 'You'}</span>
            {text}
          </p>
        )
      })}
      <div ref={endRef} />
    </div>
  )
}
