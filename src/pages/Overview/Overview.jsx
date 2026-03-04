import { useState, useEffect } from 'react';
import { PageContainer } from '../../components/layout/PageContainer/PageContainer';
import { Card } from '../../components/ui/Card/Card';
import { Skeleton } from '../../components/ui/Skeleton/Skeleton';
import { getDashboardStats, getRecentActivity } from '../../services/api';
import { formatDateTime } from '../../utils/formatDate';
import styles from './Overview.module.css';

export function Overview() {
  const [stats, setStats] = useState(null);
  const [activity, setActivity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    Promise.all([getDashboardStats(), getRecentActivity()])
      .then(([s, a]) => {
        if (!cancelled) {
          setStats(s);
          setActivity(a);
        }
      })
      .catch((err) => {
        if (!cancelled) setError(err.message || 'Failed to load');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  return (
    <PageContainer title="Overview">
      {error && (
        <p style={{ color: 'var(--danger)', marginBottom: 16 }}>{error}</p>
      )}

      <div className={styles.stats}>
        {loading ? (
          <>
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className={styles.statCard}>
                <Skeleton variant="line" height={14} width="60%" style={{ marginBottom: 8 }} />
                <Skeleton variant="line" height={28} width="40%" />
              </div>
            ))}
          </>
        ) : (
          <>
            <div className={styles.statCard}>
              <div className={styles.statLabel}>Total Users</div>
              <div className={styles.statValue}>{stats?.totalUsers ?? 0}</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statLabel}>Total Orders</div>
              <div className={styles.statValue}>{stats?.totalOrders ?? 0}</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statLabel}>Revenue</div>
              <div className={styles.statValue}>${stats?.revenue?.toFixed(2) ?? '0.00'}</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statLabel}>Pending</div>
              <div className={styles.statValue}>{stats?.pending ?? 0}</div>
            </div>
          </>
        )}
      </div>

      <h2 className={styles.sectionTitle}>Recent activity</h2>
      <div className={styles.activityCard}>
        {loading ? (
          <div style={{ padding: 24 }}>
            <Skeleton variant="line" height={16} width="100%" style={{ marginBottom: 12 }} />
            <Skeleton variant="line" height={14} width="90%" style={{ marginBottom: 8 }} />
            <Skeleton variant="line" height={14} width="80%" style={{ marginBottom: 8 }} />
            <Skeleton variant="line" height={14} width="85%" />
          </div>
        ) : (
          <table className={styles.activityTable}>
            <thead>
              <tr>
                <th>Action</th>
                <th>User</th>
                <th>Time</th>
              </tr>
            </thead>
            <tbody>
              {activity?.map((row) => (
                <tr key={row.id}>
                  <td>{row.action}</td>
                  <td>{row.user}</td>
                  <td>{formatDateTime(row.time)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </PageContainer>
  );
}
