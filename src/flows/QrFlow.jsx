import { useState } from 'react';
import { Button } from '../components/Button.jsx';
import { Notice, Pill } from '../components/Card.jsx';
import { Confirmation } from '../components/Confirmation.jsx';
import { FlowShell } from '../components/FlowShell.jsx';
import { CheckIcon, LockIcon, QrIcon, TicketIcon } from '../components/Icons.jsx';
import { DetailInput, PeopleRow, ReasonChips, SectionTitle } from '../components/Pickers.jsx';
import { QrCode } from '../components/QrCode.jsx';
import { RecognitionPost } from '../components/RecognitionPost.jsx';
import { AppHeader, Screen, ScreenTitle, ViewingAs } from '../components/Screen.jsx';
import {
  copy,
  coworkers,
  defaults,
  flows,
  getPerson,
  getReason,
  manager,
  olderPosts,
  persona,
  project,
  qr,
  reasons,
  workplace,
} from '../data/mockData.js';
import { isSpecific } from '../lib/quality.js';
import { useFlow } from '../lib/useFlow.js';
import { navigate } from '../lib/useHashRoute.js';

const flow = flows.qr;

// Where the code on the card points: straight to the recognition form.
function scanUrl() {
  return `${window.location.href.split('#')[0]}#${flow.path}/form`;
}

// The physical card, drawn as paper.
function PrintedCard() {
  return (
    <div className="-rotate-2 rounded-[10px] border border-line bg-surface p-5 shadow-device">
      <p className="text-xs font-bold tracking-tight">{project.productLabel}</p>
      <p className="mt-4 text-2xl leading-tight font-bold tracking-tight">{qr.card.heading}</p>
      <p className="mt-2 text-sm text-ink-muted">{qr.card.body}</p>
      <div className="mt-5 flex items-end justify-between gap-4">
        <p className="text-xs text-ink-subtle">
          {qr.card.issuedTo(persona.name)}
          <br />
          {workplace.name} · {workplace.unit}
        </p>
        <QrCode value={scanUrl()} className="h-28 w-28 shrink-0 text-ink" />
      </div>
    </div>
  );
}

export default function QrFlow({ onRestart, initialStep }) {
  // A real scan of the card opens "#/qr/form", so the flow can start there.
  const { stepId, goTo, back, canGoBack } = useFlow(initialStep === 'form' ? 'form' : 'card');
  const [recipientId, setRecipientId] = useState(null);
  const [reasonId, setReasonId] = useState(null);
  const [detail, setDetail] = useState('');

  const recipient = getPerson(recipientId ?? defaults.recipientId);
  const reason = getReason(reasonId);
  const canSend = Boolean(recipientId && reasonId);
  const meaningful = Boolean(reasonId) && isSpecific(detail, qr.incentive.minWords);
  const message = detail.trim() || reason?.message || '';

  function next() {
    if (stepId === 'card') goTo('form');
    else if (stepId === 'form') {
      if (!canSend) {
        // First press fills in the example. Second press sends it.
        if (!recipientId) setRecipientId(defaults.recipientId);
        if (!reasonId) setReasonId(defaults.reasonId);
        if (!detail.trim()) setDetail(defaults.detail);
      } else goTo('sent');
    } else if (stepId === 'sent') goTo('feed');
    else if (stepId === 'feed') goTo('manager');
  }

  const post = (
    <RecognitionPost
      from={persona}
      to={recipient}
      message={message}
      tag={qr.sourceTag}
      footer={copy.visibleTo(recipient.first)}
    />
  );

  let screen = null;

  if (stepId === 'card') {
    screen = (
      <Screen
        bodyClassName="flex flex-col justify-center bg-surface-muted"
        footer={
          <>
            <Button onClick={() => goTo('form')}>
              <QrIcon size={20} /> {qr.card.scan}
            </Button>
            <p className="text-center text-xs text-ink-subtle">{qr.card.liveNote}</p>
          </>
        }
      >
        <p className="mb-6 text-center text-sm font-medium text-ink-muted">{qr.card.context}</p>
        <PrintedCard />
      </Screen>
    );
  } else if (stepId === 'form') {
    screen = (
      <Screen
        header={<AppHeader right={<Pill>{qr.form.badge}</Pill>} />}
        footer={
          <>
            <div className="flex items-start gap-2.5 pb-1">
              <span
                className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-pill ${
                  meaningful ? 'bg-success-soft text-success' : 'bg-surface-muted text-ink-muted'
                }`}
              >
                {meaningful ? <CheckIcon size={15} strokeWidth={2.5} /> : <LockIcon size={14} />}
              </span>
              <p className="text-sm leading-snug">
                <span className="font-semibold">
                  {meaningful ? qr.incentive.unlockedTitle : qr.incentive.lockedTitle}.
                </span>{' '}
                <span className="text-ink-muted">
                  {meaningful ? qr.incentive.unlockedBody : qr.incentive.lockedBody}
                </span>
                <span className="block text-xs text-ink-subtle">{qr.incentive.rule}</span>
              </p>
            </div>
            <Button onClick={() => goTo('sent')} disabled={!canSend}>
              {qr.form.send(recipientId ? recipient.first : '')}
            </Button>
          </>
        }
      >
        <ScreenTitle title={qr.form.hello(persona.first)} sub={qr.form.issued(persona.name)} />
        <PeopleRow
          people={coworkers}
          selectedId={recipientId}
          onPick={setRecipientId}
          emptyHint={copy.pickHint}
        />

        <SectionTitle className="mt-4">{qr.form.reasonTitle}</SectionTitle>
        <ReasonChips reasons={reasons} selectedId={reasonId} onPick={setReasonId} />

        <div className="mt-4">
          <DetailInput
            rows={2}
            label={qr.form.detailLabel}
            placeholder={qr.form.detailPlaceholder}
            value={detail}
            onChange={setDetail}
          />
        </div>

      </Screen>
    );
  } else if (stepId === 'sent') {
    screen = (
      <Confirmation
        title={copy.sentTitle(recipient.first)}
        sub={copy.sentSub(recipient.first)}
        post={post}
        primary={{ label: qr.seeFeed(recipient.first), onClick: () => goTo('feed') }}
        secondary={{ label: copy.backToHome, onClick: () => navigate('/') }}
      >
        <Notice
          tone={meaningful ? 'success' : 'attention'}
          icon={<TicketIcon size={18} />}
          title={meaningful ? qr.incentive.earnedTitle : qr.incentive.notEarnedTitle}
        >
          <p>{meaningful ? qr.incentive.earnedBody : qr.incentive.notEarnedBody}</p>
          <p className="mt-1 text-xs text-ink-subtle">{qr.incentive.rule}</p>
        </Notice>
      </Confirmation>
    );
  } else if (stepId === 'feed') {
    screen = (
      <Screen
        header={
          <>
            <ViewingAs person={recipient} as="recipient" />
            <AppHeader viewer={recipient} />
          </>
        }
        footer={<Button onClick={() => goTo('manager')}>{qr.feed.next}</Button>}
      >
        <ScreenTitle title={qr.feed.title} />
        <div className="space-y-3">
          <RecognitionPost
            from={persona}
            to={recipient}
            message={message}
            tag={qr.sourceTag}
            isNew
          />
          {olderPosts.map((p) => (
            <RecognitionPost
              key={p.id}
              from={getPerson(p.fromId)}
              to={getPerson(p.toId)}
              message={p.message}
              when={p.when}
              tag={p.source}
            />
          ))}
        </div>
      </Screen>
    );
  } else if (stepId === 'manager') {
    screen = (
      <Screen
        header={
          <>
            <ViewingAs person={manager} as="manager" />
            <AppHeader viewer={manager} />
          </>
        }
        footer={
          <>
            <Button onClick={() => navigate('/')}>{copy.backToHome}</Button>
            <Button variant="secondary" onClick={onRestart}>
              {copy.runAgain}
            </Button>
          </>
        }
      >
        <ScreenTitle title={qr.managerView.title} sub={qr.managerView.sub} />
        <div className="grid grid-cols-3 gap-2">
          {qr.managerView.stats.map((stat) => (
            <div key={stat.label} className="rounded-card bg-surface-muted p-3">
              <p className="text-2xl font-bold tracking-tight">{stat.value}</p>
              <p className="mt-0.5 text-xs leading-tight text-ink-muted">{stat.label}</p>
            </div>
          ))}
        </div>

        <SectionTitle className="mt-5">{qr.managerView.listTitle}</SectionTitle>
        <div className="space-y-3">
          <RecognitionPost
            from={persona}
            to={recipient}
            message={message}
            tag={qr.sourceTag}
            isNew
          />
          <Notice tone="success" icon={<CheckIcon size={18} />} title={qr.managerView.counted}>
            <p>{meaningful ? qr.managerView.entryIssued : qr.managerView.entryNotIssued}</p>
          </Notice>
          {olderPosts.map((p) => (
            <RecognitionPost
              key={p.id}
              from={getPerson(p.fromId)}
              to={getPerson(p.toId)}
              message={p.message}
              when={p.when}
              tag={p.source}
            />
          ))}
        </div>
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
    >
      {screen}
    </FlowShell>
  );
}
