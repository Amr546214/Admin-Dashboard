import { NavLink } from 'react-router-dom';
import {
  IoGridOutline,
  IoPeopleOutline,
  IoCubeOutline,
  IoReceiptOutline,
  IoSettingsOutline,
} from 'react-icons/io5';
import styles from './Sidebar.module.css';

const items = [
  { to: '/dashboard/overview', icon: IoGridOutline, label: 'Overview' },
  { to: '/dashboard/users', icon: IoPeopleOutline, label: 'Users' },
  { to: '/dashboard/products', icon: IoCubeOutline, label: 'Products' },
  { to: '/dashboard/orders', icon: IoReceiptOutline, label: 'Orders' },
  { to: '/dashboard/settings', icon: IoSettingsOutline, label: 'Settings' },
];

export function Sidebar() {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.logo}>Dashboard</div>
      <nav className={styles.nav}>
        {items.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) => `${styles.link} ${isActive ? styles.linkActive : ''}`}
            end={to === '/dashboard/overview'}
          >
            <Icon size={20} />
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
