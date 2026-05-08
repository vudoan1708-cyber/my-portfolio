'use server';

import { redirect } from 'next/navigation';
import { isFullyAuthed } from '@/lib/session';
import { getCollectionForAdmin, setCollection } from '@/lib/cms';
import { stripAssetsDeep } from '@/lib/assets';
import { techRegistryItemSchema } from '@/lib/validators';

async function loadDoc() {
  const doc = await getCollectionForAdmin('tech-registry');
  return { items: doc?.items ?? [] };
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

export async function saveTechAction(_prevState, formData) {
  if (!(await isFullyAuthed())) redirect('/admin/login');
  const originalId = formData.get('originalId');
  const payloadRaw = formData.get('payload');
  if (typeof payloadRaw !== 'string') return FAIL('Missing payload.');

  let parsedJson;
  try {
    parsedJson = JSON.parse(payloadRaw);
  } catch {
    return FAIL('Invalid JSON payload.');
  }

  const stripped = stripAssetsDeep(parsedJson);
  const result = techRegistryItemSchema.safeParse(stripped);
  if (!result.success) {
    return FAIL(
      'Please fix the highlighted fields.',
      zodIssuesToFieldErrors(result.error.issues),
    );
  }

  const doc = await loadDoc();
  const list = doc.items.slice();
  const removeId = typeof originalId === 'string' && originalId ? originalId : result.data.id;
  const filtered = list.filter((it) => it.id !== removeId && it.id !== result.data.id);
  filtered.push(result.data);
  filtered.sort((a, b) => a.id.localeCompare(b.id));

  await setCollection('tech-registry', { items: filtered });
  redirect('/admin/tech-registry?saved=1');
}

export async function deleteTechAction(_prevState, formData) {
  if (!(await isFullyAuthed())) redirect('/admin/login');
  const id = formData.get('id');
  if (typeof id !== 'string') return FAIL('Bad request.');
  const doc = await loadDoc();
  const items = doc.items.filter((it) => it.id !== id);
  await setCollection('tech-registry', { items });
  redirect('/admin/tech-registry?deleted=1');
}
