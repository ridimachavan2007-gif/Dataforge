export default function ConnectScreen({ onStart, connecting, error, disabled, disabledReason }) {
  return (
    <div className="connect-screen">
      <div className="orb-wrap" data-state="idle">
        <div className="orb-glow" />
        <div className="orb-core" />
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
