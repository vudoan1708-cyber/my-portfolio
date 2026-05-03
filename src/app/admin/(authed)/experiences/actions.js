'use server';

import { redirect } from 'next/navigation';
import { isFullyAuthed } from '@/lib/session';
import { getCollectionForAdmin, setCollection } from '@/lib/cms';
import { stripAssetsDeep } from '@/lib/assets';
import { experienceSchema } from '@/lib/validators';

async function loadDoc() {
  const doc = await getCollectionForAdmin('experiences');
  return { experiences: doc?.experiences ?? [] };
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

export async function saveExperienceAction(_prevState, formData) {
  if (!(await isFullyAuthed())) redirect('/admin/login');
  const originalKey = formData.get('originalKey');
  const payloadRaw = formData.get('payload');
  if (typeof payloadRaw !== 'string') return FAIL('Missing payload.');

  let parsedJson;
  try {
    parsedJson = JSON.parse(payloadRaw);
  } catch {
    return FAIL('Invalid JSON payload.');
  }

  const stripped = stripAssetsDeep(parsedJson);
  const result = experienceSchema.safeParse(stripped);
  if (!result.success) {
    return FAIL(
      'Please fix the highlighted fields.',
      zodIssuesToFieldErrors(result.error.issues),
    );
  }

  const doc = await loadDoc();
  const list = doc.experiences.slice();
  const idx = list.findIndex((e) => e.key === originalKey);
  if (idx >= 0) list[idx] = result.data;
  else list.push(result.data);

  await setCollection('experiences', { experiences: list });
  redirect('/admin/experiences?saved=1');
}

export async function deleteExperienceAction(_prevState, formData) {
  if (!(await isFullyAuthed())) redirect('/admin/login');
  const key = formData.get('key');
  if (typeof key !== 'string') return FAIL('Bad request.');
  const doc = await loadDoc();
  const list = doc.experiences.filter((e) => e.key !== key);
  await setCollection('experiences', { experiences: list });
  redirect('/admin/experiences?deleted=1');
}
