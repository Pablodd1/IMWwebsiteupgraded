'use client';

import { useState, useEffect, useRef } from 'react';
import styles from './frontDeskChatbot.module.scss';

export default function FrontDeskChatbot({ clinicName = 'Innovative Medical Wellness', LANG = 'en' }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [status, setStatus] = useState('');
  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);
  const synthRef = useRef(null);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([{
        role: 'assistant',
        content: `Hi! I'm your virtual front desk assistant for ${clinicName}. How can I help you today?`
      }]);
    }
  }, [isOpen, messages.length, clinicName]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      synthRef.current = window.speechSynthesis;
      
      if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = LANG === 'es' ? 'es-ES' : 'en-US';
        
        recognition.onresult = (event) => {
          let final = '';
          for (let i = event.resultIndex; i < event.results.length; i++) {
            if (event.results[i].isFinal) {
              final += event.results[i][0].transcript;
            }
          }
          if (final) {
            setInput(final);
            handleSend(final);
            setIsListening(false);
          }
        };
        
        recognition.onerror = (e) => {
          console.error('Speech error:', e);
          setIsListening(false);
          setStatus('');
        };
        recognition.onend = () => {
          setIsListening(false);
          setStatus('');
        };
        recognitionRef.current = recognition;
      }
    }
  }, [LANG]);

  const speak = (text) => {
    if (!voiceEnabled || !synthRef.current) return;
    synthRef.current.cancel();
    const clean = text.replace(/[#*_\[\]]/g, '').replace(/https?:\/\/[^\s]+/g, 'website');
    const utterance = new SpeechSynthesisUtterance(clean);
    utterance.rate = 0.9;
    utterance.onstart = () => setSpeaking(true);
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);
    synthRef.current.speak(utterance);
  };

  const handleSend = async (text) => {
    const trimmed = text || input.trim();
    if (!trimmed) return;

    const userMsg = { role: 'user', content: trimmed };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);
    setStatus('Thinking...');

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, userMsg] })
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.content || 'Failed');
      }

      const data = await res.json();
      const reply = data.content || "I'm sorry, something went wrong. Please try again.";
      
      setMessages(prev => [...prev, { role: 'assistant', content: reply }]);
      setStatus('');
      if (voiceEnabled) speak(reply);
    } catch (err) {
      console.error('Chat error:', err);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: err.message || "I apologize, but I'm having trouble connecting right now. Please try again or call us at (305) 864-1373." 
      }]);
      setStatus('');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleVoice = () => {
    setVoiceEnabled(!voiceEnabled);
    if (voiceEnabled && synthRef.current) {
      synthRef.current.cancel();
      setSpeaking(false);
    }
  };

  const toggleMic = () => {
    if (!recognitionRef.current) {
      alert('Speech recognition not supported. Use Chrome or Edge.');
      return;
    }
    if (isListening) {
      recognitionRef.current.stop();
    } else {
      setStatus('Listening...');
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const quickQuestions = [
    { text: 'Services', q: 'What services do you offer?' },
    { text: 'Exomind', q: 'Tell me about Exomind brain therapy' },
    { text: 'Contact', q: 'How can I contact you?' }
  ];

  return (
    <div className={styles.chatbot}>
      <button className={`${styles.toggle} ${speaking ? styles.speaking : ''}`} onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? '✕' : speaking ? '🔊' : '💬'}
      </button>

      {isOpen && (
        <section className={styles.panel}>
          <header className={styles.header}>
            <div>
              <p className={styles.title}>
                {speaking ? '🔊 Speaking...' : isListening ? '👂 Listening...' : 'Front Desk AI'}
              </p>
              <p className={styles.subtitle}>{status || 'Ask me anything'}</p>
            </div>
            <label className={styles.voice}>
              <input type="checkbox" checked={voiceEnabled} onChange={toggleVoice} />
              🔊 Voice
            </label>
          </header>

          <div className={styles.messages}>
            {messages.map((m, i) => (
              <p key={i} className={m.role === 'user' ? styles.user : styles.bot}>
                {m.content}
              </p>
            ))}
            {(isLoading || isListening) && (
              <p className={styles.bot}>
                <span className={styles.wave}>•••</span>
              </p>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className={styles.quickLinks}>
            {quickQuestions.map(q => (
              <button key={q.text} onClick={() => handleSend(q.q)} disabled={isLoading}>{q.text}</button>
            ))}
          </div>

          <form className={styles.form} onSubmit={(e) => { e.preventDefault(); handleSend(); }}>
            <div className={`${styles.inputWrapper} ${isListening ? styles.listening : ''} ${speaking ? styles.speaking : ''}`}>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={isListening ? 'Listening...' : speaking ? 'AI Speaking...' : 'Type a message...'}
                disabled={isLoading}
              />
              <div className={styles.waveform}>
                {isListening && <span className={styles.waveBar}></span>}
                {isListening && <span className={styles.waveBar}></span>}
                {isListening && <span className={styles.waveBar}></span>}
              </div>
            </div>
            <button 
              type="button" 
              onClick={toggleMic} 
              disabled={isLoading}
              className={`${styles.micBtn} ${isListening ? styles.micActive : ''}`}
            >
              {isListening ? '⬛' : '🎤'}
            </button>
            <button 
              type="submit" 
              disabled={!input.trim() || isLoading}
              className={styles.sendBtn}
            >
              ➤
            </button>
          </form>
        </section>
      )}
    </div>
  );
}
