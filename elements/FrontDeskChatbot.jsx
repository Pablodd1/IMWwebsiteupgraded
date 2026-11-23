'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import styles from './frontDeskChatbot.module.scss';

// Visible text. Keep the greeting in sync with bot/config/persona.json (greeting.chat).
const T = {
  en: {
    greeting: "Hi! I'm Mia, the virtual front desk assistant for Innovative Medical Wellness. How can I help you today?",
    title: 'Front Desk AI', ask: 'Ask about our services or book a visit', placeholder: 'Type a message...',
    listening: 'Listening...', thinking: 'Thinking...', speaking: 'AI speaking...', more: 'More',
    book: '📅 Book', call: '📞 Call me', rate: 'How was your experience?', thanks: 'Thanks for the feedback!',
    unsupportedMic: 'Voice input is not supported in this browser.', micDenied: 'Microphone access was blocked. Check your browser permissions.',
    apptTitle: 'Request an appointment', cbTitle: 'Request a call back', name: 'Your name', phone: 'Your phone', service: 'Select service',
    when: 'Preferred day/time (optional)', cancel: 'Cancel', submit: 'Send request', sending: 'Sending...',
    privacy: 'Please do not include medical details. The office will call you to confirm.',
    sent: "Thank you! Your request was sent to our office. They'll call you to confirm.",
    sendFail: "Sorry, I couldn't send that. Please call us at (305) 864-1373.",
    err: "I'm having trouble connecting. Please call us at (305) 864-1373.",
    ai: 'AI assistant. Not for medical emergencies. In an emergency call 911.', tel: 'Call the clinic',
    quick: [{ t: 'Services', q: 'What services do you offer?' }, { t: 'Exomind', q: 'Tell me about Exomind' }, { t: 'Hours', q: 'What are your hours?' }],
  },
  es: {
    greeting: '¡Hola! Soy Mia, la asistente virtual de recepción de Innovative Medical Wellness. ¿En qué puedo ayudarte hoy?',
    title: 'Asistente IA', ask: 'Pregunta por servicios o agenda una visita', placeholder: 'Escribe un mensaje...',
    listening: 'Escuchando...', thinking: 'Pensando...', speaking: 'IA hablando...', more: 'Más',
    book: '📅 Cita', call: '📞 Llámame', rate: '¿Qué tal fue tu experiencia?', thanks: '¡Gracias por tu opinión!',
    unsupportedMic: 'La entrada de voz no es compatible con este navegador.', micDenied: 'Se bloqueó el micrófono. Revisa los permisos del navegador.',
    apptTitle: 'Solicitar una cita', cbTitle: 'Solicitar una llamada', name: 'Tu nombre', phone: 'Tu teléfono', service: 'Selecciona servicio',
    when: 'Día/hora preferida (opcional)', cancel: 'Cancelar', submit: 'Enviar solicitud', sending: 'Enviando...',
    privacy: 'Por favor no incluyas detalles médicos. La oficina te llamará para confirmar.',
    sent: '¡Gracias! Tu solicitud fue enviada a la oficina. Te llamarán para confirmar.',
    sendFail: 'Lo siento, no pude enviarla. Por favor llama al (305) 864-1373.',
    err: 'Tengo problemas para conectar. Por favor llama al (305) 864-1373.',
    ai: 'Asistente de IA. No para emergencias médicas. En una emergencia llame al 911.', tel: 'Llamar a la clínica',
    quick: [{ t: 'Servicios', q: '¿Qué servicios ofrecen?' }, { t: 'Exomind', q: 'Cuéntame sobre Exomind' }, { t: 'Horario', q: '¿Cuál es el horario?' }],
  },
};
const SERVICES = ['Exomind', 'V-Tone', 'IV Therapy', 'Biohacking', 'Regenerative Medicine', 'Hormone Therapy', 'Weight Loss', 'Chiropractic', 'Other'];
const PHONE_TEL = 'tel:+13058641373';

// Render text with safe clickable https links (no HTML injection).
function renderText(text) {
  return String(text).split(/(https?:\/\/[^\s)]+)/g).map((part, i) =>
    /^https:\/\//.test(part) ? (
      <a key={i} href={part} target="_blank" rel="noopener noreferrer">{part.replace(/^https:\/\/(www\.)?/, '')}</a>
    ) : (
      part
    )
  );
}

export default function FrontDeskChatbot({ LANG = 'en', apiUrl = '/api/chat', leadUrl = '/api/lead' }) {
  const [isOpen, setIsOpen] = useState(false);
  const [lang, setLang] = useState(LANG === 'es' ? 'es' : 'en');
  const t = T[lang];
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [micSupported, setMicSupported] = useState(false);
  const [notice, setNotice] = useState('');
  const [showActions, setShowActions] = useState(false);
  const [showRating, setShowRating] = useState(false);
  const [form, setForm] = useState(null); // null | 'appointment' | 'callback'
  const [formData, setFormData] = useState({ name: '', phone: '', service: '', time: '' });
  const [formBusy, setFormBusy] = useState(false);

  // Refs always hold the LATEST values, so speech callbacks never use stale state.
  const messagesRef = useRef([]);
  const voiceRef = useRef(false);
  const langRef = useRef(lang);
  const loadingRef = useRef(false);
  const sendRef = useRef(null);
  const recognitionRef = useRef(null);
  const endRef = useRef(null);
  const inputRef = useRef(null);
  const voicesRef = useRef([]);
  messagesRef.current = messages;
  voiceRef.current = voiceEnabled;
  langRef.current = lang;

  const pushMessage = useCallback((m) => {
    const next = [...messagesRef.current, m];
    messagesRef.current = next;
    setMessages(next);
  }, []);

  // Greeting: set on first open, and re-translate it if the only message is the greeting.
  useEffect(() => {
    if (!isOpen) return;
    setMessages((prev) => {
      if (prev.length === 0 || (prev.length === 1 && prev[0].greeting)) return [{ role: 'assistant', content: t.greeting, greeting: true }];
      return prev;
    });
  }, [isOpen, lang, t.greeting]);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' }); }, [messages, isLoading]);
  useEffect(() => { if (isOpen) inputRef.current?.focus(); }, [isOpen]);

  // Voices load asynchronously in Chrome/Safari.
  useEffect(() => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    const load = () => { voicesRef.current = window.speechSynthesis.getVoices(); };
    load();
    window.speechSynthesis.addEventListener?.('voiceschanged', load);
    return () => window.speechSynthesis.removeEventListener?.('voiceschanged', load);
  }, []);

  const stopAudio = useCallback(() => {
    try { window.speechSynthesis?.cancel(); } catch {}
    try { recognitionRef.current?.abort(); } catch {}
    setSpeaking(false);
    setIsListening(false);
  }, []);

  const speak = useCallback((text) => {
    if (!voiceRef.current || typeof window === 'undefined' || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const clean = String(text).replace(/https?:\/\/\S+/g, 'our website').replace(/[#*_`>~[\]]/g, '').replace(/\s+/g, ' ');
    const u = new SpeechSynthesisUtterance(clean);
    const code = langRef.current === 'es' ? 'es-US' : 'en-US';
    u.lang = code;
    u.rate = 1.0;
    u.pitch = 1.1;
    const prefix = code.slice(0, 2);
    const candidates = voicesRef.current.filter((v) => v.lang?.toLowerCase().startsWith(prefix));
    const female = candidates.find((v) => /female|samantha|zira|aria|jenny|paulina|monica|google (us|español)/i.test(v.name));
    u.voice = female || candidates[0] || null;
    u.onstart = () => setSpeaking(true);
    u.onend = () => setSpeaking(false);
    u.onerror = () => setSpeaking(false);
    window.speechSynthesis.speak(u);
  }, []);

  const sendMessage = useCallback(async (raw) => {
    const text = String(raw ?? '').trim();
    if (!text || loadingRef.current) return;
    loadingRef.current = true;
    pushMessage({ role: 'user', content: text });
    setInput('');
    setShowActions(false);
    setIsLoading(true);
    setNotice(T[langRef.current].thinking);
    try {
      const history = messagesRef.current.map(({ role, content }) => ({ role, content })).slice(-18);
      const res = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: history, lang: langRef.current }),
      });
      const data = await res.json().catch(() => ({}));
      const reply = data.content || T[langRef.current].err;
      pushMessage({ role: 'assistant', content: reply });
      speak(reply);
      if (res.ok && !data.emergency) setTimeout(() => setShowRating(true), 800);
    } catch {
      pushMessage({ role: 'assistant', content: T[langRef.current].err });
    } finally {
      loadingRef.current = false;
      setIsLoading(false);
      setNotice('');
    }
  }, [apiUrl, pushMessage, speak]);
  sendRef.current = sendMessage;

  // Speech recognition: one instance per language, cleaned up properly.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    setMicSupported(Boolean(SR));
    if (!SR) return;
    const rec = new SR();
    rec.continuous = false;
    rec.interimResults = true;
    rec.lang = lang === 'es' ? 'es-US' : 'en-US';
    rec.onresult = (e) => {
      let interim = '';
      let final = '';
      for (let i = e.resultIndex; i < e.results.length; i++) {
        (e.results[i].isFinal ? (final += e.results[i][0].transcript) : (interim += e.results[i][0].transcript));
      }
      if (final) { setIsListening(false); sendRef.current?.(final); } else setInput(interim);
    };
    rec.onerror = (e) => {
      setIsListening(false);
      if (e.error === 'not-allowed' || e.error === 'service-not-allowed') setNotice(T[langRef.current].micDenied);
    };
    rec.onend = () => setIsListening(false);
    recognitionRef.current = rec;
    return () => { try { rec.abort(); } catch {} recognitionRef.current = null; };
  }, [lang]);

  const toggleMic = () => {
    const rec = recognitionRef.current;
    if (!rec) return setNotice(t.unsupportedMic);
    if (isListening) return rec.stop();
    window.speechSynthesis?.cancel();
    setNotice('');
    try { rec.start(); setIsListening(true); } catch { /* already started */ }
  };

  const toggleVoice = () => {
    if (voiceEnabled) { window.speechSynthesis?.cancel(); setSpeaking(false); }
    setVoiceEnabled(!voiceEnabled);
  };

  const close = useCallback(() => { stopAudio(); setIsOpen(false); }, [stopAudio]);
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => e.key === 'Escape' && close();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, close]);
  useEffect(() => stopAudio, [stopAudio]);

  const submitLead = async (e) => {
    e.preventDefault();
    setFormBusy(true);
    try {
      const res = await fetch(leadUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ kind: form, name: formData.name, phone: formData.phone, service: formData.service || 'Not specified', preferred_time: formData.time, lang, channel: 'form' }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok) throw new Error('lead failed');
      pushMessage({ role: 'assistant', content: t.sent });
      speak(t.sent);
      setForm(null);
      setFormData({ name: '', phone: '', service: '', time: '' });
    } catch {
      pushMessage({ role: 'assistant', content: t.sendFail });
      setForm(null);
    } finally {
      setFormBusy(false);
    }
  };

  const rate = (score) => {
    setShowRating(false);
    try { window.umami?.track?.('chat_rating', { score }); } catch {}
    pushMessage({ role: 'assistant', content: t.thanks });
  };

  const toggleLang = () => setLang(lang === 'en' ? 'es' : 'en');
  const busy = isLoading || Boolean(form);
  const status = isListening ? t.listening : speaking ? t.speaking : notice || t.ask;

  return (
    <div className={styles.chatbot}>
      <button
        type="button"
        className={`${styles.toggle} ${speaking ? styles.speaking : ''}`}
        onClick={() => (isOpen ? close() : setIsOpen(true))}
        aria-label={isOpen ? 'Close chat' : 'Open chat with the front desk assistant'}
        aria-expanded={isOpen}
        aria-controls="imw-chat-panel"
      >
        {isOpen ? '✕' : speaking ? '🔊' : '💬'}
      </button>

      {isOpen && (
        <section id="imw-chat-panel" className={styles.panel} role="dialog" aria-label={t.title}>
          <header className={styles.header}>
            <div>
              <p className={styles.title}>{speaking ? '🔊' : isListening ? '👂' : '🏥'} {t.title}</p>
              <p className={styles.subtitle} aria-live="polite">{status}</p>
            </div>
            <div className={styles.headerActions}>
              <a className={styles.langBtn} href={PHONE_TEL} aria-label={t.tel} title={t.tel}>📞</a>
              <button type="button" className={styles.langBtn} onClick={toggleLang} aria-label={lang === 'en' ? 'Cambiar a español' : 'Switch to English'}>
                {lang === 'en' ? 'ES' : 'EN'}
              </button>
              <button type="button" className={styles.langBtn} onClick={toggleVoice} aria-pressed={voiceEnabled} aria-label={voiceEnabled ? 'Turn off spoken replies' : 'Turn on spoken replies'}>
                {voiceEnabled ? '🔊' : '🔇'}
              </button>
            </div>
          </header>

          <div className={styles.messages} role="log" aria-live="polite" aria-relevant="additions">
            {messages.map((m, i) => (
              <div key={i} className={m.role === 'user' ? styles.userMsg : styles.botMsg}>
                <p className={m.role === 'user' ? styles.user : styles.bot}>{m.role === 'user' ? m.content : renderText(m.content)}</p>
              </div>
            ))}
            {(isLoading || isListening) && (
              <p className={styles.bot} aria-label={isListening ? t.listening : t.thinking}><span className={styles.wave}>•••</span></p>
            )}
            {showRating && !isLoading && (
              <div className={styles.ratingContainer}>
                <p className={styles.ratingText}>{t.rate}</p>
                <div className={styles.ratingStars}>
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button key={s} type="button" onClick={() => rate(s)} aria-label={`${s} / 5`}>⭐</button>
                  ))}
                </div>
              </div>
            )}
            <div ref={endRef} />
          </div>

          <div className={styles.quickLinks}>
            {t.quick.map((q) => (
              <button key={q.t} type="button" onClick={() => sendMessage(q.q)} disabled={busy}>{q.t}</button>
            ))}
            <button type="button" onClick={() => setShowActions(!showActions)} className={styles.actionToggle} aria-expanded={showActions}>
              {showActions ? '✕' : '+'} {t.more}
            </button>
          </div>

          {showActions && (
            <div className={styles.actionButtons}>
              <button type="button" className={styles.actionBtn} onClick={() => { setForm('appointment'); setShowActions(false); }}>{t.book}</button>
              <button type="button" className={styles.actionBtn} onClick={() => { setForm('callback'); setShowActions(false); }}>{t.call}</button>
            </div>
          )}

          {form && (
            <div className={styles.formModal}>
              <form onSubmit={submitLead}>
                <h4>{form === 'appointment' ? t.apptTitle : t.cbTitle}</h4>
                <input type="text" autoComplete="name" placeholder={t.name} aria-label={t.name} maxLength={80} required
                  value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                <input type="tel" autoComplete="tel" placeholder={t.phone} aria-label={t.phone} maxLength={20} required
                  value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
                <select aria-label={t.service} required value={formData.service} onChange={(e) => setFormData({ ...formData, service: e.target.value })}>
                  <option value="">{t.service}</option>
                  {SERVICES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
                <input type="text" placeholder={t.when} aria-label={t.when} maxLength={120}
                  value={formData.time} onChange={(e) => setFormData({ ...formData, time: e.target.value })} />
                <p className={styles.notice}>{t.privacy}</p>
                <div className={styles.formButtons}>
                  <button type="button" onClick={() => setForm(null)} className={styles.cancelBtn}>{t.cancel}</button>
                  <button type="submit" className={styles.submitBtn} disabled={formBusy}>{formBusy ? t.sending : t.submit}</button>
                </div>
              </form>
            </div>
          )}

          <form className={styles.form} onSubmit={(e) => { e.preventDefault(); sendMessage(input); }}>
            <div className={`${styles.inputWrapper} ${isListening ? styles.listening : ''} ${speaking ? styles.speaking : ''}`}>
              <input
                ref={inputRef}
                type="text"
                value={input}
                maxLength={1000}
                aria-label={t.placeholder}
                onChange={(e) => setInput(e.target.value)}
                placeholder={isListening ? t.listening : t.placeholder}
                disabled={busy}
              />
            </div>
            {micSupported && (
              <button type="button" onClick={toggleMic} disabled={busy}
                className={`${styles.micBtn} ${isListening ? styles.micActive : ''}`}
                aria-pressed={isListening} aria-label={isListening ? 'Stop listening' : 'Speak your message'}>
                {isListening ? '⬛' : '🎤'}
              </button>
            )}
            <button type="submit" disabled={!input.trim() || busy} className={styles.sendBtn} aria-label="Send message">➤</button>
          </form>
          <p className={styles.disclaimer}>{t.ai}</p>
        </section>
      )}
    </div>
  );
}
