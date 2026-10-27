export const site = {
  name: 'Akram Naser',
  title: 'Akram Naser — Business Management & AI Adoption',
  description: 'Akram Naser improves processes, finds useful AI applications, and helps people use new tools with confidence.',
  github: 'https://github.com/AkiTheLucky',
  linkedin: import.meta.env.PUBLIC_LINKEDIN_URL || '',
};

export function href(path = ''): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  return `${base}/${path.replace(/^\//, '')}`;
}
