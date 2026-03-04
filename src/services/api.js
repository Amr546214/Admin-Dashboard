/**
 * Mock API layer: simulates network delay and returns Promises.
 * Replace with real fetch/axios when backend is ready.
 */

const DELAY_MS = 400;

function delay(ms = DELAY_MS) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// --- In-memory mock data ---
let users = [
  { id: '1', name: 'Amr Okasha', email: 'amr@example.com', role: 'admin', status: 'active', createdAt: '2025-01-10T10:00:00Z' },
  { id: '2', name: 'Mohamed Ahmed', email: 'mohamed@example.com', role: 'editor', status: 'active', createdAt: '2025-01-12T14:30:00Z' },
  { id: '3', name: 'Ahmed Mohamed', email: 'ahmed@example.com', role: 'viewer', status: 'inactive', createdAt: '2025-01-15T09:00:00Z' },
  { id: '4', name: 'Ali Mohamed', email: 'ali@example.com', role: 'editor', status: 'active', createdAt: '2025-02-01T11:00:00Z' },
  { id: '5', name: 'Omar Mohamed', email: 'omar@example.com', role: 'viewer', status: 'pending', createdAt: '2025-02-10T16:00:00Z' },
];

let products = [
  { id: '1', title: 'Mouse', price: 29.99, category: 'Electronics', stock: 120, status: 'active' },
  { id: '2', title: 'Keyboard', price: 49.99, category: 'Electronics', stock: 45, status: 'active' },
  { id: '3', title: 'Monitor', price: 39.99, category: 'Office', stock: 0, status: 'out_of_stock' },
  { id: '4', title: 'Laptop', price: 12.99, category: 'Office', stock: 200, status: 'active' },
  { id: '5', title: 'Printer', price: 299.99, category: 'Furniture', stock: 15, status: 'active' },
];

const orders = [
  { id: '1', customer: 'Amr Okasha', total: 89.98, status: 'paid', date: '2025-02-20T10:00:00Z' },
  { id: '2', customer: 'Mohamed Ahmed', total: 299.99, status: 'pending', date: '2025-02-21T14:00:00Z' },
  { id: '3', customer: 'Ahmed Mohamed', total: 49.99, status: 'cancelled', date: '2025-02-19T09:00:00Z' },
  { id: '4', customer: 'Ali Mohamed', total: 129.97, status: 'paid', date: '2025-02-22T11:00:00Z' },
  { id: '5', customer: 'Omar Mohamed', total: 39.99, status: 'pending', date: '2025-02-22T16:00:00Z' },
];

// --- Users API ---
export async function getUsers() {
  await delay();
  return [...users];
}

export async function getUserById(id) {
  await delay();
  const u = users.find((x) => x.id === id);
  if (!u) throw new Error('User not found');
  return { ...u };
}

export async function createUser(data) {
  await delay();
  const id = String(users.length + 1 + Date.now());
  const newUser = {
    id,
    name: data.name?.trim() || '',
    email: data.email?.trim().toLowerCase() || '',
    role: data.role || 'viewer',
    status: data.status || 'pending',
    createdAt: new Date().toISOString(),
  };
  users.push(newUser);
  return newUser;
}

export async function updateUser(id, data) {
  await delay();
  const idx = users.findIndex((x) => x.id === id);
  if (idx === -1) throw new Error('User not found');
  users[idx] = { ...users[idx], ...data, id };
  return users[idx];
}

export async function deleteUser(id) {
  await delay();
  const idx = users.findIndex((x) => x.id === id);
  if (idx === -1) throw new Error('User not found');
  users.splice(idx, 1);
  return { id };
}

// --- Products API ---
export async function getProducts() {
  await delay();
  return [...products];
}

export async function getProductById(id) {
  await delay();
  const p = products.find((x) => x.id === id);
  if (!p) throw new Error('Product not found');
  return { ...p };
}

export async function createProduct(data) {
  await delay();
  const id = String(products.length + 1 + Date.now());
  const newProduct = {
    id,
    title: data.title?.trim() || '',
    price: Number(data.price) || 0,
    category: data.category?.trim() || '',
    stock: Number(data.stock) ?? 0,
    status: data.status || 'active',
  };
  products.push(newProduct);
  return newProduct;
}

export async function updateProduct(id, data) {
  await delay();
  const idx = products.findIndex((x) => x.id === id);
  if (idx === -1) throw new Error('Product not found');
  products[idx] = { ...products[idx], ...data, id };
  return products[idx];
}

export async function deleteProduct(id) {
  await delay();
  const idx = products.findIndex((x) => x.id === id);
  if (idx === -1) throw new Error('Product not found');
  products.splice(idx, 1);
  return { id };
}

// --- Orders API (read-only) ---
export async function getOrders() {
  await delay();
  return [...orders];
}

// --- Dashboard stats (derived from mock data) ---
export async function getDashboardStats() {
  await delay();
  const totalUsers = users.length;
  const totalOrders = orders.length;
  const revenue = orders.filter((o) => o.status === 'paid').reduce((sum, o) => sum + o.total, 0);
  const pending = orders.filter((o) => o.status === 'pending').length;
  return { totalUsers, totalOrders, revenue, pending };
}
// --- Recent activity (dummy) ---
export async function getRecentActivity() {
  await delay();
  return [
    { id: '1', action: 'User signed up', user: 'Omar Mohamed', time: '2025-02-22T16:00:00Z' },
    { id: '2', action: 'Order completed', user: 'Ali Mohamed', time: '2025-02-22T11:00:00Z' },
    { id: '3', action: 'Product updated', user: 'Mohamed Ahmed', time: '2025-02-21T10:00:00Z' },
    { id: '4', action: 'Order placed', user: 'Ahmed Mohamed', time: '2025-02-21T14:00:00Z' },
    { id: '5', action: 'User role changed', user: 'Omar Mohamed', time: '2025-02-20T09:00:00Z' },
  ];
}
