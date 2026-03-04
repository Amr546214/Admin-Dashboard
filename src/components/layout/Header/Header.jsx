import { useState, useRef, useEffect } from 'react';
import { IoChevronDown, IoLogOutOutline } from 'react-icons/io5';
import { useAuth } from '../../../context/AuthContext';
import { Button } from '../../ui/Button';
import styles from './Header.module.css';

export function Header() {
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setDropdownOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const initial = user?.name?.slice(0, 1)?.toUpperCase() || 'U';

  return (
    <header className={styles.header}>
      <div className={`${styles.searchWrap} ${styles.searchIconWrap}`}>
        <input
          type="search"
          className={styles.search}
          placeholder="Search..."
          aria-label="Search"
        />
      </div>
      <div className={styles.right}>
        <div className={styles.dropdown} ref={ref}>
          <button
            type="button"
            className={styles.dropdownBtn}
            onClick={() => setDropdownOpen((o) => !o)}
            aria-expanded={dropdownOpen}
            aria-haspopup="true"
          >
            <span className={styles.avatar}>{initial}</span>
            <span>{user?.name || 'User'}</span>
            <IoChevronDown size={18} />
          </button>
          {dropdownOpen && (
            <div
              style={{
                position: 'absolute',
                top: '100%',
                right: 0,
                marginTop: 4,
                padding: 8,
                background: 'var(--bg-card)',
                border: '1px solid var(--border)',
                borderRadius: 8,
                boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                minWidth: 160,
              }}
              role="menu"
            >
              <div style={{ padding: '8px 12px', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                {user?.email || 'user@example.com'}
              </div>
              <button
                type="button"
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '8px 12px',
                  border: 'none',
                  background: 'transparent',
                  cursor: 'pointer',
                  fontSize: '0.9375rem',
                  color: 'var(--text)',
                  borderRadius: 6,
                }}
                onClick={() => { setDropdownOpen(false); logout(); }}
                role="menuitem"
              >
                <IoLogOutOutline size={18} /> Logout
              </button>
            </div>
          )}
        </div>
        <Button variant="secondary" size="sm" onClick={logout}>
          <IoLogOutOutline size={18} /> Logout
        </Button>
      </div>
    </header>
  );
}
