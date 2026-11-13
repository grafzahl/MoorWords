import test from 'node:test';
import assert from 'node:assert/strict';
import {ReadingAttempt,buildVocabulary,StablePartialMatcher} from '../dist/reading.mjs';
import {poolFor} from '../dist/engine.mjs';

const target=(text,id=1)=>({id,word:{text},hit:false,preview:false});
const details=(text,conf=.9)=>text.split(' ').map(word=>({word,conf}));

test('Langsam gelesene Teile über zwei endgültige Ergebnisse zählen einmal',()=>{
  const a=new ReadingAttempt();const t=target('Regenbogen');
  assert.deepEqual(a.final('regen',details('regen'),[t],0),{hits:[],pending:true});
  assert.equal(a.expire(1900),null);
  assert.deepEqual(a.final('bogen',details('bogen'),[t],1950),{hits:[t],pending:false});
  t.hit=true;
  assert.deepEqual(a.final('bogen',details('bogen'),[t],2100).hits,[]);
});
test('Getrennte Teile innerhalb eines Ergebnisses werden verbunden',()=>{
  const a=new ReadingAttempt();const t=target('Sonnenblume');
  assert.deepEqual(a.final('sonnen blume',details('sonnen blume'),[t],0).hits,[t]);
});
test('Bis zu vier sichere Teile, ohne fehlende Buchstaben zu ergänzen',()=>{
  const a=new ReadingAttempt();const t=target('Wasserkreislauf');
  assert.deepEqual(a.final('wasser kreis lauf',details('wasser kreis lauf'),[t],0).hits,[t]);
  assert.deepEqual(a.final('wasser kreis',details('wasser kreis'),[t],10).hits,[]);
});
test('Veraltete Teile werden nach der eingestellten Pause verworfen',()=>{
  const a=new ReadingAttempt();const t=target('Regenbogen');
  a.final('regen',details('regen'),[t],0);
  assert.equal(a.expire(1999),null);
  assert.equal(a.expire(2000).text,'regen');
  assert.deepEqual(a.final('bogen',details('bogen'),[t],2200).hits,[]);
});
test('Geduldiger Modus verbindet bei 2,5 Sekunden; Normalmodus nicht',()=>{
  const t=target('Regenbogen');
  for(const [pauseMs,shouldMatch] of [[2000,false],[3000,true]]){
    const a=new ReadingAttempt({pauseMs});a.final('regen',details('regen'),[t],0);
    assert.equal(a.final('bogen',details('bogen'),[t],2500).hits.length,shouldMatch?1:0);
  }
});
test('Audio-Zeitstempel verhindern Verbinden trotz spät gebündelter Zustellung',()=>{
  const a=new ReadingAttempt();const t=target('Regenbogen');
  assert.deepEqual(a.final('regen bogen',[
    {word:'regen',conf:.9,start:0,end:.5},{word:'bogen',conf:.9,start:5,end:5.5}
  ],[t],100).hits,[]);
});
test('Zwischenergebnisse zählen nie als Treffer und wiederholte Hypothesen verlängern nicht endlos',()=>{
  const a=new ReadingAttempt();const t=target('Haus');
  assert.equal(a.partial('haus',[t],0),true);
  assert.equal(a.partial('haus',[t],1500),false);
  assert.equal(a.expire(2000).text,'haus');
});
test('Geändertes Zwischenergebnis gibt Zeit zum Weiterlesen',()=>{
  const a=new ReadingAttempt();const t=target('Regenbogen');
  a.final('regen',details('regen'),[t],0);a.partial('bo',[t],1700);
  assert.equal(a.expire(2100),null);
  assert.deepEqual(a.final('bogen',details('bogen'),[t],2800).hits,[t]);
});
test('Unbekannte, fremde oder unsichere Teile dürfen nicht übersprungen werden',()=>{
  const t=target('Regenbogen');
  for(const text of ['regen [unk] bogen','regen nein bogen','regen maus bogen']){
    assert.deepEqual(new ReadingAttempt().final(text,details(text),[t],0).hits,[]);
  }
  assert.deepEqual(new ReadingAttempt().final('regen bogen',[{word:'regen',conf:.59},{word:'bogen',conf:.99}],[t],0).hits,[]);
});
test('Keine Klangähnlichkeitswertung und keine Teilworttreffer',()=>{
  for(const [said,wanted] of [['maus','Haus'],['häus','Haus'],['haus','Haustür'],['sonne','Sonnenblume'],['regen bogen','Regenbogens']]){
    assert.deepEqual(new ReadingAttempt().final(said,details(said),[target(wanted)],0).hits,[]);
  }
});
test('Zusammenfügen benötigt Konfidenz jedes Teils; fehlende Metadaten umgehen den Filter nicht',()=>{
  const t=target('Regenbogen');
  assert.deepEqual(new ReadingAttempt().final('regen bogen',[],[t],0).hits,[]);
  assert.deepEqual(new ReadingAttempt().final('regen bogen',[{word:'regen',conf:.9}],[t],0).hits,[]);
  assert.deepEqual(new ReadingAttempt().final('regen bogen',[{word:'regen',conf:.9},{word:'anderes',conf:.9}],[t],0).hits,[]);
});
test('Während eines Versuchs neu erschienene Ziele bekommen keine alten Treffer',()=>{
  const a=new ReadingAttempt();const old=target('Haus',1);const late=target('Regenbogen',2);
  a.partial('regen',[old],0);
  assert.deepEqual(a.final('regen bogen',details('regen bogen'),[old,late],500).hits,[]);
});
test('Verschwundene Ziele erhalten keine Punkte',()=>{
  const a=new ReadingAttempt();const old=target('Regenbogen');
  a.final('regen',details('regen'),[old],0);
  assert.deepEqual(a.final('bogen',details('bogen'),[],500).hits,[]);
});
test('Verbrauchte Wörter können nicht als Teil eines späteren Treffers dienen',()=>{
  const a=new ReadingAttempt();const first=target('Regen',1);const second=target('Regenbogen',2);
  assert.deepEqual(a.final('regen',details('regen'),[first],0).hits,[first]);first.hit=true;
  assert.deepEqual(a.final('bogen',details('bogen'),[second],500).hits,[]);
});
test('Zusammensetzung hat Vorrang vor kürzerem Ziel; Mehrfachnennung trifft Ziel nur einmal',()=>{
  const a=new ReadingAttempt();const short=target('Regen',1);const long=target('Regenbogen',2);
  assert.deepEqual(a.final('regen bogen',details('regen bogen'),[short,long],0).hits,[long]);
  const ball=target('Ball',3);assert.deepEqual(a.final('ball ball',details('ball ball'),[ball],100).hits,[ball]);
});
test('Reset und Änderungen der Wartezeit trennen Leseversuche vollständig',()=>{
  const a=new ReadingAttempt();const t=target('Regenbogen');
  a.final('regen',details('regen'),[t],0);a.reset();
  assert.deepEqual(a.final('bogen',details('bogen'),[t],100).hits,[]);
  a.setPause(3000);assert.equal(a.pending,false);assert.equal(a.pauseMs,3000);
  a.setPause(-1);assert.equal(a.pauseMs,2000);
});
test('Ein Versuch bleibt auch mit ständig wechselnden Hypothesen begrenzt',()=>{
  const a=new ReadingAttempt();const t=target('Haus');
  a.partial('h',[t],0);for(let i=1000;i<15000;i+=1000)a.partial('h'+i,[t],i);
  assert.notEqual(a.expire(15000),null);assert.equal(a.pending,false);
});
test('Klassenwortschatz enthält ganze Wörter, passende Bestandteile und Unbekannt',()=>{
  const vocabulary=buildVocabulary(poolFor(3));
  assert.ok(vocabulary.includes('regenbogen'));assert.ok(vocabulary.includes('regen'));assert.ok(vocabulary.includes('bogen'));
  assert.ok(vocabulary.includes('fußball'));assert.ok(vocabulary.includes('fuß'));
  assert.ok(vocabulary.includes('[unk]'));assert.equal(vocabulary.includes('mama'),false);
  assert.equal(new Set(vocabulary).size,vocabulary.length);assert.deepEqual(buildVocabulary([]),[]);
});

// Stable interim hypotheses are a separate, explicit gameplay acceptance path.
test('Vollständiges Wort trifft nach wiederholter Bestätigung ohne Endergebnis',()=>{
  const m=new StablePartialMatcher(),t=target('Haus');
  assert.deepEqual(m.update('haus',[t],0),[]);
  assert.deepEqual(m.update('haus',[t],799),[]);
  assert.deepEqual(m.update('haus',[t],800),[t]);
  assert.deepEqual(m.update('haus',[t],1800),[]);
});
test('Flüchtige Korrekturen, Teilwörter und unbekannte Wörter treffen nicht',()=>{
  const m=new StablePartialMatcher(),t=target('Haus');
  m.update('haus',[t],0);assert.deepEqual(m.update('maus',[t],400),[]);
  assert.deepEqual(m.update('maus',[t],1400),[]);
  for(const text of ['ha','haustür','[unk]','regen bogen']){
    m.reset();m.update(text,[t],0);assert.deepEqual(m.update(text,[t],1000),[]);
  }
});
test('Wechselnder Nachsatz blockiert kein bereits stabiles ganzes Wort',()=>{
  const m=new StablePartialMatcher(),t=target('Haus');
  m.update('haus und',[t],0);
  assert.deepEqual(m.update('haus und maus',[t],900),[t]);
});
test('Alte Hypothesen treffen weder später erschienene noch verschwundene Ziele',()=>{
  const m=new StablePartialMatcher(),t=target('Haus');
  m.update('haus',[],0);assert.deepEqual(m.update('haus',[t],900),[]);
  m.reset();m.update('haus',[t],0);assert.deepEqual(m.update('haus',[],900),[]);
  m.reset();m.update('haus',[{...t,preview:true}],0);assert.deepEqual(m.update('haus',[t],900),[]);
});
test('Reset oder leere Hypothese erfordert erneut eine stabile Bestätigung',()=>{
  const m=new StablePartialMatcher(),t=target('Haus');
  for(const reset of [()=>m.reset(),()=>m.update('',[t],500)]){
    m.update('haus',[t],0);reset();assert.deepEqual(m.update('haus',[t],1000),[]);
    assert.deepEqual(m.update('haus',[t],1800),[t]);m.reset();
  }
});
