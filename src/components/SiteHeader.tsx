import { AnimatePresence, MotionConfig, motion } from 'motion/react';
import { useEffect, useRef, useState } from 'react';
import { href, site } from '../config/site';
import { installNaserConsole } from '../lib/naser-console';
import { toggleTheme, type Theme } from '../lib/theme';
import styles from './SiteHeader.module.css';

const links = [
  { label: 'Experience', to: `${href()}#experience` },
  { label: 'Play', to: href('play') },
  { label: 'Blog', to: href('blog') },
  { label: 'Contact', to: href('contact') },
];

const normalisePath = (path: string) => path.replace(/\/+$/, '');

function isCurrentPage(currentPath: string, to: string): boolean {
  const [pathname, hash] = to.split('#');
  if (hash) return false;
  return normalisePath(currentPath) === normalisePath(pathname);
}

export default function SiteHeader({ currentPath }: { currentPath: string }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [theme, setTheme] = useState<Theme>('light');
  const menuRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 32);
    const onTheme = (event: Event) => setTheme((event as CustomEvent<Theme>).detail);
    onScroll();
    setTheme(document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light');
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('themechange', onTheme);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('themechange', onTheme);
    };
  }, []);

  useEffect(() => {
    installNaserConsole();
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const panel = menuRef.current;
    const focusable = () => Array.from(panel?.querySelectorAll<HTMLElement>('a[href], button') ?? []);
    focusable()[0]?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMenuOpen(false);
        return;
      }
      if (event.key !== 'Tab') return;
      const items = focusable();
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener('keydown', onKey);
      menuButtonRef.current?.focus();
    };
  }, [menuOpen]);

  return (
    <MotionConfig reducedMotion="user">
      <motion.header className={`${styles.header} ${scrolled ? styles.scrolled : ''}`} layout>
        <div className={styles.bar}>
          <a className={styles.brand} href={href()}>
            <span className={styles.mark} aria-hidden="true">AN</span>
            <span className={styles.brandText}>Akram Naser</span>
          </a>
          <nav className={styles.desktopNav} aria-label="Main navigation">
            {links.map((link) => (
              <a key={link.label} href={link.to} aria-current={isCurrentPage(currentPath, link.to) ? 'page' : undefined}>
                {link.label}
              </a>
            ))}
          </nav>
          <div className={styles.actions}>
            <button className={styles.iconButton} type="button" onClick={toggleTheme} aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}>
              <motion.span key={theme} initial={{ rotate: -30, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }}>
                {theme === 'dark' ? '☼' : '◐'}
              </motion.span>
            </button>
            <button ref={menuButtonRef} className={styles.menuButton} type="button" onClick={() => setMenuOpen((open) => !open)} aria-expanded={menuOpen} aria-controls="mobile-menu">
              {menuOpen ? 'Close' : 'Menu'}
            </button>
          </div>
        </div>
      </motion.header>
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            ref={menuRef}
            id="mobile-menu"
            className={styles.mobileMenu}
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
          >
            <nav aria-label="Mobile navigation">
              {links.map((link, index) => (
                <motion.a
                  key={link.label}
                  href={link.to}
                  aria-current={isCurrentPage(currentPath, link.to) ? 'page' : undefined}
                  onClick={() => setMenuOpen(false)}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  {link.label}
                </motion.a>
              ))}
            </nav>
            <a className={styles.github} href={site.github} target="_blank" rel="noreferrer">GitHub ↗</a>
          </motion.div>
        )}
      </AnimatePresence>
    </MotionConfig>
  );
}
