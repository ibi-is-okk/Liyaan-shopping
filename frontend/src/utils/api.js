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
    // Some responses like 204 No Content might not have a JSON body
    data = null;
  }

  if (!response.ok) {
    throw new Error((data && data.message) || "An error occurred");
  }
  return data;
};

// Auth
export const registerUser = async ({ fullName, email, password }) => {
  const data = await apiFetch("/auth/register", {
    method: "POST",
    body: JSON.stringify({ fullName, email, password }),
  });
  localStorage.setItem("token", data.token);
  return data;
};

export const loginUser = async ({ email, password }) => {
  const data = await apiFetch("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  localStorage.setItem("token", data.token);
  return data;
};

export const getMe = async () => {
  return await apiFetch("/auth/me");
};

// Products
export const getProducts = async ({ category, search, sortBy } = {}) => {
  const params = new URLSearchParams();
  if (category) params.append("category", category);
  if (search) params.append("search", search);
  if (sortBy) params.append("sortBy", sortBy);
  const queryString = params.toString();
  return await apiFetch(`/products${queryString ? `?${queryString}` : ""}`);
};

export const getProduct = async (id) => {
  return await apiFetch(`/products/${id}`);
};

export const getTrending = async () => {
  return await apiFetch("/products/trending");
};

export const getNewArrivals = async () => {
  return await apiFetch("/products/new-arrivals");
};

export const searchProducts = async (q) => {
  return await apiFetch(`/products/search?q=${encodeURIComponent(q)}`);
};

// Wishlist
export const getWishlist = async () => {
  return await apiFetch("/user/wishlist");
};

export const addToWishlist = async (productId) => {
  return await apiFetch(`/user/wishlist/${productId}`, {
    method: "POST",
  });
};

export const removeFromWishlist = async (productId) => {
  return await apiFetch(`/user/wishlist/${productId}`, {
    method: "DELETE",
  });
};

// Cart
export const getCart = async () => {
  return await apiFetch("/user/cart");
};

export const addToCart = async ({ productId, quantity = 1, size }) => {
  return await apiFetch("/user/cart", {
    method: "POST",
    body: JSON.stringify({ productId, quantity, size }),
  });
};

export const removeFromCart = async ({ productId, size }) => {
  // Use POST or pass as body in DELETE. fetch supports body in DELETE.
  return await apiFetch("/user/cart", {
    method: "DELETE",
    body: JSON.stringify({ productId, size }),
  });
};

// Orders
export const placeOrder = async ({ billingDetails }) => {
  return await apiFetch("/orders", {
    method: "POST",
    body: JSON.stringify({ billingDetails }),
  });
};

export const getMyOrders = async () => {
  return await apiFetch("/orders");
};

// Reviews
export const getReviews = async (productId) => {
  return await apiFetch(`/reviews/${productId}`);
};

export const addReview = async ({ productId, rating, comment }) => {
  return await apiFetch("/reviews", {
    method: "POST",
    body: JSON.stringify({ productId, rating, comment }),
  });
};
