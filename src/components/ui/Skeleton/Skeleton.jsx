import styles from './Skeleton.module.css';

export function Skeleton({ width, height, variant = 'line', className = '', style: styleProp, ...rest }) {
  const style = { ...styleProp };
  if (width) style.width = typeof width === 'number' ? `${width}px` : width;
  if (height) style.height = typeof height === 'number' ? `${height}px` : height;

  return (
    <div
      className={`${styles.skeleton} ${styles[variant] || styles.line} ${className}`}
      style={style}
      aria-hidden
      {...rest}
    />
  );
}

export function SkeletonCard() {
  return (
    <div className={styles.card}>
      <Skeleton variant="line" height={12} style={{ marginBottom: 8 }} />
      <Skeleton variant="line" height={24} width="60%" />
    </div>
  );
}

export function TableSkeleton({ rows = 5, cols = 4 }) {
  return (
    <>
      {Array.from({ length: rows }).map((_, i) => (
        <tr key={i}>
          {Array.from({ length: cols }).map((_, j) => (
            <td key={j} style={{ padding: '12px 16px' }}>
              <Skeleton variant="line" height={14} width={j === 0 ? '70%' : '50%'} />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}
