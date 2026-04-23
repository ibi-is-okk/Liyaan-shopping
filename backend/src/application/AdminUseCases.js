
class AdminUseCases {
  constructor(userRepository, productRepository, orderRepository) {
    this.userRepo    = userRepository;
    this.productRepo = productRepository;
    this.orderRepo   = orderRepository;
  }

  async verifyAdmin(userId) {
    const user = await this.userRepo.findById(userId);
    if (!user) throw new Error("User not found");
    if (!user.isAdmin) throw new Error("Not an admin");
    return user;
  }

  async addProduct(data) {
    const required = ["name", "price", "category"];
    for (const field of required) {
      if (!data[field]) throw new Error(`${field} is required`);
    }
    return this.productRepo.create(data);
  }

  async updateProduct(productId, updates) {
    const product = await this.productRepo.findById(productId);
    if (!product) throw new Error("Product not found");
    return this.productRepo.update(productId, updates);
  }

  async deleteProduct(productId) {
    const product = await this.productRepo.findById(productId);
    if (!product) throw new Error("Product not found");
    return this.productRepo.delete(productId);
  }

  async updateStock(productId, stock) {
    if (stock < 0) throw new Error("Stock cannot be negative");
    const product = await this.productRepo.findById(productId);
    if (!product) throw new Error("Product not found");
    return this.productRepo.update(productId, { stock });
  }

  async getAllOrders({ status, page = 1, limit = 20 } = {}) {
    return this.orderRepo.findAll({ status, page, limit });
  }

  async updateOrderStatus(orderId, status) {
    const validStatuses = ["pending", "processing", "shipped", "delivered", "cancelled"];
    if (!validStatuses.includes(status))
      throw new Error(`Invalid status. Must be one of: ${validStatuses.join(", ")}`);
    const order = await this.orderRepo.findById(orderId);
    if (!order) throw new Error("Order not found");
    return this.orderRepo.updateStatus(orderId, status);
  }

  async getSalesReport({ month, year } = {}) {
    const allOrders = await this.orderRepo.findAll({});

    let filtered = allOrders;
    if (month && year) {
      filtered = allOrders.filter((o) => {
        const d = new Date(o.createdAt);
        return d.getMonth() + 1 === Number(month) && d.getFullYear() === Number(year);
      });
    }

    const delivered  = filtered.filter((o) => o.status === "delivered" || o.status === "processing");
    const pending    = filtered.filter((o) => o.status === "pending");
    const cancelled  = filtered.filter((o) => o.status === "cancelled");
    const totalRevenue = delivered.reduce((sum, o) => sum + (o.total || 0), 0);

    const dailySales = {};
    delivered.forEach((o) => {
      const day = new Date(o.createdAt).toISOString().split("T")[0];
      dailySales[day] = (dailySales[day] || 0) + (o.total || 0);
    });


    const productSales = {};
    delivered.forEach((o) => {
      (o.items || []).forEach((item) => {
        const key = item.name || item.product?.toString();
        if (!key) return;
        if (!productSales[key]) productSales[key] = { name: key, qty: 0, revenue: 0 };
        productSales[key].qty     += item.quantity || 0;
        productSales[key].revenue += (item.price || 0) * (item.quantity || 0);
      });
    });

    const topProducts = Object.values(productSales)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);

    const totalUsers = await this.userRepo.countAll();

    return {
      summary: {
        totalOrders:    filtered.length,
        totalDelivered: delivered.length,
        totalPending:   pending.length,
        totalCancelled: cancelled.length,
        totalRevenue,
        totalUsers,
      },
      dailySales: Object.entries(dailySales)
        .map(([date, revenue]) => ({ date, revenue }))
        .sort((a, b) => new Date(a.date) - new Date(b.date)),
      topProducts,
    };
  }
}

module.exports = AdminUseCases;
