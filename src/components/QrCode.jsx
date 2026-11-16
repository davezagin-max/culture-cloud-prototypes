import QRCode from 'qrcode';
import { useMemo } from 'react';

// Draws a real, scannable QR code as SVG.
export function QrCode({ value, className = '' }) {
  const { size, d } = useMemo(() => {
    const { modules } = QRCode.create(value, { errorCorrectionLevel: 'M' });
    let path = '';
    for (let row = 0; row < modules.size; row += 1) {
      for (let col = 0; col < modules.size; col += 1) {
        if (modules.data[row * modules.size + col]) path += `M${col} ${row}h1v1h-1z`;
      }
    }
    return { size: modules.size, d: path };
  }, [value]);

  return (
    <svg
      viewBox={`0 0 ${size} ${size}`}
      shapeRendering="crispEdges"
      className={className}
      role="img"
      aria-label="QR code"
    >
      <path d={d} fill="currentColor" />
    </svg>
  );
}
