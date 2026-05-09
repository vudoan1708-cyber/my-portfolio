'use client';

import { useActionState, useCallback, useEffect, useMemo, useState } from 'react';
import { saveProjectAction } from './actions';
import {
  CheckboxField,
  FieldGroup,
  SelectField,
  TextField,
  TextareaField,
} from '../_components/Field';
import ImageUrlField from '../_components/ImageUrlField';
import UrlField from '../_components/UrlField';
import Repeater from '../_components/Repeater';
import SaveBar from '../_components/SaveBar';
import TechMultiSelect from '../_components/TechMultiSelect';
import LivePreview from '../_components/LivePreview';
import PreviewLayout from '../_components/PreviewLayout';
import useFormDraft from '../_components/useFormDraft';
import DraftRestoreBanner from '../_components/DraftRestoreBanner';

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
  techRegistry = [],
  originalCollection,
  originalKey,
}) {
  const [state, formAction] = useActionState(saveProjectAction, {
    error: null,
    fieldErrors: null,
  });
  const initialState = useMemo(
    () => ({ ...EMPTY_PROJECT, ...(initial ?? {}) }),
    [initial],
  );
  const [project, setProject] = useState(initialState);
  const [initialJson] = useState(() => JSON.stringify(initialState));

  const draftKey = `project:${originalCollection ?? 'new'}:${originalKey ?? 'new'}`;
  const { restoredAt, clear: clearDraft } = useFormDraft({
    key: draftKey,
    value: project,
    initialJson,
    onRestore: setProject,
  });
  const discardDraft = () => {
    setProject(initialState);
    clearDraft();
  };

  const errAt = (path) => state.fieldErrors?.[path];
  const set = (field) => (value) =>
    setProject((p) => ({ ...p, [field]: value }));

  const fieldErrorCount = state.fieldErrors
    ? Object.keys(state.fieldErrors).length
    : 0;
  const [errorSnapshot, setErrorSnapshot] = useState(null);
  useEffect(() => {
    if (fieldErrorCount > 0) {
      setErrorSnapshot(JSON.stringify(project));
    } else {
      setErrorSnapshot(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);
  const editedSinceError =
    errorSnapshot !== null && errorSnapshot !== JSON.stringify(project);

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

  const onSubmit = (e) => {
    if (saveDisabled) {
      e.preventDefault();
      scrollFirstInvalidIntoView(e.currentTarget);
      return;
    }
    clearDraft();
  };

  return (
    <form action={formAction} onSubmit={onSubmit}>
      <input type="hidden" name="originalCollection" value={originalCollection ?? ''} />
      <input type="hidden" name="originalKey" value={originalKey ?? ''} />
      <input type="hidden" name="payload" value={JSON.stringify(project)} />

      <DraftRestoreBanner restoredAt={restoredAt} onDiscard={discardDraft} />

      <PreviewLayout preview={<LivePreview kind="project" data={project} />}>
        <div className="space-y-6">
          <FieldGroup title="Identity">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <TextField
                label="Title"
                name="title"
                value={project.title}
                onChange={set('title')}
                error={errAt('title')}
                required
              />
              <TextField
                label="Key (slug)"
                name="key"
                value={project.key}
                onChange={setKey}
                error={errAt('key')}
                pattern="^[a-z0-9]+(-[a-z0-9]+)*$"
                required
              />
              <TextField
                label="Numeric ID"
                name="id"
                value={project.id}
                onChange={(v) => set('id')(v === '' ? '' : Number(v) || v)}
                error={errAt('id')}
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
              error={errAt('link')}
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
            <ImageUrlField
              label="Thumbnail image (cover)"
              value={project.img}
              onChange={set('img')}
              error={errAt('img')}
              placeholder="/projects/foo/cover.webp"
              required
              validityKey="img"
              onValidityChange={onFieldValidity}
            />
            <ImageUrlField
              label="Larger preview image (optional)"
              value={project['img-lg'] ?? ''}
              onChange={set('img-lg')}
              error={errAt('img-lg')}
              validityKey="img-lg"
              onValidityChange={onFieldValidity}
            />
          </FieldGroup>

          <FieldGroup title="Dates & meta">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <TextField
                label="Start date"
                value={project.startDate}
                onChange={set('startDate')}
                error={errAt('startDate')}
                placeholder="Jul 28, 2023"
                required
              />
              <TextField
                label="End date (blank if ongoing)"
                value={project.endDate ?? ''}
                onChange={(v) => set('endDate')(v === '' ? null : v)}
                error={errAt('endDate')}
                placeholder="Aug 29, 2025"
              />
              <TextField
                label="Role"
                value={project.role ?? ''}
                onChange={(v) => set('role')(v === '' ? null : v)}
                error={errAt('role')}
              />
              <TextField
                label="Project type"
                value={project.projectType ?? ''}
                onChange={(v) => set('projectType')(v === '' ? null : v)}
                error={errAt('projectType')}
              />
            </div>
          </FieldGroup>

          <FieldGroup title="Links">
            <LinkBlockField label="Project URL" path="projectURL" value={project.projectURL} onChange={set('projectURL')} empty={emptyLinkBlock} errAt={errAt} onFieldValidity={onFieldValidity} />
            <LinkBlockField label="Project code" path="projectCode" value={project.projectCode} onChange={set('projectCode')} empty={emptyLinkBlock} errAt={errAt} onFieldValidity={onFieldValidity} />
            <LinkBlockField label="Project log" path="projectLog" value={project.projectLog} onChange={set('projectLog')} empty={emptyLinkBlock} errAt={errAt} onFieldValidity={onFieldValidity} />
            <LinkBlockField label="Report" path="report" value={project.report} onChange={set('report')} empty={emptyLinkBlock} errAt={errAt} onFieldValidity={onFieldValidity} />
            <LinkBlockField label="Design" path="design" value={project.design} onChange={set('design')} empty={emptyLinkBlock} errAt={errAt} onFieldValidity={onFieldValidity} />
          </FieldGroup>

          <FieldGroup title="Technologies">
            <TechMultiSelect
              label="Pick from registry — type to filter, or create a new entry inline"
              items={project.technologies}
              onChange={set('technologies')}
              registry={techRegistry}
              type="tech"
            />
          </FieldGroup>

          <FieldGroup title="APIs">
            <TechMultiSelect
              label="Pick from registry — type to filter, or create a new entry inline"
              items={project.apis}
              onChange={set('apis')}
              registry={techRegistry}
              type="api"
            />
          </FieldGroup>

          <FieldGroup title="Description (each entry = one HTML paragraph)">
            <Repeater
              items={project.description}
              onChange={set('description')}
              newItem={() => ''}
              itemLabel="Paragraph"
              renderItem={(text, update, idx) => (
                <TextareaField
                  label="HTML allowed: <a>, <mark>, <li>, <br />, <p>. Forbidden: <script>, on*= attrs, javascript: URLs."
                  value={text}
                  onChange={update}
                  error={errAt(`description.${idx}`)}
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
              renderItem={(g, update, idx) => (
                <div className="space-y-3">
                  <TextField label="Alt text" value={g.alt} onChange={(v) => update({ ...g, alt: v })} error={errAt(`gallery.${idx}.alt`)} />
                  <ImageUrlField label="Image path" value={g.img} onChange={(v) => update({ ...g, img: v })} error={errAt(`gallery.${idx}.img`)} validityKey={`gallery.${idx}.img`} onValidityChange={onFieldValidity} />
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
              renderItem={(v, update, idx) => (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <TextField label="Title (optional)" value={v.title ?? ''} onChange={(val) => update({ ...v, title: val })} error={errAt(`videos.${idx}.title`)} />
                  <TextField label="Source / platform (e.g. youtube)" value={v.source ?? ''} onChange={(val) => update({ ...v, source: val })} error={errAt(`videos.${idx}.source`)} />
                  <UrlField
                    label="Link (URL)"
                    value={v.link ?? ''}
                    onChange={(val) => update({ ...v, link: val })}
                    error={errAt(`videos.${idx}.link`)}
                    validityKey={`videos.${idx}.link`}
                    onValidityChange={onFieldValidity}
                  />
                  <TextField label="Source path (alternative to Link)" value={v.src ?? ''} onChange={(val) => update({ ...v, src: val })} error={errAt(`videos.${idx}.src`)} />
                </div>
              )}
            />
          </FieldGroup>
        </div>
      </PreviewLayout>

      <SaveBar error={state.error} />
    </form>
  );
}

function LinkBlockField({ label, path, value, onChange, empty, errAt, onFieldValidity }) {
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
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <TextField label="Title" value={value.title} onChange={(v) => update({ ...value, title: v })} error={errAt(`${path}.title`)} />
          <TextField label="Label" value={value.label ?? ''} onChange={(v) => update({ ...value, label: v })} error={errAt(`${path}.label`)} />
          <div className="sm:col-span-2">
            <UrlField
              label="Link"
              value={value.link ?? ''}
              onChange={(v) => update({ ...value, link: v })}
              error={errAt(`${path}.link`)}
              validityKey={`${path}.link`}
              onValidityChange={onFieldValidity}
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}
