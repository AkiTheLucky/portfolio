export type Theme = 'light' | 'dark';

export function applyTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;
  document.documentElement.style.colorScheme = theme;
  localStorage.setItem('akram-theme', theme);
  window.dispatchEvent(new CustomEvent<Theme>('themechange', { detail: theme }));
}

export function toggleTheme() {
  applyTheme(document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark');
}
