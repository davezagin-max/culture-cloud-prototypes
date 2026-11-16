import { useCallback, useState } from 'react';

// Keeps a history of step ids so "back" retraces the path actually taken,
// including side paths like "write a message instead".
export function useFlow(firstStep) {
  const [history, setHistory] = useState([firstStep]);
  const stepId = history[history.length - 1];

  const goTo = useCallback(
    (id) => setHistory((h) => (h[h.length - 1] === id ? h : [...h, id])),
    [],
  );
  const back = useCallback(
    () => setHistory((h) => (h.length > 1 ? h.slice(0, -1) : h)),
    [],
  );

  return { stepId, goTo, back, canGoBack: history.length > 1 };
}
