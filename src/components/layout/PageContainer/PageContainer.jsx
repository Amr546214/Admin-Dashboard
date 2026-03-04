import styles from './PageContainer.module.css';

export function PageContainer({ title, children, className = '' }) {
  return (
    <main className={`${styles.container} ${className}`}>
      {title && <h1 className={styles.title}>{title}</h1>}
      {children}
    </main>
  );
}
