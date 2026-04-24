const IProductRepository = require("../../../ports/ProductRepository");
const ProductModel = require("../models/ProductModel");

class MongoProductRepository extends IProductRepository {
  async findAll({ category, search, sortBy } = {}) {
    let query = {};
    if (category) query.category = category;
    if (search)   query.$text = { $search: search };
    let sort = {};
    if (sortBy === "price_asc")  sort.price = 1;
    else if (sortBy === "price_desc") sort.price = -1;
    else if (sortBy === "name_asc")   sort.name  = 1;
    else if (sortBy === "name_desc")  sort.name  = -1;
    else sort.createdAt = -1;
    return ProductModel.find(query).sort(sort);
  }
  async findById(id) { return ProductModel.findById(id); }
  async findTrending(limit = 10) { return ProductModel.find().sort({ totalOrdered: -1 }).limit(limit); }
  async findNewArrivals(limit = 6) { return ProductModel.find({ isNewArrival: true }).sort({ createdAt: -1 }).limit(limit); }
  async search(query) { return ProductModel.find({ $text: { $search: query } }).limit(10); }
  async create(data) { return ProductModel.create(data); }
  async update(id, data) { return ProductModel.findByIdAndUpdate(id, data, { new: true }); }
  async delete(id) { return ProductModel.findByIdAndDelete(id); }
  async incrementOrderCount(id, qty = 1) { return ProductModel.findByIdAndUpdate(id, { $inc: { totalOrdered: qty } }); }
  async findByIds(ids) { return ProductModel.find({ _id: { $in: ids } }); }
}

module.exports = MongoProductRepository;
