// Deterministic MEDICAL-CLAIMS GUARD. Runs on every model reply (chat + SMS) BEFORE it is shown or sent.
// If a reply contains a claim-like phrase, it is discarded and replaced with a safe fallback.
// Strict on purpose: false positives are acceptable, a medical claim is not.
// Changing this file or its tests requires Jasmel's approval (see AGENTS.md and .github/CODEOWNERS).

const RULES = [
  // [id, regex]  (applied to lowercased, de-obfuscated text)
  ['cure', /\bcur(e|es|ed|ing)\b/],
  ['heal', /\bheal(s|ed|ing)?\b/],
  ['treats', /\btreat(s|ed|ing)\b/],
  ['prevent', /\bprevent(s|ed|ing)?\b/],
  ['reverse', /\breverse(s|d)?\b/],
  ['eliminate', /\beliminat(e|es|ed|ing)\b/],
  ['relief', /\b(relieve|relieves|relieved|relieving|relief)\b/],
  ['fix', /\bfix(es|ed|ing)?\b/],
  ['guarantee', /\bguarantee[sd]?\b/],
  ['proven', /\b(proven|clinically (proven|tested|shown|studied)|scientifically)\b/],
  ['effective', /\b(effective|effectiveness|efficacy|works for)\b/],
  ['fda', /\bfda\b/],
  ['diagnose', /\bdiagnos(e|es|ed|is|ing|tic)\b/],
  ['you-have', /\byou (likely |probably |may |might )?(have|suffer from)\b/],
  ['will-improve', /\bwill (help|improve|reduce|relieve|fix|resolve|restore|boost|increase|decrease|lower)\b/],
  ['results', /\b(results|improvement) (in|within|after) \d+/],
  ['feel-better', /\b(feel|see|notice|experience|get) (better|results|improvement|relief|a difference|changes?)\b/],
  ['timeline', /\b(in|within|after|over) \d+(-\d+)? (days?|weeks?|months?|sessions?|visits?)\b.*\b(better|results?|improv\w*|relief|pain)\b|\b(better|results?|improv\w*|relief)\b.*\b(in|within|after) \d+(-\d+)? (days?|weeks?|months?|sessions?|visits?)\b/],
  ['percent', /\b\d{1,3}\s?%/],
  ['safe', /\b(is|are|it's|its|totally|completely|very|perfectly|100%) safe\b|\bno (risk|risks|side effects?)\b|\bside effects? (are|is) (minimal|rare|mild|none)\b/],
  ['dosage', /\b\d+\s?(mg|mcg|ml|units?)\b/],
  ['advise-meds', /\b(stop|start|skip|take|increase|decrease) (taking )?(your )?(medication|medicine|meds|pills|dose)\b/],
  ['clinically', /\bclinical (trials?|studies|evidence|results)\b/],
  // Spanish
  ['es-cura', /\bcur(a|as|ar|ara|aran|ado|an|amos)\b/],
  ['es-sana', /\bsan(a|as|ar|ara|aran|ado)\b/],
  ['es-trata', /\b(para tratar|trata (la|el|los|las)|tratar (la|el|los|las))\b/],
  ['es-previene', /\bprevien(e|en)\b|\bprevenir\b/],
  ['es-revierte', /\brevierte|\brevertir\b|\belimina(r|n)?\b/],
  ['es-alivia', /\baliv(ia|ian|iar|io)\b|\balivio\b/],
  ['es-garantiza', /\bgarantiz(a|an|ado|ar|amos|o)\b|\bgarant[ií]a\b/],
  ['es-comprobado', /\b(comprobad[oa]s?|probad[oa]s? cl[ií]nicamente|cient[ií]ficamente)\b/],
  ['es-efectivo', /\b(efectiv[oa]s?|eficaz|eficacia)\b/],
  ['es-diagnostico', /\bdiagn[oó]stic(o|a|ar|ado)\b/],
  ['es-seguro', /\b(es|son) (totalmente |completamente |muy )?segur[oa]s?\b|\bsin (riesgos?|efectos secundarios)\b/],
  ['es-usted-tiene', /\busted (probablemente |posiblemente )?(tiene|sufre de)\b|\btienes\b/],
];

const normalize = (s) =>
  String(s || '')
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, (m) => m) // keep accents handled by explicit [ií]/[oó] classes above
    .replace(/[​-‏⁠﻿­]/g, '') // zero-width / soft hyphen tricks
    .replace(/[‘’]/g, "'")
    .toLowerCase()
    .replace(/\b(?:[a-z][\s.\-_*]){2,}[a-z]\b/g, (m) => m.replace(/[\s.\-_*]/g, '')) // "c u r e" / "c.u.r.e" (3+ single letters only)
    .replace(/\s+/g, ' ');

export function checkClaims(text) {
  const t = normalize(text);
  const hits = RULES.filter(([, re]) => re.test(t)).map(([id]) => id);
  return { ok: hits.length === 0, hits };
}

export const CLAIM_FALLBACK = {
  en: "I'm not able to speak to medical results or what a treatment will do. Our providers can go over that with you at a consultation. Would you like me to request an appointment or a call back from the office?",
  es: 'No puedo hablar de resultados médicos ni de lo que hará un tratamiento. Nuestros proveedores pueden explicárselo en una consulta. ¿Desea que solicite una cita o una llamada de la oficina?',
};

export const claimFallback = (lang = 'en') => CLAIM_FALLBACK[lang] || CLAIM_FALLBACK.en;
