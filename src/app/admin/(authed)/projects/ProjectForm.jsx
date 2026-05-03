'use client';

import { useActionState, useMemo, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { saveProjectAction } from './actions';
import {
  CheckboxField,
  FieldGroup,
  SelectField,
  TextField,
  TextareaField,
} from '../_components/Field';
import Repeater from '../_components/Repeater';
import SaveBar from '../_components/SaveBar';

const EMPTY_PROJECT = {
  id: '',
  key: '',
  title: '',
  img: '',
  link: '',
  startDate: '',
  endDate: '',
  starred: false,
  role: '',
  projectType: '',
  projectCode: null,
  projectLog: null,
  projectURL: null,
  report: null,
  videos: [],
  design: null,
  technologies: [],
  apis: [],
  description: [],
  gallery: [],
};

function newTech() {
  return { id: '', name: '', link: '', img: '' };
}
function newGallery() {
  return { alt: '', img: '' };
}
function newVideo() {
  return { title: '', src: '' };
}
function emptyLinkBlock() {
  return { title: '', label: '', link: '' };
}

export default function ProjectForm({
  initial,
  collections,
  originalCollection,
  originalKey,
}) {
  const [state, formAction] = useActionState(saveProjectAction, {
    error: null,
    success: false,
  });
  const [project, setProject] = useState(() => ({
    ...EMPTY_PROJECT,
    ...(initial ?? {}),
  }));

  const set = (field) => (value) =>
    setProject((p) => ({ ...p, [field]: value }));

  const collectionOptions = useMemo(
    () =>
      collections.map((c) => ({ value: c.key, label: `${c.label} (${c.key})` })),
    [collections],
  );

  const collectionFromLink = project.link?.split('/')[2] ?? collections[0]?.key ?? '';
  const setCollectionFromLink = (collection) => {
    const slug = project.key || 'new-project';
    setProject((p) => ({ ...p, link: `/portfolio/${collection}/${slug}` }));
  };
  const setKey = (newKey) => {
    setProject((p) => ({
      ...p,
      key: newKey,
      link: `/portfolio/${collectionFromLink}/${newKey}`,
    }));
  };

  return (
    <form action={formAction}>
      <input type="hidden" name="originalCollection" value={originalCollection ?? ''} />
      <input type="hidden" name="originalKey" value={originalKey ?? ''} />
      <input type="hidden" name="payload" value={JSON.stringify(project)} />

      <div className="space-y-6">
        <FieldGroup title="Identity">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <TextField
              label="Title"
              name="title"
              value={project.title}
              onChange={set('title')}
              required
            />
            <TextField
              label="Key (slug)"
              name="key"
              value={project.key}
              onChange={setKey}
              pattern="^[a-z0-9]+(-[a-z0-9]+)*$"
              required
            />
            <TextField
              label="Numeric ID"
              name="id"
              value={project.id}
              onChange={(v) => set('id')(v === '' ? '' : Number(v) || v)}
              type="number"
            />
            <SelectField
              label="Collection"
              value={collectionFromLink}
              onChange={setCollectionFromLink}
              options={collectionOptions}
            />
          </div>
          <TextField
            label="Link path (auto-generated, editable)"
            value={project.link}
            onChange={set('link')}
            placeholder="/portfolio/web-apps/your-key"
            required
          />
          <CheckboxField
            label="Starred (pin to top of collection)"
            value={project.starred}
            onChange={set('starred')}
          />
        </FieldGroup>

        <FieldGroup title="Cover image">
          <TextField
            label="Image path (relative to assets base or absolute)"
            value={project.img}
            onChange={set('img')}
            placeholder="/projects/foo/cover.webp"
            required
          />
          <TextField
            label="Larger preview image (optional)"
            value={project['img-lg'] ?? ''}
            onChange={set('img-lg')}
          />
        </FieldGroup>

        <FieldGroup title="Dates & meta">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <TextField
              label="Start date"
              value={project.startDate}
              onChange={set('startDate')}
              placeholder="Jul 28, 2023"
              required
            />
            <TextField
              label="End date (blank if ongoing)"
              value={project.endDate ?? ''}
              onChange={(v) => set('endDate')(v === '' ? null : v)}
              placeholder="Aug 29, 2025"
            />
            <TextField
              label="Role"
              value={project.role ?? ''}
              onChange={(v) => set('role')(v === '' ? null : v)}
            />
            <TextField
              label="Project type"
              value={project.projectType ?? ''}
              onChange={(v) => set('projectType')(v === '' ? null : v)}
            />
          </div>
        </FieldGroup>

        <FieldGroup title="Links">
          <LinkBlockField
            label="Project URL"
            value={project.projectURL}
            onChange={set('projectURL')}
            empty={emptyLinkBlock}
          />
          <LinkBlockField
            label="Project code"
            value={project.projectCode}
            onChange={set('projectCode')}
            empty={emptyLinkBlock}
          />
          <LinkBlockField
            label="Project log"
            value={project.projectLog}
            onChange={set('projectLog')}
            empty={emptyLinkBlock}
          />
          <LinkBlockField
            label="Report"
            value={project.report}
            onChange={set('report')}
            empty={emptyLinkBlock}
          />
          <LinkBlockField
            label="Design"
            value={project.design}
            onChange={set('design')}
            empty={emptyLinkBlock}
          />
        </FieldGroup>

        <FieldGroup title="Technologies">
          <Repeater
            items={project.technologies}
            onChange={set('technologies')}
            newItem={newTech}
            itemLabel="Tech"
            renderItem={(t, update) => (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <TextField label="ID (slug)" value={t.id} onChange={(v) => update({ ...t, id: v })} />
                <TextField label="Display name" value={t.name} onChange={(v) => update({ ...t, name: v })} />
                <TextField label="Link" value={t.link ?? ''} onChange={(v) => update({ ...t, link: v })} />
                <TextField label="Image path" value={t.img ?? ''} onChange={(v) => update({ ...t, img: v })} />
              </div>
            )}
          />
        </FieldGroup>

        <FieldGroup title="APIs">
          <Repeater
            items={project.apis}
            onChange={set('apis')}
            newItem={newTech}
            itemLabel="API"
            renderItem={(t, update) => (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <TextField label="ID (slug)" value={t.id} onChange={(v) => update({ ...t, id: v })} />
                <TextField label="Display name" value={t.name} onChange={(v) => update({ ...t, name: v })} />
                <TextField label="Link" value={t.link ?? ''} onChange={(v) => update({ ...t, link: v })} />
                <TextField label="Image path" value={t.img ?? ''} onChange={(v) => update({ ...t, img: v })} />
              </div>
            )}
          />
        </FieldGroup>

        <FieldGroup title="Description (each entry = one HTML paragraph)">
          <Repeater
            items={project.description}
            onChange={set('description')}
            newItem={() => ''}
            itemLabel="Paragraph"
            renderItem={(text, update) => (
              <TextareaField
                label="HTML allowed: <a>, <mark>, <li>, <br />, <p>. Forbidden: <script>, on*= attrs, javascript: URLs."
                value={text}
                onChange={update}
                rows={3}
              />
            )}
          />
        </FieldGroup>

        <FieldGroup title="Gallery">
          <Repeater
            items={project.gallery}
            onChange={set('gallery')}
            newItem={newGallery}
            itemLabel="Image"
            renderItem={(g, update) => (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <TextField label="Alt text" value={g.alt} onChange={(v) => update({ ...g, alt: v })} />
                <TextField label="Image path" value={g.img} onChange={(v) => update({ ...g, img: v })} />
              </div>
            )}
          />
        </FieldGroup>

        <FieldGroup title="Videos">
          <Repeater
            items={project.videos}
            onChange={set('videos')}
            newItem={newVideo}
            itemLabel="Video"
            renderItem={(v, update) => (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <TextField label="Title (optional)" value={v.title ?? ''} onChange={(val) => update({ ...v, title: val })} />
                <TextField label="Source URL" value={v.src} onChange={(val) => update({ ...v, src: val })} />
              </div>
            )}
          />
        </FieldGroup>
      </div>

      <SaveBar error={state.error} success={state.success} />
    </form>
  );
}

function LinkBlockField({ label, value, onChange, empty }) {
  const enabled = value !== null && value !== undefined;
  const update = (next) => onChange(next);
  return (
    <div className="rounded-lg ring-1 ring-white/10 bg-white/[0.02] p-4">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs uppercase tracking-[0.2em] text-white/65">{label}</span>
        <CheckboxField
          label={enabled ? 'Enabled' : 'Disabled'}
          value={enabled}
          onChange={(checked) => update(checked ? empty() : null)}
        />
      </div>
      {enabled ? (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <TextField label="Title" value={value.title} onChange={(v) => update({ ...value, title: v })} />
          <TextField label="Label" value={value.label} onChange={(v) => update({ ...value, label: v })} />
          <TextField label="Link" value={value.link} onChange={(v) => update({ ...value, link: v })} />
        </div>
      ) : null}
    </div>
  );
}
