import React, { useState, useEffect, useRef } from 'react';
import '../../styles/SupportWidget.css';
import { getFAQs, sendChatMessage } from '../../utils/api';

const SupportWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('faq');
  const [faqs, setFaqs] = useState([]);
  const [activeFaq, setActiveFaq] = useState(null);
  const [chatMessages, setChatMessages] = useState([
    { text: "Hi! How can I help you today?", isBot: true }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (isOpen && activeTab === 'faq' && faqs.length === 0) {
      fetchFaqs();
    }
  }, [isOpen, activeTab]);

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  const fetchFaqs = async () => {
    try {
      const data = await getFAQs();
      setFaqs(data);
    } catch (error) {
      console.error("Failed to fetch FAQs", error);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const userMessage = inputValue.trim();
    setChatMessages(prev => [...prev, { text: userMessage, isBot: false }]);
    setInputValue('');
    setIsLoading(true);

    try {
      const data = await sendChatMessage(userMessage);
      setChatMessages(prev => [...prev, { text: data.response, isBot: true }]);
    } catch (error) {
      setChatMessages(prev => [...prev, { text: "Sorry, I'm having trouble connecting right now.", isBot: true }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="support-widget-container">
      <button 
        className={`support-toggle-btn ${isOpen ? 'active' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        title="Support"
      >
        {isOpen ? '✕' : '💬'}
      </button>

      <div className={`support-window ${isOpen ? 'open' : ''}`}>
        <div className="support-header">
          <h3>Liyaan Support</h3>
        </div>

        <div className="support-tabs">
          <button 
            className={`support-tab ${activeTab === 'faq' ? 'active' : ''}`}
            onClick={() => setActiveTab('faq')}
          >
            FAQs
          </button>
          <button 
            className={`support-tab ${activeTab === 'chat' ? 'active' : ''}`}
            onClick={() => setActiveTab('chat')}
          >
            Chatbot
          </button>
        </div>

        <div className="support-content">
          {activeTab === 'faq' ? (
            <div className="faq-list">
              {faqs.length > 0 ? (
                faqs.map((faq, index) => (
                  <div 
                    key={faq.id || index} 
                    className={`faq-item ${activeFaq === index ? 'active' : ''}`}
                  >
                    <button 
                      className="faq-question"
                      onClick={() => setActiveFaq(activeFaq === index ? null : index)}
                    >
                      {faq.question}
                      <span>{activeFaq === index ? '−' : '+'}</span>
                    </button>
                    <div className="faq-answer">
                      {faq.answer}
                    </div>
                  </div>
                ))
              ) : (
                <p>Loading FAQs...</p>
              )}
            </div>
          ) : (
            <div className="chat-container">
              <div className="chat-messages">
                {chatMessages.map((msg, index) => (
                  <div key={index} className={`message ${msg.isBot ? 'bot' : 'user'}`}>
                    {msg.text}
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
              <form className="chat-input-area" onSubmit={handleSendMessage}>
                <input 
                  type="text" 
                  placeholder="Ask a question..." 
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  disabled={isLoading}
                />
                <button type="submit" className="chat-send-btn" disabled={isLoading || !inputValue.trim()}>
                  {isLoading ? '...' : 'Send'}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SupportWidget;
