import { useState, useEffect, useMemo } from 'react';
import { getUsers, createUser, updateUser, deleteUser } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { validateEmail } from '../../utils/validateEmail';
import { paginate } from '../../utils/paginate';
import { formatDate } from '../../utils/formatDate';
import { PageContainer } from '../../components/layout/PageContainer/PageContainer';
import { Button } from '../../components/ui/Button/Button';
import { Input } from '../../components/ui/Input/Input';
import { Select } from '../../components/ui/Select/Select';
import { Modal } from '../../components/ui/Modal/Modal';
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableHeader,
  TableCell,
  TableEmpty,
} from '../../components/ui/Table/Table';
import { Pagination } from '../../components/ui/Pagination/Pagination';
import { Badge } from '../../components/ui/Badge/Badge';
import { IoAdd, IoCreateOutline, IoTrashOutline, IoEyeOutline } from 'react-icons/io5';
import styles from './Users.module.css';

const ROLES = [
  { value: 'admin', label: 'Admin' },
  { value: 'editor', label: 'Editor' },
  { value: 'viewer', label: 'Viewer' },
];
const STATUSES = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
  { value: 'pending', label: 'Pending' },
];

const PER_PAGE = 5;

export function Users() {
  const { addToast } = useToast();
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [sortKey, setSortKey] = useState('name');
  const [sortDir, setSortDir] = useState('asc');
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ name: '', email: '', role: 'viewer', status: 'pending' });
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const fetchUsers = () => {
    setLoading(true);
    setError(null);
    getUsers()
      .then(setList)
      .catch((err) => setError(err.message || 'Failed to load users'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filtered = useMemo(() => {
    let arr = [...list];
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      arr = arr.filter(
        (u) =>
          u.name?.toLowerCase().includes(q) ||
          u.email?.toLowerCase().includes(q) ||
          u.role?.toLowerCase().includes(q)
      );
    }
    arr.sort((a, b) => {
      const aVal = a[sortKey] ?? '';
      const bVal = b[sortKey] ?? '';
      const cmp = String(aVal).localeCompare(String(bVal), undefined, { numeric: true });
      return sortDir === 'asc' ? cmp : -cmp;
    });
    return arr;
  }, [list, search, sortKey, sortDir]);

  const { items, totalPages, total } = paginate(filtered, page, PER_PAGE);

  const toggleSort = (key) => {
    if (sortKey === key) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  const openAdd = () => {
    setEditingId(null);
    setForm({ name: '', email: '', role: 'viewer', status: 'pending' });
    setFormErrors({});
    setModalOpen(true);
  };

  const openEdit = (user) => {
    setEditingId(user.id);
    setForm({
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
    });
    setFormErrors({});
    setModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const err = {};
    if (!form.name?.trim()) err.name = 'Name is required';
    const emailErr = validateEmail(form.email);
    if (emailErr) err.email = emailErr;
    setFormErrors(err);
    if (Object.keys(err).length > 0) return;

    setSubmitting(true);
    const promise = editingId
      ? updateUser(editingId, form)
      : createUser(form);
    promise
      .then(() => {
        addToast(editingId ? 'User updated.' : 'User created.', 'success');
        setModalOpen(false);
        fetchUsers();
      })
      .catch((err) => addToast(err.message || 'Request failed', 'error'))
      .finally(() => setSubmitting(false));
  };

  const handleDelete = (user) => setDeleteConfirm(user);

  const confirmDelete = () => {
    if (!deleteConfirm) return;
    setSubmitting(true);
    deleteUser(deleteConfirm.id)
      .then(() => {
        addToast('User deleted.', 'success');
        setDeleteConfirm(null);
        fetchUsers();
      })
      .catch((err) => addToast(err.message || 'Delete failed', 'error'))
      .finally(() => setSubmitting(false));
  };

  const statusVariant = (s) => (s === 'active' ? 'success' : s === 'inactive' ? 'danger' : 'warning');

  return (
    <PageContainer title="Users">
      {error && (
        <p style={{ color: 'var(--danger)', marginBottom: 16 }}>{error}</p>
      )}

      <div className={styles.toolbar}>
        <div className={styles.searchWrap}>
          <input
            type="search"
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Search users"
          />
        </div>
        <Button onClick={openAdd}>
          <IoAdd size={18} /> Add User
        </Button>
      </div>

      <div className={styles.tableWrap}>
        <Table>
          <TableHead>
            <TableRow>
              <TableHeader sortable sortDirection={sortKey === 'name' ? sortDir : null} onClick={() => toggleSort('name')}>
                Name
              </TableHeader>
              <TableHeader sortable sortDirection={sortKey === 'email' ? sortDir : null} onClick={() => toggleSort('email')}>
                Email
              </TableHeader>
              <TableHeader sortable sortDirection={sortKey === 'role' ? sortDir : null} onClick={() => toggleSort('role')}>
                Role
              </TableHeader>
              <TableHeader sortable sortDirection={sortKey === 'status' ? sortDir : null} onClick={() => toggleSort('status')}>
                Status
              </TableHeader>
              <TableHeader>Created</TableHeader>
              <TableHeader>Actions</TableHeader>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableEmpty colSpan={6} message="Loading..." />
            ) : items.length === 0 ? (
              <TableEmpty colSpan={6} />
            ) : (
              items.map((u) => (
                <TableRow key={u.id}>
                  <TableCell>{u.name}</TableCell>
                  <TableCell>{u.email}</TableCell>
                  <TableCell>{u.role}</TableCell>
                  <TableCell>
                    <Badge variant={statusVariant(u.status)}>{u.status}</Badge>
                  </TableCell>
                  <TableCell>{formatDate(u.createdAt)}</TableCell>
                  <TableCell>
                    <div className={styles.actionsCell}>
                      <Button variant="secondary" size="sm" onClick={() => openEdit(u)}>
                        <IoCreateOutline size={16} /> Edit
                      </Button>
                      <Button variant="danger" size="sm" onClick={() => handleDelete(u)}>
                        <IoTrashOutline size={16} /> Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {!loading && total > 0 && (
          <Pagination
            page={page}
            totalPages={totalPages}
            total={total}
            perPage={PER_PAGE}
            onPageChange={setPage}
          />
        )}
      </div>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingId ? 'Edit User' : 'Add User'}
        footer={
          <>
            <Button variant="secondary" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" form="user-form" disabled={submitting}>
              {submitting ? 'Saving…' : editingId ? 'Update' : 'Create'}
            </Button>
          </>
        }
      >
        <form id="user-form" onSubmit={handleSubmit} className={styles.formGrid}>
          <Input
            label="Name"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            error={formErrors.name}
            placeholder="Full name"
          />
          <Input
            label="Email"
            type="email"
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            error={formErrors.email}
            placeholder="email@example.com"
            disabled={!!editingId}
          />
          <Select
            label="Role"
            value={form.role}
            onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
            options={ROLES}
          />
          <Select
            label="Status"
            value={form.status}
            onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
            options={STATUSES}
          />
        </form>
      </Modal>

      <Modal
        open={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        title="Delete user"
        footer={
          <>
            <Button variant="secondary" onClick={() => setDeleteConfirm(null)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={confirmDelete} disabled={submitting}>
              {submitting ? 'Deleting…' : 'Delete'}
            </Button>
          </>
        }
      >
        {deleteConfirm && (
          <p className={styles.confirmText}>
            Are you sure you want to delete <strong>{deleteConfirm.name}</strong>? This action cannot be undone.
          </p>
        )}
      </Modal>
    </PageContainer>
  );
}
