'use client';

import { useMemo, useState, useEffect, useRef } from 'react';
import styles from './frontDeskChatbot.module.scss';

const MEDICAL_DISCLAIMER = "\n\n*Note: I am an AI assistant for Innovative Medical Wellness. I can provide general information but I am not a doctor and this is not medical advice. For specific health concerns, please consult our specialists.*";

const getReply = (message, clinicName, phone, email, serviceList, intro, address) => {
  const question = message.toLowerCase();

  // Emergency check
  if (question.includes('emergency') || question.includes('911') || question.includes('chest pain') || question.includes('stroke')) {
    return `If you are experiencing a medical emergency, please call 911 immediately or go to the nearest emergency room.`;
  }

  // Address / Location
  if (question.includes('address') || question.includes('location') || question.includes('where') || question.includes('find you')) {
    return `We are located at ${address}. We'd love to see you! Individual appointments and walk-ins (where applicable) are welcome.`;
  }

  // Phone / Call
  if (question.includes('phone') || question.includes('call') || question.includes('number')) {
    return `You can reach our front desk at ${phone}. Feel free to call us for immediate assistance, or I can take your details here for a callback.`;
  }

  // Email
  if (question.includes('email') || question.includes('message') || question.includes('write')) {
    return `Email us anytime at ${email}. I can also share information or collect your details for a coordinator to reach out.`;
  }

  // Hours
  if (question.includes('hours') || question.includes('open') || question.includes('when') || question.includes('time')) {
    return `Our center is generally open Monday through Friday. Specific hours can vary by service (IV Therapy, Weight Loss, Aesthetics, etc.). Would you like to check availability for a specific day?`;
  }

  // Pricing / Insurance
  if (question.includes('price') || question.includes('cost') || question.includes('how much') || question.includes('insurance') || question.includes('pay')) {
    return `Pricing depends on your customized clinical wellness plan. We accept various insurance plans and offer competitive self-pay rates for our wellness programs. Would you like a clinical coordinator to provide a free estimate?`;
  }

  // Appointment / Booking
  if (question.includes('appointment') || question.includes('book') || question.includes('schedule') || question.includes('visit') || question.includes('consultation')) {
    return `Excellent. I can help start the booking process. Do you prefer an in-person consultation or a discovery call? You can also call us directly at ${phone}.`;
  }

  // Services
  if (question.includes('services') || question.includes('treatments') || question.includes('what do you do') || question.includes('offer')) {
    const list = serviceList.length ? serviceList.join(', ') : 'regenerative medicine, IV therapy, aesthetics, and wellness care';
    return `We offer a wide range of integrative healthcare services including ${list}. Which area can we help you focus on?` + MEDICAL_DISCLAIMER;
  }

  // Specific Medical Questions (Pre-defined)
  if (question.includes('cure') || question.includes('treat') || question.includes('heal') || question.includes('diagnosis') || question.includes('medicine')) {
    return `I cannot provide medical diagnoses or treatment advice. However, our board-certified specialists at Innovative Medical Wellness create personalized plans for your specific health needs. Would you like to schedule a professional consultation?` + MEDICAL_DISCLAIMER;
  }

  // Match Services
  const matchedService = serviceList.find((service) => question.includes(service.toLowerCase()));
  if (matchedService) {
    return `Yes, we specialize in ${matchedService} and related integrative therapies. Would you like more details on how we approach this, or shall we check for consultation availability?` + MEDICAL_DISCLAIMER;
  }

  // Politeness / Meta
  if (question.includes('thank') || question.includes('thanks') || question.includes('bye') || question.includes('goodbye')) {
    return "You're very welcome! We look forward to being part of your wellness journey. Have a healthy day!";
  }

  if (intro) {
    return `${intro} How else can I assist you with our clinical wellness services today?`;
  }

  return `Thanks for reaching out to ${clinicName}. I'm here to help with services, pricing, and appointments. How can I guide you today?`;
};

export default function FrontDeskChatbot({ clinicName, intro, address, phone, email, services = [] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'bot',
      text: `Hi! I am your virtual front desk for ${clinicName}. How can I help you achieve your health goals today?`,
    },
  ]);
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);

  const serviceList = useMemo(() => services.filter(Boolean), [services]);

  const speak = (text) => {
    if (!voiceEnabled || typeof window === 'undefined' || !window.speechSynthesis) return;
    const cleanText = text.replace(/\*.*?\*/g, '').replace(/\n/g, ' ');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 0.95;
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
    const replyText = getReply(userMessage.text, clinicName, phone, email, serviceList, intro, address);
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
            <div className={styles.inputGroup}>
              <input
                type="text"
                placeholder={isListening ? "Listening..." : "Ask about services, pricing, or appointments..."}
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
