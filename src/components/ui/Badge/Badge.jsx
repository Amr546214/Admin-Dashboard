import styles from './Badge.module.css';

export function Badge({ children, variant = 'default', className = '' }) {
  return (
    <span className={`${styles.badge} ${styles[variant] || styles.default} ${className}`}>
      {children}
    </span>
  );
}
