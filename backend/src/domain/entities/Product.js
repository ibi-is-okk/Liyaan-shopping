class Product {
  constructor({ id, name, description, price, category, sizes, images, stock, rating, reviewCount, isNewArrival, isTrending, totalOrdered }) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.price = price;
    this.category = category;
    this.sizes = sizes || [];
    this.images = images || [];
    this.stock = stock || 0;
    this.rating = rating || 0;
    this.reviewCount = reviewCount || 0;
    this.isNewArrival = isNewArrival || false;
    this.isTrending = isTrending || false;
    this.totalOrdered = totalOrdered || 0;
  }
}

module.exports = Product;
