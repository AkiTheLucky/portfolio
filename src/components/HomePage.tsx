import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MotionConfig } from 'motion/react';
import { useRef } from 'react';
import { href, site } from '../config/site';
import type { BlogEntry, EducationEntry, ExperienceEntry, FermiQuestion } from '../lib/types';
import ArchArtwork from './ArchArtwork';
import ClickCounter from './ClickCounter';
import DiscoveryDoor from './DiscoveryDoor';
import FermiGame from './FermiGame';
import styles from './HomePage.module.css';
import ProcessScene from './ProcessScene';

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

  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const intro = gsap.timeline({ defaults: { ease: 'power3.out' } });
      intro
        .fromTo('[data-hero-line]', { yPercent: 110 }, { yPercent: 0, duration: 1.05, stagger: 0.1 }, 0.1)
        .from('[data-hero-fade]', { y: 18, autoAlpha: 0, duration: 0.7, stagger: 0.08 }, 0.45)
        .from('[data-hero-art]', { autoAlpha: 0, scale: 0.94, rotation: -2, duration: 1.25 }, 0.25);

      gsap.to('[data-hero-art]', {
        yPercent: 13,
        rotation: 1.5,
        ease: 'none',
        scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: 0.6 },
      });

      gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((element) => {
        gsap.from(element, {
          y: 38,
          autoAlpha: 0,
          duration: 0.85,
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
        <section id="hero" className={`shell ${styles.hero}`} aria-labelledby="hero-title">
          <div className={styles.heroCopy}>
            <p className={styles.heroKicker} data-hero-fade>Business management · AI adoption · Process improvement</p>
            <h1 id="hero-title" className={styles.heroTitle}>
              <span className={styles.nameMask}><span data-hero-line>Akram</span></span>
              <span className={`${styles.nameMask} ${styles.lastName}`}><span data-hero-line>Naser</span></span>
            </h1>
            <div className={styles.heroBottom} data-hero-fade>
              <p>I solve operational problems, teach AI tools, and find useful ways for businesses to work better.</p>
              <div className={styles.heroActions}>
                <a className="button button--primary" href="#experience">See my experience <span aria-hidden="true">↓</span></a>
                <a className="button" href={href('contact')}>Email me</a>
              </div>
            </div>
          </div>
          <div className={styles.heroArt} data-hero-art><ArchArtwork /></div>
          <div className={styles.scrollNote} data-hero-fade aria-hidden="true"><span />The main story is downstairs</div>
        </section>

        <section className={`shell section ${styles.about}`} aria-labelledby="about-title">
          <div className={styles.aboutCopy} data-reveal>
            <p className="section-kicker">A little context</p>
            <h2 id="about-title" className="section-title">Curious about better ways to work.</h2>
            <p className="section-intro">I enjoy the space between a messy real-world process and a solution that feels simple to the person using it.</p>
            <p>My background combines economics, business management, automation, teaching, and independent coding study. I care about making things useful—and about having some fun while making them.</p>
          </div>
          <div className={styles.aboutArt} data-reveal>
            <ArchArtwork compact />
            <DiscoveryDoor eyebrow="Side discovery · 01" title="Outside work" align="left">
              <p>Ballroom dancing, Art Nouveau, cooking and baking, strength training, and gaming.</p>
              <p>The Art Nouveau interest made its way into the frames. That felt appropriate.</p>
            </DiscoveryDoor>
          </div>
        </section>

        <section id="experience" className={`shell section ${styles.experience}`} aria-labelledby="experience-title">
          <div className={styles.sectionHeading} data-reveal>
            <div>
              <p className="section-kicker">Experience</p>
              <h2 id="experience-title" className="section-title">Evidence over buzzwords.</h2>
            </div>
            <p className="section-intro">A selection of operational improvements, teaching, and problem-solving from my work so far.</p>
          </div>
          <div className={styles.experienceBody}>
            <div className={styles.experienceList}>
              {experiences.map((entry) => (
                <article key={entry.id} className={styles.experienceEntry}>
                  <header className={styles.experienceMeta} data-reveal>
                    <p className={styles.timeframe}>{entry.timeframe}</p>
                    <h3>{entry.company}</h3>
                    <p>{entry.role}</p>
                    <p className={styles.location}>{entry.location}</p>
                    <p>{entry.summary}</p>
                  </header>
                  <div className={styles.achievements}>
                    {entry.achievements.map((achievement, index) => (
                      <article key={achievement.title} className={styles.achievement} data-reveal>
                        <span className={styles.achievementNumber}>{String(index + 1).padStart(2, '0')}</span>
                        {achievement.metric && <strong className={styles.metric}>{achievement.metric}</strong>}
                        <h4>{achievement.title}</h4>
                        <p>{achievement.detail}</p>
                      </article>
                    ))}
                  </div>
                </article>
              ))}
            </div>
            <aside className={styles.experienceDoor} data-reveal>
              <DiscoveryDoor eyebrow="Side discovery · 02" title="Before the automation">
                <p>The first step was not choosing a tool. It was understanding the repeated work, the handoffs, and where questions tended to get stuck.</p>
                <p>Sometimes the useful improvement is a better process. Sometimes it is an automation. Sometimes it is simply a clear answer in the right place.</p>
              </DiscoveryDoor>
            </aside>
          </div>
        </section>

        <section className={`shell section ${styles.education}`} aria-labelledby="education-title">
          <div className={styles.educationHeading} data-reveal>
            <p className="section-kicker">Education & learning</p>
            <h2 id="education-title" className="section-title">Formal study. Informal curiosity.</h2>
          </div>
          <div className={styles.educationBody}>
            <div className={styles.educationList}>
              {education.map((entry) => (
                <article key={entry.id} className={styles.educationEntry} data-reveal>
                  <p>{entry.timeframe}</p>
                  <div><h3>{entry.credential}</h3><span>{entry.institution}</span></div>
                  {entry.details.length > 0 && <ul>{entry.details.map((detail) => <li key={detail}>{detail}</li>)}</ul>}
                </article>
              ))}
            </div>
            <DiscoveryDoor eyebrow="Side discovery · 03" title="Languages in the mix">
              <ul>
                <li>German · native</li>
                <li>English · full professional proficiency</li>
                <li>Arabic · conversational</li>
                <li>Polish and Japanese · beginner</li>
              </ul>
              <p>No percentages, no radar chart. Languages are for using, not for filling in a skill map.</p>
              </DiscoveryDoor>
          </div>
        </section>

        <ProcessScene />

        <section className={`section ${styles.play}`} aria-labelledby="play-title">
          <div className="shell">
            <div className={styles.playHeading} data-reveal>
              <div><p className="section-kicker">Play</p><h2 id="play-title" className="section-title">Useful things can still be fun.</h2></div>
              <p className="section-intro">Two small experiences, both working right here. No screenshots pretending to be features.</p>
            </div>
            <div className={styles.widgetGrid} data-reveal>
              <FermiGame questions={questions} compact />
              <ClickCounter endpoint={clickEndpoint} />
            </div>
            <a className={`text-link ${styles.playLink}`} href={href('play')}>Visit the full playroom <span aria-hidden="true">↗</span></a>
          </div>
        </section>

        <section className={`shell section ${styles.blog}`} aria-labelledby="blog-title">
          <div className={styles.blogHeading} data-reveal>
            <div><p className="section-kicker">Blog</p><h2 id="blog-title" className="section-title">Notes from the margin.</h2></div>
            <a className="text-link" href={href('blog')}>All writing <span aria-hidden="true">↗</span></a>
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
              <div><span>Process</span><span>AI adoption</span><span>Building useful things</span></div>
              <p>The first posts are being written. The publishing desk is ready when they are.</p>
              <a className="text-link" href={href('blog')}>About the blog <span aria-hidden="true">↗</span></a>
            </div>
          )}
        </section>

        <section className={`shell ${styles.contact}`} aria-labelledby="contact-title">
          <div className={styles.contactInner} data-reveal>
            <p className="section-kicker">One last door</p>
            <h2 id="contact-title">Have a problem worth solving?</h2>
            <p>Tell me what you are working on, what feels stuck, or what you would like to make better.</p>
            <div className={styles.contactActions}>
              <a className="button button--primary" href={href('contact')}>Send a message <span aria-hidden="true">↗</span></a>
              {site.linkedin && <a className="button" href={site.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>}
            </div>
            <div className={styles.contactOrnament} aria-hidden="true"><span>✦</span></div>
          </div>
        </section>
      </div>
    </MotionConfig>
  );
}
