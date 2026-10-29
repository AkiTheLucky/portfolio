import { AnimatePresence, MotionConfig, motion } from 'motion/react';
import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { currentStreak, formatAnswer, getDailyQuestion, parseEstimate, scoreEstimate, utcDateKey, type FermiHistory } from '../lib/fermi';
import type { FermiQuestion } from '../lib/types';
import styles from './FermiGame.module.css';

const STORAGE_KEY = 'akram-fermi-history-v1';

export default function FermiGame({ questions, compact = false }: { questions: FermiQuestion[]; compact?: boolean }) {
  const [today, setToday] = useState('');
  const [question, setQuestion] = useState(questions[0]);
  const [history, setHistory] = useState<FermiHistory>({});
  const [estimate, setEstimate] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const dateKey = utcDateKey(new Date());
    setToday(dateKey);
    setQuestion(getDailyQuestion(questions, new Date()));
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setHistory(JSON.parse(stored) as FermiHistory);
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [questions]);

  const played = today ? history[today] : undefined;
  const streak = useMemo(() => currentStreak(history, today), [history, today]);
  const dateLabel = today
    ? new Intl.DateTimeFormat('en', { day: 'numeric', month: 'long', timeZone: 'UTC' }).format(new Date(`${today}T00:00:00Z`))
    : 'Today';

  function submit(event: FormEvent) {
    event.preventDefault();
    if (!today || played) return;
    const value = parseEstimate(estimate);
    if (!value) {
      setError('Enter a positive number. Commas and spaces are fine.');
      return;
    }
    const result = { estimate: value, score: scoreEstimate(value, question.answer), playedAt: new Date().toISOString() };
    const next = { ...history, [today]: result };
    setHistory(next);
    setError('');
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch { /* The game still works without storage. */ }
  }

  return (
    <MotionConfig reducedMotion="user">
      <article className={`${styles.game} ${compact ? styles.compact : ''}`}>
        <header className={styles.header}>
          <div>
            <p className={styles.kicker}>Daily Fermi · {dateLabel}</p>
            <h3>I love brain teasers.</h3>
          </div>
          <div className={styles.streak} aria-label={`${streak} day streak`}><strong>{streak}</strong><span>day streak</span></div>
        </header>
        <p className={styles.question}>{question.question}</p>
        <form onSubmit={submit} className={styles.form}>
          <label htmlFor={`estimate-${compact ? 'home' : 'play'}`}>Your estimate in {question.unit}</label>
          <div className={styles.inputRow}>
            <input
              id={`estimate-${compact ? 'home' : 'play'}`}
              value={played ? String(played.estimate) : estimate}
              onChange={(event) => setEstimate(event.target.value)}
              inputMode="decimal"
              autoComplete="off"
              placeholder="Type a number"
              disabled={!today || Boolean(played)}
              aria-describedby={`estimate-error-${compact ? 'home' : 'play'}`}
            />
            <button type="submit" className="button button--primary" disabled={!today || Boolean(played)}>{played ? 'Estimated' : 'Make estimate'}</button>
          </div>
          <p id={`estimate-error-${compact ? 'home' : 'play'}`} className={styles.error} role="alert">{error}</p>
        </form>
        <AnimatePresence mode="wait">
          {played && (
            <motion.div key={`${today}-${played.estimate}`} className={styles.result} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} aria-live="polite">
              <div className={styles.resultTop}>
                <span>{played.score}</span>
                <strong>{formatAnswer(question.answer)} <small>{question.unit}</small></strong>
              </div>
              <p>{question.explanation}</p>
              <details>
                <summary>See the assumptions</summary>
                <ul>{question.assumptions.map((assumption) => <li key={assumption}>{assumption}</li>)}</ul>
              </details>
            </motion.div>
          )}
        </AnimatePresence>
        {!played && <p className={styles.note}>One estimate per day. Reasonable nearby answers count.</p>}
      </article>
    </MotionConfig>
  );
}
