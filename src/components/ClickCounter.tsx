import { MotionConfig, motion } from 'motion/react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { COUNTER_STORAGE_KEY, readPersonalCount, takeClickBatch } from '../lib/counter';
import styles from './ClickCounter.module.css';

const number = new Intl.NumberFormat('en');

export default function ClickCounter({ endpoint = '' }: { endpoint?: string }) {
  const [personal, setPersonal] = useState(0);
  const [global, setGlobal] = useState<number | null>(null);
  const [error, setError] = useState('');
  const pending = useRef(0);
  const syncing = useRef(false);

  useEffect(() => {
    setPersonal(readPersonalCount(localStorage.getItem(COUNTER_STORAGE_KEY)));
    if (!endpoint) return;
    const controller = new AbortController();
    fetch(`${endpoint}/counter`, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error('Counter unavailable');
        return response.json();
      })
      .then((data: unknown) => {
        if (typeof data === 'object' && data && 'total' in data && typeof data.total === 'number') setGlobal(data.total);
      })
      .catch((reason: unknown) => {
        if ((reason as Error).name !== 'AbortError') setError('The global counter is taking a short break. Your clicks still count here.');
      });
    return () => controller.abort();
  }, [endpoint]);

  const flush = useCallback(async () => {
    if (!endpoint || syncing.current || pending.current === 0) return;
    const amount = takeClickBatch(pending.current);
    if (!amount) return;
    pending.current -= amount;
    syncing.current = true;
    try {
      const response = await fetch(`${endpoint}/counter/increment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount }),
      });
      if (!response.ok) throw new Error('Could not sync clicks');
      const data = await response.json() as { total?: number };
      if (typeof data.total === 'number') setGlobal(data.total);
      setError('');
    } catch {
      pending.current += amount;
      setError('Some global clicks have not synced yet. We will keep trying.');
    } finally {
      syncing.current = false;
    }
  }, [endpoint]);

  useEffect(() => {
    if (!endpoint) return;
    const interval = window.setInterval(() => { void flush(); }, 650);
    return () => window.clearInterval(interval);
  }, [endpoint, flush]);

  function click() {
    const next = personal + 1;
    setPersonal(next);
    try { localStorage.setItem(COUNTER_STORAGE_KEY, String(next)); } catch { /* Local storage is optional. */ }
    if (endpoint) {
      pending.current += 1;
      setGlobal((value) => value === null ? value : value + 1);
    }
  }

  return (
    <MotionConfig reducedMotion="user">
      <article className={styles.counter}>
        <div className={styles.copy}>
          <p className={styles.kicker}>A very serious metric</p>
          <h3>Click. Add one. Improve nothing.</h3>
          <p>Your count stays in this browser. The global count is shared with everyone else who has found this button.</p>
        </div>
        <div className={styles.interaction}>
          <motion.button type="button" className={styles.button} onClick={click} whileTap={{ scale: 0.93 }} whileHover={{ scale: 1.025 }} transition={{ type: 'spring', stiffness: 420, damping: 22 }}>
            <span>Click</span><span aria-hidden="true">↗</span>
          </motion.button>
          <div className={styles.counts}>
            <div><strong>{global === null ? '—' : number.format(global)}</strong><span>global clicks</span></div>
            <div><motion.strong key={personal} initial={{ y: 5, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>{number.format(personal)}</motion.strong><span>your clicks</span></div>
          </div>
        </div>
        <p className={styles.status} aria-live="polite">
          {error || (!endpoint ? 'Global syncing activates when the counter backend is connected.' : 'Global clicks are synced in small batches.')}
        </p>
      </article>
    </MotionConfig>
  );
}
