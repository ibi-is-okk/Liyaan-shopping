class SupportUseCases {
  constructor(faqRepo) {
    this.faqRepo = faqRepo;
  }

  async getFAQs() {
    return await this.faqRepo.getAll();
  }

  async getChatbotResponse(message) {
    const msg = message.toLowerCase();
    
    // Simple predefined responses logic
    if (msg.includes("hello") || msg.includes("hi")) {
      return "Hello! How can I help you today with Liyaan shopping?";
    }
    if (msg.includes("shipping") || msg.includes("delivery")) {
      return "We offer standard shipping (3-5 days) and express shipping (1-2 days). Check your order status for more details.";
    }
    if (msg.includes("return") || msg.includes("refund")) {
      return "You can return items within 30 days of purchase. Please ensure items are in their original condition.";
    }
    if (msg.includes("payment") || msg.includes("pay")) {
      return "We accept all major credit cards, PayPal, and Apple Pay.";
    }
    if (msg.includes("order") || msg.includes("track")) {
      return "You can track your order in the 'My Orders' section of your profile.";
    }
    if (msg.includes("contact") || msg.includes("support")) {
      return "You can reach our support team at support@liyaan.com or call us at 1-800-LIYAAN.";
    }

    return "I'm sorry, I don't quite understand that. You can try asking about shipping, returns, payments, or contact our support team.";
  }
}

module.exports = SupportUseCases;
