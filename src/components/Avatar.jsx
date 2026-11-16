const tints = {
  1: 'bg-avatar-1',
  2: 'bg-avatar-2',
  3: 'bg-avatar-3',
  4: 'bg-avatar-4',
  5: 'bg-avatar-5',
  6: 'bg-avatar-6',
};

const sizes = {
  sm: 'h-8 w-8 text-xs',
  md: 'h-11 w-11 text-sm',
  lg: 'h-16 w-16 text-xl',
  xl: 'h-24 w-24 text-3xl',
};

function initials(name) {
  return name
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('');
}

export function Avatar({ person, size = 'md', className = '' }) {
  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center rounded-pill font-semibold text-ink ${tints[person.tint] || tints[1]} ${sizes[size]} ${className}`}
      aria-hidden="true"
    >
      {initials(person.name)}
    </span>
  );
}
