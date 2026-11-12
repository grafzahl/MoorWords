import {normalize} from './engine.mjs';

export const DEFAULT_PAUSE_MS = 2000;
const MAX_ATTEMPT_MS = 15000;
const MIN_CONFIDENCE = 0.6;

// Real words/morphemes that may occur as separate Vosk results in compounds.
// This is vocabulary help, not a list of accepted pronunciation substitutions.
const COMPOUND_PARTS = {
  Haustür:['Haus','Tür'], Schulhof:['Schul','Hof'], Fußball:['Fuß','Ball'],
  Apfelbaum:['Apfel','Baum'], Regenbogen:['Regen','Bogen'], Schneemann:['Schnee','Mann'],
  Zahnbürste:['Zahn','Bürste'], Fahrrad:['Fahr','Rad'], Sandkasten:['Sand','Kasten'],
  Spielplatz:['Spiel','Platz'], Haustier:['Haus','Tier'], Blumenbeet:['Blumen','Beet'],
  Baumhaus:['Baum','Haus'], Turnhalle:['Turn','Halle'], Geburtstag:['Geburts','Tag'],
  Frühstück:['Früh','Stück'], Sonnenblume:['Sonnen','Blume'], Eichhörnchen:['Eich','Hörnchen'],
  Marienkäfer:['Marien','Käfer'], Klassenzimmer:['Klassen','Zimmer'], Wörterbuch:['Wörter','Buch'],
  Fahrradhelm:['Fahrrad','Helm'], Straßenverkehr:['Straßen','Verkehr'],
  Umweltschutz:['Umwelt','Schutz'], Wasserkreislauf:['Wasser','Kreis','Lauf'],
  Pflanzenwelt:['Pflanzen','Welt'], Jahreszeiten:['Jahres','Zeiten'],
  Himmelsrichtung:['Himmels','Richtung'], zusammenfassen:['zusammen','fassen']
};

export function buildVocabulary(words){
  const entries=new Set();
  for(const word of words){
    const text=typeof word==='string'?word:word.text;
    // Preserve ß: grammar entries must use the model's spelling, not match keys.
    const lower=text.normalize('NFC').toLocaleLowerCase('de-DE');
    if(!/^[a-zäöüß]+$/u.test(lower))continue;
    entries.add(lower);
    const parts=COMPOUND_PARTS[text];
    if(parts&&normalize(parts.join(''))===normalize(text)){
      for(const part of parts)entries.add(part.toLocaleLowerCase('de-DE'));
    }
  }
  return entries.size?[...entries,'[unk]']:[];
}

function tokensFrom(text,details){
  const raw=String(text).normalize('NFC').toLocaleLowerCase('de-DE').match(/\[unk\]|[a-zäöüß]+/gu)||[];
  return raw.map((word,i)=>{
    const detail=details[i];
    const aligned=detail&&normalize(detail.word)===normalize(word);
    const confidence=aligned&&Number.isFinite(detail.conf)?detail.conf:(details.length?0:null);
    return {key:word==='[unk]'?'[unk]':normalize(word),confidence,
      start:aligned&&Number.isFinite(detail.start)?detail.start:null,
      end:aligned&&Number.isFinite(detail.end)?detail.end:null};
  });
}

// Entire words only; multiple pieces must concatenate EXACTLY. Never fuzzy-match
// Haus/Maus or discard [unk], a weak token, or an intervening unrelated word.
export function matchTokens(tokens,targets,pauseMs=DEFAULT_PAUSE_MS){
  const matches=[];const used=new Set();const candidates=targets.filter(t=>!t.hit)
    .map(target=>({target,key:normalize(target.word.text)})).sort((a,b)=>b.key.length-a.key.length);
  for(let i=0;i<tokens.length;i++){
    let selected=null;
    for(const candidate of candidates){
      if(used.has(candidate.target.id??candidate.target))continue;
      let key='';
      for(let j=i;j<Math.min(tokens.length,i+4);j++){
        const token=tokens[j];
        if(token.key==='[unk]'||token.confidence!==null&&token.confidence<MIN_CONFIDENCE)break;
        if(j>i){
          // Missing confidence is tolerated for old exact-word results only.
          if(tokens.slice(i,j+1).some(t=>t.key.length<2||t.confidence===null))break;
          const previous=tokens[j-1];
          if(previous.end!==null&&token.start!==null&&token.start-previous.end>pauseMs/1000)break;
        }
        key+=token.key;
        if(!candidate.key.startsWith(key))break;
        if(key===candidate.key){selected={target:candidate.target,start:i,end:j+1};break;}
      }
      if(selected)break;
    }
    if(selected){matches.push(selected);used.add(selected.target.id??selected.target);i=selected.end-1;}
  }
  return matches;
}

export class ReadingAttempt{
  constructor({pauseMs=DEFAULT_PAUSE_MS}={}){this.pauseMs=pauseMs;this.reset();}
  reset(){this.tokens=[];this.allowed=null;this.startedAt=null;this.updatedAt=null;this.partialText='';this.hasHit=false;}
  setPause(ms){this.pauseMs=[1200,2000,3000].includes(Number(ms))?Number(ms):DEFAULT_PAUSE_MS;this.reset();}
  ensure(now,targets){if(this.startedAt===null){this.startedAt=now;this.allowed=new Set(targets.filter(t=>!t.hit&&!t.preview).map(t=>t.id));}this.updatedAt=now;}
  expired(now){return this.startedAt!==null&&(now-this.updatedAt>=this.pauseMs||now-this.startedAt>=MAX_ATTEMPT_MS);}
  partial(text,targets,now){
    if(this.expired(now))this.reset();
    if(!text||text===this.partialText)return false;
    this.ensure(now,targets);this.partialText=text;return true;
  }
  final(text,details,targets,now){
    if(this.expired(now))this.reset();
    const incoming=tokensFrom(text,details||[]);
    if(!incoming.length)return {hits:[],pending:this.startedAt!==null};
    this.ensure(now,targets);this.partialText='';this.tokens.push(...incoming);
    // Bound memory and never carry arbitrary old speech through a whole round.
    if(this.tokens.length>32)this.tokens=this.tokens.slice(-32);
    const eligible=targets.filter(t=>this.allowed.has(t.id)&&!t.preview&&!t.hit);
    const matched=matchTokens(this.tokens,eligible,this.pauseMs);
    const hits=matched.map(m=>m.target);
    if(matched.length){
      this.hasHit=true;
      // Discard consumed tokens AND preceding unrelated speech. Nothing already
      // credited can become part of a second compound or a newly spawned target.
      this.tokens=this.tokens.slice(matched.at(-1).end);
      if(!this.tokens.length){this.reset();return {hits,pending:false};}
    }
    return {hits,pending:true};
  }
  expire(now){
    if(!this.expired(now))return null;
    const result={text:this.tokens.map(t=>t.key).join(' ')||this.partialText,hadHit:this.hasHit};
    this.reset();return result;
  }
  get pending(){return this.startedAt!==null;}
}
