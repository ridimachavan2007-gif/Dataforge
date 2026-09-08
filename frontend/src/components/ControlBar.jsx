import { Mic, MicOff, PhoneOff } from 'lucide-react'

export default function ControlBar({ micEnabled, onToggleMic, onEnd }) {
  return (
    <div className="control-bar">
      <button
        type="button"
        className="control-button"
        data-active={micEnabled}
        onClick={onToggleMic}
        aria-label={micEnabled ? 'Mute microphone' : 'Unmute microphone'}
      >
        {micEnabled ? <Mic size={20} /> : <MicOff size={20} />}
      </button>
      <button
        type="button"
        className="control-button control-button--end"
        onClick={onEnd}
        aria-label="End conversation"
      >
        <PhoneOff size={20} />
      </button>
    </div>
  )
}
