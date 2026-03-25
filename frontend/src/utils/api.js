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

