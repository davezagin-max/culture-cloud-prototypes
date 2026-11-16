import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { Avatar } from '../components/Avatar.jsx';
import { Button } from '../components/Button.jsx';
import { Notice } from '../components/Card.jsx';
import { Confirmation } from '../components/Confirmation.jsx';
import { FlowShell } from '../components/FlowShell.jsx';
import { CaptionsIcon, PencilIcon, VideoIcon } from '../components/Icons.jsx';
import { DetailInput, PeoplePicker, ReasonChips, SectionTitle } from '../components/Pickers.jsx';
import { RecognitionPost } from '../components/RecognitionPost.jsx';
import { AppHeader, Screen, ScreenTitle } from '../components/Screen.jsx';
import {
  copy,
  coworkers,
  defaults,
  flows,
  getPerson,
  getReason,
  persona,
  reasons,
  video,
} from '../data/mockData.js';
import { useFlow } from '../lib/useFlow.js';
import { navigate } from '../lib/useHashRoute.js';

const flow = flows.video;

function clock(seconds) {
  return `0:${String(Math.floor(seconds)).padStart(2, '0')}`;
}

// Small label that sits on top of the dark camera view.
function Overlay({ className = '', children }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-pill bg-night/70 px-2.5 py-1 text-xs font-semibold text-on-night ${className}`}
    >
      {children}
    </span>
  );
}

// ---------------------------------------------------------------------------
// Step: record
// Uses the real camera when the browser already has permission, or when the
// presenter taps "Use my camera". Otherwise the take is simulated.
// ---------------------------------------------------------------------------

const RecordStep = forwardRef(function RecordStep({ recipient, onDone, onWriteInstead }, ref) {
  const [camera, setCamera] = useState('off'); // off | live | blocked
  const [recording, setRecording] = useState(false);
  const [elapsed, setElapsed] = useState(0);

  const videoEl = useRef(null);
  const stream = useRef(null);
  const recorder = useRef(null);
  const chunks = useRef([]);
  const startedAt = useRef(0);
  const finished = useRef(false);
  const alive = useRef(true);

  async function startCamera() {
    if (!navigator.mediaDevices?.getUserMedia) {
      setCamera('blocked');
      return;
    }
    try {
      const s = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user' },
        audio: false,
      });
      if (!alive.current) {
        s.getTracks().forEach((t) => t.stop());
        return;
      }
      stream.current = s;
      setCamera('live');
    } catch {
      if (alive.current) setCamera('blocked');
    }
  }

  // Turn the camera on by itself only if permission was already granted.
  useEffect(() => {
    alive.current = true;
    navigator.permissions
      ?.query({ name: 'camera' })
      .then((status) => {
        if (alive.current && status.state === 'granted') startCamera();
      })
      .catch(() => {});
    return () => {
      alive.current = false;
      stream.current?.getTracks().forEach((t) => t.stop());
      stream.current = null;
    };
  }, []);

  useEffect(() => {
    if (camera === 'live' && videoEl.current) videoEl.current.srcObject = stream.current;
  }, [camera]);

  function finish(url) {
    if (finished.current) return;
    finished.current = true;
    const seconds = Math.max(1, Math.round((performance.now() - startedAt.current) / 1000));
    onDone({ url, seconds: Math.min(seconds, video.maxSeconds) });
  }

  function start() {
    startedAt.current = performance.now();
    setElapsed(0);
    setRecording(true);
    if (stream.current && typeof MediaRecorder !== 'undefined') {
      try {
        chunks.current = [];
        const r = new MediaRecorder(stream.current);
        r.ondataavailable = (e) => e.data.size && chunks.current.push(e.data);
        r.start();
        recorder.current = r;
      } catch {
        recorder.current = null;
      }
    }
  }

  function stop() {
    setRecording(false);
    const r = recorder.current;
    if (r && r.state !== 'inactive') {
      r.onstop = () => {
        const blob = new Blob(chunks.current, { type: r.mimeType || 'video/webm' });
        finish(URL.createObjectURL(blob));
      };
      r.stop();
    } else {
      finish(null);
    }
  }

  const toggle = () => (recording ? stop() : start());
  useImperativeHandle(ref, () => ({ toggle }));

  // Timer. Stops by itself at the maximum length.
  useEffect(() => {
    if (!recording) return undefined;
    const id = setInterval(() => {
      const s = (performance.now() - startedAt.current) / 1000;
      setElapsed(s);
      if (s >= video.maxSeconds) stop();
    }, 100);
    return () => clearInterval(id);
  }, [recording]);

  // Demo captions appear a few words at a time while recording.
  const words = video.captions(recipient.first).split(' ');
  const spoken = words.slice(0, Math.floor(elapsed * 2.5));
  const liveCaption = spoken.slice(-7).join(' ');

  return (
    <Screen
      header={<AppHeader viewer={persona} />}
      bodyClassName="flex flex-col"
      footer={
        <div className="flex flex-col items-center gap-1">
          <button
            type="button"
            onClick={toggle}
            aria-label={recording ? 'Stop recording' : 'Start recording'}
            className="flex h-[72px] w-[72px] items-center justify-center rounded-pill border-4 border-ink bg-surface"
          >
            <span
              className={`block bg-record transition-all ${recording ? 'h-7 w-7 rounded-md' : 'h-14 w-14 rounded-pill'}`}
            />
          </button>
          <p className="text-sm font-medium text-ink-muted">
            {recording ? video.tapToStop : video.tapToRecord}
          </p>
          <Button variant="quiet" size="md" onClick={onWriteInstead}>
            <PencilIcon size={16} /> {video.writeInstead}
          </Button>
        </div>
      }
    >
      <ScreenTitle title={video.recordTitle(recipient.first)} sub={video.recordHint} />

      <div className="relative min-h-56 flex-1 overflow-hidden rounded-card bg-night text-on-night">
        {camera === 'live' ? (
          <video
            ref={videoEl}
            autoPlay
            playsInline
            muted
            className="absolute inset-0 h-full w-full -scale-x-100 object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-6 pb-16 text-center">
            <Avatar person={persona} size="xl" className={recording ? 'animate-pulse' : ''} />
            <p className="text-sm opacity-80">
              {camera === 'blocked' ? video.cameraBlocked : video.cameraOff}
            </p>
            {camera === 'off' && !recording && (
              <button
                type="button"
                onClick={startCamera}
                className="inline-flex min-h-9 items-center gap-1.5 rounded-pill bg-on-night/15 px-3.5 text-sm font-semibold hover:bg-on-night/25"
              >
                <VideoIcon size={16} /> {video.cameraOn}
              </button>
            )}
          </div>
        )}

        {/* Progress toward the 30-second cap, with a tick at 15 seconds */}
        <div className="absolute inset-x-0 top-0 h-1.5 bg-on-night/20">
          <div
            className="h-full bg-record"
            style={{ width: `${Math.min(100, (elapsed / video.maxSeconds) * 100)}%` }}
          />
          <span
            className="absolute top-0 h-full w-0.5 bg-on-night/70"
            style={{ left: `${(video.minSeconds / video.maxSeconds) * 100}%` }}
          />
        </div>

        <div className="absolute inset-x-3 top-4 flex items-center justify-between">
          <Overlay>
            <span
              className={`h-2 w-2 rounded-pill ${recording ? 'animate-pulse bg-record' : 'bg-on-night/50'}`}
            />
            {clock(elapsed)} / {clock(video.maxSeconds)}
          </Overlay>
          <Overlay>
            <CaptionsIcon size={14} /> {video.captionsOn}
          </Overlay>
        </div>

        <div className="absolute inset-x-3 bottom-3">
          {recording ? (
            liveCaption && (
              <p className="mx-auto w-fit max-w-full rounded-control bg-night/75 px-3 py-1.5 text-center text-base font-semibold">
                {liveCaption}
              </p>
            )
          ) : (
            <div className="rounded-control bg-night/75 p-3 text-sm backdrop-blur">
              <p className="font-semibold opacity-70">{video.promptLabel}</p>
              <p className="mt-0.5 text-base">{video.prompt(recipient.first)}</p>
            </div>
          )}
        </div>
      </div>
    </Screen>
  );
});

// ---------------------------------------------------------------------------
// Step: preview
// ---------------------------------------------------------------------------

function PreviewStep({ recipient, clip, captions, onCaptions, onRetake, onSend, onWriteInstead }) {
  const [editing, setEditing] = useState(false);
  const [tick, setTick] = useState(0);

  // Show the captions a short line at a time, looping like the clip does.
  const words = captions.trim().split(/\s+/).filter(Boolean);
  const lines = [];
  for (let i = 0; i < words.length; i += 6) lines.push(words.slice(i, i + 6).join(' '));

  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 1800);
    return () => clearInterval(id);
  }, []);

  const line = lines.length ? lines[tick % lines.length] : '';

  return (
    <Screen
      header={<AppHeader viewer={persona} />}
      bodyClassName="flex flex-col"
      footer={
        <>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={onRetake} className="basis-1/3">
              {video.retake}
            </Button>
            <Button onClick={onSend} className="basis-2/3">
              {video.send(recipient.first)}
            </Button>
          </div>
          <Button variant="quiet" size="md" onClick={onWriteInstead}>
            <PencilIcon size={16} /> {video.writeInstead}
          </Button>
        </>
      }
    >
      <ScreenTitle title={video.previewTitle} sub={video.previewSub} />

      <div className="relative min-h-48 flex-1 overflow-hidden rounded-card bg-night text-on-night">
        {clip.url ? (
          <video
            src={clip.url}
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 h-full w-full -scale-x-100 object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 pb-12">
            <Avatar person={persona} size="xl" />
            <p className="text-sm opacity-80">{video.simulatedClip}</p>
          </div>
        )}
        <div className="absolute top-3 left-3">
          <Overlay>{clock(clip.seconds)}</Overlay>
        </div>
        {line && (
          <p className="absolute inset-x-3 bottom-3 mx-auto w-fit max-w-[calc(100%-1.5rem)] rounded-control bg-night/75 px-3 py-1.5 text-center text-base font-semibold">
            {line}
          </p>
        )}
      </div>

      <div className="mt-3">
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center gap-1.5 text-sm font-semibold">
            <CaptionsIcon size={18} /> {video.captionsLabel}
          </span>
          <Button
            variant="quiet"
            size="sm"
            full={false}
            onClick={() => setEditing((v) => !v)}
          >
            {editing ? video.captionsDone : video.captionsEdit}
          </Button>
        </div>
        {editing ? (
          <textarea
            rows={3}
            value={captions}
            onChange={(e) => onCaptions(e.target.value)}
            aria-label={video.captionsLabel}
            className="mt-1 block w-full resize-none rounded-control border border-line bg-surface-muted px-3 py-2 text-sm focus:border-primary focus:bg-surface focus:outline-none"
          />
        ) : (
          <p className="mt-1 text-sm text-ink-muted">{captions}</p>
        )}
      </div>
    </Screen>
  );
}

// ---------------------------------------------------------------------------
// The flow
// ---------------------------------------------------------------------------

export default function VideoFlow({ onRestart }) {
  const { stepId, goTo, back, canGoBack } = useFlow('pick');
  const [recipientId, setRecipientId] = useState(null);
  const [clip, setClip] = useState(null);
  const [editedCaptions, setEditedCaptions] = useState(null);
  const [reasonId, setReasonId] = useState(null);
  const [text, setText] = useState('');
  const [sentAs, setSentAs] = useState('video');
  const recordStep = useRef(null);

  const recipient = getPerson(recipientId ?? defaults.recipientId);
  const captions = editedCaptions ?? video.captions(recipient.first);
  const reason = getReason(reasonId);
  const textMessage = text.trim() || reason?.message || '';

  // Free the recorded clip when it is replaced or the flow closes.
  useEffect(
    () => () => {
      if (clip?.url) URL.revokeObjectURL(clip.url);
    },
    [clip],
  );

  function pick(id) {
    setRecipientId(id);
    setEditedCaptions(null);
    goTo('record');
  }

  function sendVideo() {
    setSentAs('video');
    goTo('sent');
  }

  function sendText() {
    setSentAs('text');
    goTo('sent');
  }

  // What the right arrow key (and the presenter panel's Next) does on each step.
  function next() {
    if (stepId === 'pick') pick(recipientId ?? defaults.recipientId);
    else if (stepId === 'record') recordStep.current?.toggle();
    else if (stepId === 'preview') sendVideo();
    else if (stepId === 'write') {
      if (!textMessage) {
        setReasonId(defaults.reasonId);
        setText(defaults.detail);
      } else sendText();
    }
  }

  let screen = null;

  if (stepId === 'pick') {
    screen = (
      <Screen header={<AppHeader viewer={persona} />}>
        <ScreenTitle title={copy.pickTitle} sub={copy.pickSub} />
        <PeoplePicker people={coworkers} selectedId={recipientId} onPick={pick} />
      </Screen>
    );
  } else if (stepId === 'record') {
    screen = (
      <RecordStep
        ref={recordStep}
        recipient={recipient}
        onDone={(c) => {
          setClip(c);
          goTo('preview');
        }}
        onWriteInstead={() => goTo('write')}
      />
    );
  } else if (stepId === 'preview') {
    screen = (
      <PreviewStep
        recipient={recipient}
        clip={clip}
        captions={captions}
        onCaptions={setEditedCaptions}
        onRetake={back}
        onSend={sendVideo}
        onWriteInstead={() => goTo('write')}
      />
    );
  } else if (stepId === 'write') {
    screen = (
      <Screen
        header={<AppHeader viewer={persona} />}
        footer={
          <>
            <Button onClick={sendText} disabled={!textMessage}>
              {video.send(recipient.first)}
            </Button>
            <Button variant="quiet" size="md" onClick={back}>
              <VideoIcon size={16} /> {video.recordInstead}
            </Button>
          </>
        }
      >
        <ScreenTitle title={video.writeTitle(recipient.first)} sub={video.writeSub} />
        <SectionTitle>{copy.reasonTitle}</SectionTitle>
        <ReasonChips reasons={reasons} selectedId={reasonId} onPick={setReasonId} />
        <div className="mt-5">
          <DetailInput
            label={copy.detailLabel}
            placeholder={copy.detailPlaceholder}
            value={text}
            onChange={setText}
          />
        </div>
      </Screen>
    );
  } else if (stepId === 'sent') {
    const isVideo = sentAs === 'video';
    screen = (
      <Confirmation
        title={copy.sentTitle(recipient.first)}
        sub={copy.sentSub(recipient.first)}
        post={
          <RecognitionPost
            from={persona}
            to={recipient}
            message={isVideo ? captions : textMessage}
            video={isVideo ? { seconds: clip?.seconds ?? video.minSeconds } : null}
            tag={isVideo ? video.tagVideo : video.tagText}
            footer={copy.visibleTo(recipient.first)}
          />
        }
        primary={{ label: copy.backToHome, onClick: () => navigate('/') }}
        secondary={{ label: copy.runAgain, onClick: onRestart }}
      >
        {isVideo && (
          <Notice icon={<CaptionsIcon size={18} />}>
            <p>{video.sentNote}</p>
          </Notice>
        )}
      </Confirmation>
    );
  }

  return (
    <FlowShell
      flow={flow}
      stepId={stepId}
      onNext={next}
      onBack={back}
      onRestart={onRestart}
      canGoBack={canGoBack}
    >
      {screen}
    </FlowShell>
  );
}
