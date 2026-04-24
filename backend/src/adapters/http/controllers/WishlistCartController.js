class WishlistCartController {
  constructor(wishlistCartUseCases) {
    this.wishlistCartUseCases = wishlistCartUseCases;
  }

  // Wishlist
  getWishlist = async (req, res, next) => {
    try {
      const wishlist = await this.wishlistCartUseCases.getWishlist(req.user._id);
      res.json(wishlist);
    } catch (err) { next(err); }
  };

  addToWishlist = async (req, res, next) => {
    try {
      const result = await this.wishlistCartUseCases.addToWishlist(req.user._id, req.params.productId);
      res.json({ message: "Added to wishlist", wishlist: result.wishlist });
    } catch (err) { next(err); }
  };

  removeFromWishlist = async (req, res, next) => {
    try {
      const result = await this.wishlistCartUseCases.removeFromWishlist(req.user._id, req.params.productId);
      res.json({ message: "Removed from wishlist", wishlist: result.wishlist });
    } catch (err) { next(err); }
  };

  // Cart
  getCart = async (req, res, next) => {
    try {
      const cart = await this.wishlistCartUseCases.getCart(req.user._id);
      res.json(cart);
    } catch (err) { next(err); }
  };

  addToCart = async (req, res, next) => {
    try {
      const { productId, quantity, size } = req.body;
      const cart = await this.wishlistCartUseCases.addToCart(req.user._id, { productId, quantity, size });
      res.json({ message: "Added to cart", cart });
    } catch (err) { next(err); }
  };

  removeFromCart = async (req, res, next) => {
    try {
      const { productId, size } = req.body;
      await this.wishlistCartUseCases.removeFromCart(req.user._id, productId, size);
      res.json({ message: "Removed from cart" });
    } catch (err) { next(err); }
  };
}

module.exports = WishlistCartController;
