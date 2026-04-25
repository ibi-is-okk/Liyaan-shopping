const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const apiFetch = async (endpoint, options = {}) => {
  const token = localStorage.getItem("token");
  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  let data;
  try {
    data = await response.json();
  } catch (err) {
    data = null;
  }

  if (!response.ok) {
    throw new Error((data && data.message) || "An error occurred");
  }
  return data;
};

// Admin Products
export const adminGetProducts = async () => {
  return await apiFetch("/admin/products");
};

export const adminAddProduct = async (data) => {
  return await apiFetch("/admin/products", {
    method: "POST",
    body: JSON.stringify(data),
  });
};

export const adminUpdateProduct = async (id, data) => {
  return await apiFetch(`/admin/products/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
};

export const adminDeleteProduct = async (id) => {
  return await apiFetch(`/admin/products/${id}`, {
    method: "DELETE",
  });
};

export const adminUpdateStock = async (id, stock) => {
  return await apiFetch(`/admin/products/${id}/stock`, {
    method: "PATCH",
    body: JSON.stringify({ stock }),
  });
};

// Admin Orders
export const adminGetOrders = async (filters = {}) => {
  const params = new URLSearchParams(filters);
  const queryString = params.toString();
  return await apiFetch(`/admin/orders${queryString ? `?${queryString}` : ""}`);
};

export const adminUpdateOrderStatus = async (id, status) => {
  return await apiFetch(`/admin/orders/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
};

// Admin Reports
export const adminGetReports = async ({ month, year } = {}) => {
  const params = new URLSearchParams();
  if (month) params.append("month", month);
  if (year) params.append("year", year);
  const queryString = params.toString();
  return await apiFetch(`/admin/reports${queryString ? `?${queryString}` : ""}`);
};
