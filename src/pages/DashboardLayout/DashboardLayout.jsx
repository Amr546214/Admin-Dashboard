import { Outlet } from 'react-router-dom';
import { Sidebar } from '../../components/layout/Sidebar/Sidebar';
import { Header } from '../../components/layout/Header/Header';
import styles from './DashboardLayout.module.css';

export function DashboardLayout() {
  return (
    <div className={styles.layout}>
      <Sidebar />
      <div className={styles.main}>
        <Header />
        <Outlet />
      </div>
    </div>
  );
}
