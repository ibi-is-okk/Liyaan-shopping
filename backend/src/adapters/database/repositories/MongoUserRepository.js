const IUserRepository = require("../../../ports/UserRepository");
const UserModel = require("../models/UserModel");
const User = require("../../../domain/entities/User");

class MongoUserRepository extends IUserRepository {
  _toEntity(doc) {
    if (!doc) return null;
    return new User({
      id: doc._id.toString(), fullName: doc.fullName, email: doc.email,
      password: doc.password, isAdmin: doc.isAdmin,
      wishlist: doc.wishlist.map(item => (item._id ? item : item.toString())), 
      cart: doc.cart, createdAt: doc.createdAt,
    });
  }
  async findById(id) {
    const doc = await UserModel.findById(id).populate("wishlist").populate("cart.product");
    return this._toEntity(doc);
  }
  async findByEmail(email) {
    const doc = await UserModel.findOne({ email });
    return doc ? { ...this._toEntity(doc), password: doc.password, _doc: doc } : null;
  }
  async findByEmailRaw(email) { return UserModel.findOne({ email }); }
  async create(userData) {
    const doc = await UserModel.create(userData);
    return this._toEntity(doc);
  }
  async update(id, data) {
    const doc = await UserModel.findByIdAndUpdate(id, data, { new: true });
    return this._toEntity(doc);
  }
  async addToWishlist(userId, productId) {
    const doc = await UserModel.findByIdAndUpdate(userId, { $addToSet: { wishlist: productId } }, { new: true }).populate("wishlist");
    return this._toEntity(doc);
  }
  async removeFromWishlist(userId, productId) {
    const doc = await UserModel.findByIdAndUpdate(userId, { $pull: { wishlist: productId } }, { new: true }).populate("wishlist");
    return this._toEntity(doc);
  }
  async addToCart(userId, item) {
    const user = await UserModel.findById(userId);
    const existing = user.cart.find(c => c.product.toString() === item.product && c.size === item.size);
    if (existing) existing.quantity += item.quantity || 1;
    else user.cart.push(item);
    await user.save();
    await user.populate("cart.product");
    return user.cart;
  }
  async removeFromCart(userId, productId, size) {
    await UserModel.findByIdAndUpdate(userId, { $pull: { cart: { product: productId, size } } });
  }
  async clearCart(userId) {
    await UserModel.findByIdAndUpdate(userId, { $set: { cart: [] } });
  }
  async getCart(userId) {
    const user = await UserModel.findById(userId).populate("cart.product");
    return user ? user.cart : [];
  }
  // FR39 — total user count for reports
  async countAll() {
    return UserModel.countDocuments();
  }
}

module.exports = MongoUserRepository;
