class WishlistCartUseCases {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  // --- Wishlist ---
  async getWishlist(userId) {
    const user = await this.userRepository.findById(userId);
    if (!user) throw new Error("User not found");
    return user.wishlist;
  }

  async addToWishlist(userId, productId) {
    return this.userRepository.addToWishlist(userId, productId);
  }

  async removeFromWishlist(userId, productId) {
    return this.userRepository.removeFromWishlist(userId, productId);
  }

  // --- Cart ---
  async getCart(userId) {
    return this.userRepository.getCart(userId);
  }

  async addToCart(userId, { productId, quantity = 1, size }) {
    return this.userRepository.addToCart(userId, {
      product: productId,
      quantity,
      size,
    });
  }

  async removeFromCart(userId, productId, size) {
    return this.userRepository.removeFromCart(userId, productId, size);
  }

  async clearCart(userId) {
    return this.userRepository.clearCart(userId);
  }
}

module.exports = WishlistCartUseCases;
