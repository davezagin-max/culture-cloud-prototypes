export function Card({ className = '', children, ...rest }) {
  return (
    <div
      className={`rounded-card border border-line bg-surface p-4 shadow-card ${className}`}
      {...rest}
    >
      {children}
    </div>
  );
}

// A quieter panel for status messages inside a screen.
export function Notice({ tone = 'muted', icon, title, children, className = '' }) {
  const tones = {
    muted: 'bg-surface-muted text-ink',
    success: 'bg-success-soft text-ink',
    attention: 'bg-attention-soft text-ink',
  };
  const iconTones = {
    muted: 'text-ink-muted',
    success: 'text-success',
    attention: 'text-attention',
  };
  return (
    <div className={`flex gap-3 rounded-card p-4 ${tones[tone]} ${className}`}>
      {icon && <span className={`mt-0.5 shrink-0 ${iconTones[tone]}`}>{icon}</span>}
      <div className="min-w-0">
        {title && <p className="text-sm font-semibold">{title}</p>}
        {children && <div className="text-sm text-ink-muted">{children}</div>}
      </div>
    </div>
  );
}

export function Pill({ tone = 'muted', className = '', children }) {
  const tones = {
    muted: 'bg-surface-muted text-ink-muted',
    strong: 'bg-primary text-on-primary',
  };
  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1 rounded-pill px-2.5 py-1 text-xs font-medium ${tones[tone]} ${className}`}
    >
      {children}
    </span>
  );
}
