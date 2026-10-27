import { AnimatePresence, MotionConfig, motion } from 'motion/react';
import { useId, useState, type ReactNode } from 'react';
import styles from './DiscoveryDoor.module.css';

interface DiscoveryDoorProps {
  eyebrow: string;
  title: string;
  children: ReactNode;
  align?: 'left' | 'right';
}

export default function DiscoveryDoor({ eyebrow, title, children, align = 'right' }: DiscoveryDoorProps) {
  const [open, setOpen] = useState(false);
  const id = useId();

  return (
    <MotionConfig reducedMotion="user">
      <motion.article className={`${styles.discovery} ${align === 'left' ? styles.left : ''}`} layout="position">
        <motion.button
          type="button"
          className={`${styles.door} ${open ? styles.open : ''}`}
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          aria-controls={id}
          whileTap={{ scale: 0.97 }}
        >
          <span className={styles.doorArt} aria-hidden="true">
            <span className={styles.doorStar}>✦</span>
            <span className={styles.doorKnob} />
          </span>
          <span className={styles.doorCopy}>
            <span className={styles.eyebrow}>{eyebrow}</span>
            <span className={styles.title}>{title}</span>
            <span className={styles.action}>{open ? 'Close the door' : 'Open the door'}</span>
          </span>
        </motion.button>
        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              id={id}
              className={styles.content}
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ height: { type: 'spring', stiffness: 240, damping: 28 }, opacity: { duration: 0.18 } }}
            >
              <div className={styles.contentInner}>{children}</div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.article>
    </MotionConfig>
  );
}
