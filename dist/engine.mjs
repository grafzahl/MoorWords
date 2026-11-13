import {WORDS,GRADES} from './words.mjs';
export {WORDS,GRADES};
export function normalize(text){return String(text).normalize('NFC').toLocaleLowerCase('de-DE').replace(/ß/g,'ss').replace(/[^a-zäöü\s]/g,' ').replace(/\s+/g,' ').trim();}
const difficulty=word=>[...word.text].length*2+(word.tier-1)*10;
const baselines=new Map(GRADES.map(({id})=>{const pool=WORDS.filter(w=>w.grade===id);return [id,pool.reduce((sum,w)=>sum+difficulty(w),0)/pool.length];}));
export function pointsFor(word){return Math.round(100+difficulty(word)-(baselines.get(word.grade)||baselines.get(1)));}
export function lifetimeFor(word){return 12+word.tier*4+Math.min([...word.text].length,16)*.5;}
export class WordDeck{
  constructor(level,random=Math.random){this.words=[...poolFor(level)];for(let i=this.words.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[this.words[i],this.words[j]]=[this.words[j],this.words[i]];}}
  next(){return this.words.pop();}
  get remaining(){return this.words.length;}
}
export function advanceFlight(target,dt,bounds,random=Math.random){
  target.turnIn-=dt;
  if(target.turnIn<=0){const angle=random()*Math.PI*2;const speed=8+random()*8;target.vx=Math.cos(angle)*speed;target.vy=Math.sin(angle)*speed;target.turnIn=1+random()*2;}
  for(const [axis,velocity,min,max] of [['x','vx',bounds.left,bounds.right],['y','vy',bounds.top,bounds.bottom]]){
    target[axis]+=target[velocity]*dt;
    if(target[axis]<min){target[axis]=min;target[velocity]=Math.abs(target[velocity]);}
    if(target[axis]>max){target[axis]=max;target[velocity]=-Math.abs(target[velocity]);}
  }
}
export function poolFor(level){return WORDS.filter(w=>w.grade===Number(level));}
// Exact whole words only. Partial hypotheses and fuzzy substrings never score.
export function recognizedTargets(text,targets,details=[]){const tokens=new Set(normalize(text).split(' '));return targets.filter(t=>{const key=normalize(t.word.text);if(!tokens.has(key)||t.hit)return false;const matching=details.filter(d=>normalize(d.word)===key);return !matching.length||matching.some(d=>d.conf>=.6);});}
export function pickWord(level,excluded=[],random=Math.random){const pool=poolFor(level).filter(w=>!excluded.includes(w.text));if(!pool.length)return undefined;return pool[Math.max(0,Math.min(pool.length-1,Math.floor(random()*pool.length)))];}
