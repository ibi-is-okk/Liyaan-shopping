class SupportUseCases {
  constructor(faqRepo) {
    this.faqRepo = faqRepo;
  }

  async getFAQs() {
    return await this.faqRepo.getAll();
  }

  async getChatbotResponse(message) {
    const msg = message.toLowerCase();
    
    // 1. Try to find a match in FAQs
    try {
      const faqs = await this.faqRepo.getAll();
      for (const faq of faqs) {
        const q = faq.question.toLowerCase();
        // Match if the message contains the question or vice-versa
        if (msg.includes(q) || q.includes(msg)) return faq.answer;
        
        // Match if multiple significant keywords from the question appear in the message
        const keywords = q.split(/\s+/).filter(w => w.length > 3);
        const matches = keywords.filter(k => msg.includes(k));
        if (matches.length >= 2 || (keywords.length === 1 && matches.length === 1)) {
          return faq.answer;
        }
      }
    } catch (err) {
      console.error("FAQ search failed", err);
    }

    // 2. Predefined keyword logic
    if (msg.includes("hello") || msg.includes("hi") || msg.includes("hey")) {
      return "Hello! I'm the Liyaan assistant. How can I help you today?";
    }
    if (msg.includes("shipping") || msg.includes("delivery") || msg.includes("track")) {
      return "We offer standard (3-5 days) and express shipping (1-2 days). You can track your orders in the 'My Orders' section.";
    }
    if (msg.includes("return") || msg.includes("refund") || msg.includes("exchange")) {
      return "Our return policy allows returns within 30 days. Items must be in original condition with tags.";
    }
    if (msg.includes("payment") || msg.includes("pay") || msg.includes("price")) {
      return "We accept all major credit cards, PayPal, and local payment methods. All prices are in PKR (Rs).";
    }
    if (msg.includes("contact") || msg.includes("support") || msg.includes("help") || msg.includes("call")) {
      return "You can reach our support team at support@liyaan.com or call us at 1-800-LIYAAN (Mon-Sat, 9am-6pm).";
    }
    if (msg.includes("size") || msg.includes("guide") || msg.includes("fit")) {
      return "We have a size guide available on every product page. If you're between sizes, we usually recommend sizing up.";
    }

    return "I'm not sure I understand. You can ask about shipping, returns, sizes, or contact our support team. You can also browse our FAQs for more info!";
  }
}

module.exports = SupportUseCases;
