import { PRODUCTS, REVIEWS } from "../data/mockData";

const delay = (ms = 200) => new Promise((res) => setTimeout(res, ms));

let users = [
  { _id: "u1", fullName: "Demo User", email: "demo@liyaan.com", password: "password123", wishlist: [], cart: [], isAdmin: false },
  { _id: "u_admin", fullName: "Admin", email: "admin@liyaan.com", password: "admin123", wishlist: [], cart: [], isAdmin: true },
];
let orders = [];
let reviews = { ...REVIEWS };
let currentUser = null;
let products = [...PRODUCTS];

export const registerUser = async ({ fullName, email, password }) => {
  await delay();
  if (users.find((u) => u.email === email)) throw new Error("Email already in use");
  const user = { _id: `u${Date.now()}`, fullName, email, password, wishlist: [], cart: [] };
  users.push(user);
  currentUser = user;
  const token = btoa(JSON.stringify({ id: user._id }));
  localStorage.setItem("token", token);
  localStorage.setItem("mockUser", JSON.stringify(user));
  return { user: { id: user._id, fullName: user.fullName, email: user.email, isAdmin: user.isAdmin || false }, token };
};

export const loginUser = async ({ email, password }) => {
  await delay();
  const user = users.find((u) => u.email === email && u.password === password);
  if (!user) throw new Error("Invalid email or password");
  currentUser = user;
  const token = btoa(JSON.stringify({ id: user._id }));
  localStorage.setItem("token", token);
  localStorage.setItem("mockUser", JSON.stringify(user));
  return { user: { id: user._id, fullName: user.fullName, email: user.email, isAdmin: user.isAdmin || false }, token };
};

export const getMe = async () => {
  await delay();
  const saved = localStorage.getItem("mockUser");
  if (!saved) throw new Error("Not logged in");
  const u = JSON.parse(saved);
  currentUser = users.find((x) => x._id === u._id) || u;
  return currentUser;
};

const getUser = () => {
  const saved = localStorage.getItem("mockUser");
  if (!saved) return null;
  const u = JSON.parse(saved);
  return users.find((x) => x._id === u._id) || u;
};

const saveUser = (user) => {
  const idx = users.findIndex((u) => u._id === user._id);
  if (idx > -1) users[idx] = user;
  localStorage.setItem("mockUser", JSON.stringify(user));
};

export const getProducts = async ({ category, search, sortBy } = {}) => {
  await delay();
  let result = [...products];
  if (category) result = result.filter((p) => p.category === category);
  if (search)   result = result.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()));
  if (sortBy === "price_asc")  result.sort((a, b) => a.price - b.price);
  if (sortBy === "price_desc") result.sort((a, b) => b.price - a.price);
  if (sortBy === "name_asc")   result.sort((a, b) => a.name.localeCompare(b.name));
  if (sortBy === "name_desc")  result.sort((a, b) => b.name.localeCompare(a.name));
  return result;
};

export const getProduct = async (id) => {
  await delay();
  const p = products.find((x) => x._id === id);
  if (!p) throw new Error("Product not found");
  return p;
};

export const getTrending = async () => {
  await delay();
  return [...products].sort((a, b) => b.totalOrdered - a.totalOrdered).slice(0, 10);
};

export const getNewArrivals = async () => {
  await delay();
  return products.filter((p) => p.isNewArrival).slice(0, 6);
};

export const searchProducts = async (q) => {
  await delay();
  return products.filter((p) => p.name.toLowerCase().includes(q.toLowerCase())).slice(0, 5);
};

export const getWishlist = async () => {
  await delay();
  const user = getUser();
  if (!user) throw new Error("Not logged in");
  return (user.wishlist || []).map((id) => products.find((p) => p._id === id)).filter(Boolean);
};

export const addToWishlist = async (productId) => {
  await delay();
  const user = getUser();
  if (!user) throw new Error("Not logged in");
  if (!user.wishlist.includes(productId)) user.wishlist.push(productId);
  saveUser(user);
  return { wishlist: user.wishlist };
};

export const removeFromWishlist = async (productId) => {
  await delay();
  const user = getUser();
  if (!user) throw new Error("Not logged in");
  user.wishlist = user.wishlist.filter((id) => id !== productId);
  saveUser(user);
  return { wishlist: user.wishlist };
};

export const getCart = async () => {
  await delay();
  const user = getUser();
  if (!user) return [];
  return (user.cart || []).map((item) => ({
    ...item,
    product: products.find((p) => p._id === item.productId) || null,
  })).filter((i) => i.product);
};

export const addToCart = async ({ productId, quantity = 1, size }) => {
  await delay();
  const user = getUser();
  if (!user) throw new Error("Not logged in");
  if (!user.cart) user.cart = [];
  const existing = user.cart.find((c) => c.productId === productId && c.size === size);
  if (existing) {
    existing.quantity += quantity;
  } else {
    user.cart.push({ productId, quantity, size });
  }
  saveUser(user);
  const cart = user.cart.map((item) => ({
    ...item,
    product: products.find((p) => p._id === item.productId),
  }));
  return { cart };
};

export const removeFromCart = async ({ productId, size }) => {
  await delay();
  const user = getUser();
  if (!user) throw new Error("Not logged in");
  user.cart = (user.cart || []).filter((c) => !(c.productId === productId && c.size === size));
  saveUser(user);
};

export const placeOrder = async ({ billingDetails }) => {
  await delay();
  const user = getUser();
  if (!user) throw new Error("Not logged in");
  const cart = (user.cart || []).map((item) => ({
    ...item,
    product: products.find((p) => p._id === item.productId),
  }));
  if (cart.length === 0) throw new Error("Cart is empty");

  const total = cart.reduce((sum, c) => sum + (c.product?.price || 0) * c.quantity, 0);
  const order = {
    _id: `ord${Date.now()}`,
    user: user._id,
    items: cart,
    billingDetails,
    subtotal: total,
    total,
    status: "pending",
    createdAt: new Date().toISOString(),
  };
  orders.push(order);

  cart.forEach(({ productId, quantity }) => {
    const p = products.find((x) => x._id === productId);
    if (p) p.totalOrdered += quantity;
  });

  user.cart = [];
  saveUser(user);
  return { message: "Order placed successfully", order };
};

export const getMyOrders = async () => {
  await delay();
  const user = getUser();
  return orders.filter((o) => o.user === user?._id);
};

export const getReviews = async (productId) => {
  await delay();
  return reviews[productId] || [];
};

export const addReview = async ({ productId, rating, comment }) => {
  await delay();
  const user = getUser();
  if (!user) throw new Error("Not logged in");
  const already = (reviews[productId] || []).find((r) => r.userId === user._id);
  if (already) throw new Error("You have already reviewed this product");
  const review = {
    _id: `rev${Date.now()}`,
    userId: user._id,
    userName: user.fullName,
    rating,
    comment,
    createdAt: new Date().toISOString(),
  };
  if (!reviews[productId]) reviews[productId] = [];
  reviews[productId].unshift(review);
  return review;
};
