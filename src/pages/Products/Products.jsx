import { useState, useEffect } from 'react';
import { getProducts, createProduct, updateProduct, deleteProduct } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { PageContainer } from '../../components/layout/PageContainer/PageContainer';
import { Button } from '../../components/ui/Button/Button';
import { Input } from '../../components/ui/Input/Input';
import { Select } from '../../components/ui/Select/Select';
import { Modal } from '../../components/ui/Modal/Modal';
import { Badge } from '../../components/ui/Badge/Badge';
import { IoAdd, IoCreateOutline, IoTrashOutline } from 'react-icons/io5';
import styles from './Products.module.css';

const STATUS_OPTIONS = [
  { value: 'active', label: 'Active' },
  { value: 'out_of_stock', label: 'Out of stock' },
];

export function Products() {
  const { addToast } = useToast();
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    title: '',
    price: '',
    category: '',
    stock: '',
    status: 'active',
  });
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const fetchProducts = () => {
    setLoading(true);
    setError(null);
    getProducts()
      .then(setList)
      .catch((err) => setError(err.message || 'Failed to load products'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const openAdd = () => {
    setEditingId(null);
    setForm({ title: '', price: '', category: '', stock: '', status: 'active' });
    setFormErrors({});
    setModalOpen(true);
  };

  const openEdit = (p) => {
    setEditingId(p.id);
    setForm({
      title: p.title,
      price: String(p.price),
      category: p.category,
      stock: String(p.stock),
      status: p.status,
    });
    setFormErrors({});
    setModalOpen(true);
  };

  const validate = () => {
    const err = {};
    if (!form.title?.trim()) err.title = 'Title is required';
    const num = parseFloat(form.price);
    if (form.price === '' || isNaN(num) || num < 0) err.price = 'Valid price is required';
    if (!form.category?.trim()) err.category = 'Category is required';
    const stockNum = parseInt(form.stock, 10);
    if (form.stock === '' || isNaN(stockNum) || stockNum < 0) err.stock = 'Valid stock is required';
    setFormErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    const payload = {
      title: form.title.trim(),
      price: parseFloat(form.price),
      category: form.category.trim(),
      stock: parseInt(form.stock, 10),
      status: form.status,
    };
    const promise = editingId
      ? updateProduct(editingId, payload)
      : createProduct(payload);
    promise
      .then(() => {
        addToast(editingId ? 'Product updated.' : 'Product created.', 'success');
        setModalOpen(false);
        fetchProducts();
      })
      .catch((err) => addToast(err.message || 'Request failed', 'error'))
      .finally(() => setSubmitting(false));
  };

  const handleDelete = (p) => setDeleteConfirm(p);

  const confirmDelete = () => {
    if (!deleteConfirm) return;
    setSubmitting(true);
    deleteProduct(deleteConfirm.id)
      .then(() => {
        addToast('Product deleted.', 'success');
        setDeleteConfirm(null);
        fetchProducts();
      })
      .catch((err) => addToast(err.message || 'Delete failed', 'error'))
      .finally(() => setSubmitting(false));
  };

  const statusVariant = (s) => (s === 'active' ? 'success' : 'warning');

  return (
    <PageContainer title="Products">
      {error && <p className={styles.error}>{error}</p>}

      <div className={styles.toolbar}>
        <Button onClick={openAdd}>
          <IoAdd size={18} /> Add Product
        </Button>
      </div>

      {loading ? (
        <div className={styles.grid}>
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className={styles.card}>
              <div style={{ height: 20, background: 'var(--border)', borderRadius: 4 }} />
              <div style={{ height: 14, background: 'var(--border)', borderRadius: 4, width: '60%' }} />
              <div style={{ height: 14, background: 'var(--border)', borderRadius: 4, width: '40%' }} />
            </div>
          ))}
        </div>
      ) : (
        <div className={styles.grid}>
          {list.map((p) => (
            <div key={p.id} className={styles.card}>
              <h3 className={styles.cardTitle}>{p.title}</h3>
              <div className={styles.meta}>Category: {p.category}</div>
              <div className={styles.price}>${Number(p.price).toFixed(2)}</div>
              <div className={styles.meta}>Stock: {p.stock}</div>
              <Badge variant={statusVariant(p.status)}>{p.status.replace('_', ' ')}</Badge>
              <div className={styles.cardActions}>
                <Button variant="secondary" size="sm" onClick={() => openEdit(p)}>
                  <IoCreateOutline size={16} /> Edit
                </Button>
                <Button variant="danger" size="sm" onClick={() => handleDelete(p)}>
                  <IoTrashOutline size={16} /> Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingId ? 'Edit Product' : 'Add Product'}
        footer={
          <>
            <Button variant="secondary" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" form="product-form" disabled={submitting}>
              {submitting ? 'Saving…' : editingId ? 'Update' : 'Create'}
            </Button>
          </>
        }
      >
        <form id="product-form" onSubmit={handleSubmit} className={styles.formGrid}>
          <Input
            label="Title"
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            error={formErrors.title}
            placeholder="Product name"
          />
          <Input
            label="Price"
            type="number"
            step="0.01"
            min="0"
            value={form.price}
            onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
            error={formErrors.price}
            placeholder="0.00"
          />
          <Input
            label="Category"
            value={form.category}
            onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
            error={formErrors.category}
            placeholder="e.g. Electronics"
          />
          <Input
            label="Stock"
            type="number"
            min="0"
            value={form.stock}
            onChange={(e) => setForm((f) => ({ ...f, stock: e.target.value }))}
            error={formErrors.stock}
            placeholder="0"
          />
          <Select
            label="Status"
            value={form.status}
            onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
            options={STATUS_OPTIONS}
          />
        </form>
      </Modal>

      <Modal
        open={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        title="Delete product"
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
            Are you sure you want to delete <strong>{deleteConfirm.title}</strong>?
          </p>
        )}
      </Modal>
    </PageContainer>
  );
}
