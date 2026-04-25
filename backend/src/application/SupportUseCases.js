const Groq = require("groq-sdk");

class SupportUseCases {
  constructor(faqRepo) {
    this.faqRepo = faqRepo;
    this.groq = new Groq({
      apiKey: process.env.GROQ_API_KEY,
    });
  }

  async getFAQs() {
    return await this.faqRepo.getAll();
  }

  async getChatbotResponse(message) {
    try {
      const faqs = await this.faqRepo.getAll();
      
      // Prepare FAQ context for the LLM
      const faqContext = faqs.map(f => `Q: ${f.question}\nA: ${f.answer}`).join('\n\n');

      const systemPrompt = `
You are the official AI assistant for Liyaan, a premium e-commerce store in Pakistan.
Your goal is to help customers with their inquiries in a friendly, professional, and helpful manner.

USE THE FOLLOWING FAQ DATA TO ANSWER CUSTOMER QUESTIONS ACCURATELY:
${faqContext}

GENERAL STORE INFO:
- Store Name: Liyaan
- Currency: PKR (Rs)
- Support Email: support@liyaan.com
- Support Phone: 1-800-LIYAAN (Mon-Sat, 9am-6pm)

INSTRUCTIONS:
1. If the answer is in the FAQs, use that information.
2. If the answer is NOT in the FAQs, use your general knowledge but stay within the context of a professional e-commerce store.
3. Be concise and helpful.
4. If you don't know the answer, politely ask them to contact our support team at support@liyaan.com.
5. Always mention prices in PKR (Rs).
`;

      const completion = await this.groq.chat.completions.create({
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: message }
        ],
        model: "llama-3.1-8b-instant",
        temperature: 0.7,
        max_tokens: 500,
      });

      return completion.choices[0]?.message?.content || "I'm sorry, I couldn't generate a response. Please try again or contact support.";

    } catch (err) {
      console.error("AI Chatbot failed, falling back to basic logic", err);
      return this.getFallbackResponse(message);
    }
  }

  // Fallback to basic logic if API fails
  getFallbackResponse(message) {
    const msg = message.toLowerCase();
    if (msg.includes("hello") || msg.includes("hi")) return "Hello! I'm the Liyaan assistant. How can I help you today?";
    if (msg.includes("shipping")) return "We offer standard (3-5 days) and express shipping (1-2 days).";
    return "I'm having a bit of trouble thinking right now. Please email us at support@liyaan.com for help!";
  }
}

module.exports = SupportUseCases;
