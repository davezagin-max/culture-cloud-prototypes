import { useEffect, useState } from 'react';

// Hash-based routing: "#/qr/form" -> ['qr', 'form'].
function read() {
  return window.location.hash.replace(/^#\/?/, '').split('/').filter(Boolean);
}

export function useHashRoute() {
  const [parts, setParts] = useState(read);
  useEffect(() => {
    const onChange = () => setParts(read());
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, []);
  return parts;
}

export function navigate(path) {
  window.location.hash = path;
}
