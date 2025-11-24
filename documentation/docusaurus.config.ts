import type { Config } from '@docusaurus/types';
import { themes as prismThemes } from 'prism-react-renderer';

const config: Config = {
  title: 'Support and Documentation',
  tagline: 'Helping to make the most of the application.',
  favicon: 'img/logo.png',
  url: 'http://localhost:3000',
  baseUrl: '/',
  organizationName: 'Big Support',
  projectName: 'big-docs',
  onBrokenLinks: 'throw',
  markdown: {
    hooks: {
      onBrokenMarkdownLinks: 'warn',
    },
  },
  i18n: { defaultLocale: 'en', locales: ['en'] },
  presets: [
    [
      'classic',
      {
        docs: {
          path: 'content',
          routeBasePath: '/',
          sidebarPath: require.resolve('./sidebars.ts'),
          editUrl: 'https://github.com/BigInformatics/gobig/edit/main/support/content/',
          showLastUpdateAuthor: true,
          showLastUpdateTime: true,
        },
        blog: false,
        theme: { customCss: require.resolve('./src/css/custom.css') },
      },
    ],
  ],
  plugins: [require.resolve('@easyops-cn/docusaurus-search-local')],
  themeConfig: {
    navbar: {
      title: 'Big Documentation',
      logo: { alt: 'Big Logo', src: 'img/logo.png' },
      items: [
        { href: 'https://biginformatics.com', label: 'Main Website', position: 'right' }
      ],
    },
    footer: {
      style: 'dark',
      copyright: `© ${new Date().getFullYear()} Informatics FYI, Inc.`,
      links: [
        {
          title: 'Project',
          items: [
            { label: 'Informatics FYI, Inc.', href: 'https://informatics.fyi' },
            { label: 'Main Website', href: 'https://biginformatics.com' }
          ],
        },
      ],
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  },
};

export default config;
