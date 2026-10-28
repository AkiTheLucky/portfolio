import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MotionConfig } from 'motion/react';
import { useRef, useState, type CSSProperties } from 'react';
import { href, site } from '../config/site';
import type { BlogEntry, EducationEntry, ExperienceEntry, FermiQuestion } from '../lib/types';
import ClickCounter from './ClickCounter';
import FermiGame from './FermiGame';
import HeroVideo from './HeroVideo';
import styles from './HomePage.module.css';

gsap.registerPlugin(useGSAP, ScrollTrigger);

interface HomePageProps {
  experiences: ExperienceEntry[];
  education: EducationEntry[];
  questions: FermiQuestion[];
  posts: BlogEntry[];
  clickEndpoint: string;
}

export default function HomePage({ experiences, education, questions, posts, clickEndpoint }: HomePageProps) {
  const root = useRef<HTMLDivElement>(null);
  const [nameWeight, setNameWeight] = useState(0.2);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const intro = gsap.timeline({ defaults: { ease: 'power3.out' } });
      intro
        .fromTo('[data-hero-line]', { yPercent: 108 }, { yPercent: 0, duration: 0.9, stagger: 0.08 }, 0.05)
        .from('[data-hero-fade]', { y: 16, autoAlpha: 0, duration: 0.65, stagger: 0.08 }, 0.32);

      gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((element) => {
        gsap.from(element, {
          y: 28,
          autoAlpha: 0,
          duration: 0.75,
          ease: 'power3.out',
          scrollTrigger: { trigger: element, start: 'top 88%', once: true },
        });
      });

      let active = true;
      document.fonts.ready.then(() => { if (active) ScrollTrigger.refresh(); });
      return () => { active = false; };
    });
    return () => mm.revert();
  }, { scope: root });

  return (
    <MotionConfig reducedMotion="user">
      <div ref={root} className={styles.home}>
        <section
          id="hero"
          className={styles.heroSection}
          aria-labelledby="hero-title"
          style={{ '--name-density': nameWeight } as CSSProperties}
        >
          <HeroVideo />
          <div className={`shell ${styles.hero}`}>
            <div className={styles.heroInner}>
              <h1
                id="hero-title"
                className={`${styles.heroTitle} ${nameWeight >= 1 ? styles.rainbow : ''}`}
                title="Drag the gauge to make the name lighter or heavier"
              >
                {['AKRAM', 'NASER'].map((word, wordIndex) => (
                  <span key={word} className={styles.nameMask}>
                    <span data-hero-line>
                      {Array.from(word).map((letter, letterIndex) => (
                        <span
                          key={`${word}-${letterIndex}`}
                          className={styles.nameLetter}
                          style={{ '--letter': wordIndex * 5 + letterIndex } as CSSProperties}
                        >
                          {letter}
                        </span>
                      ))}
                    </span>
                  </span>
                ))}
              </h1>
              <div className={styles.nameGauge}>
                <span className={styles.scaleGlyphThin} aria-hidden="true">A</span>
                <span className={styles.gauge}>
                  <svg viewBox="0 0 160 52" role="presentation" aria-hidden="true" focusable="false">
                    <path className={styles.gaugeArc} d="M12 44 Q80 0 148 44" />
                    <path className={styles.gaugeTicks} d="M20 42 Q80 8 140 42" />
                    <g className={styles.gaugeNeedle}>
                      <line x1="80" y1="44" x2="80" y2="12" />
                      <circle cx="80" cy="44" r="3.5" />
                    </g>
                  </svg>
                  <input
                    className={styles.gaugeInput}
                    type="range"
                    min={0}
                    max={100}
                    step={1}
                    value={Math.round(nameWeight * 100)}
                    onChange={(event) => setNameWeight(Number(event.target.value) / 100)}
                    aria-label="Name weight"
                  />
                </span>
                <span className={styles.scaleGlyphThick} aria-hidden="true">A</span>
              </div>
              <p className={styles.heroSubtitle} data-hero-fade>
                Process Improvement · AI Adoption
              </p>
              <div className={styles.heroActions} data-hero-fade>
                <a className="button button--primary" href={href('contact')}>Email me</a>
                <a className="button" href="#about">Explore <span aria-hidden="true">↓</span></a>
              </div>
            </div>
          </div>
        </section>

        <section id="about" className={`shell section ${styles.about}`} aria-labelledby="about-title">
          <div className={styles.aboutCopy} data-reveal>
            <p className="section-kicker">About</p>
            <h2 id="about-title" className="section-title">Efficiency is everywhere. You just have to look.</h2>
            <p className="section-intro">I enjoy the in-between of processes and technology.</p>
            <p>My background is in economics, business management, process automation, hands-on AI coaching, and back end dev learning.</p>
          </div>
          <figure className={styles.portraitFrame} data-reveal>
            <img src={href('me.jpg')} alt="Akram Naser" width="720" height="720" loading="lazy" />
          </figure>
        </section>

        <section id="experience" className={`shell section ${styles.experience}`} aria-labelledby="experience-title">
          <div className={styles.sectionHeading} data-reveal>
            <div>
              <p className="section-kicker">Experience</p>
              <h2 id="experience-title" className="section-title">The best solutions are sometimes the most straightforward.</h2>
            </div>
            <p className="section-intro">Here's what I found.</p>
          </div>
          <div className={styles.experienceList}>
            {experiences.map((entry) => (
              <article key={entry.id} className={styles.experienceEntry}>
                <header className={styles.experienceMeta} data-reveal>
                  <div className={styles.experienceTop}>
                    <h3>{entry.company}</h3>
                    <p className={styles.timeframeBadge}>{entry.timeframe}</p>
                  </div>
                  <div className={styles.experienceSub}>
                    <p className={styles.roleTitle}>{entry.role}</p>
                    <p className={styles.locationBadge}>{entry.location}</p>
                  </div>
                  <p className={styles.experienceSummary}>{entry.summary}</p>
                </header>
                <div className={styles.achievements}>
                  {entry.achievements.map((achievement) => (
                    <article key={achievement.title} className={styles.achievementCard} data-reveal>
                      {achievement.metric && <strong className={styles.metric}>{achievement.metric}</strong>}
                      <h4>{achievement.title}</h4>
                      <p>{achievement.detail}</p>
                    </article>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className={`shell section ${styles.education}`} aria-labelledby="education-title">
          <div className={styles.educationHeading} data-reveal>
            <p className="section-kicker">Education & Learning</p>
            <h2 id="education-title" className="section-title">Degrees and learnings.</h2>
          </div>
          <div className={styles.educationList}>
            {education.map((entry) => (
              <article key={entry.id} className={styles.educationCard} data-reveal>
                <p className={styles.eduTime}>{entry.timeframe}</p>
                <h3>{entry.credential}</h3>
                <p className={styles.eduInst}>{entry.institution}</p>
                {entry.details.length > 0 && <ul>{entry.details.map((detail) => <li key={detail}>{detail}</li>)}</ul>}
              </article>
            ))}
          </div>
        </section>

        <section className={`section ${styles.play}`} aria-labelledby="play-title">
          <div className="shell">
            <div className={styles.playHeading} data-reveal>
              <div>
                <p className="section-kicker">Playroom</p>
                <h2 id="play-title" className="section-title">A fun fact.</h2>
              </div>
              <p className="section-intro">Did you know that I get my best ideas while fidgeting?</p>
            </div>
            <div className={styles.widgetGrid} data-reveal>
              <FermiGame questions={questions} compact />
              <ClickCounter endpoint={clickEndpoint} />
            </div>
            <a className={`button ${styles.playLink}`} href={href('play')}>Open full playroom <span aria-hidden="true">↗</span></a>
          </div>
        </section>

        <section className={`shell section ${styles.blog}`} aria-labelledby="blog-title">
          <div className={styles.blogHeading} data-reveal>
            <div><p className="section-kicker">Blog</p><h2 id="blog-title" className="section-title">Thoughts and ideas.</h2></div>
            <a className="button" href={href('blog')}>All writing <span aria-hidden="true">↗</span></a>
          </div>
          {posts.length > 0 ? (
            <div className={styles.postGrid}>
              {posts.slice(0, 3).map((post) => (
                <a key={post.id} className={styles.postCard} href={href(`blog/${post.id}`)} data-reveal>
                  <time>{post.pubDate}</time><h3>{post.title}</h3><p>{post.description}</p><span>Read post ↗</span>
                </a>
              ))}
            </div>
          ) : (
            <div className={styles.writingDesk} data-reveal>
              <p>The MDX publishing desk is wired up and ready for the first real post—zero AI filler articles.</p>
              <a className="button button--primary" href={href('blog')}>Visit the blog <span aria-hidden="true">↗</span></a>
            </div>
          )}
        </section>

        <section className={`shell ${styles.contact}`} aria-labelledby="contact-title">
          <div className={styles.contactInner} data-reveal>
            <p className={styles.contactBadge}>Contact</p>
            <h2 id="contact-title">Have a problem worth solving?</h2>
            <p>Tell me what you are working on, what feels stuck, or where better processes and AI could actually help your team.</p>
            <div className={styles.contactActions}>
              <a className="button button--primary" href={href('contact')}>Send a message <span aria-hidden="true">↗</span></a>
              {site.linkedin && <a className="button" href={site.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>}
            </div>
          </div>
        </section>
      </div>
    </MotionConfig>
  );
}
