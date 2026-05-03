'use server';

import { redirect } from 'next/navigation';
import { isFullyAuthed } from '@/lib/session';
import { getCollectionForAdmin, setCollection } from '@/lib/cms';
import { stripAssetsDeep } from '@/lib/assets';
import { trackSchema } from '@/lib/validators';

async function loadDoc() {
  const doc = await getCollectionForAdmin('music');
  return { tracks: doc?.tracks ?? [] };
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

export async function saveTrackAction(_prevState, formData) {
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
  const result = trackSchema.safeParse(stripped);
  if (!result.success) {
    return FAIL(
      'Please fix the highlighted fields.',
      zodIssuesToFieldErrors(result.error.issues),
    );
  }

  const doc = await loadDoc();
  const list = doc.tracks.slice();
  const idx = list.findIndex((t) => t.key === originalKey);
  if (idx >= 0) list[idx] = result.data;
  else list.push(result.data);

  await setCollection('music', { tracks: list });
  redirect('/admin/music?saved=1');
}

export async function deleteTrackAction(_prevState, formData) {
  if (!(await isFullyAuthed())) redirect('/admin/login');
  const key = formData.get('key');
  if (typeof key !== 'string') return FAIL('Bad request.');
  const doc = await loadDoc();
  const list = doc.tracks.filter((t) => t.key !== key);
  await setCollection('music', { tracks: list });
  redirect('/admin/music?deleted=1');
}
