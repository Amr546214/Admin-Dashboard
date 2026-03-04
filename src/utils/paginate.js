/**
 * Slice array for pagination.
 * @param {Array} items - Full list
 * @param {number} page - 1-based page number
 * @param {number} perPage - Items per page
 * @returns {{ items: Array, totalPages: number, total: number }}
 */
export function paginate(items, page = 1, perPage = 10) {
  const total = items.length;
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const p = Math.max(1, Math.min(page, totalPages));
  const start = (p - 1) * perPage;
  const end = start + perPage;
  return {
    items: items.slice(start, end),
    totalPages,
    total,
    page: p,
    perPage,
  };
}
