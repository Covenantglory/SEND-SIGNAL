import styles from './skeleton.module.css';

export interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  variant?: 'text' | 'circular' | 'rectangular';
  className?: string;
}

export function Skeleton({ width, height, variant = 'text', className = '' }: SkeletonProps) {
  return (
    <div
      className={`${styles.skeleton} ${styles[variant]} ${className}`}
      style={{
        width: typeof width === 'number' ? `${width}px` : width,
        height: typeof height === 'number' ? `${height}px` : height,
      }}
    />
  );
}

export function SkeletonText({ lines = 3 }: { lines?: number }) {
  return (
    <div className={styles.textWrapper}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          variant="text"
          width={i === lines - 1 ? '60%' : '100%'}
        />
      ))}
    </div>
  );
}

export function SkeletonCard() {
  return (
    <div className={styles.card}>
      <Skeleton variant="rectangular" height={160} />
      <div className={styles.cardContent}>
        <Skeleton variant="text" width="70%" />
        <Skeleton variant="text" width="90%" />
        <Skeleton variant="text" width="40%" />
      </div>
    </div>
  );
}
