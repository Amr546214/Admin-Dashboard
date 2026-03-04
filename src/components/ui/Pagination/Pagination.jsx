import styles from './Pagination.module.css';

export function Pagination({ page, totalPages, total, perPage, onPageChange }) {
  const start = total === 0 ? 0 : (page - 1) * perPage + 1;
  const end = Math.min(page * perPage, total);

  return (
    <div className={styles.wrap}>
      <span className={styles.info}>
        Showing {start}–{end} of {total}
      </span>
      <div className={styles.controls}>
        <button
          type="button"
          className={styles.btn}
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          aria-label="Previous page"
        >
          Previous
        </button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
          <button
            key={p}
            type="button"
            className={`${styles.btn} ${p === page ? styles.btnActive : ''}`}
            onClick={() => onPageChange(p)}
            aria-label={`Page ${p}`}
            aria-current={p === page ? 'page' : undefined}
          >
            {p}
          </button>
        ))}
        <button
          type="button"
          className={styles.btn}
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
          aria-label="Next page"
        >
          Next
        </button>
      </div>
    </div>
  );
}
