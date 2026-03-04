import { useEffect } from 'react';
import { IoClose } from 'react-icons/io5';
import { Button } from '../Button';
import styles from './Modal.module.css';

export function Modal({ open, onClose, title, children, footer }) {
  useEffect(() => {
    if (!open) return;
    const handleEscape = (e) => e.key === 'Escape' && onClose?.();
    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className={styles.overlay} onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div className={styles.dialog} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 id="modal-title" className={styles.title}>
            {title}
          </h2>
          <button type="button" className={styles.closeBtn} onClick={onClose} aria-label="Close">
            <IoClose size={20} />
          </button>
        </div>
        {children && <div className={styles.body}>{children}</div>}
        {footer != null && <div className={styles.footer}>{footer}</div>}
      </div>
    </div>
  );
}
