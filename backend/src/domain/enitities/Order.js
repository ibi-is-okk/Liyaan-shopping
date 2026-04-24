class Order {
  constructor({ id, user, items, billingDetails, subtotal, total, status, createdAt }) {
    this.id = id;
    this.user = user;
    this.items = items; // [{ product, quantity, size, price }]
    this.billingDetails = billingDetails;
    this.subtotal = subtotal;
    this.total = total;
    this.status = status || "pending";
    this.createdAt = createdAt;
  }
}

module.exports = Order;
