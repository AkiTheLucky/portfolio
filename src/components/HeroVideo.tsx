import { useEffect, useRef, useState } from 'react';
import lightVideo from '../assets/video/light-hero.mp4';
import darkVideo from '../assets/video/dark-hero.mp4';
import { href } from '../config/site';
import type { Theme } from '../lib/theme';
import styles from './HeroVideo.module.css';

export default function HeroVideo() {
  const [theme, setTheme] = useState<Theme | null>(null);
  const [reduced, setReduced] = useState(false);
  const [ready, setReady] = useState(false);
  const video = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const current = document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light';
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setTheme(current);
    setReduced(motionQuery.matches);

    const onTheme = (event: Event) => {
      setReady(false);
      setTheme((event as CustomEvent<Theme>).detail);
    };
    const onMotion = () => setReduced(motionQuery.matches);
    const onVisibility = () => {
      if (!video.current) return;
      if (document.hidden) video.current.pause();
      else void video.current.play().catch(() => undefined);
    };

    window.addEventListener('themechange', onTheme);
    motionQuery.addEventListener('change', onMotion);
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      window.removeEventListener('themechange', onTheme);
      motionQuery.removeEventListener('change', onMotion);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);

  if (!theme || reduced) return null;

  return (
    <div className={styles.media} aria-hidden="true">
      <video
        key={theme}
        ref={video}
        className={`${styles.video} ${ready ? styles.ready : ''}`}
        src={theme === 'dark' ? darkVideo : lightVideo}
        poster={href(theme === 'dark' ? 'video/dark-hero.jpg' : 'video/light-hero.jpg')}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        onLoadedData={() => setReady(true)}
      />
    </div>
  );
}
