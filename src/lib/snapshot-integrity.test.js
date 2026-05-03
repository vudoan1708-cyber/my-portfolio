const projectsSnapshot = require('@/data/projects.json');
const experiencesSnapshot = require('@/data/experiences.json');
const musicSnapshot = require('@/data/music.json');
const {
  projectsDocSchema,
  experiencesDocSchema,
  musicDocSchema,
} = require('./validators');

function formatIssues(result, label) {
  if (result.success) return '';
  const lines = result.error.issues.map(
    (i) => `  ${label}: path=${i.path.join('.') || '(root)'}  ${i.message}`,
  );
  return lines.join('\n');
}

describe('bundled snapshots match validator schemas', () => {
  test('projects.json passes projectsDocSchema', () => {
    const result = projectsDocSchema.safeParse(projectsSnapshot);
    if (!result.success) {
      throw new Error(
        `projects.json fails validation:\n${formatIssues(result, 'projects')}`,
      );
    }
    expect(result.success).toBe(true);
  });

  test('experiences.json passes experiencesDocSchema', () => {
    const result = experiencesDocSchema.safeParse(experiencesSnapshot);
    if (!result.success) {
      throw new Error(
        `experiences.json fails validation:\n${formatIssues(result, 'experiences')}`,
      );
    }
    expect(result.success).toBe(true);
  });

  test('music.json passes musicDocSchema', () => {
    const result = musicDocSchema.safeParse(musicSnapshot);
    if (!result.success) {
      throw new Error(
        `music.json fails validation:\n${formatIssues(result, 'music')}`,
      );
    }
    expect(result.success).toBe(true);
  });
});
