'use client';

import { useActionState, useCallback, useEffect, useState } from 'react';
import { saveTrackAction } from './actions';
import {
  FieldGroup,
  TextField,
  TextareaField,
} from '../_components/Field';
import ImageUrlField from '../_components/ImageUrlField';
import Repeater from '../_components/Repeater';
import SaveBar from '../_components/SaveBar';

const EMPTY_TRACK = {
  id: '',
  key: '',
  title: '',
  img: '',
  src: '',
  dateModified: '',
  description: [],
};

export default function TrackForm({ initial, originalKey }) {
  const [state, formAction] = useActionState(saveTrackAction, {
    error: null,
    fieldErrors: null,
  });
  const [track, setTrack] = useState(() => ({ ...EMPTY_TRACK, ...(initial ?? {}) }));
  const errAt = (path) => state.fieldErrors?.[path];
  const set = (field) => (value) => setTrack((p) => ({ ...p, [field]: value }));

  const fieldErrorCount = state.fieldErrors
    ? Object.keys(state.fieldErrors).length
    : 0;
  const [errorSnapshot, setErrorSnapshot] = useState(null);
  useEffect(() => {
    if (fieldErrorCount > 0) {
      setErrorSnapshot(JSON.stringify(track));
    } else {
      setErrorSnapshot(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);
  const editedSinceError =
    errorSnapshot !== null && errorSnapshot !== JSON.stringify(track);

  const [invalidFields, setInvalidFields] = useState({});
  const onFieldValidity = useCallback((key, isValid) => {
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
  const invalidFieldCount = Object.keys(invalidFields).length;

  const hasFieldErrors = fieldErrorCount > 0 && !editedSinceError;
  const saveDisabled = hasFieldErrors || invalidFieldCount > 0;

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
    }
  };

  return (
    <form action={formAction} onSubmit={onSubmit}>
      <input type="hidden" name="originalKey" value={originalKey ?? ''} />
      <input type="hidden" name="payload" value={JSON.stringify(track)} />

      <div className="space-y-6">
        <FieldGroup title="Identity">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <TextField
              label="Numeric ID"
              type="number"
              value={track.id}
              onChange={(v) => set('id')(v === '' ? '' : Number(v) || v)}
              error={errAt('id')}
              required
            />
            <TextField label="Key (slug)" value={track.key} onChange={set('key')} error={errAt('key')} required />
            <TextField label="Title" value={track.title} onChange={set('title')} error={errAt('title')} required />
            <TextField
              label="Date modified"
              value={track.dateModified ?? ''}
              onChange={(v) => set('dateModified')(v === '' ? null : v)}
              error={errAt('dateModified')}
              placeholder="Apr 02, 2025"
            />
          </div>
        </FieldGroup>

        <FieldGroup title="Assets">
          <ImageUrlField
            label="Cover image path"
            value={track.img}
            onChange={set('img')}
            error={errAt('img')}
            placeholder="/music/your-track/cover.webp"
            required
            validityKey="img"
            onValidityChange={onFieldValidity}
          />
          <TextField
            label="Audio source path"
            value={track.src}
            onChange={set('src')}
            error={errAt('src')}
            placeholder="/music/your-track/track.mp3"
            required
          />
        </FieldGroup>

        <FieldGroup title="Description (each entry = one HTML paragraph)">
          <Repeater
            items={track.description}
            onChange={set('description')}
            newItem={() => ''}
            itemLabel="Paragraph"
            renderItem={(text, update, idx) => (
              <TextareaField
                label="HTML allowed (subset). Forbidden: <script>, on*= attrs, javascript: URLs."
                value={text}
                onChange={update}
                error={errAt(`description.${idx}`)}
                rows={3}
              />
            )}
          />
        </FieldGroup>
      </div>

      <SaveBar error={state.error} />
    </form>
  );
}
