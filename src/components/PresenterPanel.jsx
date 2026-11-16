import { Button } from './Button.jsx';
import { ArrowLeftIcon, ArrowRightIcon } from './Icons.jsx';

function Row({ label, children }) {
  return (
    <div>
      <p className="text-xs font-semibold tracking-wide text-ink-subtle uppercase">{label}</p>
      <p className="mt-1 text-lg leading-snug">{children}</p>
    </div>
  );
}

function Key({ children }) {
  return (
    <kbd className="rounded-md border border-line bg-surface px-1.5 py-0.5 font-sans text-xs font-semibold text-ink">
      {children}
    </kbd>
  );
}

// Sits beside the phone on desktop. Tells the room where we are and why it matters.
export function PresenterPanel({ flow, step, position, onNext, onBack, canGoBack, isLast }) {
  return (
    <aside className="hidden h-[min(820px,calc(100dvh-6.5rem))] w-[380px] shrink-0 flex-col gap-5 overflow-y-auto rounded-card border border-line bg-surface p-6 shadow-card lg:flex">
      <div>
        <p className="text-sm font-semibold text-ink-muted">
          Prototype {flow.number} · Lead: {flow.lead}
        </p>
        <p className="mt-3 text-sm font-semibold text-ink-subtle">{position}</p>
        <h2 className="text-3xl leading-tight font-bold tracking-tight">{step.title}</h2>
      </div>

      <Row label="Barrier addressed">{flow.barrier}</Row>
      <Row label="Metric this step moves">{step.metric}</Row>
      {step.note && (
        <div className="rounded-control bg-surface-muted p-3.5 text-sm leading-relaxed text-ink-muted">
          {step.note}
        </div>
      )}

      <div className="mt-auto space-y-3 border-t border-line pt-4">
        <div className="flex gap-2">
          <Button variant="secondary" size="md" onClick={onBack} disabled={!canGoBack}>
            <ArrowLeftIcon size={18} /> Back
          </Button>
          <Button size="md" onClick={onNext} disabled={isLast}>
            Next <ArrowRightIcon size={18} />
          </Button>
        </div>
        <p className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs text-ink-muted">
          <span>
            <Key>←</Key> <Key>→</Key> step
          </span>
          <span>
            <Key>R</Key> restart
          </span>
          <span>
            <Key>H</Key> home
          </span>
        </p>
      </div>
    </aside>
  );
}
