'use server';

import { redirect } from 'next/navigation';
import { isFullyAuthed } from '@/lib/session';
import { getCollectionForAdmin, setCollection } from '@/lib/cms';
import { stripAssetsDeep } from '@/lib/assets';
import { projectsDocSchema, projectSchema } from '@/lib/validators';

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
  if (originalCollection && originalCollection !== project.link.split('/')[2]) {
    next.projects[originalCollection] = (
      next.projects[originalCollection] ?? []
    ).filter((p) => p.key !== originalKey);
  }
  const targetCollection = project.link.split('/')[2];
  const list = (next.projects[targetCollection] ?? []).slice();
  const idx = list.findIndex((p) => p.key === originalKey);
  if (idx >= 0) list[idx] = project;
  else list.push(project);
  next.projects[targetCollection] = list;
  return next;
}

export async function saveProjectAction(_prevState, formData) {
  if (!(await isFullyAuthed())) redirect('/admin/login');

  const originalCollection = formData.get('originalCollection');
  const originalKey = formData.get('originalKey');
  const payloadRaw = formData.get('payload');
  if (typeof payloadRaw !== 'string') {
    return { error: 'Missing payload.' };
  }

  let parsedJson;
  try {
    parsedJson = JSON.parse(payloadRaw);
  } catch {
    return { error: 'Invalid JSON in nested fields.' };
  }

  const stripped = stripAssetsDeep(parsedJson);
  const result = projectSchema.safeParse(stripped);
  if (!result.success) {
    return {
      error: result.error.issues
        .slice(0, 3)
        .map((i) => `${i.path.join('.') || '(root)'}: ${i.message}`)
        .join('; '),
    };
  }

  const doc = await loadDoc();
  const next = upsertProjectInDoc(doc, originalCollection, originalKey, result.data);
  const docResult = projectsDocSchema.safeParse(next);
  if (!docResult.success) {
    return { error: 'Document failed validation after merge.' };
  }
  await setCollection('projects', docResult.data);
  redirect('/admin/projects?saved=1');
}

export async function deleteProjectAction(_prevState, formData) {
  if (!(await isFullyAuthed())) redirect('/admin/login');
  const collection = formData.get('collection');
  const key = formData.get('key');
  if (typeof collection !== 'string' || typeof key !== 'string') {
    return { error: 'Bad request.' };
  }
  const doc = await loadDoc();
  const next = deleteProjectFromDoc(doc, collection, key);
  const docResult = projectsDocSchema.safeParse(next);
  if (!docResult.success) {
    return { error: 'Document failed validation after delete.' };
  }
  await setCollection('projects', docResult.data);
  redirect('/admin/projects?deleted=1');
}
