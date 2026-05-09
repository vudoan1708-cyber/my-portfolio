'use client';

import { useActionState, useCallback, useEffect, useMemo, useState } from 'react';
import { saveTechAction } from './actions';
import {
  FieldGroup,
  SelectField,
  TextField,
} from '../_components/Field';
import ImageUrlField from '../_components/ImageUrlField';
import UrlField from '../_components/UrlField';
import SaveBar from '../_components/SaveBar';
import useFormDraft from '../_components/useFormDraft';
import DraftRestoreBanner from '../_components/DraftRestoreBanner';

const EMPTY_ITEM = {
  id: '',
  name: '',
  link: '',
  img: '',
  type: 'tech',
  category: 'frontend',
  tailwindCssClass: '',
};

const TYPE_OPTIONS = [
  { value: 'tech', label: 'Tech (technology / language / library)' },
  { value: 'api', label: 'API (third-party API or platform)' },
];

const CATEGORY_OPTIONS = [
  { value: 'fullstack', label: 'Full-stack' },
  { value: 'frontend', label: 'Frontend' },
  { value: 'backend', label: 'Backend' },
  { value: 'tooling', label: 'Tooling' },
  { value: 'design', label: 'Design' },
];

export default function TechRegistryForm({ initial, originalId }) {
  const [state, formAction] = useActionState(saveTechAction, {
    error: null,
    fieldErrors: null,
  });
  const initialState = useMemo(
    () => ({
      ...EMPTY_ITEM,
      ...(initial ?? {}),
      tailwindCssClass: initial?.tailwindCssClass ?? '',
    }),
    [initial],
  );
  const [item, setItem] = useState(initialState);
  const [initialJson] = useState(() => JSON.stringify(initialState));
  const draftKey = `tech-registry:${originalId ?? 'new'}`;
  const { restoredAt, clear: clearDraft } = useFormDraft({
    key: draftKey,
    value: item,
    initialJson,
    onRestore: setItem,
  });
  const discardDraft = () => {
    setItem(initialState);
    clearDraft();
  };

  const errAt = (path) => state.fieldErrors?.[path];
  const set = (field) => (value) =>
    setItem((p) => ({ ...p, [field]: value }));

  const fieldErrorCount = state.fieldErrors
    ? Object.keys(state.fieldErrors).length
    : 0;
  const [errorSnapshot, setErrorSnapshot] = useState(null);
  useEffect(() => {
    if (fieldErrorCount > 0) {
      setErrorSnapshot(JSON.stringify(item));
    } else {
      setErrorSnapshot(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);
  const editedSinceError =
    errorSnapshot !== null && errorSnapshot !== JSON.stringify(item);

  const [invalidFields, setInvalidFields] = useState({});
  const onValidity = useCallback((key, isValid) => {
    setInvalidFields((prev) => {
      if (isValid) {
        if (!(key in prev)) return prev;
        const next = { ...prev };
        delete next[key];
        return next;
      }
      if (prev[key]) return prev;
      return { ...prev, [key]: true };
    });
  }, []);
  const invalidCount = Object.keys(invalidFields).length;

  const hasFieldErrors = fieldErrorCount > 0 && !editedSinceError;
  const saveDisabled = hasFieldErrors || invalidCount > 0;

  const scrollFirstInvalidIntoView = (root) => {
    const target = (root ?? document).querySelector('[aria-invalid="true"]');
    if (target && typeof target.scrollIntoView === 'function') {
      target.scrollIntoView({ behavior: 'smooth', block: 'center' });
      if (typeof target.focus === 'function') {
        target.focus({ preventScroll: true });
      }
    }
  };

  useEffect(() => {
    if (fieldErrorCount > 0) {
      requestAnimationFrame(() => scrollFirstInvalidIntoView());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  const onSubmit = (e) => {
    if (saveDisabled) {
      e.preventDefault();
      scrollFirstInvalidIntoView(e.currentTarget);
      return;
    }
    clearDraft();
  };

  const submitPayload = {
    ...item,
    tailwindCssClass: item.tailwindCssClass?.trim() || null,
    ...(item.type === 'api' ? { category: undefined } : {}),
  };

  return (
    <form action={formAction} onSubmit={onSubmit}>
      <input type="hidden" name="originalId" value={originalId ?? ''} />
      <input type="hidden" name="payload" value={JSON.stringify(submitPayload)} />

      <DraftRestoreBanner restoredAt={restoredAt} onDiscard={discardDraft} />

      <div className="space-y-6">
        <FieldGroup title="Identity">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <TextField
              label="ID (slug)"
              value={item.id}
              onChange={set('id')}
              error={errAt('id')}
              pattern="^[a-z0-9]+(-[a-z0-9]+)*$"
              required
            />
            <TextField
              label="Display name"
              value={item.name}
              onChange={set('name')}
              error={errAt('name')}
              required
            />
            <SelectField
              label="Type"
              value={item.type}
              onChange={set('type')}
              options={TYPE_OPTIONS}
            />
            {item.type === 'tech' ? (
              <SelectField
                label="Category"
                value={item.category ?? 'frontend'}
                onChange={set('category')}
                options={CATEGORY_OPTIONS}
                error={errAt('category')}
              />
            ) : null}
            <TextField
              label="Tailwind class for icon background (optional)"
              value={item.tailwindCssClass ?? ''}
              onChange={set('tailwindCssClass')}
              error={errAt('tailwindCssClass')}
              placeholder="e.g. bg-white"
            />
          </div>
        </FieldGroup>

        <FieldGroup title="Link">
          <UrlField
            label="Documentation / homepage URL"
            value={item.link}
            onChange={set('link')}
            error={errAt('link')}
            placeholder="https://reactjs.org/"
            required
            validityKey="link"
            onValidityChange={onValidity}
          />
        </FieldGroup>

        <FieldGroup title="Icon image">
          <ImageUrlField
            label="Image path"
            value={item.img}
            onChange={set('img')}
            error={errAt('img')}
            placeholder="/projects/techs/react.svg"
            required
            validityKey="img"
            onValidityChange={onValidity}
          />
        </FieldGroup>
      </div>

      <SaveBar error={state.error} />
    </form>
  );
}
