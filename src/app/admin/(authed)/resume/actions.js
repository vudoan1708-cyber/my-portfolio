'use server';

import { redirect } from 'next/navigation';
import { isFullyAuthed } from '@/lib/session';
import { getCollectionForAdmin, setCollection } from '@/lib/cms';
import { stripAssetsDeep } from '@/lib/assets';
import { resumeSchema } from '@/lib/validators';

function zodIssuesToFieldErrors(issues) {
  const fieldErrors = {};
  for (const issue of issues) {
    const path = issue.path.join('.') || '(root)';
    if (!fieldErrors[path]) fieldErrors[path] = issue.message;
  }
  return fieldErrors;
}

const FAIL = (error, fieldErrors = null) => ({ error, fieldErrors });

export async function saveResumeAction(_prevState, formData) {
  if (!(await isFullyAuthed())) redirect('/admin/login');
  const payloadRaw = formData.get('payload');
  if (typeof payloadRaw !== 'string') return FAIL('Missing payload.');

  let parsedJson;
  try {
    parsedJson = JSON.parse(payloadRaw);
  } catch {
    return FAIL('Invalid JSON payload.');
  }

  const stripped = stripAssetsDeep(parsedJson);
  const result = resumeSchema.safeParse(stripped);
  if (!result.success) {
    return FAIL(
      'Please fix the highlighted fields.',
      zodIssuesToFieldErrors(result.error.issues),
    );
  }

  await setCollection('resume', result.data);
  redirect('/admin/resume?saved=1');
}

export async function loadResumeForAdmin() {
  return getCollectionForAdmin('resume');
}
