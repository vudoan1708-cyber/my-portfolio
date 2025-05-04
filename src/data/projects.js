const GITHUB_TECH_IMG_BASE_URL = 'https://vudoan1708-cyber.github.io/logos/portfolio/projects';
const GITHUB_GALLERY_PUNCHLINER_BASE_URL = `${GITHUB_TECH_IMG_BASE_URL}/punchliner`;

export const projects = {
  'web-apps': [
    {
      id: 1,
      key: 'punchliner',
      title: 'Punchliner',
      img: '/images/projects/punchliner/punchliner.webp',
      link: '/portfolio/web-apps/punchliner',
      startDate: 'May 31, 2022',
      endDate: 'July 03, 2022',
      role: 'Frontend Developer',
      projectType: 'Web app',
      projectCode: {
        title: 'Github URL',
        link: 'https://github.com/vudoan1708-cyber/Punchliner.app',
      },
      technologies: [
        { id: 'svelte', name: 'Svelte', link: 'https://svelte.dev/', img: `${GITHUB_TECH_IMG_BASE_URL}/techs/svelte.webp` },
        { id: 'typescript', name: 'Typescript', link: 'https://www.typescriptlang.org/', img: `${GITHUB_TECH_IMG_BASE_URL}/techs/typescript.webp` },
        { id: 'nodejs', name: 'Node.js', link: 'https://nodejs.org/en/', img: `${GITHUB_TECH_IMG_BASE_URL}/techs/node.webp` },
        { id: 'sass', name: 'Scss', link: 'https://sass-lang.com/', img: `${GITHUB_TECH_IMG_BASE_URL}/techs/scss.webp` },
        { id: 'supabase', name: 'Supabase', link: 'https://sass-lang.com/', img: `${GITHUB_TECH_IMG_BASE_URL}/techs/supabase.webp` },
      ],
      description: [
        'From May 31, 2022 - Jun 03, 2022, the project was initiated as an individual project, where a distraction-free text editor which has the ability to type, to hide text, to reveal text on mouse hover and mouse click needed implementing.',
        '<br />',
        'A month later, as it needed to grow with more features such as account management system, document overview, storage and premium membership, another backend developer joined the team and we worked together to help the client bring his vision to life.',
        'All this was implemented from scratch and has no rich text library involvement.',
        '<br />',
        'The appearance of the application was wished to replicate that of another text editor programme called <a target="_blank" rel="noopener noreferrer" href="https://writer.bighugelabs.com/welcome">Writer</a>',
      ],
      gallery: [
        { alt: 'Homepage', img: `${GITHUB_GALLERY_PUNCHLINER_BASE_URL}/punchliner_homepage.webp` },
        { alt: 'Registration', img: `${GITHUB_GALLERY_PUNCHLINER_BASE_URL}/punchliner_register.webp` },
        { alt: 'Log in', img: `${GITHUB_GALLERY_PUNCHLINER_BASE_URL}/punchliner_login.webp` },
        { alt: 'Document share', img: `${GITHUB_GALLERY_PUNCHLINER_BASE_URL}/punchliner_share_docs.webp` },
        { alt: 'Editor view', img: `${GITHUB_GALLERY_PUNCHLINER_BASE_URL}/punchliner_editor.webp` },
        { alt: 'Membership upgrade', img: `${GITHUB_GALLERY_PUNCHLINER_BASE_URL}/punchliner_premium.webp` },
        { alt: 'Stripe integration', img: `${GITHUB_GALLERY_PUNCHLINER_BASE_URL}/punchliner_stripe.webp` },
      ],
    },
    {
      id: 2,
      key: 'b',
      title: 'WebApp B',
      img: '/images/web-apps-2.jpg',
      link: '/portfolio/web-apps/2',
    },
  ],
  games: [
    { id: 1, title: 'Game A', img: '/images/games-1.jpg', link: '/portfolio/games/1' },
  ],
  utilities: [
    { id: 1, title: 'Utility A', img: '/images/utilities-1.jpg', link: '/portfolio/utilities/1' },
  ],
  'ai-projects': [
    { id: 1, title: 'AI A', img: '/images/ai-projects-1.jpg', link: '/portfolio/ai-projects/1' },
  ],
  designs: [
    { id: 1, title: 'Design A', img: '/images/designs-1.jpg', link: '/portfolio/designs/1' },
  ],
};

export const projectCollections = [
  { key: 'web-apps', label: 'Web Apps', img: '/images/collections/muserfly_mobile_map_zoom3.webp', description: 'Projects involve with creating a user interface for web applications ranging from non-commercial to semi-commercial and fully commercial (or in other words, working in a company)' },
  { key: 'games', label: 'Games', img: '/images/collections/turtle_race_boss_fight.webp', description: 'Projects involve with the hobby game making (primarily web-based games with little to no consideration in performance)' },
  { key: 'utilities', label: 'Utilities', img: '/images/collections/i2t-logo.webp', description: 'Projects involve with creating extensions / plugins / addons (however you like to call it) across diffferent platforms or ecosystems.' },
  { key: 'ai-projects', label: 'AI Projects', img: '/images/collections/ai-logo.webp', description: 'Projects involve with creating AI models with or without pre-trained models' },
  { key: 'designs', label: 'Designs', img: '/images/collections/3d_printing.webp', description: 'Projects involve with designs ranging from poster design to 3D visualisation and prototyping' },
];
