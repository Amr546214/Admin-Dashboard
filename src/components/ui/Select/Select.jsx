import styles from './Select.module.css';

export function Select({ label, error, id, options = [], className = '', ...props }) {
  const selectId = id || `select-${Math.random().toString(36).slice(2, 9)}`;
  return (
    <div className={`${styles.wrap} ${className}`}>
      {label && (
        <label htmlFor={selectId} className={styles.label}>
          {label}
        </label>
      )}
      <select
        id={selectId}
        className={`${styles.select} ${error ? styles.error : ''}`}
        aria-invalid={!!error}
        {...props}
      >
        {options.map((opt) =>
          typeof opt === 'object' ? (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ) : (
            <option key={opt} value={opt}>
              {opt}
            </option>
          )
        )}
      </select>
      {error && <span className={styles.msg}>{error}</span>}
    </div>
  );
}
