'use server';

import { redirect } from 'next/navigation';
import { isFullyAuthed } from '@/lib/session';
import { getCollectionForAdmin, setCollection } from '@/lib/cms';
import { stripAssetsDeep } from '@/lib/assets';
import { experienceSchema, experiencesDocSchema } from '@/lib/validators';

async function loadDoc() {
  const doc = await getCollectionForAdmin('experiences');
  return { experiences: doc?.experiences ?? [] };
}

export async function saveExperienceAction(_prevState, formData) {
  if (!(await isFullyAuthed())) redirect('/admin/login');
  const originalKey = formData.get('originalKey');
  const payloadRaw = formData.get('payload');
  if (typeof payloadRaw !== 'string') return { error: 'Missing payload.' };

  let parsedJson;
  try {
    parsedJson = JSON.parse(payloadRaw);
  } catch {
    return { error: 'Invalid JSON in nested fields.' };
  }

  const stripped = stripAssetsDeep(parsedJson);
  const result = experienceSchema.safeParse(stripped);
  if (!result.success) {
    return {
      error: result.error.issues
        .slice(0, 3)
        .map((i) => `${i.path.join('.') || '(root)'}: ${i.message}`)
        .join('; '),
    };
  }

  const doc = await loadDoc();
  const list = doc.experiences.slice();
  const idx = list.findIndex((e) => e.key === originalKey);
  if (idx >= 0) list[idx] = result.data;
  else list.push(result.data);

  const docResult = experiencesDocSchema.safeParse({ experiences: list });
  if (!docResult.success) return { error: 'Document failed validation.' };

  await setCollection('experiences', docResult.data);
  redirect('/admin/experiences?saved=1');
}

export async function deleteExperienceAction(_prevState, formData) {
  if (!(await isFullyAuthed())) redirect('/admin/login');
  const key = formData.get('key');
  if (typeof key !== 'string') return { error: 'Bad request.' };
  const doc = await loadDoc();
  const list = doc.experiences.filter((e) => e.key !== key);
  const docResult = experiencesDocSchema.safeParse({ experiences: list });
  if (!docResult.success) return { error: 'Document failed validation.' };
  await setCollection('experiences', docResult.data);
  redirect('/admin/experiences?deleted=1');
}
