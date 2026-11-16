import { useEffect } from 'react';
import { Avatar } from '../components/Avatar.jsx';
import { ArrowRightIcon, BellIcon, QrIcon, VideoIcon } from '../components/Icons.jsx';
import { flowList, persona, project, workplace } from '../data/mockData.js';
import { navigate } from '../lib/useHashRoute.js';

const icons = { video: VideoIcon, qr: QrIcon, reminders: BellIcon };

function Field({ label, children }) {
  return (
    <div>
      <dt className="text-xs font-semibold tracking-wide text-ink-subtle uppercase">{label}</dt>
      <dd className="mt-0.5 text-base leading-snug">{children}</dd>
    </div>
  );
}

export default function Home() {
  // Press 1, 2 or 3 to open a prototype.
  useEffect(() => {
    function onKey(e) {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const flow = flowList.find((f) => String(f.number) === e.key);
      if (flow) navigate(flow.path);
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <div className="min-h-dvh bg-canvas">
      <div className="mx-auto flex min-h-dvh max-w-6xl flex-col px-5 py-8 md:px-10 md:py-12">
        <header>
          <p className="text-base font-bold tracking-tight">{project.productLabel}</p>
          <h1 className="mt-6 text-3xl leading-tight font-bold tracking-tight md:text-5xl">
            {project.title}
          </h1>
          <p className="mt-3 max-w-3xl text-lg text-ink-muted md:text-xl">{project.goal}</p>
          <p className="mt-1 text-sm font-medium text-ink-subtle md:text-base">{project.metric}</p>
        </header>

        <section className="mt-8 flex items-center gap-4 rounded-card border border-line bg-surface p-4 shadow-card md:p-5">
          <Avatar person={persona} size="lg" />
          <div className="min-w-0">
            <p className="font-semibold">
              Meet {persona.first}, {persona.age} · {persona.role}, {workplace.unit}
            </p>
            <p className="text-sm text-ink-muted md:text-base">{persona.story}</p>
          </div>
        </section>

        <main className="mt-6 grid gap-5 md:grid-cols-3">
          {flowList.map((flow) => {
            const Icon = icons[flow.id];
            return (
              <a
                key={flow.id}
                href={`#${flow.path}`}
                className="group flex flex-col rounded-card border border-line bg-surface p-6 shadow-card transition-colors hover:border-primary"
              >
                <div className="flex items-center justify-between">
                  <span className="flex h-12 w-12 items-center justify-center rounded-control bg-primary-soft text-primary">
                    <Icon size={26} />
                  </span>
                  <span className="text-sm font-semibold text-ink-subtle">
                    Prototype {flow.number}
                  </span>
                </div>
                <h2 className="mt-5 text-2xl font-bold tracking-tight">{flow.name}</h2>
                <p className="mt-1 text-ink-muted">{flow.pitch}</p>
                <dl className="mt-5 space-y-4 border-t border-line pt-5">
                  <Field label="Barrier it addresses">{flow.barrier}</Field>
                  <Field label="Team lead">{flow.lead}</Field>
                </dl>
                <span className="mt-auto block pt-6">
                  <span className="flex min-h-13 items-center justify-center gap-2 rounded-control bg-primary px-5 font-semibold text-on-primary group-hover:bg-primary-hover">
                    Open prototype <ArrowRightIcon size={18} />
                  </span>
                </span>
              </a>
            );
          })}
        </main>

        <footer className="mt-auto pt-8 text-sm text-ink-subtle">
          <p>
            {project.team} · Press 1, 2 or 3 to open a prototype. Inside one, use the arrow keys.
          </p>
          <p className="mt-1">{project.disclaimer}</p>
        </footer>
      </div>
    </div>
  );
}
