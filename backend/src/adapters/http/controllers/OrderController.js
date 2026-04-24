class OrderController {
  constructor(orderUseCases) {
    this.orderUseCases = orderUseCases;
  }

  placeOrder = async (req, res, next) => {
    try {
      const { billingDetails } = req.body;
      if (!billingDetails) return res.status(400).json({ message: "Billing details required" });
      const order = await this.orderUseCases.placeOrder({
        userId: req.user._id,
        billingDetails,
      });
      res.status(201).json({ message: "Order placed successfully", order });
    } catch (err) { next(err); }
  };

  getMyOrders = async (req, res, next) => {
    try {
      const orders = await this.orderUseCases.getUserOrders(req.user._id);
      res.json(orders);
    } catch (err) { next(err); }
  };

  getOrderById = async (req, res, next) => {
    try {
      const order = await this.orderUseCases.getOrderById(req.params.id);
      res.json(order);
    } catch (err) { next(err); }
  };
}

module.exports = OrderController;
