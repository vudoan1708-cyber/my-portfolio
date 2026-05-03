'use client';

function ErrorText({ error }) {
  if (!error) return null;
  return (
    <span className="block text-xs text-rose-300 mt-1.5" role="alert">
      {error}
    </span>
  );
}

export function TextField({
  label,
  name,
  value,
  onChange,
  type = 'text',
  error,
  ...rest
}) {
  return (
    <label className="block">
      <span className="block text-xs uppercase tracking-[0.2em] text-white/50 mb-1.5">
        {label}
      </span>
      <input
        type={type}
        name={name}
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={Boolean(error) || undefined}
        className={`w-full rounded-lg bg-white/5 ring-1 focus:outline-none text-white px-3 py-2 ${
          error
            ? 'ring-rose-400/60 focus:ring-rose-400'
            : 'ring-white/10 focus:ring-rose-400'
        }`}
        {...rest}
      />
      <ErrorText error={error} />
    </label>
  );
}

export function TextareaField({
  label,
  value,
  onChange,
  rows = 4,
  error,
  ...rest
}) {
  return (
    <label className="block">
      <span className="block text-xs uppercase tracking-[0.2em] text-white/50 mb-1.5">
        {label}
      </span>
      <textarea
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        aria-invalid={Boolean(error) || undefined}
        className={`w-full rounded-lg bg-white/5 ring-1 focus:outline-none text-white px-3 py-2 font-mono text-sm ${
          error
            ? 'ring-rose-400/60 focus:ring-rose-400'
            : 'ring-white/10 focus:ring-rose-400'
        }`}
        {...rest}
      />
      <ErrorText error={error} />
    </label>
  );
}

export function CheckboxField({ label, value, onChange, error }) {
  return (
    <div>
      <label className="inline-flex items-center gap-2 select-none">
        <input
          type="checkbox"
          checked={!!value}
          onChange={(e) => onChange(e.target.checked)}
          aria-invalid={Boolean(error) || undefined}
          className="w-4 h-4 rounded bg-white/5 ring-1 ring-white/10 text-rose-500 focus:ring-rose-400"
        />
        <span className="text-sm text-white/85">{label}</span>
      </label>
      <ErrorText error={error} />
    </div>
  );
}

export function SelectField({ label, value, onChange, options, error }) {
  return (
    <label className="block">
      <span className="block text-xs uppercase tracking-[0.2em] text-white/50 mb-1.5">
        {label}
      </span>
      <select
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={Boolean(error) || undefined}
        className={`w-full rounded-lg bg-white/5 ring-1 focus:outline-none text-white px-3 py-2 ${
          error
            ? 'ring-rose-400/60 focus:ring-rose-400'
            : 'ring-white/10 focus:ring-rose-400'
        }`}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} className="bg-neutral-900">
            {opt.label}
          </option>
        ))}
      </select>
      <ErrorText error={error} />
    </label>
  );
}

export function FieldGroup({ title, children }) {
  return (
    <fieldset className="rounded-xl ring-1 ring-white/10 bg-white/[0.03] p-5">
      {title ? (
        <legend className="px-2 text-xs uppercase tracking-[0.25em] text-rose-300/80">
          {title}
        </legend>
      ) : null}
      <div className="space-y-4">{children}</div>
    </fieldset>
  );
}
