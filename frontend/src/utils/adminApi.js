import { PRODUCTS } from "../data/mockData";

const delay = (ms = 150) => new Promise((res) => setTimeout(res, ms));

let mockProducts = [...PRODUCTS];
let mockOrders = [
  { _id: "ord001", user: { fullName: "Sara Ahmed" }, billingDetails: { streetAddress: "12 Gulberg", city: "Lahore" }, items: [{ name: "2 Piece Embroidered Suit", quantity: 1, price: 4500 }], total: 4500, status: "delivered", createdAt: "2025-10-04T10:00:00Z" },
  { _id: "ord002", user: { fullName: "Hina Baig" }, billingDetails: { streetAddress: "45 DHA Phase 5", city: "Karachi" }, items: [{ name: "Gold Hoop Earrings", quantity: 2, price: 1800 }], total: 3600, status: "processing", createdAt: "2025-10-08T14:30:00Z" },
  { _id: "ord003", user: { fullName: "Ayesha Malik" }, billingDetails: { streetAddress: "78 F-7", city: "Islamabad" }, items: [{ name: "3 Piece Embroidered Red", quantity: 1, price: 6800 }], total: 6800, status: "pending", createdAt: "2025-10-12T09:15:00Z" },
  { _id: "ord004", user: { fullName: "Nadia Raza" }, billingDetails: { streetAddress: "23 Johar Town", city: "Lahore" }, items: [{ name: "Pearl Necklace Set", quantity: 1, price: 2400 }], total: 2400, status: "shipped", createdAt: "2025-10-15T16:45:00Z" },
  { _id: "ord005", user: { fullName: "Zara Khan" }, billingDetails: { streetAddress: "9 Clifton", city: "Karachi" }, items: [{ name: "Winter Wool Hoodie", quantity: 2, price: 3200 }], total: 6400, status: "delivered", createdAt: "2025-10-18T11:20:00Z" },
  { _id: "ord006", user: { fullName: "Fatima Syed" }, billingDetails: { streetAddress: "34 G-10", city: "Islamabad" }, items: [{ name: "Pink Diamond Pendant", quantity: 1, price: 3100 }], total: 3100, status: "cancelled", createdAt: "2025-10-20T08:00:00Z" },
];
let mockUsers = [
  { _id: "u1", fullName: "Demo User", email: "demo@liyaan.com" },
  { _id: "u2", fullName: "Sara Ahmed", email: "sara@example.com" },
  { _id: "u3", fullName: "Admin", email: "admin@liyaan.com", isAdmin: true },
];

export const adminGetProducts = async () => {
  await delay();
  return [...mockProducts];
};

export const adminAddProduct = async (data) => {
  await delay();
  const product = { _id: `p${Date.now()}`, ...data, totalOrdered: 0, rating: 0, reviewCount: 0 };
  mockProducts.push(product);
  return product;
};

export const adminUpdateProduct = async (id, data) => {
  await delay();
  const idx = mockProducts.findIndex((p) => p._id === id);
  if (idx === -1) throw new Error("Product not found");
  mockProducts[idx] = { ...mockProducts[idx], ...data };
  return mockProducts[idx];
};

export const adminDeleteProduct = async (id) => {
  await delay();
  const idx = mockProducts.findIndex((p) => p._id === id);
  if (idx === -1) throw new Error("Product not found");
  mockProducts.splice(idx, 1);
  return { message: "Deleted" };
};

export const adminUpdateStock = async (id, stock) => {
  await delay();
  const idx = mockProducts.findIndex((p) => p._id === id);
  if (idx === -1) throw new Error("Product not found");
  mockProducts[idx].stock = stock;
  return mockProducts[idx];
};

export const adminGetOrders = async ({ status } = {}) => {
  await delay();
  if (status) return mockOrders.filter((o) => o.status === status);
  return [...mockOrders];
};

export const adminUpdateOrderStatus = async (id, status) => {
  await delay();
  const idx = mockOrders.findIndex((o) => o._id === id);
  if (idx === -1) throw new Error("Order not found");
  mockOrders[idx].status = status;
  return mockOrders[idx];
};

export const adminGetReports = async ({ month, year } = {}) => {
  await delay();
  let filtered = [...mockOrders];
  if (month && year) {
    filtered = filtered.filter((o) => {
      const d = new Date(o.createdAt);
      return d.getMonth() + 1 === Number(month) && d.getFullYear() === Number(year);
    });
  }
  const delivered = filtered.filter((o) => ["delivered", "processing", "shipped"].includes(o.status));
  const pending   = filtered.filter((o) => o.status === "pending");
  const totalRevenue = delivered.reduce((sum, o) => sum + o.total, 0);

  const dailySales = {};
  delivered.forEach((o) => {
    const day = new Date(o.createdAt).toISOString().split("T")[0];
    dailySales[day] = (dailySales[day] || 0) + o.total;
  });

  const productSales = {};
  delivered.forEach((o) => {
    (o.items || []).forEach((item) => {
      const key = item.name;
      if (!productSales[key]) productSales[key] = { name: key, qty: 0, revenue: 0 };
      productSales[key].qty     += item.quantity || 0;
      productSales[key].revenue += (item.price || 0) * (item.quantity || 0);
    });
  });

  return {
    summary: {
      totalOrders: filtered.length,
      totalDelivered: delivered.length,
      totalPending: pending.length,
      totalCancelled: filtered.filter((o) => o.status === "cancelled").length,
      totalRevenue,
      totalUsers: mockUsers.length,
    },
    dailySales: Object.entries(dailySales)
      .map(([date, revenue]) => ({ date, revenue }))
      .sort((a, b) => new Date(a.date) - new Date(b.date)),
    topProducts: Object.values(productSales)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5),
  };
};
