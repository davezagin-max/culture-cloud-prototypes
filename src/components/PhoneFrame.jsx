import { shift } from '../data/mockData.js';

// On a laptop or projector: a phone-shaped frame. On a real phone: no frame,
// the screen just fills the browser.
export function PhoneFrame({ children }) {
  return (
    <div className="relative flex min-h-0 w-full flex-1 flex-col overflow-hidden bg-surface md:h-[min(820px,calc(100dvh-6.5rem))] md:w-[390px] md:flex-none md:rounded-[46px] md:border-[10px] md:border-night md:shadow-device">
      <div className="hidden h-9 shrink-0 items-center justify-between bg-surface px-7 text-xs font-semibold md:flex">
        <span>{shift.statusBarTime}</span>
        <span className="flex items-center gap-1.5" aria-hidden="true">
          <span className="flex items-end gap-0.5">
            <i className="block h-1.5 w-1 rounded-sm bg-ink" />
            <i className="block h-2 w-1 rounded-sm bg-ink" />
            <i className="block h-2.5 w-1 rounded-sm bg-ink" />
            <i className="block h-3 w-1 rounded-sm bg-ink-subtle" />
          </span>
          <span className="relative block h-3 w-6 rounded-[4px] border border-ink">
            <i className="absolute inset-y-0.5 left-0.5 block w-2 rounded-[2px] bg-ink" />
          </span>
        </span>
      </div>
      <div className="relative min-h-0 flex-1">{children}</div>
    </div>
  );
}
