import { useEffect, useRef } from 'react'
import { useSession, useSessionMessages, RoomAudioRenderer } from '@livekit/components-react'

export default function Transcript({ session, localMessages = [] }) {
  const { messages } = useSessionMessages(session)

  const transcriptRef = useRef(null)
  const endRef = useRef(null)
  const shouldAutoScroll = useRef(true)

  const handleScroll = () => {
    const container = transcriptRef.current

    if (!container) return

    const distanceFromBottom =
      container.scrollHeight -
      container.scrollTop -
      container.clientHeight

    shouldAutoScroll.current = distanceFromBottom < 100
  }

  useEffect(() => {
    if (shouldAutoScroll.current) {
      endRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'end',
      })
    }
  }, [messages.length, localMessages.length])

  const allMessages = [
    ...localMessages.map((text, index) => ({
      id: `local-${index}`,
      message: text,
      isLocal: true,
    })),
    ...messages,
  ]

  if (!allMessages.length) {
    return (
      <p className="transcript-empty">
        Your conversation will appear here as you talk.
      </p>
    )
  }

  return (
    <div
      ref={transcriptRef}
      className="transcript"
      onScroll={handleScroll}
    >
      {allMessages.map((msg) => {
        const isAgent = msg.isLocal
          ? false
          : msg.from?.isAgent ?? msg.type === 'agentTranscript'

        const text = msg.message ?? ''

        if (!text) return null

        return (
          <p
            key={msg.id}
            className={`transcript-line ${
              isAgent
                ? 'transcript-line--agent'
                : 'transcript-line--user'
            }`}
          >
            <span className="speaker">
              {isAgent ? 'Aura' : 'You'}
            </span>

            {text}
          </p>
        )
      })}

      <div ref={endRef} />
    </div>
  )
}