/*! IMW Front Desk Assistant - embeddable widget (text chat + tap-to-call + request forms)
 * Add to any partner site:
 *   <script src="https://innovativemedicalwellness.com/embed.js" data-lang="en" async></script>
 * The partner site's origin must be listed in ALLOWED_ORIGINS on the main site (Vercel env var).
 */
(function () {
  if (window.__imwWidget) return;
  window.__imwWidget = true;
  var script = document.currentScript || document.querySelector('script[src*="embed.js"]');
  var API = (script && script.getAttribute('data-api')) || new URL(script.src).origin;
  var lang = (script && script.getAttribute('data-lang')) === 'es' ? 'es' : 'en';
  var color = (script && script.getAttribute('data-color')) || '#005d93';
  var TXT = {
    en: { hi: "Hi! I'm Mia, the virtual front desk assistant for Innovative Medical Wellness. How can I help you today?", ph: 'Type a message...', send: 'Send', err: "I'm having trouble connecting. Please call (305) 864-1373.", call: 'Call', ai: 'AI assistant. For emergencies call 911.', book: 'Request a call back', name: 'Your name', phone: 'Your phone', svc: 'Service of interest', go: 'Send request', ok: "Thank you! Our office will call you to confirm.", priv: 'Please do not include medical details.' },
    es: { hi: '¡Hola! Soy Mia, la asistente virtual de recepción de Innovative Medical Wellness. ¿En qué puedo ayudarte hoy?', ph: 'Escribe un mensaje...', send: 'Enviar', err: 'Tengo problemas para conectar. Llame al (305) 864-1373.', call: 'Llamar', ai: 'Asistente de IA. En emergencias llame al 911.', book: 'Solicitar llamada', name: 'Tu nombre', phone: 'Tu teléfono', svc: 'Servicio de interés', go: 'Enviar solicitud', ok: '¡Gracias! La oficina te llamará para confirmar.', priv: 'Por favor no incluyas detalles médicos.' }
  };
  var t = TXT[lang];
  var history = [];

  var host = document.createElement('div');
  host.style.cssText = 'position:fixed;right:16px;bottom:16px;z-index:2147483000;font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif';
  var root = host.attachShadow({ mode: 'open' }); // style isolation from the partner site
  root.innerHTML =
    '<style>' +
    '*{box-sizing:border-box}button{font:inherit;cursor:pointer}' +
    '.fab{width:58px;height:58px;border-radius:50%;border:0;background:' + color + ';color:#fff;font-size:26px;box-shadow:0 4px 18px rgba(0,0,0,.3)}' +
    '.panel{display:none;position:absolute;right:0;bottom:70px;width:min(370px,calc(100vw - 32px));height:min(540px,calc(100vh - 110px));background:#fff;border-radius:16px;box-shadow:0 10px 40px rgba(0,0,0,.28);overflow:hidden;flex-direction:column}' +
    '.panel.open{display:flex}.hd{background:' + color + ';color:#fff;padding:12px 14px;display:flex;justify-content:space-between;align-items:center;font-weight:700}' +
    '.hd a,.hd button{color:#fff;background:rgba(255,255,255,.18);border:0;border-radius:12px;padding:5px 10px;font-size:13px;text-decoration:none;margin-left:6px}' +
    '.msgs{flex:1;overflow:auto;padding:12px;background:#f6f8fa;display:flex;flex-direction:column;gap:8px}' +
    '.m{max-width:86%;padding:9px 12px;border-radius:14px;font-size:14px;line-height:1.45;white-space:pre-wrap;word-break:break-word}' +
    '.b{background:#e8f0fe;align-self:flex-start}.u{background:' + color + ';color:#fff;align-self:flex-end}' +
    '.row{display:flex;gap:6px;padding:8px;border-top:1px solid #e5e9ed}.row input{flex:1;padding:10px;border:1px solid #ccd3da;border-radius:10px;font-size:14px}' +
    '.row button{background:' + color + ';color:#fff;border:0;border-radius:10px;padding:0 14px}' +
    '.foot{font-size:11px;color:#667;text-align:center;padding:2px 8px 8px}.link{background:none;border:0;color:' + color + ';text-decoration:underline;font-size:12px;padding:4px 8px;text-align:left}' +
    '.form{display:none;padding:10px;border-top:1px solid #e5e9ed;background:#fff}.form.open{display:block}.form input{width:100%;margin:3px 0;padding:8px;border:1px solid #ccd3da;border-radius:8px}' +
    '.form button{margin-top:6px;width:100%;padding:9px;background:' + color + ';color:#fff;border:0;border-radius:8px}.hint{font-size:11px;color:#667}' +
    ':focus-visible{outline:3px solid #ffb703;outline-offset:2px}' +
    '</style>' +
    '<button class="fab" aria-label="Open chat" aria-expanded="false">💬</button>' +
    '<section class="panel" role="dialog" aria-label="Front desk assistant">' +
    '<div class="hd"><span>Front Desk AI</span><span><a href="tel:+13058641373" aria-label="' + t.call + '">📞 ' + t.call + '</a><button class="lang" aria-label="Language">' + (lang === 'en' ? 'ES' : 'EN') + '</button></span></div>' +
    '<div class="msgs" role="log" aria-live="polite"></div>' +
    '<button class="link bk"></button>' +
    '<form class="form"><input class="fn" required maxlength="80" autocomplete="name"><input class="fp" type="tel" required maxlength="20" autocomplete="tel"><input class="fs" maxlength="80"><div class="hint"></div><button type="submit"></button></form>' +
    '<form class="row"><input class="in" maxlength="1000" autocomplete="off"><button type="submit"></button></form>' +
    '<div class="foot"></div></section>';
  document.body.appendChild(host);

  var $ = function (s) { return root.querySelector(s); };
  var fab = $('.fab'), panel = $('.panel'), msgs = $('.msgs'), input = $('.in'), form = $('.form');
  function labels() {
    t = TXT[lang]; input.placeholder = t.ph; $('.row button').textContent = t.send; $('.foot').textContent = t.ai;
    $('.bk').textContent = '📅 ' + t.book; $('.fn').placeholder = t.name; $('.fp').placeholder = t.phone; $('.fs').placeholder = t.svc;
    $('.form .hint').textContent = t.priv; $('.form button').textContent = t.go; $('.lang').textContent = lang === 'en' ? 'ES' : 'EN';
  }
  function add(role, text) {
    var d = document.createElement('div'); d.className = 'm ' + (role === 'user' ? 'u' : 'b'); d.textContent = text; // textContent: never HTML
    msgs.appendChild(d); msgs.scrollTop = msgs.scrollHeight; return d;
  }
  function open(v) {
    panel.classList.toggle('open', v); fab.setAttribute('aria-expanded', String(v)); fab.textContent = v ? '✕' : '💬';
    if (v && !msgs.children.length) { labels(); add('assistant', t.hi); }
    if (v) input.focus();
  }
  fab.onclick = function () { open(!panel.classList.contains('open')); };
  host.addEventListener('keydown', function (e) { if (e.key === 'Escape') open(false); });
  $('.lang').onclick = function () { lang = lang === 'en' ? 'es' : 'en'; labels(); };
  $('.bk').onclick = function () { form.classList.toggle('open'); };

  $('.row').onsubmit = function (e) {
    e.preventDefault();
    var text = input.value.trim(); if (!text) return;
    input.value = ''; add('user', text); history.push({ role: 'user', content: text });
    var wait = add('assistant', '…'); input.disabled = true;
    fetch(API + '/api/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ messages: history.slice(-18), lang: lang }) })
      .then(function (r) { return r.json().catch(function () { return {}; }); })
      .then(function (d) { var c = d.content || t.err; wait.textContent = c; history.push({ role: 'assistant', content: c }); })
      .catch(function () { wait.textContent = t.err; })
      .then(function () { input.disabled = false; input.focus(); });
  };
  form.onsubmit = function (e) {
    e.preventDefault();
    fetch(API + '/api/lead', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ kind: 'callback', name: $('.fn').value, phone: $('.fp').value, service: $('.fs').value, lang: lang, channel: 'form' }) })
      .then(function (r) { return r.json(); })
      .then(function (d) { add('assistant', d.ok ? t.ok : t.err); if (d.ok) { form.classList.remove('open'); form.reset(); } })
      .catch(function () { add('assistant', t.err); });
  };
  labels();
})();
