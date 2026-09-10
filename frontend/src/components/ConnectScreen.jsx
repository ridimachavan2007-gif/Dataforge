export default function ConnectScreen({ onStart, connecting, error, disabled, disabledReason }) {
  return (
    <div className="connect-screen">
      <div className="orb-wrap" data-state="idle">
        <div className="orb-glow" />
        <div className="orb-core">
  <div className="connect-logo" aria-label="Aura logo">
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
</div>
      </div>

      <div>
        <h1>Aura</h1>
        <p>One voice, two languages. Talk in English or Hindi — switch mid-sentence, she'll follow.</p>
      </div>

      {error && <p className="status-banner">{error}</p>}
      {disabled && disabledReason && <p className="status-banner">{disabledReason}</p>}

      <button
        type="button"
        className="connect-button"
        onClick={onStart}
        disabled={connecting || disabled}
      >
        {connecting ? 'Connecting…' : 'Start talking'}
      </button>
    </div>
  )
}
