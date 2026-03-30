import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: 'Iya Oloja',
    },
    links: [
      {
        text: 'API',
        url: 'https://iya-oloja.pages.dev/api',
      },
      {
        text: 'GitHub',
        url: 'https://github.com/ifihan/nigerian-markets-api',
      },
    ],
    githubUrl: 'https://github.com/ifihan/nigerian-markets-api',
    searchToggle: {
      enabled: true,
    },
  };
}
