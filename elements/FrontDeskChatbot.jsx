'use client';

import { useMemo, useState, useEffect, useRef } from 'react';
import styles from './frontDeskChatbot.module.scss';
import { chatbotKnowledge } from './chatbotKnowledge';

const MEDICAL_DISCLAIMER = "\n\n*Note: I am an AI assistant for Innovative Medical Wellness. I can provide general information but I am not a doctor and this is not medical advice. For specific health concerns, please consult our specialists.*";

const getReply = (message) => {
  const question = message.toLowerCase();

  // 1. Emergency
  if (question.includes('emergency') || question.includes('911') || question.includes('chest pain') || question.includes('stroke')) {
    return "If you are experiencing a medical emergency, please call 911 immediately or go to the nearest emergency room.";
  }

  // 2. Check FAQs
  for (const faq of chatbotKnowledge.faqs) {
    if (faq.q.some(q => question.includes(q))) {
      return faq.a + MEDICAL_DISCLAIMER;
    }
  }

  // 3. Check Services
  for (const [key, service] of Object.entries(chatbotKnowledge.services)) {
    if (service.keywords.some(k => question.includes(k))) {
      return `${service.description} \n\n${service.details || ''} \n\n${service.link ? `Learn more: ${service.link}` : ''}` + MEDICAL_DISCLAIMER;
    }
  }

  // 4. Company Info
  if (question.includes('address') || question.includes('location') || question.includes('where')) {
    return `We are located at ${chatbotKnowledge.company.address}. We'd love to see you!`;
  }
  if (question.includes('phone') || question.includes('call') || question.includes('number')) {
    return `You can reach us at ${chatbotKnowledge.company.phone}.`;
  }
  if (question.includes('email')) {
    return `Email us at ${chatbotKnowledge.company.email}.`;
  }
  if (question.includes('hours') || question.includes('open')) {
    return "We are generally open Monday-Friday. Please call to confirm availability for specific services.";
  }
  if (question.includes('aging') || question.includes('biohacking')) {
    return `${chatbotKnowledge.services.agingBiohacking.description} Visit: ${chatbotKnowledge.services.agingBiohacking.link}`;
  }

  // 5. General / Greetings
  if (question.includes('hi') || question.includes('hello')) {
    return `Hello! Welcome to ${chatbotKnowledge.company.name}. How can I assist you today?`;
  }

  return chatbotKnowledge.general.fallback;
};

export default function FrontDeskChatbot({ clinicName, intro }) {
  const [isOpen, setIsOpen] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'bot',
      text: `Hi! I am your virtual front desk for ${clinicName || chatbotKnowledge.company.name}. How can I help you achieve your health goals today?`,
    },
  ]);
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);

  // Voice Selection
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState(null);

  useEffect(() => {
    const loadVoices = () => {
      const available = window.speechSynthesis.getVoices();
      setVoices(available);
      // Prefer a natural female voice (Google US English, Microsoft Zira, or just the first one)
      const preferred = available.find(v => v.name.includes('Google US English') || v.name.includes('Zira'));
      setSelectedVoice(preferred || available[0]);
    };

    loadVoices();
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, []);

  const speak = (text) => {
    if (!voiceEnabled || typeof window === 'undefined' || !window.speechSynthesis) return;
    const cleanText = text.replace(/\*.*?\*/g, '').replace(/https?:\/\/[^\s]+/g, 'website').replace(/\n/g, '. '); // Remove URLs for speech
    const utterance = new SpeechSynthesisUtterance(cleanText);
    if (selectedVoice) utterance.voice = selectedVoice;
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
      const recognition = new window.webkitSpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, []);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert('Speech recognition is not supported in your browser. Please use Chrome or Edge.');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.start();
      setIsListening(true);
    }
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

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
              <label className={styles.voice}>
                <input
                  type="checkbox"
                  checked={voiceEnabled}
                  onChange={(event) => setVoiceEnabled(event.target.checked)}
                />
                Voice Mode
              </label>
              {voiceEnabled && voices.length > 0 && (
                <select
                  className={styles.voiceSelect}
                  value={selectedVoice?.name}
                  onChange={(e) => setSelectedVoice(voices.find(v => v.name === e.target.value))}
                >
                  {voices.map(v => <option key={v.name} value={v.name}>{v.name.slice(0, 15)}...</option>)}
                </select>
              )}
            </div>
          </header>

          <div className={styles.messages}>
            {messages.map((message, index) => (
              <p
                key={`${message.role}-${index}`}
                className={message.role === 'bot' ? styles.bot : styles.user}
                style={{ whiteSpace: 'pre-wrap' }}
              >
                {message.text}
              </p>
            ))}
          </div>

          <div className={styles.quickLinks}>
            <button type="button" onClick={() => sendMessage('What services do you offer?')}>
              Services
            </button>
            <button type="button" onClick={() => sendMessage('Tell me about Exomind')}>
              Exomind
            </button>
            <button type="button" onClick={() => sendMessage('Aging Biohacking info?')} style={{ borderColor: '#9BEC00' }}>
              Aging Biohacking
            </button>
          </div>

          <form className={styles.form} onSubmit={handleSend}>
            <div className={styles.inputGroup}>
              <input
                type="text"
                placeholder={isListening ? "Listening..." : "Ask us anything..."}
                value={input}
                onChange={(event) => setInput(event.target.value)}
                className={isListening ? styles.listening : ''}
              />
              <button
                type="button"
                className={`${styles.voiceBtn} ${isListening ? styles.listeningBtn : ''}`}
                onClick={toggleListening}
                disabled={!recognitionRef.current}
                title={recognitionRef.current ? "Click to speak" : "Speech recognition not supported"}
              >
                {isListening ? '🛑' : '🎤'}
              </button>
              <button type="submit">Send</button>
            </div>
          </form>
        </section>
      ) : null}
    </div>
  );
}
