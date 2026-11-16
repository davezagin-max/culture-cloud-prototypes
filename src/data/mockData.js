/*
 * MOCK DATA — everything the prototypes show comes from this file.
 *
 * Teammates: edit names, roles, copy, and presenter notes here. Nothing in this
 * file talks to a server. Every person, workplace, and number is made up.
 */

// ---------------------------------------------------------------------------
// Project
// ---------------------------------------------------------------------------

export const project = {
  productLabel: 'Culture Cloud', // plain text label, used instead of a logo
  title: 'Frontline recognition prototypes',
  team: 'IS 4496 · University of Utah · Group 7',
  goal: 'Get more Gen Z frontline workers sending meaningful recognition each month.',
  metric: 'What we measure: recognition sent. Not logins, not visits.',
  disclaimer:
    'Student prototype with made-up people and data. Not an O.C. Tanner product.',
};

// ---------------------------------------------------------------------------
// People and place (the same cast appears in all three flows)
// ---------------------------------------------------------------------------

export const workplace = {
  name: 'Cedar Valley Medical Center',
  unit: '4 West',
  unitLong: '4 West · Med-Surg',
};

export const persona = {
  id: 'maya',
  name: 'Maya Torres',
  first: 'Maya',
  age: 22,
  role: 'Nursing assistant',
  tint: 1, // which avatar colour to use (1–6, see tokens.css)
  story:
    'Maya just finished a 12-hour shift. She has her phone, a few minutes before the drive home, and no computer at work.',
};

export const manager = {
  id: 'carol',
  name: 'Carol Whitfield',
  first: 'Carol',
  role: 'Nurse manager',
  tint: 6,
};

export const shift = {
  clockIn: '7:00 AM',
  clockOut: '7:12 PM',
  length: '12h 12m',
  statusBarTime: '7:12',
};

// Coworkers on Maya's shift. The first one is the default pick in every flow.
export const coworkers = [
  {
    id: 'denise',
    name: 'Denise Okafor',
    first: 'Denise',
    role: 'Charge nurse',
    overlap: 'Whole shift together',
    tint: 2,
  },
  {
    id: 'luis',
    name: 'Luis Herrera',
    first: 'Luis',
    role: 'Nursing assistant',
    overlap: 'Whole shift together',
    tint: 3,
  },
  {
    id: 'priya',
    name: 'Priya Nair',
    first: 'Priya',
    role: 'Registered nurse',
    overlap: '7 AM to 3 PM',
    tint: 4,
  },
  {
    id: 'andre',
    name: 'Andre Baptiste',
    first: 'Andre',
    role: 'Patient transport',
    overlap: '11 AM to 7 PM',
    tint: 5,
  },
  {
    id: 'hannah',
    name: 'Hannah Kim',
    first: 'Hannah',
    role: 'Unit clerk',
    overlap: '7 AM to 3 PM',
    tint: 6,
  },
];

// Quick reasons. `message` is what gets sent if Maya taps a reason and types nothing.
export const reasons = [
  { id: 'covered', label: 'Covered for me', message: 'Thanks for covering for me today.' },
  { id: 'taught', label: 'Taught me something', message: 'Thanks for teaching me something today.' },
  { id: 'calm', label: 'Kept things calm', message: 'Thanks for keeping things calm today.' },
  { id: 'extra', label: 'Went the extra mile', message: 'Thanks for going the extra mile today.' },
  { id: 'patient', label: 'Great with a patient', message: 'You were so good with that patient today.' },
];

// What the arrow keys fill in, so the story is the same in all three flows.
export const defaults = {
  recipientId: 'denise',
  reasonId: 'covered',
  detail:
    'You stayed with my patient in 412 during the rapid response so I could finally take my break.',
};

// ---------------------------------------------------------------------------
// Shared copy
// ---------------------------------------------------------------------------

export const copy = {
  pickTitle: 'Who made your shift better?',
  pickSub: 'People you worked with today',
  pickHint: 'Tap someone from today’s shift',
  reasonTitle: 'What for?',
  detailLabel: 'Add a detail (optional)',
  detailPlaceholder: 'What did they do?',
  sentTitle: (first) => `Sent to ${first}`,
  sentSub: (first) => `${first} will see it in the feed. So will the team.`,
  visibleTo: (first) => `Seen by ${first}, the ${workplace.unit} team, and ${manager.first}`,
  home: 'Home',
  restart: 'Restart',
  backToHome: 'Back to home',
  runAgain: 'Run it again',
};

// ---------------------------------------------------------------------------
// Flow 1 — Video recognition
// ---------------------------------------------------------------------------

export const video = {
  minSeconds: 15,
  maxSeconds: 30,
  recordTitle: (first) => `Say thanks to ${first}`,
  recordHint: '15 to 30 seconds. One take is fine.',
  promptLabel: 'Not sure what to say? Try',
  prompt: (first) => `“Hey ${first}, thanks for…” and say one thing they did.`,
  cameraOff: 'Camera preview is simulated',
  cameraOn: 'Use my camera',
  cameraBlocked: 'No camera access, so this take is simulated.',
  writeInstead: 'Write a message instead',
  recordInstead: 'Record a video instead',
  captionsOn: 'Captions on',
  captionsLabel: 'Auto-captions',
  captionsEdit: 'Fix a word',
  captionsDone: 'Done',
  // Scripted for the demo. Real captions would come from speech-to-text.
  captions: (first) =>
    `Hey ${first}, thanks for staying with my patient in 412 today. I finally got to eat. You saved my shift.`,
  previewTitle: 'Look good?',
  previewSub: 'Nobody sees it until you send.',
  retake: 'Retake',
  send: (first) => `Send to ${first}`,
  writeTitle: (first) => `Write to ${first}`,
  writeSub: 'Pick one, type one, or both.',
  tapToRecord: 'Tap to record',
  tapToStop: 'Tap to stop',
  simulatedClip: 'Simulated clip',
  tagVideo: 'Video',
  tagText: 'Message',
  sentNote: 'Captions go with the video, so it works with the sound off.',
};

// ---------------------------------------------------------------------------
// Flow 2 — QR recognition cards
// ---------------------------------------------------------------------------

export const qr = {
  card: {
    heading: 'Who had your back today?',
    body: 'Scan to thank them. Takes a minute. No login.',
    issuedTo: (name) => `Card for ${name}`,
    context: `${manager.first} handed these out at the 6:45 huddle.`,
    scan: 'Scan the card',
    liveNote: 'On the deployed site this code is real. Point a phone camera at it.',
  },
  form: {
    badge: 'From your card · no login',
    hello: (first) => `Hi ${first}. Who are you thanking?`,
    issued: (name) => `This card belongs to ${name}.`,
    reasonTitle: 'What for?',
    detailLabel: 'What did they do?',
    detailPlaceholder: 'One specific thing is plenty',
    send: (first) => (first ? `Send to ${first}` : 'Send'),
  },
  // The incentive. It rewards one meaningful recognition, not volume.
  incentive: {
    name: 'weekly drawing',
    prize: 'a $25 gift card',
    limitPerWeek: 1,
    minWords: 5,
    lockedTitle: 'Drawing entry: locked',
    lockedBody: 'Say one specific thing they did to unlock it.',
    unlockedTitle: 'Drawing entry: unlocked',
    unlockedBody: 'Specific thanks. That’s the good stuff.',
    rule: 'One entry a week, max. Sending more won’t add entries.',
    earnedTitle: 'You’re in this week’s drawing',
    earnedBody: 'One entry for a $25 gift card. It’s saved to your account.',
    notEarnedTitle: 'No drawing entry this time',
    notEarnedBody: 'Your thanks still counts. Add one specific detail next time to get an entry.',
  },
  seeFeed: (first) => `See it in ${first}’s feed`,
  feed: {
    title: 'Your feed',
    newLabel: 'New',
    next: 'See the manager’s view',
  },
  managerView: {
    title: `${workplace.unit} recognition`,
    sub: 'This week',
    // Made-up numbers.
    stats: [
      { label: 'Recognitions sent', value: 14 },
      { label: 'From thank-you cards', value: 5 },
      { label: 'Cards handed out', value: 24 },
    ],
    listTitle: 'Latest',
    counted: 'Counted toward team recognition',
    entryIssued: 'Drawing entry issued: 1. Limit is 1 per person, per week.',
    entryNotIssued: 'No drawing entry issued. The thanks had no specific reason.',
  },
  sourceTag: 'Thank-you card',
};

// Older posts that fill out the feed and the manager's list.
export const olderPosts = [
  {
    id: 'p1',
    fromId: 'priya',
    toId: 'denise',
    when: 'Yesterday',
    message: 'Thanks for walking me through the new IV pump. I would have been lost.',
    source: 'App',
  },
  {
    id: 'p2',
    fromId: 'andre',
    toId: 'luis',
    when: 'Monday',
    message: 'You had every patient ready before I got there. Made my whole route easier.',
    source: 'Thank-you card',
  },
];

// ---------------------------------------------------------------------------
// Flow 3 — Post-shift reminders
// ---------------------------------------------------------------------------

export const reminders = {
  timeclock: {
    label: 'Timeclock',
    mockTag: 'Mock',
    onShift: 'On the clock',
    clockedIn: `Clocked in ${shift.clockIn}`,
    clockOut: 'Clock out',
    doneTitle: 'You’re clocked out',
    doneSub: `${shift.length} today. Go rest.`,
    standIn: 'Stand-in for your workforce system (UKG, ADP, Workday, Gusto).',
  },
  notification: {
    app: 'Culture Cloud',
    when: 'now',
    title: 'Did someone help you today?',
    body: 'Tap to thank them. Takes about 10 seconds.',
  },
  prompt: {
    title: 'Did someone help you today?',
    sub: 'From your shift',
    addNote: 'Add a note',
    send: (first) => (first ? `Send to ${first}` : 'Pick someone to send'),
  },
  notToday: 'Not today',
  turnOff: 'Turn off reminders',
  // Made-up guardrails that answer the notification-fatigue risk.
  rules: {
    longShiftHours: 8,
    maxPerWeek: 2,
  },
  skipped: {
    title: 'No worries',
    body: 'Nothing sent. Rest up.',
    rule: 'We only ask after long shifts, and never more than twice a week.',
  },
  off: {
    title: 'Reminders are off',
    body: 'No more prompts after your shifts. You can turn them back on in Settings anytime.',
    undo: 'Turn back on',
  },
  taps: {
    label: (n) => `${n} ${n === 1 ? 'tap' : 'taps'}`,
    sub: 'from notification to sent',
    noTyping: 'No typing',
    withNote: 'Plus the note you added',
    steps: ['Notification', 'Coworker', 'Reason', 'Send'],
  },
  sourceTag: 'After-shift reminder',
};

// ---------------------------------------------------------------------------
// Flows: home cards and presenter panel content
//
// `steps` is the main path, in order. `sideSteps` are branches off it.
// Each step: title (shown to the presenter), metric (what this step would
// move), and an optional note (what to say, or the sponsor's question).
// ---------------------------------------------------------------------------

export const flows = {
  video: {
    id: 'video',
    path: '/video',
    number: 1,
    name: 'Video recognition',
    lead: 'David',
    pitch: 'Record a 15 to 30 second thank-you instead of typing one.',
    barrier: 'No time to type, and not sure what to say.',
    steps: [
      {
        id: 'pick',
        title: 'Pick a coworker',
        metric: 'Recognition flows started',
        note: 'Only people from today’s shift show up, so there is nothing to search.',
      },
      {
        id: 'record',
        title: 'Record',
        metric: 'Starts that turn into a recorded video',
        note: 'Sponsor question: would anyone record after a long shift? One button, a starter line, and a visible way to write instead.',
      },
      {
        id: 'preview',
        title: 'Preview with captions',
        metric: 'Recorded videos that get sent, not abandoned',
        note: 'Captions are scripted for the demo. Retake is one tap.',
      },
      {
        id: 'sent',
        title: 'Sent',
        metric: 'Recognition sent per Gen Z frontline worker, per month',
      },
    ],
    sideSteps: [
      {
        id: 'write',
        title: 'Write a message instead',
        metric: 'Recognitions saved by the text option',
        note: 'Anyone who does not want to be on camera still sends.',
      },
    ],
  },
  qr: {
    id: 'qr',
    path: '/qr',
    number: 2,
    name: 'QR recognition cards',
    lead: 'Sam',
    pitch: 'A paper thank-you card with a code that opens a short recognition flow.',
    barrier: 'Forgetting to open Culture Cloud, and no quick way to reach it at work.',
    steps: [
      {
        id: 'card',
        title: 'The printed card',
        metric: 'Cards scanned out of cards handed out',
        note: 'Each card is issued to one employee, so the code already knows who is sending.',
      },
      {
        id: 'form',
        title: 'Scan lands here',
        metric: 'QR scans that lead to recognition sent',
        note: 'No login wall, no menus. The drawing entry unlocks only with a specific reason.',
      },
      {
        id: 'sent',
        title: 'Sent',
        metric: 'Meaningful recognitions sent (pass the specific-reason check)',
        note: 'One entry a week, so sending more does not earn more.',
      },
      {
        id: 'feed',
        title: 'Recipient’s feed',
        metric: 'Card recognitions that post to the feed',
        note: 'Sponsor concern: how does paper get into the platform? It posts like any other recognition.',
      },
      {
        id: 'manager',
        title: 'Manager’s view',
        metric: 'Card recognitions counted in team reporting',
        note: 'Counted, visible to the manager, and the entry is tied to an account.',
      },
    ],
    sideSteps: [],
  },
  reminders: {
    id: 'reminders',
    path: '/reminders',
    number: 3,
    name: 'Post-shift reminders',
    lead: 'Rane',
    pitch: 'An optional nudge at clock-out: “Did someone help you today?”',
    barrier: 'Good moments are forgotten by the time there is a chance to recognize someone.',
    steps: [
      {
        id: 'clock',
        title: 'Clock out',
        metric: 'Long shifts that trigger a prompt',
        note: 'Generic timeclock. It stands in for UKG, ADP, Workday, or Gusto.',
      },
      {
        id: 'notify',
        title: 'The prompt arrives',
        metric: 'Prompts tapped out of prompts delivered',
        note: 'Optional. “Not today” is right on the notification.',
      },
      {
        id: 'prompt',
        title: 'Pick someone and a reason',
        metric: 'Prompts that lead to recognition sent',
        note: 'Coworkers come from the shift schedule, so there is nothing to search or type.',
      },
      {
        id: 'sent',
        title: 'Sent',
        metric: 'Taps from notification to sent',
        note: 'Sponsor question: how few taps? The counter shows what this run took.',
      },
    ],
    sideSteps: [
      {
        id: 'skipped',
        title: 'Not today',
        metric: '“Not today” rate (watch for fatigue)',
        note: 'Skipping is one tap and costs nothing.',
      },
      {
        id: 'off',
        title: 'Reminders turned off',
        metric: 'Reminder opt-out rate',
        note: 'Opt-out is one tap from the prompt, and it can be undone.',
      },
    ],
  },
};

export const flowList = [flows.video, flows.qr, flows.reminders];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const everyone = [persona, manager, ...coworkers];

export function getPerson(id) {
  return everyone.find((p) => p.id === id) || null;
}

export function getReason(id) {
  return reasons.find((r) => r.id === id) || null;
}
