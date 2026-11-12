import {WORDS,GRADES} from './words.mjs';
export {WORDS,GRADES};
export function normalize(text){return String(text).normalize('NFC').toLocaleLowerCase('de-DE').replace(/ß/g,'ss').replace(/[^a-zäöü\s]/g,' ').replace(/\s+/g,' ').trim();}
export function pointsFor(word){return 5 + [...word.text].length * 2 + (word.tier-1)*10;}
export function poolFor(level){return WORDS.filter(w=>w.grade===Number(level));}
// Exact whole words only. Partial hypotheses and fuzzy substrings never score.
export function recognizedTargets(text,targets,details=[]){const tokens=new Set(normalize(text).split(' '));return targets.filter(t=>{const key=normalize(t.word.text);if(!tokens.has(key)||t.hit)return false;const matching=details.filter(d=>normalize(d.word)===key);return !matching.length||matching.some(d=>d.conf>=.6);});}
export function pickWord(level,excluded=[],random=Math.random){const pool=poolFor(level).filter(w=>!excluded.includes(w.text));if(!pool.length)return undefined;return pool[Math.max(0,Math.min(pool.length-1,Math.floor(random()*pool.length)))];}
