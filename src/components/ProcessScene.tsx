import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useRef } from 'react';
import styles from './ProcessScene.module.css';

gsap.registerPlugin(useGSAP, ScrollTrigger);

const steps = [
  {
    number: '01',
    title: 'Understand the actual problem',
    text: 'Map the work, find the friction, and clarify who owns each step before choosing a tool.',
  },
  {
    number: '02',
    title: 'Make the process better',
    text: 'Remove duplicated effort, simplify the route, and automate only the parts that benefit from it.',
  },
  {
    number: '03',
    title: 'Help people make it useful',
    text: 'Teach the approach, answer questions, and turn a new tool into something people can use confidently.',
  },
];

const nodes = [
  { className: styles.nodeA, label: 'Request', target: 0 },
  { className: styles.nodeB, label: 'Inbox', target: 1 },
  { className: styles.nodeC, label: 'Copy + paste', target: -1 },
  { className: styles.nodeD, label: 'Review', target: 2 },
  { className: styles.nodeE, label: 'Useful outcome', target: 3 },
];

export default function ProcessScene() {
  const section = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add('(min-width: 800px) and (prefers-reduced-motion: no-preference)', () => {
      const nodeElements = gsap.utils.toArray<HTMLElement>(`.${styles.node}`);
      const timeline = gsap.timeline({
        defaults: { ease: 'power2.inOut' },
        scrollTrigger: {
          trigger: section.current,
          start: 'top top',
          end: 'bottom bottom',
          pin: stage.current,
          pinSpacing: false,
          scrub: 0.6,
          invalidateOnRefresh: true,
        },
      });

      timeline
        .to(nodeElements, {
          x: (_index, element) => {
            const target = Number((element as HTMLElement).dataset.target);
            if (target < 0 || !stage.current) return 0;
            const visual = stage.current.querySelector(`.${styles.visual}`)!;
            const targetX = visual.clientWidth * (0.16 + target * 0.225);
            return targetX - (element as HTMLElement).offsetLeft;
          },
          y: (_index, element) => {
            const target = Number((element as HTMLElement).dataset.target);
            const visual = stage.current!.querySelector(`.${styles.visual}`)!;
            return target >= 0 ? visual.clientHeight * 0.43 - (element as HTMLElement).offsetTop : 0;
          },
          rotation: 0,
          duration: 0.42,
        }, 0)
        .to(`.${styles.redundant}`, { autoAlpha: 0, scale: 0.6, duration: 0.2 }, 0.12)
        .to(`.${styles.stepOne}`, { x: -8, duration: 0.18 }, 0.24)
        .to(`.${styles.stepTwo}`, { x: 0, duration: 0.18 }, 0.24)
        .fromTo(`.${styles.connection}`, { scaleX: 0 }, { scaleX: 1, duration: 0.25 }, 0.3)
        .to(`.${styles.nodes}`, { autoAlpha: 0.22, duration: 0.22 }, 0.55)
        .to(`.${styles.stepTwo}`, { x: -8, duration: 0.18 }, 0.58)
        .to(`.${styles.stepThree}`, { x: 0, duration: 0.18 }, 0.58)
        .fromTo(`.${styles.tool}`, { autoAlpha: 0, y: 28, scale: 0.96 }, { autoAlpha: 1, y: 0, scale: 1, duration: 0.3 }, 0.6)
        .fromTo(`.${styles.person}`, { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, stagger: 0.06, duration: 0.18 }, 0.78);
    });
    return () => mm.revert();
  }, { scope: section });

  return (
    <section ref={section} className={styles.processSection} aria-labelledby="capabilities-title">
      <div ref={stage} className={styles.stage}>
        <div className={`shell ${styles.layout}`}>
          <div className={styles.copy}>
            <p className="section-kicker">What I can help with</p>
            <h2 id="capabilities-title" className="section-title">Better work, not just more tools.</h2>
            <div className={styles.steps}>
              {steps.map((step, index) => (
                <article key={step.number} className={`${styles.step} ${index === 0 ? styles.stepOne : index === 1 ? styles.stepTwo : styles.stepThree}`}>
                  <span>{step.number}</span>
                  <div><h3>{step.title}</h3><p>{step.text}</p></div>
                </article>
              ))}
            </div>
          </div>
          <div className={styles.processStatic}>
            {steps.map((step) => <div key={step.number} className={styles.staticCard}><span>{step.number}</span><p>{step.text}</p></div>)}
          </div>
          <div className={styles.processMotion} aria-hidden="true">
            <div className={styles.visual}>
              <div className={styles.nodes}>
                {nodes.map((node) => (
                  <div key={node.label} data-target={node.target} className={`${styles.node} ${node.className} ${node.target < 0 ? styles.redundant : ''}`}>
                    <span className={styles.nodeDot} />{node.label}
                  </div>
                ))}
                <div className={styles.connection} />
              </div>
              <div className={styles.tool}>
                <div className={styles.toolBar}><span /><span /><span /></div>
                <div className={styles.toolBody}>
                  <span className={styles.toolLabel}>One clear next step</span>
                  <strong>Useful by design.</strong>
                  <div className={styles.toolProgress}><span /></div>
                </div>
              </div>
              <div className={styles.people}>
                {['A', 'B', 'C'].map((person) => <span key={person} className={styles.person}>{person}</span>)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
