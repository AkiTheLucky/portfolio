import { COUNTER_STORAGE_KEY, readPersonalCount } from './counter';
import { applyTheme, toggleTheme, type Theme } from './theme';

/** Dispatched on `window` so the home page gauge can obey console commands. */
export const GAUGE_EVENT = 'naser-gauge';

const SEEN_KEY = 'akram-console-seen';
const MUTED_LIGHT = 'color:#4c5d6c;font-size:11px;letter-spacing:0.05em';
const MUTED_DARK = 'color:#a8b8c8;font-size:11px;letter-spacing:0.05em';
const ACCENT_LIGHT = 'color:#2a4667;font-weight:600;font-size:11px';
const ACCENT_DARK = 'color:#9fc2e4;font-weight:600;font-size:11px';

export interface NaserConsole {
  help: () => void;
  gauge: (value?: number) => number | undefined;
  hyperspeed: (on?: boolean) => number | undefined;
  theme: (mode?: Theme) => Theme;
  clicks: () => number;
}

declare global {
  interface Window {
    naser?: NaserConsole;
  }
}

/** Keeps console input inside the 0–1 name-weight range. */
export function clampGauge(value: number): number {
  if (Number.isNaN(value)) return 0;
  return Math.min(1, Math.max(0, value));
}

const isDark = () => document.documentElement.dataset.theme === 'dark';

const muted = () => (isDark() ? MUTED_DARK : MUTED_LIGHT);
const accent = () => (isDark() ? ACCENT_DARK : ACCENT_LIGHT);

function printSignature(): void {
  try {
    if (sessionStorage.getItem(SEEN_KEY) === 'true') return;
    sessionStorage.setItem(SEEN_KEY, 'true');
  } catch {
    /* Storage is optional. */
  }

  const dark = isDark();
  const chip = dark
    ? 'background:#172433;color:#9fc2e4'
    : 'background:#33517a;color:#f0eee9';
  console.log(
    '%cAKRAM NASER%c  process improvement · ai adoption',
    `${chip};padding:5px 9px;border-radius:4px;font-weight:700;letter-spacing:0.16em;font-size:12px`,
    `${muted()};padding-left:4px`,
  );
  console.log('You read the console. Type %cnaser.help()%c and pull a lever.', accent(), muted());
}

function printHelp(): void {
  console.log('%cnaser%c · console commands', accent(), `${muted()};padding-left:4px`);
  console.table([
    { command: 'naser.help()', does: 'Print this list' },
    { command: 'naser.gauge(0.6)', does: 'Set the name weight, 0 → 1' },
    { command: 'naser.hyperspeed()', does: 'Jump straight to full weight' },
    { command: 'naser.theme()', does: "Toggle the theme, or naser.theme('dark')" },
    { command: 'naser.clicks()', does: 'Read your local click count' },
  ]);
}

function setGauge(value: number): number | undefined {
  const next = clampGauge(value);
  if (!document.getElementById('hero')) {
    console.log('%cThe gauge only exists on the home page.', muted());
    return undefined;
  }
  window.dispatchEvent(new CustomEvent<number>(GAUGE_EVENT, { detail: next }));
  return next;
}

function readClicks(): number {
  try {
    return readPersonalCount(localStorage.getItem(COUNTER_STORAGE_KEY));
  } catch {
    return 0;
  }
}

function setTheme(mode?: Theme): Theme {
  if (mode === 'light' || mode === 'dark') {
    applyTheme(mode);
    return mode;
  }
  toggleTheme();
  return isDark() ? 'dark' : 'light';
}

export function installNaserConsole(): NaserConsole {
  if (window.naser) return window.naser;

  const api: NaserConsole = {
    help: printHelp,
    gauge: (value = 1) => setGauge(value),
    hyperspeed: (on = true) => setGauge(on ? 1 : 0.2),
    theme: setTheme,
    clicks: readClicks,
  };

  window.naser = api;
  printSignature();
  return api;
}
