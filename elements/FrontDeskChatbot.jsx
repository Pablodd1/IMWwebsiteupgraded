'use client';

import { useState, useEffect, useRef } from 'react';
import styles from './frontDeskChatbot.module.scss';

const DAILY_TIPS = [
  "Stay hydrated! Drink at least 8 glasses of water daily for optimal health.",
  "Quality sleep is essential. Aim for 7-9 hours of restful sleep each night.",
  "Movement matters! Even a 20-minute walk can boost your mood and energy.",
  "Deep breathing exercises can help reduce stress and improve focus.",
  "Good nutrition fuels your body. Eat plenty of fruits and vegetables!",
  "Sunlight exposure in the morning helps regulate your circadian rhythm.",
  "Posture check! Sitting up straight can improve energy and reduce fatigue."
];

export default function FrontDeskChatbot({ clinicName = 'Innovative Medical Wellness', LANG = 'en' }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [status, setStatus] = useState('');
  const [chatLang, setChatLang] = useState('en');
  const [showActions, setShowActions] = useState(false);
  const [rating, setRating] = useState(0);
  const [showRating, setShowRating] = useState(false);
  const [appointmentForm, setAppointmentForm] = useState({ name: '', phone: '', service: '', message: '' });
  const [showAppointment, setShowAppointment] = useState(false);
  const [callBackForm, setCallBackForm] = useState({ name: '', phone: '', message: '' });
  const [showCallBack, setShowCallBack] = useState(false);
  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);
  const synthRef = useRef(null);

  const getDailyTip = () => DAILY_TIPS[Math.floor(Math.random() * DAILY_TIPS.length)];

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const tip = getDailyTip();
      setMessages([{
        role: 'assistant',
        content: chatLang === 'es' 
          ? `¡Hola! Soy tu asistente virtual de Innovative Medical Wellness. ${tip}\n\n¿Cómo puedo ayudarte hoy?`
          : `Hi! I'm your virtual front desk assistant for ${clinicName}. ${tip}\n\nHow can I help you today?`
      }]);
    }
  }, [isOpen, messages.length, clinicName, chatLang]);

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
        recognition.lang = chatLang === 'es' ? 'es-ES' : 'en-US';
        
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
  }, [chatLang]);

  const speak = (text) => {
    if (!voiceEnabled || !synthRef.current) return;
    synthRef.current.cancel();
    const clean = text.replace(/[#*_\[\]]/g, '').replace(/https?:\/\/[^\s]+/g, 'website');
    const utterance = new SpeechSynthesisUtterance(clean);
    utterance.rate = 0.9;
    utterance.lang = chatLang === 'es' ? 'es-ES' : 'en-US';
    utterance.onstart = () => setSpeaking(true);
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);
    synthRef.current.speak(utterance);
  };

  const handleSend = async (text, forceLang = null) => {
    const langToUse = forceLang || chatLang;
    const trimmed = text || input.trim();
    if (!trimmed) return;

    const userMsg = { role: 'user', content: trimmed };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);
    setStatus('Thinking...');
    setShowActions(false);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, userMsg], lang: langToUse })
      });

      if (!res.ok) throw new Error('Failed');

      const data = await res.json();
      const reply = data.content || "I'm sorry, something went wrong.";
      
      setMessages(prev => [...prev, { role: 'assistant', content: reply }]);
      setStatus('');
      if (voiceEnabled) speak(reply);
      
      // Show rating after assistant responds
      setTimeout(() => setShowRating(true), 1000);
    } catch (err) {
      console.error('Chat error:', err);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: langToUse === 'es' 
          ? "Lo siento, tengo problemas para conectar. Por favor llama al (305) 864-1373."
          : "I apologize, I'm having trouble connecting. Please call us at (305) 864-1373."
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
      alert(chatLang === 'es' ? 'Reconocimiento de voz no soportado. Usa Chrome o Edge.' : 'Speech recognition not supported. Use Chrome or Edge.');
      return;
    }
    if (isListening) {
      recognitionRef.current.stop();
    } else {
      setStatus(chatLang === 'es' ? 'Escuchando...' : 'Listening...');
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const handleAppointmentSubmit = async (e) => {
    e.preventDefault();
    const msg = `Appointment Request:\nName: ${appointmentForm.name}\nPhone: ${appointmentForm.phone}\nService: ${appointmentForm.service}\nMessage: ${appointmentForm.message}`;
    setShowAppointment(false);
    setAppointmentForm({ name: '', phone: '', service: '', message: '' });
    await handleSend(msg);
  };

  const handleCallBackSubmit = async (e) => {
    e.preventDefault();
    const msg = `Call Back Request:\nName: ${callBackForm.name}\nPhone: ${callBackForm.phone}\nMessage: ${callBackForm.message}`;
    setShowCallBack(false);
    setCallBackForm({ name: '', phone: '', message: '' });
    await handleSend(msg);
  };

  const handleRating = (score) => {
    setRating(score);
    const feedback = score >= 4 ? 'Great' : score >= 3 ? 'Good' : 'Needs improvement';
    handleSend(`User feedback: ${feedback} (${score}/5 stars)`);
    setShowRating(false);
    setRating(0);
  };

  const toggleLang = () => {
    const newLang = chatLang === 'en' ? 'es' : 'en';
    setChatLang(newLang);
    // Send a system message to switch language
    const msg = { role: 'user', content: `[Switch language to ${newLang === 'en' ? 'English' : 'Spanish'}]` };
    handleSend(msg.content, newLang);
  };

  const quickQuestions = chatLang === 'es' ? [
    { text: 'Servicios', q: '¿Qué servicios ofrecen?' },
    { text: 'Exomind', q: 'Cuéntame sobre Exomind' },
    { text: 'Contacto', q: '¿Cómo puedo contactarlos?' }
  ] : [
    { text: 'Services', q: 'What services do you offer?' },
    { text: 'Exomind', q: 'Tell me about Exomind brain therapy' },
    { text: 'Contact', q: 'How can I contact you?' }
  ];

  const actionButtons = chatLang === 'es' ? [
    { text: '📅 Cita', label: 'Request Appointment', action: () => setShowAppointment(true) },
    { text: '📞 Llamada', label: 'Request Call Back', action: () => setShowCallBack(true) },
    { text: '💡 Consejo', label: 'Health Tip', action: () => handleSend(chatLang === 'es' ? 'Dame un consejo de salud' : 'Give me a health tip') }
  ] : [
    { text: '📅 Book', label: 'Request Appointment', action: () => setShowAppointment(true) },
    { text: '📞 Call', label: 'Request Call Back', action: () => setShowCallBack(true) },
    { text: '💡 Tip', label: 'Health Tip', action: () => handleSend('Give me a health tip') }
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
                {speaking ? '🔊' : isListening ? '👂' : '🏥'} {chatLang === 'es' ? 'Asistente IA' : 'Front Desk AI'}
              </p>
              <p className={styles.subtitle}>{status || (chatLang === 'es' ? 'Pregúntame cualquier cosa' : 'Ask me anything')}</p>
            </div>
            <div className={styles.headerActions}>
              <button className={styles.langBtn} onClick={toggleLang} title="Switch Language">
                {chatLang === 'en' ? 'ES' : 'EN'}
              </button>
              <label className={styles.voice}>
                <input type="checkbox" checked={voiceEnabled} onChange={toggleVoice} />
                🔊
              </label>
            </div>
          </header>

          <div className={styles.messages}>
            {messages.map((m, i) => (
              <div key={i} className={m.role === 'user' ? styles.userMsg : styles.botMsg}>
                <p className={m.role === 'user' ? styles.user : styles.bot}>{m.content}</p>
              </div>
            ))}
            {(isLoading || isListening) && (
              <p className={styles.bot}>
                <span className={styles.wave}>•••</span>
              </p>
            )}
            
            {/* Rating */}
            {showRating && !isLoading && (
              <div className={styles.ratingContainer}>
                <p className={styles.ratingText}>{chatLang === 'es' ? '¿Qué tal fue tu experiencia?' : 'How was your experience?'}</p>
                <div className={styles.ratingStars}>
                  {[1,2,3,4,5].map(s => (
                    <button key={s} onClick={() => handleRating(s)} className={rating >= s ? styles.starActive : ''}>⭐</button>
                  ))}
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Actions */}
          <div className={styles.quickLinks}>
            {quickQuestions.map(q => (
              <button key={q.text} onClick={() => handleSend(q.q)} disabled={isLoading}>{q.text}</button>
            ))}
            <button onClick={() => setShowActions(!showActions)} className={styles.actionToggle}>
              {showActions ? '✕' : '+'} {chatLang === 'es' ? 'Más' : 'More'}
            </button>
          </div>

          {/* Action Buttons */}
          {showActions && (
            <div className={styles.actionButtons}>
              {actionButtons.map(btn => (
                <button key={btn.text} onClick={btn.action} className={styles.actionBtn}>
                  {btn.text}
                </button>
              ))}
            </div>
          )}

          {/* Appointment Form Modal */}
          {showAppointment && (
            <div className={styles.formModal}>
              <form onSubmit={handleAppointmentSubmit}>
                <h4>{chatLang === 'es' ? 'Solicitar Cita' : 'Request Appointment'}</h4>
                <input 
                  type="text" 
                  placeholder={chatLang === 'es' ? 'Tu nombre' : 'Your Name'} 
                  value={appointmentForm.name}
                  onChange={e => setAppointmentForm({...appointmentForm, name: e.target.value})}
                  required 
                />
                <input 
                  type="tel" 
                  placeholder={chatLang === 'es' ? 'Tu teléfono' : 'Your Phone'} 
                  value={appointmentForm.phone}
                  onChange={e => setAppointmentForm({...appointmentForm, phone: e.target.value})}
                  required 
                />
                <select 
                  value={appointmentForm.service}
                  onChange={e => setAppointmentForm({...appointmentForm, service: e.target.value})}
                  required
                >
                  <option value="">{chatLang === 'es' ? 'Selecciona servicio' : 'Select Service'}</option>
                  <option value="Exomind">Exomind</option>
                  <option value="V-Tone">V-Tone</option>
                  <option value="IV Therapy">IV Therapy</option>
                  <option value="Biohacking">Biohacking</option>
                  <option value="Other">Other</option>
                </select>
                <textarea 
                  placeholder={chatLang === 'es' ? 'Mensaje opcional' : 'Optional Message'}
                  value={appointmentForm.message}
                  onChange={e => setAppointmentForm({...appointmentForm, message: e.target.value})}
                />
                <div className={styles.formButtons}>
                  <button type="button" onClick={() => setShowAppointment(false)} className={styles.cancelBtn}>
                    {chatLang === 'es' ? 'Cancelar' : 'Cancel'}
                  </button>
                  <button type="submit" className={styles.submitBtn}>
                    {chatLang === 'es' ? 'Enviar' : 'Submit'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Call Back Form Modal */}
          {showCallBack && (
            <div className={styles.formModal}>
              <form onSubmit={handleCallBackSubmit}>
                <h4>{chatLang === 'es' ? 'Solicitar Llamada' : 'Request Call Back'}</h4>
                <input 
                  type="text" 
                  placeholder={chatLang === 'es' ? 'Tu nombre' : 'Your Name'} 
                  value={callBackForm.name}
                  onChange={e => setCallBackForm({...callBackForm, name: e.target.value})}
                  required 
                />
                <input 
                  type="tel" 
                  placeholder={chatLang === 'es' ? 'Tu teléfono' : 'Your Phone'} 
                  value={callBackForm.phone}
                  onChange={e => setCallBackForm({...callBackForm, phone: e.target.value})}
                  required 
                />
                <textarea 
                  placeholder={chatLang === 'es' ? '¿Sobre qué necesitas información?' : 'What do you need info about?'}
                  value={callBackForm.message}
                  onChange={e => setCallBackForm({...callBackForm, message: e.target.value})}
                />
                <div className={styles.formButtons}>
                  <button type="button" onClick={() => setShowCallBack(false)} className={styles.cancelBtn}>
                    {chatLang === 'es' ? 'Cancelar' : 'Cancel'}
                  </button>
                  <button type="submit" className={styles.submitBtn}>
                    {chatLang === 'es' ? 'Llamarme' : 'Call Me'}
                  </button>
                </div>
              </form>
            </div>
          )}

          <form className={styles.form} onSubmit={(e) => { e.preventDefault(); handleSend(); }}>
            <div className={`${styles.inputWrapper} ${isListening ? styles.listening : ''} ${speaking ? styles.speaking : ''}`}>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={isListening ? (chatLang === 'es' ? 'Escuchando...' : 'Listening...') : speaking ? (chatLang === 'es' ? 'Hablando IA...' : 'AI Speaking...') : (chatLang === 'es' ? 'Escribe un mensaje...' : 'Type a message...')}
                disabled={isLoading || showAppointment || showCallBack}
              />
            </div>
            <button 
              type="button" 
              onClick={toggleMic} 
              disabled={isLoading || showAppointment || showCallBack}
              className={`${styles.micBtn} ${isListening ? styles.micActive : ''}`}
            >
              {isListening ? '⬛' : '🎤'}
            </button>
            <button 
              type="submit" 
              disabled={!input.trim() || isLoading || showAppointment || showCallBack}
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
