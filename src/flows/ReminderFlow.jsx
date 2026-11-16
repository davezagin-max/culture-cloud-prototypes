import { useState } from 'react';
import { Avatar } from '../components/Avatar.jsx';
import { Button } from '../components/Button.jsx';
import { Card, Notice, Pill } from '../components/Card.jsx';
import { Confirmation } from '../components/Confirmation.jsx';
import { FlowShell } from '../components/FlowShell.jsx';
import { BellIcon, CheckIcon, ClockIcon } from '../components/Icons.jsx';
import { DetailInput, PeopleRow, ReasonChips, SectionTitle } from '../components/Pickers.jsx';
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
  reminders,
  shift,
} from '../data/mockData.js';
import { useFlow } from '../lib/useFlow.js';
import { navigate } from '../lib/useHashRoute.js';

const flow = flows.reminders;
const noTaps = { notify: 0, person: 0, reason: 0, note: 0, send: 0 };

// A generic timeclock. It is not modelled on any vendor's product.
function Timeclock({ clockedOut, onClockOut }) {
  return (
    <Screen
      header={
        <AppHeader
          label={reminders.timeclock.label}
          right={<Pill>{reminders.timeclock.mockTag}</Pill>}
        />
      }
      bodyClassName="relative flex flex-col items-center justify-center text-center"
      footer={
        <>
          <Button onClick={onClockOut} disabled={clockedOut}>
            <ClockIcon size={20} /> {reminders.timeclock.clockOut}
          </Button>
          <p className="text-center text-xs text-ink-subtle">{reminders.timeclock.standIn}</p>
        </>
      }
    >
      {clockedOut ? (
        <>
          <span className="flex h-14 w-14 items-center justify-center rounded-pill bg-success-soft text-success">
            <CheckIcon size={30} strokeWidth={2.5} />
          </span>
          <p className="mt-4 text-2xl font-bold tracking-tight">{reminders.timeclock.doneTitle}</p>
          <p className="mt-1 text-ink-muted">{reminders.timeclock.doneSub}</p>
        </>
      ) : (
        <>
          <p className="text-sm font-semibold text-ink-muted">{reminders.timeclock.onShift}</p>
          <p className="mt-1 text-6xl font-bold tracking-tight tabular-nums">{shift.clockOut}</p>
          <Card className="mt-6 flex w-full items-center gap-3 text-left">
            <Avatar person={persona} />
            <div>
              <p className="font-semibold">{persona.name}</p>
              <p className="text-sm text-ink-muted">
                {reminders.timeclock.clockedIn} · {shift.length}
              </p>
            </div>
          </Card>
        </>
      )}
    </Screen>
  );
}

// The push notification, with "not today" and "turn off" right on it.
function NotificationBanner({ onOpen, onNotToday, onTurnOff }) {
  return (
    <div
      className="absolute inset-x-2 top-2 z-10 animate-drop-in overflow-hidden rounded-[20px] border border-line bg-surface text-left shadow-device"
      style={{ animationDelay: '0.5s' }}
    >
      <button
        type="button"
        onClick={onOpen}
        className="flex w-full items-start gap-3 p-3.5 text-left hover:bg-surface-muted"
      >
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-control bg-primary text-on-primary">
          <BellIcon size={20} />
        </span>
        <span className="min-w-0 flex-1">
          <span className="flex items-center justify-between text-xs text-ink-subtle">
            <span className="font-semibold">{reminders.notification.app}</span>
            <span>{reminders.notification.when}</span>
          </span>
          <span className="mt-0.5 block font-semibold">{reminders.notification.title}</span>
          <span className="block text-sm text-ink-muted">{reminders.notification.body}</span>
        </span>
      </button>
      <div className="flex border-t border-line text-sm font-semibold text-ink-muted">
        <button
          type="button"
          onClick={onNotToday}
          className="min-h-11 flex-1 hover:bg-surface-muted hover:text-ink"
        >
          {reminders.notToday}
        </button>
        <button
          type="button"
          onClick={onTurnOff}
          className="min-h-11 flex-1 border-l border-line hover:bg-surface-muted hover:text-ink"
        >
          {reminders.turnOff}
        </button>
      </div>
    </div>
  );
}

function TapCounter({ taps }) {
  const total = Object.values(taps).reduce((sum, n) => sum + n, 0);
  return (
    <Card>
      <div className="flex items-baseline gap-2">
        <p className="text-4xl font-bold tracking-tight tabular-nums">
          {reminders.taps.label(total)}
        </p>
        <p className="text-sm text-ink-muted">{reminders.taps.sub}</p>
      </div>
      <ol className="mt-3 grid grid-cols-4 gap-1.5 text-center">
        {reminders.taps.steps.map((label, i) => (
          <li key={label} className="rounded-control bg-surface-muted px-1 py-1.5">
            <span className="block text-sm font-bold">{i + 1}</span>
            <span className="block text-[11px] leading-tight text-ink-muted">{label}</span>
          </li>
        ))}
      </ol>
      <p className="mt-3 text-sm text-ink-muted">
        {taps.note ? reminders.taps.withNote : reminders.taps.noTyping}
      </p>
    </Card>
  );
}

export default function ReminderFlow({ onRestart }) {
  const { stepId, goTo, back, canGoBack } = useFlow('clock');
  const [recipientId, setRecipientId] = useState(null);
  const [reasonId, setReasonId] = useState(null);
  const [note, setNote] = useState('');
  const [noteOpen, setNoteOpen] = useState(false);
  const [taps, setTaps] = useState(noTaps);

  const recipient = getPerson(recipientId ?? defaults.recipientId);
  const reason = getReason(reasonId);
  const canSend = Boolean(recipientId && reasonId);
  const message = note.trim() || reason?.message || '';

  const addTap = (key) => setTaps((t) => ({ ...t, [key]: t[key] + 1 }));

  function openPrompt() {
    setTaps((t) => ({ ...t, notify: 1 }));
    goTo('prompt');
  }

  function pickPerson(id) {
    if (id !== recipientId) addTap('person');
    setRecipientId(id);
  }

  function pickReason(id) {
    if (id !== reasonId) addTap('reason');
    setReasonId(id);
  }

  function send() {
    setTaps((t) => ({ ...t, send: 1 }));
    goTo('sent');
  }

  function next() {
    if (stepId === 'clock') goTo('notify');
    else if (stepId === 'notify') openPrompt();
    else if (stepId === 'prompt') {
      if (!canSend) {
        // First press picks the example coworker and reason. Second press sends.
        if (!recipientId) pickPerson(defaults.recipientId);
        if (!reasonId) pickReason(defaults.reasonId);
      } else send();
    }
  }

  let screen = null;

  if (stepId === 'clock') {
    screen = <Timeclock clockedOut={false} onClockOut={() => goTo('notify')} />;
  } else if (stepId === 'notify') {
    screen = (
      <div className="relative h-full">
        <Timeclock clockedOut />
        <NotificationBanner
          onOpen={openPrompt}
          onNotToday={() => goTo('skipped')}
          onTurnOff={() => goTo('off')}
        />
      </div>
    );
  } else if (stepId === 'prompt') {
    screen = (
      <Screen
        header={<AppHeader viewer={persona} />}
        footer={
          <>
            <Button onClick={send} disabled={!canSend}>
              {reminders.prompt.send(recipientId ? recipient.first : '')}
            </Button>
            <div className="flex justify-center gap-6">
              <Button variant="quiet" size="md" full={false} onClick={() => goTo('skipped')}>
                {reminders.notToday}
              </Button>
              <Button variant="quiet" size="md" full={false} onClick={() => goTo('off')}>
                {reminders.turnOff}
              </Button>
            </div>
          </>
        }
      >
        <ScreenTitle title={reminders.prompt.title} sub={reminders.prompt.sub} />
        <PeopleRow
          people={coworkers}
          selectedId={recipientId}
          onPick={pickPerson}
          emptyHint={copy.pickHint}
        />

        <SectionTitle className="mt-4">{copy.reasonTitle}</SectionTitle>
        <ReasonChips reasons={reasons} selectedId={reasonId} onPick={pickReason} />

        <div className="mt-4">
          {noteOpen ? (
            <DetailInput
              label={copy.detailLabel}
              placeholder={copy.detailPlaceholder}
              value={note}
              onChange={setNote}
              rows={2}
            />
          ) : (
            <Button
              variant="quiet"
              size="sm"
              full={false}
              onClick={() => {
                setNoteOpen(true);
                addTap('note');
              }}
            >
              {reminders.prompt.addNote}
            </Button>
          )}
        </div>
      </Screen>
    );
  } else if (stepId === 'sent') {
    screen = (
      <Confirmation
        title={copy.sentTitle(recipient.first)}
        sub={copy.sentSub(recipient.first)}
        post={
          <RecognitionPost
            from={persona}
            to={recipient}
            message={message}
            tag={reminders.sourceTag}
            footer={copy.visibleTo(recipient.first)}
          />
        }
        primary={{ label: copy.backToHome, onClick: () => navigate('/') }}
        secondary={{ label: copy.runAgain, onClick: onRestart }}
      >
        <TapCounter taps={taps} />
      </Confirmation>
    );
  } else if (stepId === 'skipped') {
    screen = (
      <Screen
        header={<AppHeader viewer={persona} />}
        bodyClassName="flex flex-col justify-center"
        footer={
          <>
            <Button onClick={() => navigate('/')}>{copy.backToHome}</Button>
            <Button variant="quiet" size="md" onClick={() => goTo('off')}>
              {reminders.turnOff}
            </Button>
          </>
        }
      >
        <ScreenTitle title={reminders.skipped.title} sub={reminders.skipped.body} />
        <Notice icon={<BellIcon size={18} />}>
          <p>{reminders.skipped.rule}</p>
        </Notice>
      </Screen>
    );
  } else if (stepId === 'off') {
    screen = (
      <Screen
        header={<AppHeader viewer={persona} />}
        bodyClassName="flex flex-col justify-center"
        footer={
          <>
            <Button onClick={() => navigate('/')}>{copy.backToHome}</Button>
            <Button variant="secondary" onClick={back}>
              {reminders.off.undo}
            </Button>
          </>
        }
      >
        <ScreenTitle title={reminders.off.title} sub={reminders.off.body} />
      </Screen>
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
      endSteps={['skipped', 'off']}
    >
      {screen}
    </FlowShell>
  );
}
