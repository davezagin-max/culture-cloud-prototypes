import { Avatar } from './Avatar.jsx';
import { CheckIcon } from './Icons.jsx';

// List of coworkers. Tap a row to pick.
export function PeoplePicker({ people, selectedId, onPick }) {
  return (
    <ul className="space-y-2">
      {people.map((person) => {
        const selected = person.id === selectedId;
        return (
          <li key={person.id}>
            <button
              type="button"
              onClick={() => onPick(person.id)}
              aria-pressed={selected}
              className={`flex w-full items-center gap-3 rounded-card border p-3 text-left transition-colors ${
                selected
                  ? 'border-primary bg-primary-soft'
                  : 'border-line bg-surface hover:bg-surface-muted'
              }`}
            >
              <Avatar person={person} />
              <span className="min-w-0 flex-1">
                <span className="block truncate font-semibold">{person.name}</span>
                <span className="block truncate text-sm text-ink-muted">
                  {person.role} · {person.overlap}
                </span>
              </span>
              {selected && <CheckIcon className="shrink-0 text-primary" />}
            </button>
          </li>
        );
      })}
    </ul>
  );
}

// The same coworkers as a single row of faces, for one-screen forms.
export function PeopleRow({ people, selectedId, onPick, emptyHint }) {
  const selected = people.find((p) => p.id === selectedId);
  return (
    <div>
      <ul className="grid grid-cols-5 gap-1">
        {people.map((person) => {
          const isSelected = person.id === selectedId;
          return (
            <li key={person.id}>
              <button
                type="button"
                onClick={() => onPick(person.id)}
                aria-pressed={isSelected}
                aria-label={`${person.name}, ${person.role}`}
                className={`flex w-full flex-col items-center gap-1.5 rounded-control border px-1 py-2 transition-colors ${
                  isSelected
                    ? 'border-primary bg-primary-soft'
                    : 'border-transparent hover:bg-surface-muted'
                }`}
              >
                <Avatar person={person} />
                <span className={`text-xs ${isSelected ? 'font-bold' : 'font-medium'}`}>
                  {person.first}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
      <p className="mt-2 min-h-5 text-sm text-ink-muted">
        {selected ? `${selected.name} · ${selected.role} · ${selected.overlap}` : emptyHint}
      </p>
    </div>
  );
}

// Quick reasons as tappable chips.
export function ReasonChips({ reasons, selectedId, onPick }) {
  return (
    <div className="flex flex-wrap gap-2">
      {reasons.map((reason) => {
        const selected = reason.id === selectedId;
        return (
          <button
            key={reason.id}
            type="button"
            onClick={() => onPick(reason.id)}
            aria-pressed={selected}
            className={`min-h-10 rounded-pill border px-4 text-sm font-medium transition-colors ${
              selected
                ? 'border-primary bg-primary text-on-primary'
                : 'border-line bg-surface text-ink hover:bg-surface-muted'
            }`}
          >
            {reason.label}
          </button>
        );
      })}
    </div>
  );
}

export function DetailInput({ label, placeholder, value, onChange, rows = 3 }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-semibold">{label}</span>
      <textarea
        rows={rows}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="block w-full resize-none rounded-control border border-line bg-surface-muted px-3.5 py-3 text-base text-ink placeholder:text-ink-subtle focus:border-primary focus:bg-surface focus:outline-none"
      />
    </label>
  );
}

export function SectionTitle({ children, className = '' }) {
  return (
    <h2 className={`mb-2 text-sm font-semibold text-ink-muted ${className}`}>{children}</h2>
  );
}
