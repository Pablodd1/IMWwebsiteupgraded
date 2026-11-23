// Deterministic safety checks. These run BEFORE the model so they cannot be talked around.
import { readConfig } from './config.js';

let compiled = null;
function patterns() {
  if (!compiled) {
    compiled = readConfig('safety.json').emergencyPatterns.map((p) => new RegExp(p, 'i'));
  }
  return compiled;
}

export function isEmergency(text) {
  if (!text || typeof text !== 'string') return false;
  return patterns().some((re) => re.test(text));
}

export function emergencyReply(lang = 'en') {
  const replies = readConfig('safety.json').emergencyReply;
  return replies[lang] || replies.en;
}

export function isStopWord(text) {
  if (!text) return false;
  const words = readConfig('safety.json').stopWords;
  return words.includes(text.trim().toLowerCase());
}

// Basic cleanup so a reply is safe to speak or text.
export function cleanForSpeech(text) {
  return String(text || '')
    .replace(/https?:\/\/\S+/g, 'our website')
    .replace(/[#*_`>~\[\]]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}
