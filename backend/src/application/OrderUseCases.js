class OrderUseCases {
  constructor(orderRepository, productRepository, userRepository) {
    this.orderRepository = orderRepository;
    this.productRepository = productRepository;
    this.userRepository = userRepository;
  }

  async placeOrder({ userId, billingDetails }) {
    // Get user's cart
    const cart = await this.userRepository.getCart(userId);
    if (!cart || cart.length === 0) throw new Error("Cart is empty");

    const items = cart.map((c) => ({
      product: c.product._id || c.product,
      name: c.product.name,
      quantity: c.quantity,
      size: c.size,
      price: c.product.price,
    }));

    const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
    const total = subtotal;

    const order = await this.orderRepository.create({
      user: userId,
      items,
      billingDetails,
      subtotal,
      total,
      status: "pending",
    });

    // Increment totalOrdered on each product
    for (const item of items) {
      await this.productRepository.incrementOrderCount(item.product, item.quantity);
    }

    // Clear cart
    await this.userRepository.clearCart(userId);

    return order;
  }

  async getUserOrders(userId) {
    return this.orderRepository.findByUser(userId);
  }

  async getOrderById(orderId) {
    const order = await this.orderRepository.findById(orderId);
    if (!order) throw new Error("Order not found");
    return order;
  }
}

module.exports = OrderUseCases;
