import { useEffect, useRef } from 'react';
import { copy } from '../data/mockData.js';
import { navigate } from '../lib/useHashRoute.js';
import { HomeIcon, RestartIcon } from './Icons.jsx';
import { PhoneFrame } from './PhoneFrame.jsx';
import { PresenterPanel } from './PresenterPanel.jsx';

function isTyping(target) {
  return (
    target instanceof HTMLElement &&
    (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)
  );
}

// The stage every flow is presented on: top bar (home, restart), the phone,
// the presenter panel, and the keyboard shortcuts.
export function FlowShell({
  flow,
  stepId,
  onNext,
  onBack,
  onRestart,
  canGoBack,
  endSteps = [], // side-path steps with nothing after them
  children,
}) {
  const mainIndex = flow.steps.findIndex((s) => s.id === stepId);
  const onMainPath = mainIndex !== -1;
  const step = onMainPath ? flow.steps[mainIndex] : flow.sideSteps.find((s) => s.id === stepId);
  const isLast = onMainPath ? mainIndex === flow.steps.length - 1 : endSteps.includes(stepId);
  const position = onMainPath ? `Step ${mainIndex + 1} of ${flow.steps.length}` : 'Side path';

  // Keep the latest handlers in a ref so the key listener is attached once.
  const handlers = useRef({});
  handlers.current = { onNext, onBack, onRestart };

  useEffect(() => {
    function onKey(e) {
      if (e.metaKey || e.ctrlKey || e.altKey || isTyping(e.target)) return;
      const key = e.key.toLowerCase();
      if (key === 'arrowright') {
        e.preventDefault();
        handlers.current.onNext();
      } else if (key === 'arrowleft') {
        e.preventDefault();
        handlers.current.onBack();
      } else if (key === 'r') {
        handlers.current.onRestart();
      } else if (key === 'h' || key === 'escape') {
        navigate('/');
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <div className="flex h-dvh flex-col bg-canvas">
      <div className="flex h-12 shrink-0 items-center justify-between gap-2 border-b border-line bg-surface px-3 md:h-14 md:border-0 md:bg-transparent md:px-8">
        <button
          type="button"
          onClick={() => navigate('/')}
          className="inline-flex min-h-10 items-center gap-1.5 rounded-control px-2 text-sm font-semibold text-ink-muted hover:bg-surface-muted hover:text-ink md:hover:bg-surface"
        >
          <HomeIcon size={18} /> {copy.home}
        </button>

        <div className="flex min-w-0 flex-col items-center">
          <p className="truncate text-sm font-semibold">
            {flow.number}. {flow.name}
          </p>
          <div className="mt-1 flex gap-1" aria-label={position}>
            {flow.steps.map((s, i) => (
              <span
                key={s.id}
                className={`h-1 w-5 rounded-pill ${onMainPath && i <= mainIndex ? 'bg-primary' : 'bg-line'}`}
              />
            ))}
          </div>
        </div>

        <button
          type="button"
          onClick={onRestart}
          className="inline-flex min-h-10 items-center gap-1.5 rounded-control px-2 text-sm font-semibold text-ink-muted hover:bg-surface-muted hover:text-ink md:hover:bg-surface"
        >
          <RestartIcon size={18} /> {copy.restart}
        </button>
      </div>

      <div className="flex min-h-0 flex-1 justify-center md:items-center md:gap-10 md:px-8 md:pb-6">
        <PhoneFrame>{children}</PhoneFrame>
        <PresenterPanel
          flow={flow}
          step={step}
          position={position}
          onNext={onNext}
          onBack={onBack}
          canGoBack={canGoBack}
          isLast={isLast}
        />
      </div>
    </div>
  );
}
