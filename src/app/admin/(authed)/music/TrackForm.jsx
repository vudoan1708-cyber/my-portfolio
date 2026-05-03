'use client';

import { useActionState, useState } from 'react';
import { saveTrackAction } from './actions';
import {
  FieldGroup,
  TextField,
  TextareaField,
} from '../_components/Field';
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
    success: false,
  });
  const [track, setTrack] = useState(() => ({ ...EMPTY_TRACK, ...(initial ?? {}) }));
  const set = (field) => (value) => setTrack((p) => ({ ...p, [field]: value }));

  return (
    <form action={formAction}>
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
              required
            />
            <TextField label="Key (slug)" value={track.key} onChange={set('key')} required />
            <TextField label="Title" value={track.title} onChange={set('title')} required />
            <TextField
              label="Date modified"
              value={track.dateModified ?? ''}
              onChange={(v) => set('dateModified')(v === '' ? null : v)}
              placeholder="Apr 02, 2025"
            />
          </div>
        </FieldGroup>

        <FieldGroup title="Assets">
          <TextField
            label="Cover image path"
            value={track.img}
            onChange={set('img')}
            placeholder="/music/your-track/cover.webp"
            required
          />
          <TextField
            label="Audio source path"
            value={track.src}
            onChange={set('src')}
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
            renderItem={(text, update) => (
              <TextareaField
                label="HTML allowed (subset). Forbidden: <script>, on*= attrs, javascript: URLs."
                value={text}
                onChange={update}
                rows={3}
              />
            )}
          />
        </FieldGroup>
      </div>

      <SaveBar error={state.error} success={state.success} />
    </form>
  );
}
