import { PRODUCTS, REVIEWS } from "../data/mockData";

// Simulates async network delay
const delay = (ms = 200) => new Promise((res) => setTimeout(res, ms));

// ── In-memory state ──────────────────────────────────────────────────────────
let users = [
  { _id: "u1", fullName: "Demo User", email: "demo@liyaan.com", password: "password123", wishlist: [], cart: [] },
];
let orders = [];
let reviews = { ...REVIEWS };
let currentUser = null;
let products = [...PRODUCTS];

// ── Auth ─────────────────────────────────────────────────────────────────────
export const registerUser = async ({ fullName, email, password }) => {
  await delay();
  if (users.find((u) => u.email === email)) throw new Error("Email already in use");
  const user = { _id: `u${Date.now()}`, fullName, email, password, wishlist: [], cart: [] };
  users.push(user);
  currentUser = user;
  const token = btoa(JSON.stringify({ id: user._id }));
  localStorage.setItem("token", token);
  localStorage.setItem("mockUser", JSON.stringify(user));
  return { user: { id: user._id, fullName: user.fullName, email: user.email }, token };
};

export const loginUser = async ({ email, password }) => {
  await delay();
  const user = users.find((u) => u.email === email && u.password === password);
  if (!user) throw new Error("Invalid email or password");
  currentUser = user;
  const token = btoa(JSON.stringify({ id: user._id }));
  localStorage.setItem("token", token);
  localStorage.setItem("mockUser", JSON.stringify(user));
  return { user: { id: user._id, fullName: user.fullName, email: user.email }, token };
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

// ── Products ─────────────────────────────────────────────────────────────────
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