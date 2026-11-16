import { Avatar } from './Avatar.jsx';
import { Pill } from './Card.jsx';
import { CaptionsIcon, PlayIcon } from './Icons.jsx';

// One recognition, as it appears in a feed, a manager list, or a confirmation.
export function RecognitionPost({
  from,
  to,
  message,
  when = 'Just now',
  tag,
  isNew = false,
  video = null, // { seconds } when the recognition is a video
  footer,
}) {
  return (
    <article
      className={`rounded-card border bg-surface p-4 shadow-card ${isNew ? 'border-primary' : 'border-line'}`}
    >
      <div className="flex items-center gap-3">
        <Avatar person={from} />
        <div className="min-w-0 flex-1">
          <p className="text-sm leading-snug">
            <span className="font-semibold">{from.name}</span>
            <span className="text-ink-muted"> thanked </span>
            <span className="font-semibold">{to.name}</span>
          </p>
          <p className="text-xs text-ink-subtle">{when}</p>
        </div>
        {isNew && <Pill tone="strong">New</Pill>}
      </div>

      {video && (
        <div className="mt-3 flex items-center gap-3 rounded-control bg-night p-3 text-on-night">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-pill bg-on-night/15">
            <PlayIcon size={18} />
          </span>
          <span className="text-sm font-medium">
            Video · 0:{String(video.seconds).padStart(2, '0')}
          </span>
          <span className="ml-auto flex items-center gap-1 text-xs opacity-80">
            <CaptionsIcon size={16} /> Captions
          </span>
        </div>
      )}

      <p className="mt-3 text-base leading-snug">{message}</p>

      {(tag || footer) && (
        <div className="mt-3 flex flex-wrap items-center gap-2">
          {tag && <Pill>{tag}</Pill>}
          {footer && <span className="text-xs text-ink-subtle">{footer}</span>}
        </div>
      )}
    </article>
  );
}
