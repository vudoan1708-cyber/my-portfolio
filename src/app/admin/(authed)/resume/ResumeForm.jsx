'use client';

import { useActionState, useCallback, useEffect, useState } from 'react';
import { saveResumeAction } from './actions';
import {
  CheckboxField,
  FieldGroup,
  TextField,
  TextareaField,
} from '../_components/Field';
import UrlField from '../_components/UrlField';
import Repeater from '../_components/Repeater';
import SaveBar from '../_components/SaveBar';
import LivePreview from '../_components/LivePreview';
import PreviewLayout from '../_components/PreviewLayout';

const EMPTY_RESUME = {
  profile: {
    name: '',
    role: '',
    company: { name: '', url: '' },
    location: '',
    email: '',
    phone: '',
    github: { label: '', url: '' },
    linkedin: { label: '', url: '' },
    portfolio: { label: '', url: '' },
  },
  experiences: [],
  education: [],
  skills: [],
  languages: [],
};

function newExperience() {
  return {
    key: '',
    role: '',
    company: '',
    companyURL: null,
    location: null,
    employmentType: null,
    startDate: '',
    endDate: null,
    current: false,
    summary: null,
    bullets: [],
    technologies: [],
    relatedProjectsLabel: null,
    relatedProjects: [],
  };
}
function newEducation() {
  return {
    degree: '',
    institution: '',
    startDate: '',
    endDate: null,
    notes: null,
  };
}
function newSkillGroup() {
  return { group: '', items: [] };
}
function newRelated() {
  return { title: '', link: '' };
}

export default function ResumeForm({ initial }) {
  const [state, formAction] = useActionState(saveResumeAction, {
    error: null,
    fieldErrors: null,
  });
  const [resume, setResume] = useState(() => mergeWithDefaults(initial));

  const errAt = (path) => state.fieldErrors?.[path];

  const setProfile = (field) => (value) =>
    setResume((p) => ({
      ...p,
      profile: { ...p.profile, [field]: value },
    }));
  const setProfileNested = (field, sub) => (value) =>
    setResume((p) => ({
      ...p,
      profile: {
        ...p.profile,
        [field]: { ...(p.profile[field] ?? {}), [sub]: value },
      },
    }));
  const setTop = (field) => (value) =>
    setResume((p) => ({ ...p, [field]: value }));

  // ---- Save guard / scroll-to-error ----
  const fieldErrorCount = state.fieldErrors
    ? Object.keys(state.fieldErrors).length
    : 0;
  const [errorSnapshot, setErrorSnapshot] = useState(null);
  useEffect(() => {
    if (fieldErrorCount > 0) {
      setErrorSnapshot(JSON.stringify(resume));
    } else {
      setErrorSnapshot(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);
  const editedSinceError =
    errorSnapshot !== null && errorSnapshot !== JSON.stringify(resume);

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
      <input type="hidden" name="payload" value={JSON.stringify(resume)} />

      <PreviewLayout preview={<LivePreview kind="resume" data={resume} />}>
        <div className="space-y-6">
          <FieldGroup title="Profile">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <TextField
                label="Name"
                value={resume.profile.name}
                onChange={setProfile('name')}
                error={errAt('profile.name')}
                required
              />
              <TextField
                label="Role"
                value={resume.profile.role}
                onChange={setProfile('role')}
                error={errAt('profile.role')}
                required
              />
              <TextField
                label="Current company name"
                value={resume.profile.company?.name ?? ''}
                onChange={setProfileNested('company', 'name')}
                error={errAt('profile.company.name')}
                required
              />
              <UrlField
                label="Current company URL"
                value={resume.profile.company?.url ?? ''}
                onChange={setProfileNested('company', 'url')}
                error={errAt('profile.company.url')}
                validityKey="profile.company.url"
                onValidityChange={onFieldValidity}
                required
              />
              <TextField
                label="Location"
                value={resume.profile.location}
                onChange={setProfile('location')}
                error={errAt('profile.location')}
                required
              />
              <TextField
                label="Email"
                type="email"
                value={resume.profile.email}
                onChange={setProfile('email')}
                error={errAt('profile.email')}
                required
              />
              <TextField
                label="Phone"
                value={resume.profile.phone}
                onChange={setProfile('phone')}
                error={errAt('profile.phone')}
                required
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <TextField
                label="GitHub label"
                value={resume.profile.github?.label ?? ''}
                onChange={setProfileNested('github', 'label')}
                error={errAt('profile.github.label')}
              />
              <UrlField
                label="GitHub URL"
                value={resume.profile.github?.url ?? ''}
                onChange={setProfileNested('github', 'url')}
                error={errAt('profile.github.url')}
                validityKey="profile.github.url"
                onValidityChange={onFieldValidity}
              />
              <TextField
                label="LinkedIn label"
                value={resume.profile.linkedin?.label ?? ''}
                onChange={setProfileNested('linkedin', 'label')}
                error={errAt('profile.linkedin.label')}
              />
              <UrlField
                label="LinkedIn URL"
                value={resume.profile.linkedin?.url ?? ''}
                onChange={setProfileNested('linkedin', 'url')}
                error={errAt('profile.linkedin.url')}
                validityKey="profile.linkedin.url"
                onValidityChange={onFieldValidity}
              />
              <TextField
                label="Portfolio label"
                value={resume.profile.portfolio?.label ?? ''}
                onChange={setProfileNested('portfolio', 'label')}
                error={errAt('profile.portfolio.label')}
              />
              <UrlField
                label="Portfolio URL"
                value={resume.profile.portfolio?.url ?? ''}
                onChange={setProfileNested('portfolio', 'url')}
                error={errAt('profile.portfolio.url')}
                validityKey="profile.portfolio.url"
                onValidityChange={onFieldValidity}
              />
            </div>
          </FieldGroup>

          <FieldGroup title="Experiences">
            <Repeater
              items={resume.experiences}
              onChange={setTop('experiences')}
              newItem={newExperience}
              itemLabel="Experience"
              renderItem={(exp, update, idx) => (
                <ExperienceRow
                  exp={exp}
                  update={update}
                  idx={idx}
                  errAt={errAt}
                  onFieldValidity={onFieldValidity}
                />
              )}
            />
          </FieldGroup>

          <FieldGroup title="Education">
            <Repeater
              items={resume.education}
              onChange={setTop('education')}
              newItem={newEducation}
              itemLabel="Education"
              renderItem={(edu, update, idx) => (
                <div className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <TextField
                      label="Degree"
                      value={edu.degree}
                      onChange={(v) => update({ ...edu, degree: v })}
                      error={errAt(`education.${idx}.degree`)}
                      required
                    />
                    <TextField
                      label="Institution"
                      value={edu.institution}
                      onChange={(v) => update({ ...edu, institution: v })}
                      error={errAt(`education.${idx}.institution`)}
                      required
                    />
                    <TextField
                      label="Start date"
                      value={edu.startDate}
                      onChange={(v) => update({ ...edu, startDate: v })}
                      error={errAt(`education.${idx}.startDate`)}
                      placeholder="Oct 2018"
                      required
                    />
                    <TextField
                      label="End date (blank if ongoing)"
                      value={edu.endDate ?? ''}
                      onChange={(v) =>
                        update({ ...edu, endDate: v === '' ? null : v })
                      }
                      error={errAt(`education.${idx}.endDate`)}
                      placeholder="May 2021"
                    />
                  </div>
                  <TextareaField
                    label="Notes"
                    value={edu.notes ?? ''}
                    onChange={(v) =>
                      update({ ...edu, notes: v === '' ? null : v })
                    }
                    error={errAt(`education.${idx}.notes`)}
                    rows={2}
                  />
                </div>
              )}
            />
          </FieldGroup>

          <FieldGroup title="Skills (groups)">
            <Repeater
              items={resume.skills}
              onChange={setTop('skills')}
              newItem={newSkillGroup}
              itemLabel="Group"
              renderItem={(group, update, idx) => (
                <div className="space-y-3">
                  <TextField
                    label="Group name"
                    value={group.group}
                    onChange={(v) => update({ ...group, group: v })}
                    error={errAt(`skills.${idx}.group`)}
                    placeholder="Frontend"
                    required
                  />
                  <Repeater
                    items={group.items ?? []}
                    onChange={(items) => update({ ...group, items })}
                    newItem={() => ''}
                    itemLabel="Skill"
                    renderItem={(skill, updateSkill, sIdx) => (
                      <TextField
                        label="Skill"
                        value={skill}
                        onChange={updateSkill}
                        error={errAt(`skills.${idx}.items.${sIdx}`)}
                        required
                      />
                    )}
                  />
                </div>
              )}
            />
          </FieldGroup>

          <FieldGroup title="Languages">
            <Repeater
              items={resume.languages}
              onChange={setTop('languages')}
              newItem={() => ''}
              itemLabel="Language"
              renderItem={(lang, update, idx) => (
                <TextField
                  label="Language"
                  value={lang}
                  onChange={update}
                  error={errAt(`languages.${idx}`)}
                  placeholder="English (fluent)"
                  required
                />
              )}
            />
          </FieldGroup>
        </div>
      </PreviewLayout>

      <SaveBar error={state.error} />
    </form>
  );
}

function ExperienceRow({ exp, update, idx, errAt, onFieldValidity }) {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <TextField
          label="Key (slug)"
          value={exp.key}
          onChange={(v) => update({ ...exp, key: v })}
          error={errAt(`experiences.${idx}.key`)}
          pattern="^[a-z0-9]+(-[a-z0-9]+)*$"
          required
        />
        <TextField
          label="Role"
          value={exp.role}
          onChange={(v) => update({ ...exp, role: v })}
          error={errAt(`experiences.${idx}.role`)}
          required
        />
        <TextField
          label="Company"
          value={exp.company}
          onChange={(v) => update({ ...exp, company: v })}
          error={errAt(`experiences.${idx}.company`)}
          required
        />
        <UrlField
          label="Company URL (optional)"
          value={exp.companyURL ?? ''}
          onChange={(v) =>
            update({ ...exp, companyURL: v === '' ? null : v })
          }
          error={errAt(`experiences.${idx}.companyURL`)}
          validityKey={`experiences.${idx}.companyURL`}
          onValidityChange={onFieldValidity}
        />
        <TextField
          label="Location"
          value={exp.location ?? ''}
          onChange={(v) =>
            update({ ...exp, location: v === '' ? null : v })
          }
          error={errAt(`experiences.${idx}.location`)}
        />
        <TextField
          label="Employment type"
          value={exp.employmentType ?? ''}
          onChange={(v) =>
            update({ ...exp, employmentType: v === '' ? null : v })
          }
          error={errAt(`experiences.${idx}.employmentType`)}
        />
        <TextField
          label="Start date"
          value={exp.startDate}
          onChange={(v) => update({ ...exp, startDate: v })}
          error={errAt(`experiences.${idx}.startDate`)}
          placeholder="Aug 2021"
          required
        />
        <TextField
          label="End date (blank if current)"
          value={exp.endDate ?? ''}
          onChange={(v) =>
            update({ ...exp, endDate: v === '' ? null : v })
          }
          error={errAt(`experiences.${idx}.endDate`)}
        />
      </div>
      <CheckboxField
        label="Current role"
        value={exp.current}
        onChange={(v) => update({ ...exp, current: v })}
      />
      <TextareaField
        label="Summary"
        value={exp.summary ?? ''}
        onChange={(v) => update({ ...exp, summary: v === '' ? null : v })}
        error={errAt(`experiences.${idx}.summary`)}
        rows={2}
      />
      <Repeater
        items={exp.bullets ?? []}
        onChange={(bullets) => update({ ...exp, bullets })}
        newItem={() => ''}
        itemLabel="Bullet"
        renderItem={(text, updateBullet, bIdx) => (
          <TextareaField
            label="Bullet point"
            value={text}
            onChange={updateBullet}
            error={errAt(`experiences.${idx}.bullets.${bIdx}`)}
            rows={2}
          />
        )}
      />
      <Repeater
        items={exp.technologies ?? []}
        onChange={(technologies) => update({ ...exp, technologies })}
        newItem={() => ''}
        itemLabel="Tech chip"
        renderItem={(text, updateTech, tIdx) => (
          <TextField
            label="Display label (free text — chip)"
            value={text}
            onChange={updateTech}
            error={errAt(`experiences.${idx}.technologies.${tIdx}`)}
            required
          />
        )}
      />
      <TextField
        label="Related-projects label (optional)"
        value={exp.relatedProjectsLabel ?? ''}
        onChange={(v) =>
          update({
            ...exp,
            relatedProjectsLabel: v === '' ? null : v,
          })
        }
        error={errAt(`experiences.${idx}.relatedProjectsLabel`)}
        placeholder="Side projects"
      />
      <Repeater
        items={exp.relatedProjects ?? []}
        onChange={(relatedProjects) => update({ ...exp, relatedProjects })}
        newItem={newRelated}
        itemLabel="Related project"
        renderItem={(rp, updateRp, rIdx) => (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <TextField
              label="Title"
              value={rp.title}
              onChange={(v) => updateRp({ ...rp, title: v })}
              error={errAt(`experiences.${idx}.relatedProjects.${rIdx}.title`)}
              required
            />
            <UrlField
              label="Link (path or URL)"
              value={rp.link}
              onChange={(v) => updateRp({ ...rp, link: v })}
              error={errAt(`experiences.${idx}.relatedProjects.${rIdx}.link`)}
              kind="pathOrHttp"
              validityKey={`experiences.${idx}.relatedProjects.${rIdx}.link`}
              onValidityChange={onFieldValidity}
              placeholder="/portfolio/web-apps/foo"
              required
            />
          </div>
        )}
      />
    </div>
  );
}

function mergeWithDefaults(initial) {
  if (!initial) return EMPTY_RESUME;
  return {
    profile: {
      ...EMPTY_RESUME.profile,
      ...(initial.profile ?? {}),
      company: {
        ...EMPTY_RESUME.profile.company,
        ...(initial.profile?.company ?? {}),
      },
      github: {
        ...EMPTY_RESUME.profile.github,
        ...(initial.profile?.github ?? {}),
      },
      linkedin: {
        ...EMPTY_RESUME.profile.linkedin,
        ...(initial.profile?.linkedin ?? {}),
      },
      portfolio: {
        ...EMPTY_RESUME.profile.portfolio,
        ...(initial.profile?.portfolio ?? {}),
      },
    },
    experiences: initial.experiences ?? [],
    education: initial.education ?? [],
    skills: initial.skills ?? [],
    languages: initial.languages ?? [],
  };
}
