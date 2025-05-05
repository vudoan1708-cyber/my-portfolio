const GITHUB_IMG_BASE_URL = 'https://vudoan1708-cyber.github.io/logos/portfolio';
const GITHUB_PROJECTS_BASE_URL = `${GITHUB_IMG_BASE_URL}/projects`;
const GITHUB_COLLECTIONS_BASE_URL = `${GITHUB_IMG_BASE_URL}/collections`;

const GITHUB_GALLERY_PUNCHLINER_BASE_URL = `${GITHUB_PROJECTS_BASE_URL}/punchliner`;
const GITHUB_GALLERY_CERBERUS_BASE_URL = `${GITHUB_PROJECTS_BASE_URL}/cerberus`;
const GITHUB_GALLERY_MUSERFLY_BASE_URL = `${GITHUB_PROJECTS_BASE_URL}/muserfly`;

export const projects = {
  'web-apps': [
    {
      id: 1,
      key: 'punchliner',
      title: 'Punchliner',
      img: `${GITHUB_GALLERY_PUNCHLINER_BASE_URL}/punchliner_thumbnail.webp`,
      link: '/portfolio/web-apps/punchliner',
      startDate: 'May 31, 2022',
      endDate: 'July 03, 2022',
      role: 'Frontend Developer',
      projectType: 'Responsive web app',
      projectCode: {
        title: 'Project code',
        label: 'Github URL',
        link: 'https://github.com/vudoan1708-cyber/Punchliner.app',
      },
      projectLog: null,
      projectURL: null,
      report: null,
      videos: [],
      design: null,
      technologies: [
        { id: 'svelte', name: 'Svelte', link: 'https://svelte.dev/', img: `${GITHUB_PROJECTS_BASE_URL}/techs/svelte.webp` },
        { id: 'typescript', name: 'Typescript', link: 'https://www.typescriptlang.org/', img: `${GITHUB_PROJECTS_BASE_URL}/techs/typescript.webp` },
        { id: 'nodejs', name: 'Node.js', link: 'https://nodejs.org/en/', img: `${GITHUB_PROJECTS_BASE_URL}/techs/node.webp` },
        { id: 'sass', name: 'Scss', link: 'https://sass-lang.com/', img: `${GITHUB_PROJECTS_BASE_URL}/techs/scss.webp` },
        { id: 'supabase', name: 'Supabase', link: 'https://supabase.com//', img: `${GITHUB_PROJECTS_BASE_URL}/techs/supabase.webp` },
      ],
      apis: [],
      description: [
        'From May 31, 2022 - Jun 03, 2022, the project was initiated as an individual project, where a distraction-free text editor which has the ability to type, to hide text, to reveal text on mouse hover and mouse click needed implementing.',
        '<br />',
        'A month later, as it needed to grow with more features such as account management system, document overview, storage and premium membership, another backend developer joined the team and we worked together to help the client bring his vision to life.',
        'All this was implemented from scratch and has no rich text library involvement.',
        '<br />',
        'The appearance of the application was wished to replicate that of another text editor programme called <a target="_blank" rel="noopener noreferrer" href="https://writer.bighugelabs.com/welcome">Writer</a>.',
        '<br />',
        'What I learned from this project is how I took a lot of text editing features for granted, particularly:',
        '<li>When I worked with <mark>manipulating cursor positions</mark>.</li>',
        '<li>How <mark>copying and pasting</mark>, or <mark>line breaks</mark> can become very tricky for that.</li>',
        '<li>And how to <mark>display the exact same content style that has been saved to the database</mark>.</li>'
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
      key: 'cerberus',
      title: 'Cerberus A&E Wristbands',
      img: `${GITHUB_GALLERY_CERBERUS_BASE_URL}/cerberus_thumbnail.webp`,
      link: '/portfolio/web-apps/cerberus',
      startDate: 'Apr 25, 2021',
      role: 'Backend Engineer (no database)',
      projectType: 'Screen-based app (can be used as a web app on laptops, and hospital monitors)',
      projectCode: {
        title: 'Project code',
        label: 'Github URL',
        link: 'https://github.com/vudoan1708-cyber/Cerberus-AE-Wristband',
      },
      projectLog: null,
      projectURL: null,
      report: null,
      videos: [
        {
          title: 'Showcase video',
          source: 'youtube',
          link: 'https://www.youtube.com/watch?v=8u69eYnbKwY',
        }
      ],
      design: {
        title: 'Figma design',
        link: 'https://www.figma.com/file/EcwYNHUPsIgt0DMMcQnmJi/A%26E-wristbands-interface?node-id=0%3A1',
      },
      technologies: [
        { id: 'go', name: 'Golang', link: 'https://go.dev/', img: `${GITHUB_PROJECTS_BASE_URL}/techs/golang.webp` },
        { id: 'graphql', name: 'GraphQL', link: 'https://graphql.org/', img: `${GITHUB_PROJECTS_BASE_URL}/techs/graphql.webp` },
        { id: 'python', name: 'Python', link: 'https://www.python.org/', img: `${GITHUB_PROJECTS_BASE_URL}/techs/python.webp` },
      ],
      apis: [],
      description: [
        'A group project aims at creating a screen-based user interface for A&E wristbands handled by <a target="_blank" rel="noopener noreferrer" href="https://cerberus-laboratories.com/">The Cerberus Security Laboratories Team</a>',
        '<br />',
        'My main responsibilty includes building the server architecture and server communication using tools such as GoLang and GraphQL, as well as building a dummy data generation tool using Python for API testing purposes.',
        '<br />',
        'What I learned a lot from this project is:',
        '<li>What GraphQL <mark>schema-first</mark> approach is.</li>',
        '<li><mark>Code generator</mark> that can map GraphQL schemas into Golang code 😱.</li>',
        '<li>And great <mark>teamwork</mark> makes perfect.</li>'
      ],
      gallery: [
        { alt: 'Homepage', img: `${GITHUB_GALLERY_CERBERUS_BASE_URL}/cerberus_main_screen.webp` },
        { alt: 'NEWS Scores', img: `${GITHUB_GALLERY_CERBERUS_BASE_URL}/cerberus_thumbnail.webp` },
        { alt: 'Technical Diagram', img: `${GITHUB_GALLERY_CERBERUS_BASE_URL}/cerberus_diagram.webp` },
        { alt: 'Golang + GraphQL', img: `${GITHUB_GALLERY_CERBERUS_BASE_URL}/cerberus_latestWristbandData.webp` },
      ],
    },
    {
      id: 3,
      key: 'muserfly',
      title: 'Muserfly',
      img: `${GITHUB_GALLERY_MUSERFLY_BASE_URL}/muserfly_main_screen.webp`,
      link: '/portfolio/web-apps/muserfly',
      startDate: 'Oct 25, 2020',
      endDate: 'May 30, 2021',
      role: 'Full-stack Developer',
      projectType: 'Responsive web app',
      projectCode: {
        title: 'Project code',
        label: 'Github URL',
        link: 'https://github.com/vudoan1708-cyber/Emotion-Based-Music-Streaming-App-WEB/',
      },
      projectLog: {
        title: 'Project log',
        label: 'Padlet URL',
        link: 'https://padlet.com/vudoan1708/cctp-qd6y7h6tys92exi6',
      },
      projectURL: {
        title: 'Project URL',
        label: 'Muserfly',
        link: 'https://muserfly.glitch.me/#/',
      },
      report: {
        title: 'Report',
        label: 'Google Drive URL',
        link: 'https://drive.google.com/file/d/1BNrhz0tHH4oZTiQVOnc64kq34SqCQ209/view',
      },
      videos: [
        {
          title: 'Work-in-progress video',
          source: 'youtube',
          link: 'https://www.youtube.com/watch?v=GDZOgYXMtoU',
        },
        {
          title: 'Final demo video',
          source: 'youtube',
          link: 'https://www.youtube.com/watch?v=LFQIMeK7dqw',
        }
      ],
      design: null,
      technologies: [
        { id: 'vue3', name: 'Vue 3', link: 'https://vuejs.org/', img: `${GITHUB_PROJECTS_BASE_URL}/techs/vue.webp` },
        { id: 'p5js', name: 'p5.js', link: 'https://p5js.org/', img: `${GITHUB_PROJECTS_BASE_URL}/techs/p5.webp` },
        { id: 'd3', name: 'D3', link: 'https://d3js.org/', img: `${GITHUB_PROJECTS_BASE_URL}/techs/d3.webp` },
        { id: 'nodejs', name: 'Node.js', link: 'https://nodejs.org/en/', img: `${GITHUB_PROJECTS_BASE_URL}/techs/node.webp` },
        { id: 'sass', name: 'Scss', link: 'https://sass-lang.com/', img: `${GITHUB_PROJECTS_BASE_URL}/techs/scss.webp` },
        { id: 'mongodb', name: 'MongoDB Atlas', link: 'https://www.mongodb.com/products/platform/atlas-database', img: `${GITHUB_PROJECTS_BASE_URL}/techs/mongodb.webp` },
      ],
      apis: [
        { id: 'spotify', name: 'Spotify API', link: 'https://developer.spotify.com/documentation/web-api' },
      ],
      description: [
        'A university final year project which uses Spotify API as the baseline for song searches and audio streaming.',
        '<br />',
        'The project is an Emotion-Based Music Streaming App which prioritises user\'s moods to play songs.',
        '<br />',
        'It is also used to speculatively propose a potentially new screen-based behaviour using a map for content discovery.',
        '<br />',
        'What I learned a lot from this project is:',
        '<li>How emotions can be represented in different <mark>graph models</mark> and choosing one that particularly works for a scenario takes time.</li>',
        '<li>How <mark>MongoDB</mark> and <mark>network whitelisting</mark> works.</li>',
        '<li>And how terrible it was to work on a full-fledged project on your own.</li>',
      ],
      gallery: [
        { alt: 'Welcoming page', img: `${GITHUB_GALLERY_MUSERFLY_BASE_URL}/muserfly_mobile_welcoming_page.webp` },
        { alt: 'Homepage', img: `${GITHUB_GALLERY_MUSERFLY_BASE_URL}/muserfly_mobile_home.webp` },
        { alt: 'Emotion map (mobile)', img: `${GITHUB_GALLERY_MUSERFLY_BASE_URL}/muserfly_mobile_map.webp` },
        { alt: 'Golang + GraphQL', img: `${GITHUB_GALLERY_MUSERFLY_BASE_URL}/cerberus_latestWristbandData.webp` },
      ],
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
  { key: 'web-apps', label: 'Web Apps', img: `${GITHUB_COLLECTIONS_BASE_URL}/muserfly_mobile_map_zoom3.webp`, description: 'Projects involve with creating a user interface for web applications ranging from non-commercial to semi-commercial and fully commercial (or in other words, working in a company)' },
  { key: 'games', label: 'Games', img: `${GITHUB_COLLECTIONS_BASE_URL}/turtle_race_boss_fight.webp`, description: 'Projects involve with the hobby game making (primarily web-based games with little to no consideration in performance)' },
  { key: 'utilities', label: 'Utilities', img: `${GITHUB_COLLECTIONS_BASE_URL}/i2t-logo.webp`, description: 'Projects involve with creating extensions / plugins / addons (however you like to call it) across diffferent platforms or ecosystems.' },
  { key: 'ai-projects', label: 'AI Projects', img: `${GITHUB_COLLECTIONS_BASE_URL}/ai-logo.webp`, description: 'Projects involve with creating AI models with or without pre-trained models' },
  { key: 'designs', label: 'Designs', img: `${GITHUB_COLLECTIONS_BASE_URL}/3d_printing.webp`, description: 'Projects involve with designs ranging from poster design to 3D visualisation and prototyping' },
];
