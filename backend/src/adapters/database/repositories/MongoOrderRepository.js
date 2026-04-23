const IOrderRepository = require("../../../ports/IOrderRepository");
const OrderModel = require("../models/OrderModel");

class MongoOrderRepository extends IOrderRepository {
  async create(data) {
    return OrderModel.create(data);
  }

  async findById(id) {
    return OrderModel.findById(id).populate("items.product").populate("user", "fullName email");
  }

  async findByUser(userId) {
    return OrderModel.find({ user: userId }).populate("items.product").sort({ createdAt: -1 });
  }

  // FR37 — admin: find all orders with optional status filter + pagination
  async findAll({ status, page = 1, limit = 20 } = {}) {
    const query = status ? { status } : {};
    return OrderModel.find(query)
      .populate("user", "fullName email")
      .populate("items.product", "name price")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);
  }

  async updateStatus(id, status) {
    return OrderModel.findByIdAndUpdate(id, { status }, { new: true });
  }

  async countAll() {
    return OrderModel.countDocuments();
  }
}

module.exports = MongoOrderRepository;
