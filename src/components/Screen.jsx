import { project } from '../data/mockData.js';
import { Avatar } from './Avatar.jsx';

// The header every in-app screen shares. A plain text label stands in for the logo.
export function AppHeader({ label = project.productLabel, viewer, right }) {
  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-line bg-surface px-5">
      <span className="text-base font-bold tracking-tight">{label}</span>
      <span className="flex items-center gap-2">
        {right}
        {viewer && <Avatar person={viewer} size="sm" />}
      </span>
    </header>
  );
}

// Strip that says whose phone we are looking at when it is not the persona's.
export function ViewingAs({ person, as }) {
  return (
    <div className="shrink-0 bg-attention-soft px-5 py-1.5 text-center text-xs font-medium text-attention">
      Now on {person.name}’s phone · {as}
    </div>
  );
}

// Standard screen layout: fixed header, scrolling body, pinned footer for actions.
export function Screen({ header, children, footer, bodyClassName = '' }) {
  return (
    <div className="flex h-full flex-col bg-surface">
      {header}
      <div className={`min-h-0 flex-1 overflow-y-auto px-5 py-5 ${bodyClassName}`}>{children}</div>
      {footer && (
        <div className="shrink-0 space-y-2 border-t border-line bg-surface px-5 pt-3 pb-[max(1rem,env(safe-area-inset-bottom))]">
          {footer}
        </div>
      )}
    </div>
  );
}

export function ScreenTitle({ title, sub }) {
  return (
    <div className="mb-4">
      <h1 className="text-2xl leading-tight font-bold tracking-tight">{title}</h1>
      {sub && <p className="mt-1 text-sm text-ink-muted">{sub}</p>}
    </div>
  );
}
