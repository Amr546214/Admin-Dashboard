import { useState, useEffect, useMemo } from 'react';
import { getOrders } from '../../services/api';
import { formatDate } from '../../utils/formatDate';
import { PageContainer } from '../../components/layout/PageContainer/PageContainer';
import { Table, TableHead, TableBody, TableRow, TableHeader, TableCell, TableEmpty } from '../../components/ui/Table/Table';
import { Badge } from '../../components/ui/Badge/Badge';
import styles from './Orders.module.css';

const STATUS_OPTIONS = [
  { value: '', label: 'All statuses' },
  { value: 'paid', label: 'Paid' },
  { value: 'pending', label: 'Pending' },
  { value: 'cancelled', label: 'Cancelled' },
];

export function Orders() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    setLoading(true);
    setError(null);
    getOrders()
      .then(setList)
      .catch((err) => setError(err.message || 'Failed to load orders'))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    if (!statusFilter) return list;
    return list.filter((o) => o.status === statusFilter);
  }, [list, statusFilter]);

  const statusVariant = (s) => {
    if (s === 'paid') return 'success';
    if (s === 'cancelled') return 'danger';
    return 'warning';
  };

  return (
    <PageContainer title="Orders">
      {error && (
        <p style={{ color: 'var(--danger)', marginBottom: 16 }}>{error}</p>
      )}

      <div className={styles.filters}>
        <span className={styles.filterLabel}>Status:</span>
        <select
          className={styles.filterSelect}
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          aria-label="Filter by status"
        >
          {STATUS_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.tableWrap}>
        <Table>
          <TableHead>
            <TableRow>
              <TableHeader>Order ID</TableHeader>
              <TableHeader>Customer</TableHeader>
              <TableHeader>Total</TableHeader>
              <TableHeader>Status</TableHeader>
              <TableHeader>Date</TableHeader>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableEmpty colSpan={5} message="Loading..." />
            ) : filtered.length === 0 ? (
              <TableEmpty colSpan={5} />
            ) : (
              filtered.map((o) => (
                <TableRow key={o.id}>
                  <TableCell>#{o.id}</TableCell>
                  <TableCell>{o.customer}</TableCell>
                  <TableCell>${o.total?.toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge variant={statusVariant(o.status)}>{o.status}</Badge>
                  </TableCell>
                  <TableCell>{formatDate(o.date)}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </PageContainer>
  );
}
