class AdminController {
  constructor(adminUseCases) {
    this.adminUseCases = adminUseCases;
  }

  // FR33 — POST /api/admin/products
  addProduct = async (req, res, next) => {
    try {
      const product = await this.adminUseCases.addProduct(req.body);
      res.status(201).json(product);
    } catch (err) { next(err); }
  };

  // FR34 — PUT /api/admin/products/:id
  updateProduct = async (req, res, next) => {
    try {
      const product = await this.adminUseCases.updateProduct(req.params.id, req.body);
      res.json(product);
    } catch (err) { next(err); }
  };

  // FR35 — DELETE /api/admin/products/:id
  deleteProduct = async (req, res, next) => {
    try {
      await this.adminUseCases.deleteProduct(req.params.id);
      res.json({ message: "Product deleted successfully" });
    } catch (err) { next(err); }
  };

  // FR36 — PATCH /api/admin/products/:id/stock
  updateStock = async (req, res, next) => {
    try {
      const { stock } = req.body;
      if (stock === undefined) return res.status(400).json({ message: "stock is required" });
      const product = await this.adminUseCases.updateStock(req.params.id, Number(stock));
      res.json(product);
    } catch (err) { next(err); }
  };

  // FR37 — GET /api/admin/orders
  getAllOrders = async (req, res, next) => {
    try {
      const { status, page, limit } = req.query;
      const orders = await this.adminUseCases.getAllOrders({
        status,
        page: Number(page) || 1,
        limit: Number(limit) || 20,
      });
      res.json(orders);
    } catch (err) { next(err); }
  };

  // FR38 — PATCH /api/admin/orders/:id/status
  updateOrderStatus = async (req, res, next) => {
    try {
      const { status } = req.body;
      if (!status) return res.status(400).json({ message: "status is required" });
      const order = await this.adminUseCases.updateOrderStatus(req.params.id, status);
      res.json(order);
    } catch (err) { next(err); }
  };

  // FR39 — GET /api/admin/reports
  getSalesReport = async (req, res, next) => {
    try {
      const { month, year } = req.query;
      const report = await this.adminUseCases.getSalesReport({ month, year });
      res.json(report);
    } catch (err) { next(err); }
  };

  // GET /api/admin/products — list all products for admin table
  getAllProducts = async (req, res, next) => {
    try {
      const products = await this.adminUseCases.productRepo.findAll({});
      res.json(products);
    } catch (err) { next(err); }
  };
}

module.exports = AdminController;
