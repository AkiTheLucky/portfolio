import { MotionConfig, motion } from 'motion/react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { COUNTER_STORAGE_KEY, readPersonalCount, takeClickBatch, unlockedTiers } from '../lib/counter';
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

  function click(amount: number) {
    const next = personal + amount;
    setPersonal(next);
    try { localStorage.setItem(COUNTER_STORAGE_KEY, String(next)); } catch { /* Local storage is optional. */ }
    if (endpoint) {
      pending.current += amount;
      setGlobal((value) => value === null ? value : value + amount);
    }
  }

  const unlocked = unlockedTiers(personal);

  return (
    <MotionConfig reducedMotion="user">
      <article className={styles.counter}>
        <div className={styles.copy}>
          <p className={styles.kicker}>Make number go up</p>
          <h3>Click here.</h3>
        </div>
        <div className={styles.interaction}>
          <div className={styles.buttons}>
            {unlocked.map((tier) => (
              <motion.button
                key={tier.amount}
                type="button"
                className={styles.button}
                onClick={() => click(tier.amount)}
                aria-label={`Add ${tier.amount} ${tier.amount === 1 ? 'click' : 'clicks'}`}
                initial={tier.amount === 1 ? false : { opacity: 0, scale: 0.65 }}
                animate={{ opacity: 1, scale: 1 }}
                whileTap={{ scale: 0.93 }}
                whileHover={{ scale: 1.025 }}
                transition={{ type: 'spring', stiffness: 420, damping: 22 }}
              >
                <span>{tier.amount === 1 ? 'Click' : `Click ×${tier.amount}`}</span><span aria-hidden="true">↗</span>
              </motion.button>
            ))}
          </div>
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
