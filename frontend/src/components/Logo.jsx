export default function Logo() {
  return (
    <div className="aura-logo" role="img" aria-label="Aura logo">
      <div className="aura-logo__ring" />
      <svg viewBox="0 0 200 200" className="aura-logo__svg">
        <path
          d="M40 150 C 55 90, 75 60, 100 45 C 125 60, 145 90, 160 150"
          fill="none"
          stroke="#e2e8f0"
          strokeWidth="10"
          strokeLinecap="round"
          className="aura-logo__mark"
        />
        <path
          d="M68 118 C 85 106, 115 106, 132 118"
          fill="none"
          stroke="#e2e8f0"
          strokeWidth="10"
          strokeLinecap="round"
          className="aura-logo__mark"
        />
      </svg>
    </div>
  )
}