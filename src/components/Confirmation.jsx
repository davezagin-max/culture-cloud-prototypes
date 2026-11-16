import { persona } from '../data/mockData.js';
import { Button } from './Button.jsx';
import { CheckIcon } from './Icons.jsx';
import { AppHeader, Screen } from './Screen.jsx';

// The one confirmation screen all three flows end on.
// `children` is a slot for what is special about a flow (drawing entry, tap count).
// It sits above the post so it stays visible on short screens.
export function Confirmation({ title, sub, post, children, primary, secondary }) {
  return (
    <Screen
      header={<AppHeader viewer={persona} />}
      footer={
        <>
          <Button onClick={primary.onClick}>{primary.label}</Button>
          {secondary && (
            <Button variant="secondary" onClick={secondary.onClick}>
              {secondary.label}
            </Button>
          )}
        </>
      }
    >
      <div className="flex flex-col items-center pb-4 text-center">
        <span className="flex h-14 w-14 animate-pop items-center justify-center rounded-pill bg-success-soft text-success">
          <CheckIcon size={30} strokeWidth={2.5} />
        </span>
        <h1 className="mt-3 text-2xl font-bold tracking-tight">{title}</h1>
        {sub && <p className="mt-1 text-sm text-ink-muted">{sub}</p>}
      </div>
      <div className="space-y-3">
        {children}
        {post}
      </div>
    </Screen>
  );
}
