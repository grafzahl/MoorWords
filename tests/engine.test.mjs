import test from 'node:test';import assert from 'node:assert/strict';
import {WORDS,GRADES,pointsFor,normalize,recognizedTargets,pickWord,poolFor,WordDeck,lifetimeFor,advanceFlight} from '../dist/engine.mjs';
const target=(text,tier=1)=>({word:{text,tier},hit:false});
test('Normalisiert Satzzeichen, Großschreibung und ß, bewahrt Umlaute',()=>{assert.equal(normalize('  GRÜẞE, Maus! '),'grüsse maus');assert.notEqual(normalize('Hüte'),normalize('Hute'));});
test('Wertet nur vollständige Wörter, nicht Teilwörter',()=>{const a=target('Haus'),b=target('Maus');assert.deepEqual(recognizedTargets('Maus',[a,b]),[b]);assert.deepEqual(recognizedTargets('Haustür',[a]),[]);assert.deepEqual(recognizedTargets('',[a]),[]);});
test('Schwache Erkennung und bereits getroffene Ziele zählen nicht',()=>{const a=target('Ball');assert.equal(recognizedTargets('Ball',[a],[{word:'ball',conf:.4}]).length,0);assert.equal(recognizedTargets('Ball',[a],[{word:'ball',conf:.9}]).length,1);a.hit=true;assert.equal(recognizedTargets('Ball',[a]).length,0);});
test('Mehrere vorgelesene Wörter werden unabhängig getroffen',()=>{const a=target('Haus'),b=target('Maus');assert.deepEqual(recognizedTargets('Haus und Maus',[a,b]),[a,b]);});
test('Länge und Schwierigkeitsstufe erhöhen die Punkte',()=>{assert.ok(pointsFor({text:'Schmetterling',tier:3})>pointsFor({text:'Blume',tier:2}));assert.ok(pointsFor({text:'Blume',tier:2})>pointsFor({text:'Blume',tier:1}));});
test('Vier eigenständige Klassenpools mit je 128 eindeutigen Wörtern',()=>{assert.deepEqual(GRADES.map(g=>g.id),[1,2,3,4]);assert.equal(WORDS.length,512);assert.equal(new Set(WORDS.map(w=>normalize(w.text))).size,512);for(let i=1;i<=4;i++){assert.equal(poolFor(i).length,128);assert.ok(poolFor(i).every(w=>w.grade===i));}assert.ok(poolFor(4).some(w=>w.tier===4));assert.equal(poolFor(4).some(w=>w.text==='Mama'),false);});
test('Zufallsauswahl bleibt in der Klasse und vermeidet sichtbare Wörter',()=>{assert.notEqual(pickWord(1,['Mama'],()=>0).text,'Mama');for(let grade=1;grade<=4;grade++)for(let i=0;i<100;i++)assert.equal(pickWord(grade).grade,grade);});
test('Jedes Wort trägt Lernschwerpunkt und gültige Lesehürde',()=>{for(const word of WORDS){assert.match(word.text,/^[A-Za-zÄÖÜäöüß]+$/u);assert.ok(word.focus.length>10);assert.ok([1,2,3,4].includes(word.tier));}for(const grade of GRADES){const pool=poolFor(grade.id);assert.equal(new Set(pool.map(w=>w.focus)).size,4);for(const example of grade.examples)assert.ok(pool.some(w=>w.text===example));}});
test('Punkte wachsen auch für die vierte Lesehürde',()=>{const text='Wort';assert.ok(pointsFor({text,tier:4})>pointsFor({text,tier:3}));assert.ok(pointsFor({text:'Wörterbuch',tier:4})>pointsFor({text,tier:4}));});
test('Leere oder ungültige Auswahl liefert kein erfundenes Wort',()=>{assert.deepEqual(poolFor(0),[]);assert.deepEqual(poolFor(5),[]);assert.equal(pickWord(9),undefined);assert.equal(pickWord(1,poolFor(1).map(w=>w.text)),undefined);});


test('Jede Klasse hat etwa 100 Punkte pro Wort als gemeinsame Baseline',()=>{
  for(let grade=1;grade<=4;grade++){
    const points=poolFor(grade).map(pointsFor);
    assert.ok(Math.abs(points.reduce((sum,p)=>sum+p,0)/points.length-100)<=.5);
    assert.ok(points.every(p=>Number.isInteger(p)&&p>0));
  }
});
test('Ein Rundenvorrat liefert alle Wörter genau einmal und endet dann',()=>{
  for(let grade=1;grade<=4;grade++){
    const deck=new WordDeck(grade);const seen=new Set();
    while(deck.remaining){const word=deck.next();assert.equal(word.grade,grade);assert.ok(!seen.has(word.text));seen.add(word.text);}
    assert.equal(seen.size,128);assert.equal(deck.next(),undefined);assert.equal(deck.remaining,0);
    assert.equal(new WordDeck(grade).remaining,128);
  }
});
test('Vorrat verwirft auch verpasste Wörter; Ziehen verändert den Klassenindex nicht',()=>{
  const deck=new WordDeck(1,()=>0);const missed=deck.next();
  assert.ok(!Array.from({length:127},()=>deck.next()).some(w=>w.text===missed.text));
  assert.equal(poolFor(1).length,128);assert.equal(new WordDeck(0).next(),undefined);
});
test('Lesehürde und Länge geben mehr Lebenszeit',()=>{
  assert.ok(lifetimeFor({text:'Wort',tier:4})>lifetimeFor({text:'Wort',tier:1}));
  assert.ok(lifetimeFor({text:'Regenbogen',tier:3})>lifetimeFor({text:'Haus',tier:3}));
  assert.ok(WORDS.every(w=>lifetimeFor(w)>=17&&lifetimeFor(w)<=36));
});
test('Flug bleibt auch bei Richtungswechseln innerhalb der lesbaren Grenzen',()=>{
  const bounds={left:20,right:80,top:15,bottom:85};const t={x:50,y:50,vx:0,vy:0,turnIn:0};
  for(let i=0;i<5000;i++){advanceFlight(t,.15,bounds);assert.ok(t.x>=20&&t.x<=80);assert.ok(t.y>=15&&t.y<=85);}
  t.x=80;t.vx=10;t.turnIn=1;advanceFlight(t,.1,bounds);assert.equal(t.x,80);assert.ok(t.vx<0);
});
