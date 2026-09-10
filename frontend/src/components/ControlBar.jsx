import { useState } from 'react'
import { Mic, MicOff, PhoneOff, Send } from 'lucide-react'

export default function ControlBar({
  micEnabled,
  onToggleMic,
  onEnd,
  onSendText,
}) {
  const [text, setText] = useState('')
  const [sending, setSending] = useState(false)

  const handleSend = async () => {
    const message = text.trim()

    if (!message || sending) return

    try {
      setSending(true)
      await onSendText(message)
      setText('')
    } catch (error) {
      console.error('Failed to send text:', error)
    } finally {
      setSending(false)
    }
  }

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="control-bar">
      <div className="text-input-container">
        <input
          type="text"
          value={text}
          onChange={(event) => setText(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
          aria-label="Type a message"
          disabled={sending}
        />

        <button
          type="button"
          className="text-send-button"
          onClick={handleSend}
          disabled={!text.trim() || sending}
          aria-label="Send message"
          title="Send message"
        >
          <Send size={18} />
        </button>
      </div>

      <button
        type="button"
        className="control-button"
        data-active={micEnabled}
        onClick={onToggleMic}
        aria-label={
          micEnabled ? 'Mute microphone' : 'Unmute microphone'
        }
        title={micEnabled ? 'Mute microphone' : 'Unmute microphone'}
      >
        {micEnabled ? <Mic size={20} /> : <MicOff size={20} />}
      </button>

      <button
        type="button"
        className="control-button control-button--end"
        onClick={onEnd}
        aria-label="End conversation"
        title="End conversation"
      >
        <PhoneOff size={20} />
      </button>
    </div>
  )
}