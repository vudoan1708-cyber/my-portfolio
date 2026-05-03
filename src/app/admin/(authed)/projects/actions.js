'use server';

import { redirect } from 'next/navigation';
import { isFullyAuthed } from '@/lib/session';
import { getCollectionForAdmin, setCollection } from '@/lib/cms';
import { stripAssetsDeep } from '@/lib/assets';
import { projectSchema } from '@/lib/validators';

async function loadDoc() {
  const doc = await getCollectionForAdmin('projects');
  return {
    projects: doc?.projects ?? {},
    projectCollections: doc?.projectCollections ?? [],
  };
}

function deleteProjectFromDoc(doc, collection, key) {
  const next = { ...doc, projects: { ...doc.projects } };
  next.projects[collection] = (next.projects[collection] ?? []).filter(
    (p) => p.key !== key,
  );
  return next;
}

function upsertProjectInDoc(doc, originalCollection, originalKey, project) {
  const next = { ...doc, projects: { ...doc.projects } };
  const targetCollection = project.link.split('/')[2];
  if (originalCollection && originalCollection !== targetCollection) {
    next.projects[originalCollection] = (
      next.projects[originalCollection] ?? []
    ).filter((p) => p.key !== originalKey);
  }
  const list = (next.projects[targetCollection] ?? []).slice();
  const idx = list.findIndex((p) => p.key === originalKey);
  if (idx >= 0) list[idx] = project;
  else list.push(project);
  next.projects[targetCollection] = list;
  return next;
}

function zodIssuesToFieldErrors(issues) {
  const fieldErrors = {};
  for (const issue of issues) {
    const path = issue.path.join('.') || '(root)';
    if (!fieldErrors[path]) fieldErrors[path] = issue.message;
  }
  return fieldErrors;
}

const FAIL = (error, fieldErrors = null) => ({ error, fieldErrors });

export async function saveProjectAction(_prevState, formData) {
  if (!(await isFullyAuthed())) redirect('/admin/login');

  const originalCollection = formData.get('originalCollection');
  const originalKey = formData.get('originalKey');
  const payloadRaw = formData.get('payload');
  if (typeof payloadRaw !== 'string') {
    return FAIL('Missing payload.');
  }

  let parsedJson;
  try {
    parsedJson = JSON.parse(payloadRaw);
  } catch {
    return FAIL('Invalid JSON payload.');
  }

  const stripped = stripAssetsDeep(parsedJson);
  const result = projectSchema.safeParse(stripped);
  if (!result.success) {
    return FAIL(
      'Please fix the highlighted fields.',
      zodIssuesToFieldErrors(result.error.issues),
    );
  }

  const doc = await loadDoc();
  const next = upsertProjectInDoc(
    doc,
    originalCollection,
    originalKey,
    result.data,
  );
  await setCollection('projects', next);
  redirect('/admin/projects?saved=1');
}

export async function deleteProjectAction(_prevState, formData) {
  if (!(await isFullyAuthed())) redirect('/admin/login');
  const collection = formData.get('collection');
  const key = formData.get('key');
  if (typeof collection !== 'string' || typeof key !== 'string') {
    return FAIL('Bad request.');
  }
  const doc = await loadDoc();
  const next = deleteProjectFromDoc(doc, collection, key);
  await setCollection('projects', next);
  redirect('/admin/projects?deleted=1');
}
