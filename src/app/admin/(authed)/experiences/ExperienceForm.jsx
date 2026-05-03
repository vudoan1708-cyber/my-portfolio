'use client';

import { useActionState, useState } from 'react';
import { saveExperienceAction } from './actions';
import {
  CheckboxField,
  FieldGroup,
  TextField,
  TextareaField,
} from '../_components/Field';
import Repeater from '../_components/Repeater';
import SaveBar from '../_components/SaveBar';

const EMPTY_EXP = {
  id: '',
  key: '',
  company: '',
  companyURL: null,
  role: '',
  location: null,
  employmentType: null,
  startDate: '',
  endDate: null,
  current: false,
  logo: null,
  summary: null,
  technologies: [],
  relatedProjectKeys: [],
};

function newTech() {
  return { id: '', name: '', link: '', img: '' };
}

export default function ExperienceForm({ initial, originalKey }) {
  const [state, formAction] = useActionState(saveExperienceAction, {
    error: null,
    fieldErrors: null,
  });
  const [exp, setExp] = useState(() => ({ ...EMPTY_EXP, ...(initial ?? {}) }));
  const errAt = (path) => state.fieldErrors?.[path];
  const set = (field) => (value) => setExp((p) => ({ ...p, [field]: value }));

  return (
    <form action={formAction}>
      <input type="hidden" name="originalKey" value={originalKey ?? ''} />
      <input type="hidden" name="payload" value={JSON.stringify(exp)} />

      <div className="space-y-6">
        <FieldGroup title="Identity">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <TextField label="ID" value={exp.id} onChange={set('id')} error={errAt('id')} required />
            <TextField label="Key (slug)" value={exp.key} onChange={set('key')} error={errAt('key')} required />
            <TextField label="Company" value={exp.company} onChange={set('company')} error={errAt('company')} required />
            <TextField label="Company URL" value={exp.companyURL ?? ''} onChange={(v) => set('companyURL')(v === '' ? null : v)} error={errAt('companyURL')} />
            <TextField label="Role" value={exp.role} onChange={set('role')} error={errAt('role')} required />
            <TextField label="Location" value={exp.location ?? ''} onChange={(v) => set('location')(v === '' ? null : v)} error={errAt('location')} />
            <TextField label="Employment type" value={exp.employmentType ?? ''} onChange={(v) => set('employmentType')(v === '' ? null : v)} error={errAt('employmentType')} />
            <TextField label="Logo path" value={exp.logo ?? ''} onChange={(v) => set('logo')(v === '' ? null : v)} error={errAt('logo')} />
          </div>
        </FieldGroup>

        <FieldGroup title="Dates">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <TextField label="Start date" value={exp.startDate} onChange={set('startDate')} error={errAt('startDate')} required />
            <TextField label="End date (blank if current)" value={exp.endDate ?? ''} onChange={(v) => set('endDate')(v === '' ? null : v)} error={errAt('endDate')} />
          </div>
          <CheckboxField label="Current role" value={exp.current} onChange={set('current')} />
        </FieldGroup>

        <FieldGroup title="Summary">
          <TextareaField
            label="HTML allowed (subset). Forbidden: <script>, on*= attrs, javascript: URLs."
            value={exp.summary ?? ''}
            onChange={(v) => set('summary')(v === '' ? null : v)}
            error={errAt('summary')}
            rows={5}
          />
        </FieldGroup>

        <FieldGroup title="Technologies">
          <Repeater
            items={exp.technologies}
            onChange={set('technologies')}
            newItem={newTech}
            itemLabel="Tech"
            renderItem={(t, update, idx) => (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <TextField label="ID (slug)" value={t.id} onChange={(v) => update({ ...t, id: v })} error={errAt(`technologies.${idx}.id`)} />
                <TextField label="Display name" value={t.name} onChange={(v) => update({ ...t, name: v })} error={errAt(`technologies.${idx}.name`)} />
                <TextField label="Link" value={t.link ?? ''} onChange={(v) => update({ ...t, link: v })} error={errAt(`technologies.${idx}.link`)} />
                <TextField label="Image path" value={t.img ?? ''} onChange={(v) => update({ ...t, img: v })} error={errAt(`technologies.${idx}.img`)} />
              </div>
            )}
          />
        </FieldGroup>

        <FieldGroup title="Related project keys">
          <Repeater
            items={exp.relatedProjectKeys}
            onChange={set('relatedProjectKeys')}
            newItem={() => ''}
            itemLabel="Key"
            renderItem={(slug, update, idx) => (
              <TextField label="Project key (slug)" value={slug} onChange={update} error={errAt(`relatedProjectKeys.${idx}`)} />
            )}
          />
        </FieldGroup>
      </div>

      <SaveBar error={state.error} />
    </form>
  );
}
