'use server';

import { redirect } from 'next/navigation';
import { isFullyAuthed } from '@/lib/session';
import { getCollectionForAdmin, setCollection } from '@/lib/cms';
import { stripAssetsDeep } from '@/lib/assets';
import { trackSchema, musicDocSchema } from '@/lib/validators';

async function loadDoc() {
  const doc = await getCollectionForAdmin('music');
  return { tracks: doc?.tracks ?? [] };
}

export async function saveTrackAction(_prevState, formData) {
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
  const result = trackSchema.safeParse(stripped);
  if (!result.success) {
    return {
      error: result.error.issues
        .slice(0, 3)
        .map((i) => `${i.path.join('.') || '(root)'}: ${i.message}`)
        .join('; '),
    };
  }

  const doc = await loadDoc();
  const list = doc.tracks.slice();
  const idx = list.findIndex((t) => t.key === originalKey);
  if (idx >= 0) list[idx] = result.data;
  else list.push(result.data);

  const docResult = musicDocSchema.safeParse({ tracks: list });
  if (!docResult.success) return { error: 'Document failed validation.' };

  await setCollection('music', docResult.data);
  redirect('/admin/music?saved=1');
}

export async function deleteTrackAction(_prevState, formData) {
  if (!(await isFullyAuthed())) redirect('/admin/login');
  const key = formData.get('key');
  if (typeof key !== 'string') return { error: 'Bad request.' };
  const doc = await loadDoc();
  const list = doc.tracks.filter((t) => t.key !== key);
  const docResult = musicDocSchema.safeParse({ tracks: list });
  if (!docResult.success) return { error: 'Document failed validation.' };
  await setCollection('music', docResult.data);
  redirect('/admin/music?deleted=1');
}
