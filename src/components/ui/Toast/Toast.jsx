import styles from './Toast.module.css';

export function Toast({ message, variant = 'success' }) {
  return (
    <div className={`${styles.toast} ${styles[variant]}`} role="status">
      {message}
    </div>
  );
}

export function ToastContainer({ toasts }) {
  return (
    <div className={styles.container} aria-live="polite">
      {toasts.map((t) => (
        <Toast key={t.id} message={t.message} variant={t.variant} />
      ))}
    </div>
  );
}
