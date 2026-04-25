class SupportController {
  constructor(supportUseCases) {
    this.supportUseCases = supportUseCases;
  }

  async getFAQs(req, res, next) {
    try {
      const faqs = await this.supportUseCases.getFAQs();
      res.status(200).json(faqs);
    } catch (error) {
      next(error);
    }
  }

  async chat(req, res, next) {
    try {
      const { message } = req.body;
      if (!message) {
        return res.status(400).json({ error: "Message is required" });
      }
      const response = await this.supportUseCases.getChatbotResponse(message);
      res.status(200).json({ response });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = SupportController;
