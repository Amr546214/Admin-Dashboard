import styles from './Table.module.css';

export function Table({ children, zebra = true, className = '' }) {
  return (
    <div className={`${styles.wrap} ${className}`}>
      <table className={`${styles.table} ${zebra ? styles.zebra : ''}`}>
        {children}
      </table>
    </div>
  );
}

export function TableHead({ children }) {
  return <thead>{children}</thead>;
}

export function TableBody({ children }) {
  return <tbody>{children}</tbody>;
}

export function TableRow({ children, className = '' }) {
  return <tr className={styles.tr}>{children}</tr>;
}

export function TableHeader({ children, sortable, sortDirection, onClick, className = '' }) {
  return (
    <th
      className={`${styles.th} ${sortable ? styles.sortable : ''} ${className}`}
      onClick={sortable ? onClick : undefined}
    >
      {children}
      {sortable && sortDirection && (
        <span style={{ marginLeft: 4 }} aria-hidden>
          {sortDirection === 'asc' ? ' ↑' : ' ↓'}
        </span>
      )}
    </th>
  );
}

export function TableCell({ children, className = '' }) {
  return <td className={`${styles.td} ${className}`}>{children}</td>;
}

export function TableEmpty({ colSpan, message = 'No data' }) {
  return (
    <tr>
      <td colSpan={colSpan} className={styles.empty}>
        {message}
      </td>
    </tr>
  );
}
