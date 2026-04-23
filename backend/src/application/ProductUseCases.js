class ProductUseCases {
  constructor(productRepository) {
    this.productRepository = productRepository;
  }

  async getAllProducts(filters) {
    return this.productRepository.findAll(filters);
  }

  async getProductById(id) {
    const product = await this.productRepository.findById(id);
    if (!product) throw new Error("Product not found");
    return product;
  }

  async getTrending(limit = 10) {
    return this.productRepository.findTrending(limit);
  }

  async getNewArrivals(limit = 6) {
    return this.productRepository.findNewArrivals(limit);
  }

  async searchProducts(query) {
    if (!query || query.trim() === "") throw new Error("Search query required");
    return this.productRepository.search(query);
  }

  async createProduct(data) {
    return this.productRepository.create(data);
  }
}

module.exports = ProductUseCases;
