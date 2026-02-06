'use client';

import { useMemo, useState } from 'react';
import styles from './frontDeskChatbot.module.scss';

const createDefaultReply = (clinicName, phone) =>
  `Thanks for reaching out to ${clinicName}. I can help with services, pricing, and appointments. Call ${phone} or tell me what you need.`;

export default function FrontDeskChatbot({ clinicName, intro, address, phone, email, services = [] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'bot',
      text: `Hi! I am your front desk assistant for ${clinicName}. How can I help today?`,
    },
  ]);
  const [input, setInput] = useState('');

  const serviceList = useMemo(() => services.filter(Boolean), [services]);

  const speak = (text) => {
    if (!voiceEnabled || typeof window === 'undefined' || !window.speechSynthesis) return;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95;
    utterance.pitch = 1.0;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  };

  const getReply = (message) => {
    const question = message.toLowerCase();

    if (question.includes('address') || question.includes('location') || question.includes('where')) {
      return `We are located at ${address}. Would you like directions or to book a visit?`;
    }
    if (question.includes('phone') || question.includes('call')) {
      return `You can reach us at ${phone}. Want me to start a call?`;
    }
    if (question.includes('email')) {
      return `Email us anytime at ${email}. I can also share info here.`;
    }
    if (question.includes('hours') || question.includes('open')) {
      return `Hours vary by service. Share a preferred day, or call ${phone} for current hours.`;
    }
    if (question.includes('price') || question.includes('cost') || question.includes('insurance')) {
      return `Pricing depends on your care plan. I can connect you with a coordinator or collect a few details to provide an estimate.`;
    }
    if (question.includes('appointment') || question.includes('book') || question.includes('schedule')) {
      return `Great choice. I can help book an appointment. Do you prefer a call at ${phone} or should I take your details here?`;
    }
    if (question.includes('services') || question.includes('treatments')) {
      const list = serviceList.length ? serviceList.join(', ') : 'regenerative medicine, IV therapy, aesthetics, and wellness care';
      return `We offer ${list}. Which service are you interested in?`;
    }

    const matchedService = serviceList.find((service) => question.includes(service.toLowerCase()));
    if (matchedService) {
      return `Yes, we provide ${matchedService}. Want details, pricing, or to schedule a consultation?`;
    }

    if (intro) {
      return `${intro} How can I guide you today?`;
    }

    return createDefaultReply(clinicName, phone);
  };

  const sendMessage = (text) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    const userMessage = { role: 'user', text: trimmed };
    const replyText = getReply(userMessage.text);
    const botMessage = { role: 'bot', text: replyText };

    setMessages((prev) => [...prev, userMessage, botMessage]);
    setInput('');
    speak(replyText);
  };

  const handleSend = (event) => {
    event.preventDefault();
    sendMessage(input);
  };

  return (
    <div className={styles.chatbot}>
      <button className={styles.toggle} type="button" onClick={() => setIsOpen((prev) => !prev)}>
        {isOpen ? 'Close chat' : 'Chat with us'}
      </button>

      {isOpen ? (
        <section className={styles.panel}>
          <header className={styles.header}>
            <div>
              <p className={styles.title}>Front Desk Assistant</p>
              <p className={styles.subtitle}>Friendly, private, and helpful.</p>
            </div>
            <label className={styles.voice}>
              <input
                type="checkbox"
                checked={voiceEnabled}
                onChange={(event) => setVoiceEnabled(event.target.checked)}
              />
              Voice replies
            </label>
          </header>

          <div className={styles.messages}>
            {messages.map((message, index) => (
              <p
                key={`${message.role}-${index}`}
                className={message.role === 'bot' ? styles.bot : styles.user}
              >
                {message.text}
              </p>
            ))}
          </div>

          <div className={styles.quickLinks}>
            <button type="button" onClick={() => sendMessage('What services do you offer?')}>
              Services
            </button>
            <button type="button" onClick={() => sendMessage('Where are you located?')}>
              Location
            </button>
            <button type="button" onClick={() => sendMessage('I want to book an appointment.')}>
              Book visit
            </button>
          </div>

          <form className={styles.form} onSubmit={handleSend}>
            <input
              type="text"
              placeholder="Ask about services, pricing, or appointments..."
              value={input}
              onChange={(event) => setInput(event.target.value)}
            />
            <button type="submit">Send</button>
          </form>
        </section>
      ) : null}
    </div>
  );
}
