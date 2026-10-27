import { useState, type FormEvent } from 'react';
import { site } from '../config/site';
import styles from './ContactForm.module.css';

type Status = 'idle' | 'sending' | 'success' | 'error';

export default function ContactForm({ endpoint = '' }: { endpoint?: string }) {
  const [status, setStatus] = useState<Status>('idle');
  const [message, setMessage] = useState('');
  const configured = /^https:\/\//.test(endpoint);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    if (!configured) {
      setStatus('error');
      setMessage('Form delivery has not been connected yet.');
      return;
    }
    setStatus('sending');
    setMessage('Sending your message…');
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' },
      });
      if (!response.ok) throw new Error('Submission failed');
      form.reset();
      setStatus('success');
      setMessage('Thanks — your message has been sent. I will get back to you.');
    } catch {
      setStatus('error');
      setMessage('That did not go through. Please try again in a moment.');
    }
  }

  return (
    <form className={styles.form} onSubmit={submit}>
      <div className={styles.honeypot} aria-hidden="true">
        <label htmlFor="company-website">Leave this field empty</label>
        <input id="company-website" name="_gotcha" type="text" tabIndex={-1} autoComplete="off" />
      </div>
      <div className="form-field">
        <label htmlFor="name">Name</label>
        <input id="name" name="name" type="text" autoComplete="name" required placeholder="Your name" />
      </div>
      <div className="form-field">
        <label htmlFor="email">Email</label>
        <input id="email" name="email" type="email" autoComplete="email" required placeholder="you@example.com" />
      </div>
      <div className="form-field">
        <label htmlFor="message">Message</label>
        <textarea id="message" name="message" required minLength={10} placeholder="What would you like to talk about?" />
      </div>
      <div className={styles.submitRow}>
        <button className="button button--primary" type="submit" disabled={status === 'sending' || !configured}>
          {status === 'sending' ? 'Sending…' : 'Send message'}
        </button>
        <p className="form-status" data-state={status} aria-live="polite">
          {message || (!configured ? 'Add the Formspree endpoint to activate delivery.' : 'Your message goes directly to Akram.')}
        </p>
      </div>
      <p className={styles.social}>Prefer another route? <a href={site.linkedin || site.github} target="_blank" rel="noreferrer">{site.linkedin ? 'Find me on LinkedIn' : 'Find me on GitHub'} ↗</a></p>
    </form>
  );
}
