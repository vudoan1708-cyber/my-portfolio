const GITHUB_IMG_BASE_URL = 'https://vudoan1708-cyber.github.io/logos/portfolio';
const GITHUB_PROJECTS_BASE_URL = `${GITHUB_IMG_BASE_URL}/projects`;
const GITHUB_COMPANIES_BASE_URL = `${GITHUB_IMG_BASE_URL}/companies`;

export const experiences = [
  {
    id: 'voly',
    key: 'voly',
    company: 'Voly',
    companyURL: 'https://www.volygroup.com/',
    role: 'Software Engineer',
    location: 'Cheadle Hulme, UK',
    employmentType: 'Full-time',
    startDate: 'Aug, 2021',
    endDate: null,
    current: true,
    logo: `${GITHUB_PROJECTS_BASE_URL}/volyfequickdev/Voly_Group.webp`,
    summary:
      'UK fintech building financial management software for the superyacht industry. My day-to-day production frontend experience comprises of component library work, internal tooling development, bugfixes, and shipping features against a real codebase under real deadlines.',
    technologies: [
      { id: 'react', name: 'React.js', link: 'https://react.dev/', img: `${GITHUB_PROJECTS_BASE_URL}/techs/react.svg` },
      { id: 'svelte', name: 'Svelte', link: 'https://svelte.dev/', img: `${GITHUB_PROJECTS_BASE_URL}/techs/svelte.webp` },
      { id: 'typescript', name: 'Typescript', link: 'https://www.typescriptlang.org/', img: `${GITHUB_PROJECTS_BASE_URL}/techs/typescript.webp` },
      { id: 'storybook', name: 'Storybook', link: 'https://storybook.js.org/', img: `${GITHUB_PROJECTS_BASE_URL}/techs/storybook.svg` },
      { id: 'vite', name: 'Vite', link: 'https://vite.dev/', img: `${GITHUB_PROJECTS_BASE_URL}/techs/vite.webp` },
    ],
    relatedProjectKeys: ['volyfequickdev', 'i2t', 'voly-fe-auto-deploy'],
  },
];
