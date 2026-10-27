import styles from './ArchArtwork.module.css';

export default function ArchArtwork({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`${styles.artwork} ${compact ? styles.compact : ''}`} aria-hidden="true">
      <svg viewBox="0 0 560 680" role="presentation">
        <g className={styles.backLines}>
          <path d="M82 590V262C82 128 167 48 280 48s198 80 198 214v328" />
          <path d="M113 590V270c0-113 70-181 167-181s167 68 167 181v320" />
          <path d="M49 590h462" />
        </g>
        <g className={styles.botanical}>
          <path d="M135 510c62-74 50-156 19-211 80 46 101 127 62 205" />
          <path d="M425 510c-62-74-50-156-19-211-80 46-101 127-62 205" />
          <path d="M146 425c-40-8-62-35-67-71 43 4 69 28 76 59M414 425c40-8 62-35 67-71-43 4-69 28-76 59" />
          <path d="M174 338c-20-38-14-73 9-103 31 36 30 72 4 106M386 338c20-38 14-73-9-103-31 36-30 72-4 106" />
        </g>
        <path className={styles.innerArch} d="M164 590V294c0-85 46-139 116-139s116 54 116 139v296" />
        <g className={styles.sun}>
          <circle cx="280" cy="238" r="38" />
          <path d="M280 178v-22M280 320v-22M220 238h-22M362 238h-22M238 196l-15-15M337 295l-15-15M322 196l15-15M223 295l15-15" />
        </g>
        <g className={styles.monogram}>
          <text x="280" y="434" textAnchor="middle">AN</text>
          <path d="M211 467h138" />
        </g>
        <g className={styles.stars}>
          <path d="m107 187 5 13 13 5-13 5-5 13-5-13-13-5 13-5 5-13ZM453 187l5 13 13 5-13 5-5 13-5-13-13-5 13-5 5-13Z" />
          <circle cx="116" cy="541" r="5" />
          <circle cx="444" cy="541" r="5" />
        </g>
      </svg>
    </div>
  );
}
