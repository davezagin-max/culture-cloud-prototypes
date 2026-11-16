const variants = {
  primary:
    'bg-primary text-on-primary hover:bg-primary-hover disabled:bg-line disabled:text-ink-subtle',
  secondary:
    'border border-line bg-surface text-ink hover:bg-surface-muted disabled:text-ink-subtle',
  quiet: 'text-ink-muted underline decoration-line underline-offset-4 hover:text-ink',
};

const sizes = {
  lg: 'min-h-13 px-5 text-base',
  md: 'min-h-11 px-4 text-sm',
  sm: 'min-h-9 px-3 text-sm',
};

export function Button({
  variant = 'primary',
  size = 'lg',
  full = true,
  className = '',
  children,
  ...rest
}) {
  return (
    <button
      type="button"
      className={`inline-flex items-center justify-center gap-2 rounded-control font-semibold transition-colors ${variants[variant]} ${sizes[size]} ${full ? 'w-full' : ''} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}
