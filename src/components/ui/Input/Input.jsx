import styles from './Input.module.css';

export function Input({
  label,
  error,
  id,
  className = '',
  ...props
}) {
  const inputId = id || `input-${Math.random().toString(36).slice(2, 9)}`;
  return (
    <div className={`${styles.wrap} ${className}`}>
      {label && (
        <label htmlFor={inputId} className={styles.label}>
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={`${styles.input} ${error ? styles.error : ''}`}
        aria-invalid={!!error}
        aria-describedby={error ? `${inputId}-error` : undefined}
        {...props}
      />
      {error && (
        <span id={`${inputId}-error`} className={`${styles.msg} ${styles.msgError}`}>
          {error}
        </span>
      )}
    </div>
  );
}
