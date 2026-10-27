import { AnimatePresence, MotionConfig, motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { href, site } from '../config/site';
import { toggleTheme, type Theme } from '../lib/theme';
import styles from './SiteHeader.module.css';

const links = [
  { label: 'Experience', to: `${href()}#experience` },
  { label: 'Play', to: href('play') },
  { label: 'Blog', to: href('blog') },
  { label: 'Contact', to: href('contact') },
];

export default function SiteHeader({ currentPath }: { currentPath: string }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [theme, setTheme] = useState<Theme>('light');

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
    if (!menuOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener('keydown', onKey);
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
              <a key={link.label} href={link.to} aria-current={currentPath === link.to ? 'page' : undefined}>
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
            <button className={styles.menuButton} type="button" onClick={() => setMenuOpen((open) => !open)} aria-expanded={menuOpen} aria-controls="mobile-menu">
              {menuOpen ? 'Close' : 'Menu'}
            </button>
          </div>
        </div>
      </motion.header>
      <AnimatePresence>
        {menuOpen && (
          <motion.div id="mobile-menu" className={styles.mobileMenu} initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}>
            <nav aria-label="Mobile navigation">
              {links.map((link, index) => (
                <motion.a key={link.label} href={link.to} onClick={() => setMenuOpen(false)} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.05 }}>
                  <span>0{index + 1}</span>{link.label}
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
